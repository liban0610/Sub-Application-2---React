using System;
using System.ComponentModel.DataAnnotations;
using System.Runtime.InteropServices;
namespace Aplzz.Models
{
    public class User
        {
            [Key]
            public int IdUser {get;set;}
            [Required(ErrorMessage ="Firstname is required")]
            public string Firstname {get;set;} = string.Empty;
            [Required(ErrorMessage ="Aftername is required")]
            public string Aftername {get;set;} = string.Empty;
            [Required(ErrorMessage ="Email is required")]
            [EmailAddress(ErrorMessage ="Email is not accepted, try another one")] 
            public string Email {get;set;} = string.Empty;
            // choose a password
            [Required(ErrorMessage ="Password is required to proceed!")]
            [DataType(DataType.Password)]
            public string Password {get;set;} = string.Empty;
            // regular expresstion for username
            [RegularExpression(@"^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$", ErrorMessage ="Username is invalid, try another one")]
            public string Username {get;set;} = string.Empty;
            [RegularExpression(@"(0047|\+47|47)?\d{8} ", ErrorMessage ="Invalid norwegian number")]
            public string Phone {get;set;} = string.Empty;
            public DateTime Date_Started {get;set;}
            // regex for image
            [RegularExpression(@"([^\s]+(\.(?i)(jpe?g|png|gif|bmp))$)", ErrorMessage ="Please choose a picture (.jpeg, jpg, png file etc.)")]
            public string? ProfilePicture {get;set;}
        }
}
