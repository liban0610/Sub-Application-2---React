using Microsoft.EntityFrameworkCore;
using Aplzz.DAL;
using Aplzz.Models;
using Serilog;
using Serilog.Events;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers().AddNewtonsoftJson(options => {
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<PostDbContext>(options => {
    options.UseSqlite(builder.Configuration["ConnectionStrings:DatabaseConnection"]);});

builder.Services.AddDbContext<AccountDbContext>(options => {
    options.UseSqlite(builder.Configuration["ConnectionStrings:AccountDbContextConnection"]);});

builder.Services.AddControllers();
builder.Services.AddCors(options =>
        {
            options.AddPolicy("CorsPolicy",
                builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
        });

builder.Services.AddScoped<IPostRepository, PostRepository>();
builder.Services.AddScoped<IAccountRepository, AccountRepository>();


builder.Services.AddSession(options => {
    options.Cookie.Name = ".Applz.Session";
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

// Add Distributed Memory Cache for session support
builder.Services.AddDistributedMemoryCache();

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddHttpContextAccessor();

var loggerConfiguration = new LoggerConfiguration()
    .MinimumLevel.Information() // levels: Trace< Information < Warning < Erorr < Fatal
    .WriteTo.File($"APILogs/app_{DateTime.Now:yyyyMMdd_HHmmss}.log")
    .Filter.ByExcluding(e => e.Properties.TryGetValue("SourceContext", out var value) &&
                            e.Level == LogEventLevel.Information &&
                            e.MessageTemplate.Text.Contains("Executed DbCommand"));
var logger = loggerConfiguration.CreateLogger();
builder.Logging.AddSerilog(logger);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    DBInit.Seed(app);
    app.UseSwagger();
    app.UseSwaggerUI();
    
}

app.UseAuthentication();
app.UseAuthorization();

// Add session middleware to the request pipeline
app.UseSession();

app.UseStaticFiles();
app.UseRouting();
app.UseCors("CorsPolicy");
app.MapControllerRoute(name: "api", pattern: "{controller}/{action=Index}/{id?}");
    
app.Run();