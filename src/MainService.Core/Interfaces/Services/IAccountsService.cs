namespace MainService.Core.Interfaces.Services;

public interface IAccountsService
{
    Task<bool> DeleteAccountAsync(int userId, string password);
}