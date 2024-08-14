namespace MainService.Core.Interfaces.Services
{
    public interface IQRCoderService
    {
        byte[] GenerateQRCode(string url);
    }
}