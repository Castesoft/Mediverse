using Microsoft.AspNetCore.Authorization.Infrastructure;

namespace MainService.Authorization.Operations
{
    public static class ClinicOperations
    {
        public static readonly OperationAuthorizationRequirement Read = 
            new() { Name = nameof(Read) };
            
        public static readonly OperationAuthorizationRequirement Create = 
            new() { Name = nameof(Create) };
            
        public static readonly OperationAuthorizationRequirement Update = 
            new() { Name = nameof(Update) };
            
        public static readonly OperationAuthorizationRequirement Delete = 
            new() { Name = nameof(Delete) };
            
        public static readonly OperationAuthorizationRequirement ManageNurses = 
            new() { Name = nameof(ManageNurses) };
            
        public static readonly OperationAuthorizationRequirement ManagePhotos = 
            new() { Name = nameof(ManagePhotos) };
    }
}
