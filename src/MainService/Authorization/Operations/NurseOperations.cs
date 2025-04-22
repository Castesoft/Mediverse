using Microsoft.AspNetCore.Authorization.Infrastructure;

namespace MainService.Authorization.Operations;

public static class NurseOperations
{
    public static readonly OperationAuthorizationRequirement CreateAssociation =
        new() { Name = nameof(CreateAssociation) };

    public static readonly OperationAuthorizationRequirement ReadAssociation =
        new() { Name = nameof(ReadAssociation) };

    public static readonly OperationAuthorizationRequirement DeleteAssociation =
        new() { Name = nameof(DeleteAssociation) };
}