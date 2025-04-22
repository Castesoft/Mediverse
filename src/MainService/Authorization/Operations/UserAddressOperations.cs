using Microsoft.AspNetCore.Authorization.Infrastructure;

namespace MainService.Authorization.Operations;

public static class UserAddressOperations
{
    public static readonly OperationAuthorizationRequirement Create =
        new() { Name = nameof(Create) };

    public static readonly OperationAuthorizationRequirement Read =
        new() { Name = nameof(Read) };

    public static readonly OperationAuthorizationRequirement Update =
        new() { Name = nameof(Update) };

    public static readonly OperationAuthorizationRequirement Delete =
        new() { Name = nameof(Delete) };

    public static readonly OperationAuthorizationRequirement SetMain =
        new() { Name = nameof(SetMain) };

    public static readonly OperationAuthorizationRequirement SetBilling =
        new() { Name = nameof(SetBilling) };
}