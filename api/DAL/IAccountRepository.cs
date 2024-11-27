using Aplzz.Models;

namespace Aplzz.DAL;
public interface IAccountRepository 
{
    //Task<IEnumerable<User>> GetAllUsers();
    Task<User?> GetUserInfo(string uName);
}