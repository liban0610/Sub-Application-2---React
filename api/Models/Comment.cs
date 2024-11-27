using System.ComponentModel.DataAnnotations;

namespace Aplzz.Models;

public class Comment
{
    public int CommentId { get; set; }
    public string? Text { get; set; }
    public int UserId {get;set;}
    public DateTime CommentedAt { get; set; }
    public int PostId { get; set; }
    public virtual Post? Post { get; set; }
    public virtual User GetUser {get;set;}
}
