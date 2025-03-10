using Bogus;
using MainService.Models.Entities;
using System.Reflection;

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
        .RuleFor(n => n.NotificationType, _ => GetRandomNotificationType())
        .RuleFor(n => n.Payload, f => f.Lorem.Sentence())
        .RuleFor(n => n.CreatedAt, f => f.Date.Past().ToUniversalTime())
        .RuleFor(n => n.UserNotifications, _ => []);

    private static string GetRandomNotificationType()
    {
        var notificationTypes = typeof(NotificationType)
            .GetFields(BindingFlags.Public | BindingFlags.Static | BindingFlags.FlattenHierarchy)
            .Where(fi => fi is { IsLiteral: true, IsInitOnly: false } && fi.FieldType == typeof(string))
            .Select(fi => (string)fi.GetRawConstantValue()!)
            .ToArray();

        return notificationTypes[new Random().Next(notificationTypes.Length)];
    }
}