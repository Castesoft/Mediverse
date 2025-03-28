using Microsoft.AspNetCore.Authorization.Infrastructure;

namespace MainService.Authorization.Operations;

/// <summary>
/// Defines standard operation names for Service resource authorization.
/// </summary>
public static class ServiceOperations
{
    public static readonly OperationAuthorizationRequirement Create =
        new() { Name = nameof(Create) };

    public static readonly OperationAuthorizationRequirement Read =
        new() { Name = nameof(Read) };

    public static readonly OperationAuthorizationRequirement Update =
        new() { Name = nameof(Update) };

    public static readonly OperationAuthorizationRequirement Delete =
        new() { Name = nameof(Delete) };
}
