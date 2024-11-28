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
                new User
                {
                    Username = "fjordmaster",
                    Email = "fjordmaster@example.com",
                    Password = "Test12345",
                    Firstname = "Magnus",
                    Aftername = "Fjord",
                    Phone = "12345678",
                    Date_Started = DateTime.Now,
                    ProfilePicture = "/images/profile.jpg"
                },
                new User
                {
                    Username = "mariasmith",
                    Email = "maria@example.com",
                    Password = "Test12345",
                    Firstname = "Maria",
                    Aftername = "Smith",
                    Phone = "87654321",
                    Date_Started = DateTime.Now,
                    ProfilePicture = "/images/profile.jpg"
                },
                new User
                {
                    Username = "nordlys",
                    Email = "nordlys@example.com",
                    Password = "Test12345",
                    Firstname = "Aurora",
                    Aftername = "Berg",
                    Phone = "23456789",
                    Date_Started = DateTime.Now,
                    ProfilePicture = "/images/profile.jpg"
                },
                new User
                {
                    Username = "villmark",
                    Email = "villmark@example.com",
                    Password = "Test12345",
                    Firstname = "Lars",
                    Aftername = "Skog",
                    Phone = "34567890",
                    Date_Started = DateTime.Now,
                    ProfilePicture = "/images/profile.jpg"
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
                },
                new Post
                {
                    Content = "Nydelig dag på fjellet! 🏔️",
                    CreatedAt = DateTime.Now,
                    ImageUrl = "/images/mountain.png",
                    UserId = users[1].IdUser
                }
            };
            context.Posts.AddRange(posts);
            context.SaveChanges();

            var comments = new List<Comment>
            {
                new Comment { Text = "Flott innlegg!", CommentedAt = DateTime.Now, PostId = posts[0].PostId, UserId = users[0].IdUser },
                new Comment { Text = "Veldig informativt.", CommentedAt = DateTime.Now, PostId = posts[0].PostId, UserId = users[1].IdUser },
                new Comment { Text = "Helt enig!", CommentedAt = DateTime.Now, PostId = posts[0].PostId, UserId = users[2].IdUser },
                new Comment { Text = "Interessant perspektiv!", CommentedAt = DateTime.Now, PostId = posts[0].PostId, UserId = users[3].IdUser },
                
                new Comment { Text = "Dette var bra!", CommentedAt = DateTime.Now, PostId = posts[1].PostId, UserId = users[0].IdUser },
                new Comment { Text = "Godt skrevet!", CommentedAt = DateTime.Now, PostId = posts[1].PostId, UserId = users[1].IdUser },
                new Comment { Text = "Takk for at du deler!", CommentedAt = DateTime.Now, PostId = posts[1].PostId, UserId = users[2].IdUser },
                new Comment { Text = "Gleder meg til mer!", CommentedAt = DateTime.Now, PostId = posts[1].PostId, UserId = users[3].IdUser },
                
                new Comment { Text = "Så nydelig utsikt! 😍", CommentedAt = DateTime.Now, PostId = posts[2].PostId, UserId = users[0].IdUser },
                new Comment { Text = "Hvilket fjell er dette?", CommentedAt = DateTime.Now, PostId = posts[2].PostId, UserId = users[1].IdUser },
                new Comment { Text = "Fantastisk bilde! 🏔️", CommentedAt = DateTime.Now, PostId = posts[2].PostId, UserId = users[2].IdUser },
                new Comment { Text = "Må dra dit selv!", CommentedAt = DateTime.Now, PostId = posts[2].PostId, UserId = users[3].IdUser }
            };
            context.Comments.AddRange(comments);
            context.SaveChanges();

            var likes = new List<Like>
            {
                // Likes for første innlegg
                new Like { PostId = posts[0].PostId, UserId = users[0].IdUser },
                new Like { PostId = posts[0].PostId, UserId = users[1].IdUser },
                new Like { PostId = posts[0].PostId, UserId = users[2].IdUser },
                new Like { PostId = posts[0].PostId, UserId = users[3].IdUser },
                
                // Likes for andre innlegg
                new Like { PostId = posts[1].PostId, UserId = users[0].IdUser },
                new Like { PostId = posts[1].PostId, UserId = users[1].IdUser },
                new Like { PostId = posts[1].PostId, UserId = users[2].IdUser },
                new Like { PostId = posts[1].PostId, UserId = users[3].IdUser },
                
                // Likes for tredje innlegg
                new Like { PostId = posts[2].PostId, UserId = users[0].IdUser },
                new Like { PostId = posts[2].PostId, UserId = users[1].IdUser },
                new Like { PostId = posts[2].PostId, UserId = users[2].IdUser },
                new Like { PostId = posts[2].PostId, UserId = users[3].IdUser }
            };
            context.Likes.AddRange(likes);
            context.SaveChanges();
        }
    }
}