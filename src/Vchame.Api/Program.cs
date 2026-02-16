using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var dbPath = Environment.GetEnvironmentVariable("DB_PATH") ?? "vchame.db";
builder.Services.AddDbContext<AppDb>(o => o.UseSqlite($"Data Source={dbPath}"));

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDb>();
    db.Database.EnsureCreated();
}

app.UseDefaultFiles();
app.UseStaticFiles();

var api = app.MapGroup("/api");

api.MapPost("/eat", async (EatRequest req, AppDb db) =>
{
    if (string.IsNullOrWhiteSpace(req.DeviceId) || req.Count < 1 || req.Count > 100)
        return Results.BadRequest();

    var today = DateOnly.FromDateTime(DateTime.UtcNow);
    var entry = await db.DailyCounts
        .FirstOrDefaultAsync(x => x.DeviceId == req.DeviceId && x.Date == today);

    if (entry is null)
    {
        entry = new DailyCount { DeviceId = req.DeviceId, Date = today, Count = req.Count };
        db.DailyCounts.Add(entry);
    }
    else
    {
        entry.Count += req.Count;
    }

    await db.SaveChangesAsync();
    return Results.Ok(new { entry.Count });
});

api.MapGet("/stats/{deviceId}", async (string deviceId, AppDb db) =>
{
    var now = DateTime.UtcNow;
    var today = DateOnly.FromDateTime(now);
    var weekStart = today.AddDays(-(int)now.DayOfWeek + (int)DayOfWeek.Monday);
    if (now.DayOfWeek == DayOfWeek.Sunday) weekStart = weekStart.AddDays(-7);
    var monthStart = new DateOnly(today.Year, today.Month, 1);

    var counts = await db.DailyCounts
        .Where(x => x.DeviceId == deviceId)
        .ToListAsync();

    return Results.Ok(new
    {
        today = counts.Where(x => x.Date == today).Sum(x => x.Count),
        week = counts.Where(x => x.Date >= weekStart).Sum(x => x.Count),
        month = counts.Where(x => x.Date >= monthStart).Sum(x => x.Count),
        allTime = counts.Sum(x => x.Count),
        days = counts.Count
    });
});

api.MapGet("/global", async (AppDb db) =>
{
    var total = await db.DailyCounts.SumAsync(x => x.Count);
    var devices = await db.DailyCounts.Select(x => x.DeviceId).Distinct().CountAsync();
    return Results.Ok(new { total, people = devices });
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
            e.HasKey(x => new { x.DeviceId, x.Date });
            e.HasIndex(x => x.DeviceId);
        });
    }
}

public class DailyCount
{
    public required string DeviceId { get; set; }
    public DateOnly Date { get; set; }
    public int Count { get; set; }
}

public record EatRequest(string DeviceId, int Count);
