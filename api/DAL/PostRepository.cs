using Microsoft.EntityFrameworkCore;
using Aplzz.Models;

namespace Aplzz.DAL;

public class PostRepository : IPostRepository
{
    private readonly PostDbContext _db;
    private readonly ILogger<PostRepository> _logger;

    public PostRepository(PostDbContext db, ILogger<PostRepository> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task<IEnumerable<Post>> GetAll()
    {
        try
        {
            return await _db.Posts
                .Include(p => p.Comments)
                .Include(p => p.Likes)
                .Include(p => p.GetUser)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }
        catch (Exception e)
        {
            _logger.LogError("[PostRepository] Failed to get all posts: {e}", e.Message);
            throw;
        }
    }
    // lag en spørring hvor du henter ut ifra brukerens id
        public async Task<IEnumerable<Post>> GellPostByUserId(int userId)
    {
        try
        {
            return await _db.Posts
                .Include(p => p.Comments)
                .Include(p => p.Likes)
                .Include(p => p.GetUser)
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }
        catch (Exception e)
        {
            _logger.LogError("[PostRepository] Failed to get all posts by user: {e}", e.Message);
            throw;
        }
    }

    public async Task<Post?> GetPostById(int id)
    {
        try
        {
            return await _db.Posts
                .Include(p => p.Comments)
                .Include(p => p.Likes)
                .Include(p => p.GetUser)
                .FirstOrDefaultAsync(p => p.PostId == id);
        }
        catch (Exception e)
        {
            _logger.LogError("[PostRepository] Failed to get post by id {id}: {e}", id, e.Message);
            throw;
        }
    }

    public async Task Create(Post post)
    {
        try
        {
            _db.Posts.Add(post);
            await _db.SaveChangesAsync();
        }
        catch (Exception e)
        {
            _logger.LogError("[PostRepository] Failed to create post: {e}", e.Message);
            throw;
        }
    }

    public async Task Update(Post post)
    {
        try
        {
            _db.Posts.Update(post);
            await _db.SaveChangesAsync();
        }
        catch (Exception e)
        {
            _logger.LogError("[PostRepository] Failed to update post {PostId}: {e}", post.PostId, e.Message);
            throw;
        }
    }

    public async Task<bool> Delete(int id)
    {
        try
        {
            var post = await _db.Posts.FindAsync(id);
            if (post == null)
            {
                return false;
            }

            _db.Posts.Remove(post);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            _logger.LogError("[PostRepository] Failed to delete post {id}: {e}", id, e.Message);
            throw;
        }
    }

    public async Task<bool> AddComment(Comment comment)
    {
        try
        {
            _db.Comments.Add(comment);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            _logger.LogError("[PostRepository] Failed to add comment to post {PostId}: {e}", comment.PostId, e.Message);
            return false;
        }
    }

    public async Task<bool> AddLike(Like like)
    {
        try
        {
            _db.Likes.Add(like);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            _logger.LogError("[PostRepository] Failed to add like to post {PostId}: {e}", like.PostId, e.Message);
            return false;
        }
    }

    public async Task<bool> RemoveLike(int postId, int userId)
    {
        try
        {
            var like = await _db.Likes
                .FirstOrDefaultAsync(l => l.PostId == postId && l.UserId == userId);
            
            if (like == null) return false;

            _db.Likes.Remove(like);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            _logger.LogError("[PostRepository] Failed to remove like from post {PostId}: {e}", postId, e.Message);
            return false;
        }
    }

    public async Task<int> GetLikeCount(int postId)
    {
        try
        {
            return await _db.Likes.CountAsync(l => l.PostId == postId);
        }
        catch (Exception e)
        {
            _logger.LogError("[PostRepository] Failed to get like count for post {PostId}: {e}", postId, e.Message);
            throw;
        }
    }

    public async Task<bool> HasUserLikedPost(int postId, int userId)
    {
        try
        {
            return await _db.Likes.AnyAsync(l => l.PostId == postId && l.UserId == userId);
        }
        catch (Exception e)
        {
            _logger.LogError("[PostRepository] Failed to check if user liked post: {e}", e.Message);
            throw;
        }
    }
}
