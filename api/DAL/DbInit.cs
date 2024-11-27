using Microsoft.EntityFrameworkCore;
using Aplzz.Models;

namespace Aplzz.DAL
{
    public static class DBInit
    {
        public static void Seed(IApplicationBuilder app)
        {
            using var serviceScope = app.ApplicationServices.CreateScope();
            var context = serviceScope.ServiceProvider.GetRequiredService<PostDbContext>();
            
            // Ensure database is created with latest schema
            context.Database.EnsureDeleted();
            context.Database.EnsureCreated();

            if (!context.Users.Any())
            {
                var users = new List<User>
                {
                    new User {
                        IdUser = 1, 
                        Firstname = "Ahmad", 
                        Aftername = "Faryabi",
                        Username = "ahmad", 
                        Password = "1234", 
                        Phone = "12345678", 
                        Email = "email@email.com",
                        ProfilePicture = "images/profile.jpeg"
                    }
                };
                context.Users.AddRange(users);
                context.SaveChanges();
            }

            List<int> postIds = new List<int>();
            if (!context.Posts.Any())
            {
                var userId = context.Users.First().IdUser;
                var posts = new List<Post>
                {
                    new Post
                    {
                        Content = "Dette er det første innlegget.",
                        CreatedAt = DateTime.Now,
                        ImageUrl = "/images/pexels.jpg",
                        UserId = userId
                    },
                    new Post
                    {
                        Content = "Dette er det andre innlegget.",
                        CreatedAt = DateTime.Now,
                        ImageUrl = "/images/scott.jpg",
                        UserId = userId
                    }
                };
                context.Posts.AddRange(posts);
                context.SaveChanges();

                postIds = posts.Select(p => p.PostId).ToList();
            }
            else
            {
                postIds = context.Posts.Select(p => p.PostId).ToList();
            }

            // Seed Comments kun hvis vi har gyldige innlegg
            if (!context.Comments.Any() && postIds.Any())
            {
                var comments = new List<Comment>
                {
                    new Comment { Text = "Flott innlegg!", CommentedAt = DateTime.Now, PostId = postIds[0] },
                    new Comment { Text = "Veldig informativt.", CommentedAt = DateTime.Now, PostId = postIds.Last() }
                };
                context.Comments.AddRange(comments);
                context.SaveChanges();
            }

            // Seed Likes
            if (!context.Likes.Any())

            // Seed Likes kun hvis vi har gyldige innlegg og brukere
            if (!context.Likes.Any() && postIds.Any() && context.Users.Any())
            {
                var userIds = context.Users.Select(u => u.IdUser).ToList();
                var likes = new List<Like>
                {
                    new Like { PostId = postIds[0], UserId = userIds[0] },
                    new Like { PostId = postIds.Last(), UserId = userIds.Last() }
                };
                context.Likes.AddRange(likes);
                context.SaveChanges();
            }
        }
    }
}