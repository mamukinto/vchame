using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

var connStr = Environment.GetEnvironmentVariable("DATABASE_URL");
if (connStr is not null)
    builder.Services.AddDbContext<AppDb>(o => o.UseNpgsql(connStr));
else
    builder.Services.AddDbContext<AppDb>(o => o.UseInMemoryDatabase("vchame"));

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDb>();
    db.Database.EnsureCreated();
    if (connStr is not null)
    {
        // Idempotent migration: add DishType column and update PK if needed
        await db.Database.ExecuteSqlRawAsync("""
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_name = 'DailyCounts' AND column_name = 'DishType'
                ) THEN
                    ALTER TABLE "DailyCounts" ADD COLUMN "DishType" text NOT NULL DEFAULT 'khinkali';
                    ALTER TABLE "DailyCounts" DROP CONSTRAINT "PK_DailyCounts";
                    ALTER TABLE "DailyCounts" ADD CONSTRAINT "PK_DailyCounts"
                        PRIMARY KEY ("DeviceId", "Date", "DishType");
                END IF;
            END $$;
            """);

        // Idempotent migration: create Devices and Friends tables
        await db.Database.ExecuteSqlRawAsync("""
            CREATE TABLE IF NOT EXISTS "Devices" (
                "DeviceId" text PRIMARY KEY,
                "Nickname" text,
                "FriendCode" text NOT NULL,
                "CreatedAt" timestamp with time zone NOT NULL DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS "Friends" (
                "Id" serial PRIMARY KEY,
                "DeviceId" text NOT NULL,
                "FriendDeviceId" text NOT NULL,
                "AddedAt" timestamp with time zone NOT NULL DEFAULT NOW(),
                UNIQUE ("DeviceId", "FriendDeviceId")
            );

            CREATE INDEX IF NOT EXISTS "IX_Friends_DeviceId" ON "Friends" ("DeviceId");
            """);
    }
}

app.UseDefaultFiles();
app.UseStaticFiles();

DateOnly GetToday(string? localDate)
{
    if (localDate is not null && DateOnly.TryParse(localDate, out var parsed))
        return parsed;
    return DateOnly.FromDateTime(DateTime.UtcNow);
}


string GenerateFriendCode(string deviceId)
{
    using var sha = SHA256.Create();
    var hash = sha.ComputeHash(Encoding.UTF8.GetBytes(deviceId));
    var num = BitConverter.ToUInt32(hash, 0);
    var code = Convert.ToString(num % 2176782336, 36).ToUpper().PadLeft(6, '0');
    return code[^6..];
}

var api = app.MapGroup("/api");

api.MapPost("/eat", async (EatRequest req, AppDb db) =>
{
    if (string.IsNullOrWhiteSpace(req.DeviceId) || req.Count < 1 || req.Count > 100)
        return Results.BadRequest();

    var dishType = string.IsNullOrWhiteSpace(req.DishType) ? "khinkali" : req.DishType;
    var today = GetToday(req.LocalDate);
    var entry = await db.DailyCounts
        .FirstOrDefaultAsync(x => x.DeviceId == req.DeviceId && x.Date == today && x.DishType == dishType);

    if (entry is null)
    {
        entry = new DailyCount { DeviceId = req.DeviceId, Date = today, DishType = dishType, Count = req.Count };
        db.DailyCounts.Add(entry);
    }
    else
    {
        entry.Count += req.Count;
    }

    await db.SaveChangesAsync();
    return Results.Ok(new { entry.Count });
});

api.MapPost("/undo", async (EatRequest req, AppDb db) =>
{
    if (string.IsNullOrWhiteSpace(req.DeviceId) || req.Count < 1 || req.Count > 100)
        return Results.BadRequest();

    var dishType = string.IsNullOrWhiteSpace(req.DishType) ? "khinkali" : req.DishType;
    var today = GetToday(req.LocalDate);
    var entry = await db.DailyCounts
        .FirstOrDefaultAsync(x => x.DeviceId == req.DeviceId && x.Date == today && x.DishType == dishType);

    if (entry is null || entry.Count <= 0)
        return Results.Ok(new { Count = 0 });

    entry.Count = Math.Max(0, entry.Count - req.Count);
    await db.SaveChangesAsync();
    return Results.Ok(new { entry.Count });
});

api.MapPost("/clear", async (EatRequest req, AppDb db) =>
{
    if (string.IsNullOrWhiteSpace(req.DeviceId)) return Results.BadRequest();
    var dishType = string.IsNullOrWhiteSpace(req.DishType) ? "khinkali" : req.DishType;
    var today = GetToday(req.LocalDate);
    var entry = await db.DailyCounts
        .FirstOrDefaultAsync(x => x.DeviceId == req.DeviceId && x.Date == today && x.DishType == dishType);
    if (entry is not null) { entry.Count = 0; await db.SaveChangesAsync(); }
    return Results.Ok(new { Count = 0 });
});

api.MapGet("/stats/{deviceId}", async (string deviceId, string? localDate, AppDb db) =>
{
    var today = GetToday(localDate);
    var dow = today.DayOfWeek;
    var weekStart = today.AddDays(-(int)dow + (int)DayOfWeek.Monday);
    if (dow == DayOfWeek.Sunday) weekStart = weekStart.AddDays(-7);
    var monthStart = new DateOnly(today.Year, today.Month, 1);

    var counts = await db.DailyCounts
        .Where(x => x.DeviceId == deviceId)
        .ToListAsync();

    var activeDays = counts
        .GroupBy(x => x.Date)
        .Where(g => g.Sum(x => x.Count) > 0)
        .Select(g => g.Key)
        .OrderByDescending(d => d)
        .ToList();
    int streak = 0;
    var check = today;
    foreach (var day in activeDays)
    {
        if (day == check) { streak++; check = check.AddDays(-1); }
        else if (day < check) break;
    }

    var dishes = counts
        .GroupBy(x => x.DishType)
        .ToDictionary(
            g => g.Key,
            g => new
            {
                today = g.Where(x => x.Date == today).Sum(x => x.Count),
                week = g.Where(x => x.Date >= weekStart).Sum(x => x.Count),
                month = g.Where(x => x.Date >= monthStart).Sum(x => x.Count),
                allTime = g.Sum(x => x.Count),
            });

    return Results.Ok(new
    {
        today = counts.Where(x => x.Date == today).Sum(x => x.Count),
        week = counts.Where(x => x.Date >= weekStart).Sum(x => x.Count),
        month = counts.Where(x => x.Date >= monthStart).Sum(x => x.Count),
        allTime = counts.Sum(x => x.Count),
        days = counts.Select(x => x.Date).Distinct().Count(),
        streak,
        dishes
    });
});

api.MapGet("/leaderboard", async (string? deviceId, string? period, AppDb db) =>
{
    var query = db.DailyCounts.AsQueryable();
    if (period == "week")
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var dow = today.DayOfWeek;
        var weekStart = today.AddDays(-(int)dow + (int)DayOfWeek.Monday);
        if (dow == DayOfWeek.Sunday) weekStart = weekStart.AddDays(-7);
        query = query.Where(x => x.Date >= weekStart);
    }
    var top10 = await query
        .GroupBy(x => x.DeviceId)
        .Select(g => new { DeviceId = g.Key, Total = g.Sum(x => x.Count) })
        .OrderByDescending(x => x.Total)
        .Take(100)
        .ToListAsync();
    var result = top10.Select((x, i) => new {
        rank = i + 1,
        count = x.Total,
        isMe = x.DeviceId == deviceId
    });
    return Results.Ok(result);
});

api.MapGet("/global", async (AppDb db) =>
{
    var total = await db.DailyCounts.SumAsync(x => x.Count);
    var devices = await db.DailyCounts.Select(x => x.DeviceId).Distinct().CountAsync();
    var byDish = await db.DailyCounts
        .GroupBy(x => x.DishType)
        .Select(g => new { dish = g.Key, count = g.Sum(x => x.Count) })
        .ToListAsync();
    return Results.Ok(new { total, people = devices, byDish });
});


// ── Friends endpoints ──

api.MapPost("/set-nickname", async (SetNicknameRequest req, AppDb db) =>
{
    if (string.IsNullOrWhiteSpace(req.DeviceId)) return Results.BadRequest();
    var nickname = req.Nickname?.Trim();
    if (nickname != null && nickname.Length > 50) nickname = nickname.Substring(0, 50);
    var device = await db.Devices.FindAsync(req.DeviceId);
    if (device is null)
    {
        device = new Device { DeviceId = req.DeviceId, FriendCode = GenerateFriendCode(req.DeviceId), Nickname = nickname, CreatedAt = DateTime.UtcNow };
        db.Devices.Add(device);
    }
    else { device.Nickname = nickname; }
    await db.SaveChangesAsync();
    return Results.Ok(new { nickname = device.Nickname, friendCode = device.FriendCode });
});

api.MapGet("/friend-code/{deviceId}", async (string deviceId, AppDb db) =>
{
    var device = await db.Devices.FindAsync(deviceId);
    if (device is null)
    {
        device = new Device { DeviceId = deviceId, FriendCode = GenerateFriendCode(deviceId), Nickname = null, CreatedAt = DateTime.UtcNow };
        db.Devices.Add(device);
        await db.SaveChangesAsync();
    }
    return Results.Ok(new { code = device.FriendCode, nickname = device.Nickname });
});

api.MapPost("/add-friend", async (AddFriendRequest req, AppDb db) =>
{
    if (string.IsNullOrWhiteSpace(req.DeviceId) || string.IsNullOrWhiteSpace(req.FriendCode)) return Results.BadRequest();
    var friendCode = req.FriendCode.Trim().ToUpper();
    var friendDevice = await db.Devices.FirstOrDefaultAsync(d => d.FriendCode == friendCode);
    if (friendDevice is null) return Results.NotFound(new { error = "Friend code not found" });
    if (friendDevice.DeviceId == req.DeviceId) return Results.BadRequest(new { error = "Cannot add yourself" });
    var existing = await db.Friends.FirstOrDefaultAsync(f => f.DeviceId == req.DeviceId && f.FriendDeviceId == friendDevice.DeviceId);
    if (existing is not null) return Results.Ok(new { success = true, alreadyAdded = true });
    db.Friends.Add(new Friend { DeviceId = req.DeviceId, FriendDeviceId = friendDevice.DeviceId, AddedAt = DateTime.UtcNow });
    await db.SaveChangesAsync();
    return Results.Ok(new { success = true });
});

api.MapGet("/friends/{deviceId}", async (string deviceId, string? localDate, AppDb db) =>
{
    var today = GetToday(localDate);
    var dow = today.DayOfWeek;
    var weekStart = today.AddDays(-(int)dow + (int)DayOfWeek.Monday);
    if (dow == DayOfWeek.Sunday) weekStart = weekStart.AddDays(-7);
    var friendships = await db.Friends.Where(f => f.DeviceId == deviceId).ToListAsync();
    var friendDeviceIds = friendships.Select(f => f.FriendDeviceId).ToList();
    var friendDevices = await db.Devices.Where(d => friendDeviceIds.Contains(d.DeviceId)).ToListAsync();
    var friendCounts = await db.DailyCounts.Where(c => friendDeviceIds.Contains(c.DeviceId)).ToListAsync();
    var badges = new Dictionary<string, object>
    {
        ["khinkali"] = new { ka = "🥟 ხინკლის მამა", en = "🥟 Khinkali Lord" },
        ["khachapuri"] = new { ka = "🧀 ყველის ბოსი", en = "🧀 Cheese Brain" },
        ["qababi"] = new { ka = "🔥 მაყლის ოსტატი", en = "🔥 Grill Master" },
        ["lobiani"] = new { ka = "🫘 ლობიანის ფანატიკოსი", en = "🫘 Bean Lover" }
    };
    var result = friendDevices.Select(fd =>
    {
        var counts = friendCounts.Where(c => c.DeviceId == fd.DeviceId).ToList();
        var totalToday = counts.Where(c => c.Date == today).Sum(c => c.Count);
        var totalWeek = counts.Where(c => c.Date >= weekStart).Sum(c => c.Count);
        var totalAllTime = counts.Sum(c => c.Count);
        var byDish = counts.GroupBy(c => c.DishType).Select(g => new { dish = g.Key, count = g.Sum(x => x.Count) }).OrderByDescending(g => g.count).ToList();
        var topDish = byDish.FirstOrDefault()?.dish ?? "khinkali";
        var badge = badges.ContainsKey(topDish) ? badges[topDish] : new { ka = "🍽 დამწყები", en = "🍽 Rookie" };
        return new { friendCode = fd.FriendCode, nickname = fd.Nickname, totalToday, totalWeek, totalAllTime, badge, topDish };
    }).ToList();
    return Results.Ok(result);
});


app.MapGet("/stats", context =>
{
    context.Response.ContentType = "text/html";
    return context.Response.SendFileAsync(
        Path.Combine(app.Environment.WebRootPath, "stats.html"));
});

app.MapFallback(context =>
{
    context.Response.ContentType = "text/html";
    return context.Response.SendFileAsync(
        Path.Combine(app.Environment.WebRootPath, "index.html"));
});

app.Run();

public class AppDb : DbContext
{
    public AppDb(DbContextOptions<AppDb> options) : base(options) { }
    public DbSet<DailyCount> DailyCounts => Set<DailyCount>();
    public DbSet<Device> Devices => Set<Device>();
    public DbSet<Friend> Friends => Set<Friend>();

    protected override void OnModelCreating(ModelBuilder m)
    {
        m.Entity<DailyCount>(e =>
        {
            e.HasKey(x => new { x.DeviceId, x.Date, x.DishType });
            e.HasIndex(x => x.DeviceId);
        });
    }
}

public class DailyCount
{
    public required string DeviceId { get; set; }
    public DateOnly Date { get; set; }
    public string DishType { get; set; } = "khinkali";
    public int Count { get; set; }
}


public class Device
{
    public required string DeviceId { get; set; }
    public string? Nickname { get; set; }
    public required string FriendCode { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class Friend
{
    public int Id { get; set; }
    public required string DeviceId { get; set; }
    public required string FriendDeviceId { get; set; }
    public DateTime AddedAt { get; set; }
}

public record EatRequest(string DeviceId, int Count, string DishType = "khinkali", string? LocalDate = null);
public record SetNicknameRequest(string DeviceId, string? Nickname);
public record AddFriendRequest(string DeviceId, string FriendCode);
