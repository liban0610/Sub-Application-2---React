using System;
using System.ComponentModel.DataAnnotations;
using System.Runtime.InteropServices;
namespace Aplzz.Models
{
    public class LoginModel
    {
        [Required(ErrorMessage ="Email is required")]
        [EmailAddress(ErrorMessage ="Email is not accepted, try another one")]
        public string Email {get;set;} = string.Empty;
        [Required(ErrorMessage ="Password is required to proceed!")]
        [DataType(DataType.Password)]
        public string Password {get;set;} = string.Empty;
    }
}