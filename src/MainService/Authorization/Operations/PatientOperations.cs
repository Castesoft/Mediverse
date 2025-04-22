using Microsoft.AspNetCore.Authorization.Infrastructure;

namespace MainService.Authorization.Operations;

public static class PatientOperations
{
    public static readonly OperationAuthorizationRequirement ReadDetails =
        new() { Name = nameof(ReadDetails) };

    public static readonly OperationAuthorizationRequirement CreateAssociation =
        new() { Name = nameof(CreateAssociation) };

    public static readonly OperationAuthorizationRequirement DeleteAssociation =
        new() { Name = nameof(DeleteAssociation) };

    public static readonly OperationAuthorizationRequirement ManageMedicalRecord =
        new() { Name = nameof(ManageMedicalRecord) };
}