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
            
            context.Database.EnsureDeleted();
            context.Database.EnsureCreated();

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

            var posts = new List<Post>
            {
                new Post
                {
                    Content = "Dette er det første innlegget.",
                    CreatedAt = DateTime.Now,
                    ImageUrl = "/images/pexels.jpg",
                    UserId = users[0].IdUser
                },
                new Post
                {
                    Content = "Dette er det andre innlegget.",
                    CreatedAt = DateTime.Now,
                    ImageUrl = "/images/scott.jpg",
                    UserId = users[0].IdUser
                }
            };
            context.Posts.AddRange(posts);
            context.SaveChanges();

            var comments = new List<Comment>
            {
                new Comment { 
                    Text = "Flott innlegg!", 
                    CommentedAt = DateTime.Now, 
                    PostId = posts[0].PostId,
                    UserId = users[0].IdUser 
                },
                new Comment { 
                    Text = "Veldig informativt.", 
                    CommentedAt = DateTime.Now, 
                    PostId = posts[1].PostId,
                    UserId = users[0].IdUser 
                }
            };
            context.Comments.AddRange(comments);
            context.SaveChanges();

            var likes = new List<Like>
            {
                new Like { 
                    PostId = posts[0].PostId, 
                    UserId = users[0].IdUser 
                },
                new Like { 
                    PostId = posts[1].PostId, 
                    UserId = users[0].IdUser 
                }
            };
            context.Likes.AddRange(likes);
            context.SaveChanges();
        }
    }
}