using System.Diagnostics;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Aplzz.Models;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Collections;
using Microsoft.EntityFrameworkCore.Query;
using Microsoft.AspNetCore.Http.Connections;
using Aplzz.DAL;
namespace Aplzz.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LoginAPIController : Controller 
{
  private readonly PostDbContext _userDB;
  private readonly ILogger<LoginAPIController> _logger;
  public LoginAPIController(PostDbContext userDb, ILogger<LoginAPIController> logger) 
  {
    _logger = logger;
    _userDB = userDb;
  }


  [HttpGet("login")]
  public IActionResult Index() 
  {
    if(HttpContext.Session.GetString("username") != null) {
      return RedirectToAction("Index", "Post");
    } else {
      return View();
    }
  }

 [HttpPost("loginPost")]
 public IActionResult Index(LoginModel loginModel) {
  if(ModelState.IsValid) {
    if(CheckEmail(loginModel.Email) == true && CheckPassword(loginModel.Password) == true) {
      // linq query:
      var MyUser = from user in _userDB.Users 
      where user.Email == loginModel.Email && user.Password == loginModel.Password
      select user;
      // create session:
      foreach(var user in MyUser) {
        HttpContext.Session.SetString("id", user.IdUser.ToString());
        HttpContext.Session.SetString("username", user.Username.ToString());
        HttpContext.Session.SetString("firstname", user.Firstname.ToString());
        HttpContext.Session.SetString("aftername", user.Aftername.ToString());
        HttpContext.Session.SetString("email", user.Email.ToString());
        
        return Ok( new { 
          id = user.IdUser.ToString(),
          username = user.Username.ToString(),
          firstname = user.Firstname.ToString(),
          aftername = user.Aftername.ToString(),
          email = user.Email.ToString()
        });
      }
    } else {
      return NotFound("E-post eller passord eksisterer ikke");
    }
  }
  return Ok();
 } 




  [HttpGet("register")]
  public IActionResult Register() 
  {
    return View();
  }


  [HttpPost("registerPost")]
  public IActionResult Register(User userModel) {

    if(ModelState.IsValid) {
      // used to count errors
      User userr = new User {
        Firstname = userModel.Firstname,
        Aftername = userModel.Aftername,
        Email = userModel.Email,
        Password = userModel.Password,
        Username = userModel.Username,
        Date_Started = DateTime.Now,
        ProfilePicture = userModel.ProfilePicture
      };
      bool checkName = CheckUserName(userr.Username);
      bool checkEmail = CheckEmail(userr.Email);

      // check username exist
      if(checkName == true) {
        return BadRequest("userNameFound");
      }

      if(userr.ProfilePicture == null) {
        userr.ProfilePicture = "/images/profile.jpg";
      }

      if(checkEmail == true) {
        return BadRequest("epostFound");
      }
      if(checkName == false && checkEmail == false) {
        _userDB.Users.Add(userr);
        _userDB.SaveChanges();
        return Ok(userr);
      }
    }
    return BadRequest();
  }
  [HttpGet("usernameChecker")]
  public bool CheckUserName(string Username) {
    return _userDB.Users.Any(a => a.Username == Username);
  }

  [HttpGet("emailChecker")]
  public bool CheckEmail(string Email) {
    return _userDB.Users.Any(a => a.Email == Email);
  }
  [HttpGet("passwordChecker")]
  public bool CheckPassword(string Password) {
    return _userDB.Users.Any(a => a.Password == Password);
  }

  [HttpGet("logout")]
  public IActionResult Logout() {
    HttpContext.Session.Clear();
    return RedirectToAction("Index", "Login");
  }
}