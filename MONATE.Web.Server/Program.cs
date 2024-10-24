using Microsoft.EntityFrameworkCore;
using MONATE.Web.Server.Logics;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

MONATE.Web.Server.Helpers.DotEnvHelper.Load();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var oracleConnectionString = builder.Configuration.GetConnectionString("OracleDb");
builder.Services.AddDbContext<MonateDbContext>(options =>
{
    options.UseOracle(oracleConnectionString);
});

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
