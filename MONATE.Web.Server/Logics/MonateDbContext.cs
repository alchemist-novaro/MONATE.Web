namespace MONATE.Web.Server.Logics
{
    using Microsoft.EntityFrameworkCore;
    using MONATE.Web.Server.Data.Models.UserInfo;

    public class MonateDbContext : DbContext
    {
        public MonateDbContext(DbContextOptions<MonateDbContext> options) : base(options) 
        {

        }

        public DbSet<User> Users { get; set; }
        public DbSet<UserLocation> Locations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<UserLocation>()
                .HasOne(l => l.UserPassword)
                .WithOne(p => p.UserLocation)
                .HasForeignKey<UserLocation>(l => l.UserPasswordId);
        }
    }
}
