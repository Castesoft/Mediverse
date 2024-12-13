namespace MainService.Core.DTOs.User
{
    public class SocialAuthDto
    {
        public string? Provider { get; set; }
        public string? AccessToken { get; set; }
    }
}