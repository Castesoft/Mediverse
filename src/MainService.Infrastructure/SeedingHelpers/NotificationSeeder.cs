using Bogus;
using MainService.Models.Entities;

namespace MainService.Infrastructure.SeedingHelpers;

public static class NotificationSeeder
{
    public static IEnumerable<Notification> GetNotifications(int count)
    {
        return NotificationFaker.Generate(count);
    }
    
    private static readonly Faker<Notification> NotificationFaker = new Faker<Notification>()
        .RuleFor(n => n.Title, f => f.Commerce.ProductName())
        .RuleFor(n => n.Message, f => f.Lorem.Sentence())
        .RuleFor(n => n.ActionUrl, f => f.Internet.Url())
        .RuleFor(n => n.NotificationType, f => f.PickRandom<NotificationType>())
        .RuleFor(n => n.Payload, f => f.Lorem.Sentence())
        .RuleFor(n => n.CreatedAt, f => f.Date.Past().ToUniversalTime())
        .RuleFor(n => n.UserNotifications, _ => []);
}