using MainService.Core.Interfaces.Services;
using QRCoder;

namespace MainService.Infrastructure.Services
{
    public class QRCoderService : IQRCoderService
    {
        public byte[] GenerateQRCode(string url)
        {
            QRCodeGenerator qrGenerator = new();
            QRCodeData qrCodeData = qrGenerator.CreateQrCode(url, QRCodeGenerator.ECCLevel.Q);
            PngByteQRCode qrCode = new(qrCodeData);
            return qrCode.GetGraphic(20);
        }
    }
}