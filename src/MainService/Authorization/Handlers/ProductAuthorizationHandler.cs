using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using MainService.Models.Entities;
using MainService.Authorization.Operations;
using MainService.Core.Extensions;

namespace MainService.Authorization.Handlers;

/// <summary>
/// Handles authorization requirements for Product resources based on user roles and ownership.
/// - Admins: Full access.
/// - Doctors: Can only read products they own (DoctorProduct.DoctorId == userId) or global products (DoctorProduct is null)
/// - Other Users: Can read all products.
/// - Doctors: Can create products.
/// - Doctors: Can modify (Update, Delete, ManagePhotos, ManageWarehouses) ONLY products where DoctorProduct is not null and DoctorProduct.DoctorId matches their UserId.
/// - Products with null DoctorProduct can only be modified by Admins.
/// </summary>
public class ProductAuthorizationHandler(ILogger<ProductAuthorizationHandler> logger) : AuthorizationHandler<OperationAuthorizationRequirement, Product>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, OperationAuthorizationRequirement requirement, Product resource)
    {
        // Basic authentication checks
        if (context.User == null || !context.User.Identity.IsAuthenticated)
        {
            context.Fail();
            return Task.CompletedTask;
        }

        var userId = context.User.GetUserId();
        if (userId <= 0)
        {
            context.Fail();
            return Task.CompletedTask;
        }

        logger.LogDebug("Evaluating {RequirementName} for User:{UserId} on Product:{ProductId}",
            requirement.Name, userId, resource.Id);

        // Admin bypass
        if (context.User.IsInRole("Admin"))
        {
            logger.LogInformation("ADMIN User:{UserId} granted {RequirementName} on Product:{ProductId}",
                userId, requirement.Name, resource.Id);
            context.Succeed(requirement);
            return Task.CompletedTask;
        }

        // Role/Ownership based logic
        switch (requirement.Name)
        {
            case nameof(ProductOperations.Read):
                if (context.User.IsInRole("Doctor"))
                {
                    if (resource.DoctorProduct == null || resource.DoctorProduct.DoctorId == userId)
                    {
                        logger.LogInformation("Doctor:{UserId} granted Read access to Product:{ProductId} - {Reason}", userId, resource.Id, resource.DoctorProduct == null ? "Global Product" : "Owner Match");
                        context.Succeed(requirement);
                    }
                    else
                    {
                        logger.LogWarning("Read access DENIED for Doctor:{UserId} on Product:{ProductId} - Owned by Doctor:{OwnerId}", userId, resource.Id, resource.DoctorProduct.DoctorId);
                    }
                }
                else
                {
                    context.Succeed(requirement);
                }
                break;

            case nameof(ProductOperations.Create):
                if (context.User.IsInRole("Doctor"))
                {
                    context.Succeed(requirement);
                }
                break;

            case nameof(ProductOperations.Update):
            case nameof(ProductOperations.ManagePhotos):
            case nameof(ProductOperations.Delete):
            case nameof(ProductOperations.ManageWarehouses):
                if (context.User.IsInRole("Doctor"))
                {
                    if (resource.DoctorProduct != null && resource.DoctorProduct.DoctorId == userId)
                    {
                        context.Succeed(requirement);
                    }
                    else
                    {
                        var reason = resource.DoctorProduct == null
                            ? "Product has no Doctor association"
                            : $"Doctor does not own product (Owner: {resource.DoctorProduct.DoctorId})";

                        logger.LogWarning("Authorization FAILED for Doctor:{UserId} on Product:{ProductId} ({RequirementName}). Reason: {Reason}", userId, resource.Id, requirement.Name, reason);
                    }
                }
                break;

            default:
                logger.LogWarning("Unhandled requirement: {RequirementName} for Product:{ProductId}", requirement.Name, resource.Id);
                break;
        }

        if (!context.HasSucceeded)
        {
            logger.LogWarning("Authorization FAILED for User:{UserId} on Product:{ProductId} ({RequirementName})", userId, resource.Id, requirement.Name);
        }

        return Task.CompletedTask;
    }
}