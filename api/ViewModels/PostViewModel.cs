using Aplzz.Models;
using System.Collections.Generic;

namespace Aplzz.ViewModels
{
    public class PostViewModel
    {
        public IEnumerable<Post> Posts { get; set; }
        public string CurrentViewName { get; set; }

        public PostViewModel(IEnumerable<Post> posts, string currentViewName)
        {
            Posts = posts;
            CurrentViewName = currentViewName;
        }
    }
}
