using Microsoft.EntityFrameworkCore;

namespace Aplzz.Models
{
    public class AccountDbContext : DbContext
    {
        public AccountDbContext(DbContextOptions<AccountDbContext> options) : base(options)
         {
             Database.EnsureCreated();
         }

        public DbSet<AccountProfile> AccountProfiles { get; set; } // Add this line to connect to AccountProfile model
    }
}