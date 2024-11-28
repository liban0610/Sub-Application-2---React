using Microsoft.AspNetCore.Mvc;
using Aplzz.DAL;
using Aplzz.Models;
using Aplzz.ViewModels;
using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace Aplzz.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostAPIController : Controller
{
    private readonly IPostRepository _postRepository;
    private readonly ILogger<PostController> _logger;

    public PostAPIController(IPostRepository postRepository, ILogger<PostController> logger)
    {
        _postRepository = postRepository;
        _logger = logger;
    }

    [HttpGet("posts")]
    public async Task<IActionResult> GetPosts()
    {
        var posts = await _postRepository.GetAll();
        if (posts == null)
        {
            _logger.LogError("[PostAPIController] Post list not found while executing _postRepository.GetAll()");
            return NotFound("Post list not found");
        }
        return Ok(posts);
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreatePost([FromForm] Post post, IFormFile? image)
    {
        if (post == null)
        {
            return BadRequest("Invalid post data");
        }

        if (image != null)
        {
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(image.FileName)}";
            var filePath = Path.Combine("wwwroot/images", fileName);
            
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }
            
            post.ImageUrl = $"/images/{fileName}";
        }

        post.CreatedAt = DateTime.Now;
        await _postRepository.Create(post);
        
        return Ok(post);
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetPost(int id)
    {
        var post = await _postRepository.GetPostById(id);
    if (post == null)
    {
        _logger.LogError("[PostAPIController] Post not found for the PostId {PostId:0000}", id);
        return NotFound("Post not found for the PostId");
    }
    return Ok(post);
}

    [HttpPut("update/{id}")]
    public async Task<IActionResult> Update(int id, [FromForm] Post updatedPost, IFormFile? image)
    {
    if (updatedPost == null)
    {
        return BadRequest("Post data cannot be null");
    }

    var existingPost = await _postRepository.GetPostById(id);
    if (existingPost == null)
    {
        return NotFound("Post not found");
    }

    // Håndter bildeopplasting hvis nytt bilde er lagt ved
    if (image != null)
    {
        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(image.FileName)}";
        var filePath = Path.Combine("wwwroot/images", fileName);
        
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await image.CopyToAsync(stream);
        }
        
        existingPost.ImageUrl = $"/images/{fileName}";
    }

    // Oppdater innleggets innhold
    existingPost.Content = updatedPost.Content;

    bool updateSuccessful = await _postRepository.Update(existingPost);
    if (updateSuccessful)
    {
        return Ok(existingPost);
    }

    _logger.LogWarning("[PostAPIController] Post update failed {@post}", existingPost);
    return StatusCode(500, "Internal server error");
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _postRepository.Delete(id);
        if (!result)
    {
        return NotFound("Innlegget ble ikke funnet");
        }
        return NoContent();
    }

    [HttpPost("addcomment")]
public async Task<IActionResult> AddComment([FromForm] int postId, [FromForm] string commentText)
{
    if (string.IsNullOrEmpty(commentText))
    {
        return BadRequest(new { error = "Kommentartekst kan ikke være tom" });
    }

    var comment = new Comment
    {
        Text = commentText,
        CommentedAt = DateTime.Now,
        PostId = postId,
        UserId = 1 // Midlertidig bruker-ID
    };

    var result = await _postRepository.AddComment(comment);
    if (!result)
    {
        return BadRequest(new { error = "Kunne ikke legge til kommentar" });
    }

    // Hent brukernavnet fra databasen
    var user = await _postRepository.GetUserById(comment.UserId);
    
    return Ok(new { 
        commentId = comment.CommentId,
        text = comment.Text,
        commentedAt = comment.CommentedAt,
        userId = comment.UserId,
        username = user?.Username ?? "Anonym" // Fallback til "Anonym" hvis ingen bruker funnet
    });
    }

    [HttpPost("likepost")]
public async Task<IActionResult> LikePost([FromForm] int postId)
{
    try
    {
        // Midlertidig hardkodet bruker-ID for testing
        int userId = 1;
        var isLiked = await _postRepository.HasUserLikedPost(postId, userId);

        if (isLiked)
        {
            await _postRepository.RemoveLike(postId, userId);
            return Ok(new { 
                isLiked = false, 
                userId = userId,
                likesCount = await _postRepository.GetLikeCount(postId)
            });
        }
        else
        {
            var like = new Like { PostId = postId, UserId = userId };
            await _postRepository.AddLike(like);
            return Ok(new { 
                isLiked = true, 
                userId = userId,
                likesCount = await _postRepository.GetLikeCount(postId)
            });
        }
    }
    catch (Exception e)
    {
        _logger.LogError("[PostController] Like operation failed: {e}", e.Message);
        return BadRequest(new { error = "Kunne ikke utføre like-operasjonen" });
    }
}
}
    
    public class PostController : Controller
    {
        private readonly IPostRepository _postRepository; // Legg til en privat felt for konteksten
        private readonly ILogger<PostController> _logger;

        // Injiser PostDbContext via konstruktøren
        public PostController(IPostRepository postRepository, ILogger<PostController> logger)
        {
            _postRepository = postRepository;
            _logger = logger;
        }

        public async Task<IActionResult> Index()
        {
            try
            {
                var posts = await _postRepository.GetAll();
                var viewModel = new PostViewModel(posts, "Aplzz Feed");
                return View(viewModel);
            }
            catch (Exception e)
            {
                _logger.LogError("[PostController] Failed to fetch posts: {e}", e.Message);
                return BadRequest("Failed to fetch posts");
            }
        }

        [HttpGet]
        public IActionResult Create()
        {
            if(HttpContext.Session.GetString("username") == null) {
                // logg inn først for å entre siden
                return RedirectToAction("Index", "Login");
            }
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Create(Post post, IFormFile? imageFile)
        {
            if (ModelState.IsValid)
            {
                if (imageFile != null && imageFile.Length > 0)
                {
                    try
                    {
                        var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images", imageFile.FileName);
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await imageFile.CopyToAsync(stream);
                        }
                        post.ImageUrl = $"/images/{imageFile.FileName}";
                    }
                    catch (Exception e)
                    {
                        _logger.LogError("[PostController] Image upload failed: {e}", e.Message);
                    }
                }

                post.CreatedAt = DateTime.Now;
                try
                {
                    post.UserId = int.Parse(HttpContext.Session.GetString("id"));
                    await _postRepository.Create(post);
                    return RedirectToAction(nameof(Index));
                }
                catch (Exception e)
                {
                    _logger.LogError("[PostController] Failed to create post: {e}", e.Message);
                }
            }
            if(HttpContext.Session.GetString("username") == null) {
                // logg inn først for å entre siden
                return RedirectToAction("Index", "Login");
            }
            return View(post);
        }

        [HttpPost]
        public async Task<IActionResult> AddComment(int postId, string commentText)
        {
            if (!string.IsNullOrEmpty(commentText))
            {
                var comment = new Comment
                {
                    Text = commentText,
                    CommentedAt = DateTime.Now,
                    PostId = postId,
                    UserId = int.Parse(HttpContext.Session.GetString("id"))
                };

                var result = await _postRepository.AddComment(comment);
                if (!result)
                {
                    return BadRequest(new { error = "Kunne ikke legge til kommentar" });
                }
                return Json(new { 
                    text = comment.Text,
                    commentedAt = comment.CommentedAt.ToString("dd.MM.yyyy HH:mm")
                });
            }
            return BadRequest(new { error = "Kommentartekst kan ikke være tom" });
        }

        [HttpGet]
        public async Task<IActionResult> Update(int id)
        {
            var post = await _postRepository.GetPostById(id);
            if (post == null)
            {
                return NotFound();
            }
            if(HttpContext.Session.GetString("username") == null) {
                // logg inn først for å entre siden
                return RedirectToAction("Index", "Login");
            }
            // only people with same id will delete/edit their own posts!
            if(int.Parse(HttpContext.Session.GetString("id")) != post.UserId) {
                return View("NoAccess", post);
            }

            return View(post);
        }

        [HttpPost]
        public async Task<IActionResult> Update(int id, Post post, IFormFile? imageFile)
        {
            if (ModelState.IsValid)
            {
                var originalPost = await _postRepository.GetPostById(id);
                if (originalPost == null)
                {
                    return NotFound();
                }

                // Update only the necessary properties
                originalPost.Content = post.Content;
                
                // Only update image if a new one is provided
                if (imageFile != null && imageFile.Length > 0)
                {
                    try
                    {
                        var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images", imageFile.FileName);
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await imageFile.CopyToAsync(stream);
                        }
                        originalPost.ImageUrl = $"/images/{imageFile.FileName}";
                    }
                    catch (Exception e)
                    {
                        _logger.LogError("[PostController] Image upload failed: {e}", e.Message);
                    }
                }

                try
                {
                    await _postRepository.Update(originalPost);
                    return RedirectToAction(nameof(Index));
                }
                catch (Exception e)
                {
                    _logger.LogError("[PostController] Failed to update post: {e}", e.Message);
                    ModelState.AddModelError("", "Failed to update post");
                }
            }
            return View(post);
        }

        [HttpGet]
        public async Task<IActionResult> Delete(int id)
        {
            var post = await _postRepository.GetPostById(id);
            if (post == null)
            {
                return NotFound();
            }
            if(HttpContext.Session.GetString("username") == null) {
                // logg inn først for å entre siden
                return RedirectToAction("Index", "Login");
            }

            // only people with same id will delete/edit their own posts!
            if(int.Parse(HttpContext.Session.GetString("id")) != post.UserId) {
                return View("NoAccess", post);
            }

            return View(post);
        }

        [HttpPost]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var result = await _postRepository.Delete(id);
            if (!result)
            {
                return NotFound();
            }
            return RedirectToAction(nameof(Index));
        }

        [HttpPost]
        public async Task<IActionResult> LikePost(int postId)
        {
            if(HttpContext.Session.GetString("username") == null) {
                // logg inn først for å entre siden
                return RedirectToAction("Index", "Login");
            }
            try
            {
                int userId = int.Parse(HttpContext.Session.GetString("id")); // Hardkodet bruker-ID
                var isLiked = await _postRepository.HasUserLikedPost(postId, userId);

                if (isLiked)
                {
                    await _postRepository.RemoveLike(postId, userId);
                }
                else
                {
                    var like = new Like {PostId = postId, UserId = userId};
                    await _postRepository.AddLike(like);
                }

                var newLikeCount = await _postRepository.GetLikeCount(postId);
                return Json(new { likesCount = newLikeCount, isLiked = !isLiked });
            }
            catch (Exception e)
            {
                _logger.LogError("[PostController] Failed to process like: {e}", e.Message);
                return BadRequest("Failed to process like");
            }
        }
    }

