namespace MainService.Core.DTOs.User
{
    public class TwoFactorSetupDto
    {
        public string SharedKey { get; set; }
        public string AuthenticatorUri { get; set; }
        public byte[] QrCode { get; set; }
    }
}