using MainService.Core.Interfaces.Services;
using MainService.Core.Settings;
using Microsoft.Extensions.Options;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace MainService.Infrastructure.Services;
public class TwilioService : ITwilioService
{
    private readonly TwilioSettings _twilioSettings;
    public TwilioService(IOptions<TwilioSettings> twilioSettings)
    {
        _twilioSettings = twilioSettings.Value;
        TwilioClient.Init(_twilioSettings.AccountSID, _twilioSettings.AuthToken);
    }

    public async Task<MessageResource> SendMessage(string to, string message)
    {
        var messageOptions = new CreateMessageOptions(new PhoneNumber(to))
        {
            From = new PhoneNumber(_twilioSettings.PhoneNumber),
            Body = message
        };

        var messageTask = await MessageResource.CreateAsync(messageOptions);
        return messageTask;
    }
}