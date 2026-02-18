using Microsoft.EntityFrameworkCore;

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
        dishes
    });
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

public record EatRequest(string DeviceId, int Count, string DishType = "khinkali", string? LocalDate = null);
