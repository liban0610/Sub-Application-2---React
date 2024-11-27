using Microsoft.EntityFrameworkCore;
using Aplzz.Models;
using Microsoft.AspNetCore.Mvc;

namespace Aplzz.DAL;

public class AccountRepository: IAccountRepository
{
    private readonly PostDbContext _db;
    private readonly ILogger<AccountRepository> _logger;

    public AccountRepository(PostDbContext db, ILogger<AccountRepository> logger) {
        _logger = logger;
        _db = db;
    }

    // sjekk om bruker finnes i databasen ved hjelp av brukernavn
    public async Task<IEnumerable<User>> GetAllUsers() 
    {
        try
        {
            return await _db.Users
                .OrderByDescending(p => p.IdUser)
                .ToListAsync();
        }
        catch (Exception e)
        {
            _logger.LogError("[AccountRepository] Failed to get all users: {e}", e.Message);
            throw;
        }
    }
    public async Task<User?> GetUserInfo(string uName) {
        try {
            return await _db.Users
            .FirstOrDefaultAsync(user => user.Username == uName);
        }
        catch (Exception e) {
            _logger.LogError("[AccountRepository] Something wrong happened, try again later {uName} {e}", uName, e.Message);
            throw;
        }
    }
}