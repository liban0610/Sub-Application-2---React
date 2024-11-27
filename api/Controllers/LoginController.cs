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

public class LoginController : Controller 
{
  private readonly PostDbContext _userDB;
  private readonly ILogger<LoginController> _logger;
  public LoginController(PostDbContext userDb, ILogger<LoginController> logger) 
  {
    _logger = logger;
    _userDB = userDb;
  }

  public IActionResult Index() 
  {
    if(HttpContext.Session.GetString("username") != null) {
      return RedirectToAction("Index", "Post");
    } else {
      return View();
    }
  }

 [HttpPost]
 public IActionResult Index(LoginModel loginModel) {
  if(ModelState.IsValid) {
    if(CheckEmail(loginModel.Email) == true && CheckPassword(loginModel.Password) == true) {
      // linq query:
      var MyUser = from user in _userDB.Users 
      where user.Email == loginModel.Email && user.Password == loginModel.Password
      select user;
      // create session:
      foreach(var res in MyUser) {
        HttpContext.Session.SetString("id", res.IdUser.ToString());
        HttpContext.Session.SetString("username", res.Username.ToString());
        HttpContext.Session.SetString("firstname", res.Firstname.ToString());
        HttpContext.Session.SetString("aftername", res.Aftername.ToString());
        HttpContext.Session.SetString("email", res.Email.ToString());
        HttpContext.Session.SetString("profilePicture", res.ProfilePicture.ToString());
      }
      return RedirectToAction("Index", "Post");
    } else {
      TempData["ErrorMessage"] = "E-mail or password is incorrect or account does not exist!";
    }
  }
  return View();
 } 



  public IActionResult Register() 
  {
    return View();
  }


  [HttpPost]
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
        TempData["ErrorUserName"] = "Username exist already choose another one";
      }

      if(userr.ProfilePicture == null) {
        userr.ProfilePicture = "/images/profile.jpg";
      }

      if(checkEmail == true) {
        TempData["ErrorEmail"] = "Email exist already choose another one";
      }
      if(checkName == false && checkEmail == false) {
        _userDB.Users.Add(userr);
        _userDB.SaveChanges();
        TempData["SuccessMsg"] = "Account successfully added. Login now!";
      }
    }
    return View();
  }

  public bool CheckUserName(string Username) {
    return _userDB.Users.Any(a => a.Username == Username);
  }

  public bool CheckEmail(string Email) {
    return _userDB.Users.Any(a => a.Email == Email);
  }
  public bool CheckPassword(string Password) {
    return _userDB.Users.Any(a => a.Password == Password);
  }

  public IActionResult Logout() {
    HttpContext.Session.Clear();
    return RedirectToAction("Index", "Login");
  }
}