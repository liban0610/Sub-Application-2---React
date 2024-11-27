/*using Microsoft.EntityFrameworkCore;
using Aplzz.Models;
namespace Aplzz.Models
{
    public class DbContexts : DbContext 
    {
        public DbContexts(DbContextOptions<DbContexts> options) : base(options)
        {
            Database.EnsureCreated();
        }
        public DbSet<User> Users { get; set; } 
        public DbSet<Like> Likes { get; set; } 
        // needed tables for soocial media managements
        public DbSet<Post> Posts { get; set; } 
        public DbSet<Comment> Comments { get; set; } 
    }
}
*/