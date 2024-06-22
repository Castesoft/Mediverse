using Twilio.Rest.Api.V2010.Account;

namespace MainService.Core.Interfaces.Services;
public interface ITwilioService
{
    Task<MessageResource> SendMessage(string to, string message);
}