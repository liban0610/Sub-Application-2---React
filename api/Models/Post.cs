
namespace Aplzz.Models;

public class Post
{
    public Post()
    {
        Likes = new List<Like>();
    }

    public int PostId { get; set; }
    public required string Content { get; set; }

    public string? ImageUrl { get; set; }
    public int UserId { get; set; }
    public virtual User? GetUser {get;set;}
    public DateTime CreatedAt { get; set; }
    public virtual List<Comment>? Comments { get; set; }
    public virtual List<Like> Likes { get; set; }

    public static implicit operator Post(Task<IEnumerable<Post>> v)
    {
        throw new NotImplementedException();
    }
}