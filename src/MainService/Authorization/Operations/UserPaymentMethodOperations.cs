using Microsoft.AspNetCore.Authorization.Infrastructure;

namespace MainService.Authorization.Operations;

public static class UserPaymentMethodOperations
{
    public static readonly OperationAuthorizationRequirement Create =
        new() { Name = nameof(Create) };

    public static readonly OperationAuthorizationRequirement Read =
        new() { Name = nameof(Read) };

    public static readonly OperationAuthorizationRequirement Update = // e.g., Set as Default
        new() { Name = nameof(Update) };

    public static readonly OperationAuthorizationRequirement Delete =
        new() { Name = nameof(Delete) };
}