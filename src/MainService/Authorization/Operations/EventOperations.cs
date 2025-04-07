using Microsoft.AspNetCore.Authorization.Infrastructure;

namespace MainService.Authorization.Operations;

/// <summary>
/// Defines standard operation names for Event resource authorization.
/// </summary>
public static class EventOperations
{
    public static readonly OperationAuthorizationRequirement Create =
        new() { Name = nameof(Create) };

    public static readonly OperationAuthorizationRequirement Read =
        new() { Name = nameof(Read) };

    public static readonly OperationAuthorizationRequirement Update =
        new() { Name = nameof(Update) };

    public static readonly OperationAuthorizationRequirement Delete =
        new() { Name = nameof(Delete) };

    // --- Specific Operations ---
    public static readonly OperationAuthorizationRequirement UpdateEvolution =
        new() { Name = nameof(UpdateEvolution) };

    public static readonly OperationAuthorizationRequirement UpdateNextSteps =
        new() { Name = nameof(UpdateNextSteps) };

    public static readonly OperationAuthorizationRequirement Pay =
        new() { Name = nameof(Pay) };

    public static readonly OperationAuthorizationRequirement Cancel =
        new() { Name = nameof(Cancel) };
}