using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using MainService.Core.Interfaces.Services;
using MainService.Models.Entities;
using MainService.Authorization.Operations;
using MainService.Core.Extensions;

namespace MainService.Authorization.Handlers
{
    /// <summary>
    /// Handles authorization requirements for specific Product resources based on user relationship.
    /// </summary>
    public class ProductAuthorizationHandler(IUnitOfWork uow, ILogger<ProductAuthorizationHandler> logger)
        : AuthorizationHandler<OperationAuthorizationRequirement, Product>
    {
        protected override async Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            OperationAuthorizationRequirement requirement,
            Product resource)
        {
            if (context.User == null || !context.User.Identity.IsAuthenticated)
            {
                logger.LogWarning("Authorization failed: User is not authenticated.");
                context.Fail();
                return;
            }

            var userId = context.User.GetUserId();
            if (userId <= 0)
            {
                logger.LogWarning("Authorization failed: User ID not found or invalid in claims.");
                context.Fail();
                return;
            }

            logger.LogDebug("Evaluating requirement {RequirementName} for User {UserId} on Product {ProductId}", requirement.Name, userId, resource.Id);

            var isAuthorized = false;

            // Admin has full access to all products
            if (context.User.IsInRole("Admin"))
            {
                logger.LogInformation("Admin authorization granted for User {UserId} on Product {ProductId}", userId, resource.Id);
                context.Succeed(requirement);
                return;
            }

            switch (requirement.Name)
            {
                case nameof(ProductOperations.Read):
                    // Anyone can read products that are visible
                    if (resource.DoctorProduct == null)
                    {
                        logger.LogWarning("doctorproduct is null");
                        isAuthorized = true;
                    }
                    else
                    {
                        // Doctors can see their own products even if not visible
                        isAuthorized = context.User.IsInRole("Doctor") && resource.DoctorProduct.DoctorId == userId;
                    }
                    break;

                case nameof(ProductOperations.Create):
                    // Only doctors can create products
                    isAuthorized = context.User.IsInRole("Doctor");
                    break;

                case nameof(ProductOperations.Update):
                case nameof(ProductOperations.ManagePhotos):
                    // Doctors can update their own products
                    isAuthorized = context.User.IsInRole("Doctor") && resource.DoctorProduct.DoctorId == userId;
                    break;

                case nameof(ProductOperations.Delete):
                    // Only doctors can delete their own products
                    isAuthorized = context.User.IsInRole("Doctor") && resource.DoctorProduct.DoctorId == userId;
                    break;

                case nameof(ProductOperations.ManageWarehouses):
                    // Only doctors with warehouse management permissions can manage warehouses
                    isAuthorized = context.User.IsInRole("Doctor") && resource.DoctorProduct.DoctorId == userId;
                    break;

                default:
                    logger.LogWarning("Authorization requirement {RequirementName} is not handled by ProductAuthorizationHandler for Product {ProductId}.", requirement.Name, resource.Id);
                    isAuthorized = false;
                    break;
            }

            if (isAuthorized)
            {
                logger.LogInformation("Authorization SUCCEEDED for User {UserId} requirement {RequirementName} on Product {ProductId}", userId, requirement.Name, resource.Id);
                context.Succeed(requirement);
            }
            else
            {
                logger.LogDebug("Authorization final result: FAILED for User {UserId} requirement {RequirementName} on Product {ProductId}", userId, requirement.Name, resource.Id);
            }
        }
    }
}
