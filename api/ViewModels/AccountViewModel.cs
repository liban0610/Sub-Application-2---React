using Aplzz.Models;
using System.Collections.Generic;

namespace Aplzz.ViewModels
{
    public class AccountViewModel 
    {
        public User GetUserInfo {get;set;}
        public IEnumerable<Post> Posts {get;set;}
    }
}