using Microsoft.EntityFrameworkCore;
using Aplzz.Models;

namespace Aplzz.DAL 
{
    public class PostDbContext : DbContext 
    {
        public PostDbContext(DbContextOptions<PostDbContext> options) : base(options)
        {
            Database.EnsureCreated();
        }

        public DbSet<Post> Posts { get; set; } 
        public DbSet<Comment> Comments { get; set; } 
        public DbSet<Like> Likes { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseLazyLoadingProxies();
        }
    }
}

