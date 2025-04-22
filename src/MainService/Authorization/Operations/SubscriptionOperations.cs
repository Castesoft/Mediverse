using Microsoft.AspNetCore.Authorization.Infrastructure;

namespace MainService.Authorization.Operations;

public static class SubscriptionOperations
{
    public static readonly OperationAuthorizationRequirement Create =
        new() { Name = nameof(Create) };

    public static readonly OperationAuthorizationRequirement Read =
        new() { Name = nameof(Read) };

    public static readonly OperationAuthorizationRequirement Cancel =
        new() { Name = nameof(Cancel) };

    public static readonly OperationAuthorizationRequirement ReadHistory =
        new() { Name = nameof(ReadHistory) };
}