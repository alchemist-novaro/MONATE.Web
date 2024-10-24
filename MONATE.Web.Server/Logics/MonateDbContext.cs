namespace MONATE.Web.Server.Logics
{
    using Microsoft.EntityFrameworkCore;
    using MONATE.Web.Server.Data;

    public class MonateDbContext : DbContext
    {
        public MonateDbContext(DbContextOptions<MonateDbContext> options) : base(options) 
        {

        }

        public DbSet<UserPassword> UserPasswords { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
