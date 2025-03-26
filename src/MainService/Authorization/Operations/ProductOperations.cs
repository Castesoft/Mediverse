using Microsoft.AspNetCore.Authorization.Infrastructure;

namespace MainService.Authorization.Operations;

/// <summary>
/// Defines standard operation names for Product resource authorization.
/// </summary>
public static class ProductOperations
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
    public static readonly OperationAuthorizationRequirement ManageWarehouses =
        new() { Name = nameof(ManageWarehouses) };
        
    public static readonly OperationAuthorizationRequirement ManagePhotos =
        new() { Name = nameof(ManagePhotos) };
}
