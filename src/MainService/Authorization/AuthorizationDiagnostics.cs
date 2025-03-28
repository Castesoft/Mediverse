using Microsoft.AspNetCore.Authorization;
using MainService.Authorization.Handlers;
using Serilog;

namespace MainService.Authorization;

public static class AuthorizationDiagnostics
{
    public static void VerifyAuthorizationHandlersRegistration(IServiceProvider serviceProvider)
    {
        try
        {
            // Check if the PrescriptionAuthorizationHandler is registered
            var handlers = serviceProvider.GetServices<IAuthorizationHandler>();
            var handlersList = handlers.ToList();

            var prescriptionHandler = handlersList.OfType<PrescriptionAuthorizationHandler>().FirstOrDefault();

            if (prescriptionHandler == null)
            {
                Log.Error("PrescriptionAuthorizationHandler is NOT registered in the service collection!");
            }
            else
            {
                Log.Information("PrescriptionAuthorizationHandler is correctly registered");
            }

            Log.Information("Registered authorization handlers: {Count}", handlersList.Count);
            foreach (var handler in handlersList)
            {
                Log.Information("Handler registered: {HandlerType}", handler.GetType().FullName);
            }
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Error checking authorization handlers registration");
        }
    }
}