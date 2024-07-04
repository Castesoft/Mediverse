using System.Net;
using System.Text.Json;
using MainService.Errors;
using Serilog;

namespace MainService.Middleware;
public class ExceptionMiddleware(RequestDelegate next, IHostEnvironment env)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            if (ex is PermissionDeniedException) Log.Warning(ex, ex.Message);
            else Log.Error(ex, ex.Message);

            context.Response.ContentType = "application/json";

            if (ex is PermissionDeniedException permissionDeniedException)
            {

                context.Response.StatusCode = (int)HttpStatusCode.Forbidden;
                var response = new ApiException(context.Response.StatusCode, "Access Denied", permissionDeniedException.Message);
                var json = JsonSerializer.Serialize(response, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
                await context.Response.WriteAsync(json);
            }
            else
            {

                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                var response = env.IsDevelopment()
                    ? new ApiException((int)HttpStatusCode.InternalServerError, ex.Message, ex.StackTrace?.ToString())
                    : new ApiException((int)HttpStatusCode.InternalServerError, ex.Message, "Internal server error");
                var json = JsonSerializer.Serialize(response, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
                await context.Response.WriteAsync(json);
            }
        }
    }
}