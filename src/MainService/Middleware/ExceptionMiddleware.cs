using System.Net;
using System.Text.Json;
using MainService.Errors;

namespace MainService.Middleware;
public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;
    private readonly IHostEnvironment _env;
    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger,
        IHostEnvironment env)
    {
        _env = env;
        _logger = logger;
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            // Check if the exception is a PermissionDeniedException to log it as a warning.
            if (ex is PermissionDeniedException)
            {
                _logger.LogWarning(ex, ex.Message); // Log as warning.
            }
            else
            {
                _logger.LogError(ex, ex.Message); // Log as error for other types of exceptions.
            }

            context.Response.ContentType = "application/json";

            if (ex is PermissionDeniedException permissionDeniedException)
            {
                // Modify the response for PermissionDeniedException
                context.Response.StatusCode = (int)HttpStatusCode.Forbidden; // 403 Forbidden
                var response = new ApiException(context.Response.StatusCode, "Access Denied", permissionDeniedException.Message);
                var json = JsonSerializer.Serialize(response, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
                await context.Response.WriteAsync(json);
            }
            else
            {
                // Handle other exceptions
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError; // 500 Internal Server Error
                var response = _env.IsDevelopment()
                    ? new ApiException((int)HttpStatusCode.InternalServerError, ex.Message, ex.StackTrace?.ToString())
                    : new ApiException((int)HttpStatusCode.InternalServerError);
                var json = JsonSerializer.Serialize(response, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
                await context.Response.WriteAsync(json);
            }
        }
    }

    // public async Task InvokeAsync(HttpContext context)
    // {
    //     try
    //     {
    //         await _next(context);
    //     }
    //     catch (Exception ex)
    //     {
    //         _logger.LogError(ex, ex.Message);
    //         context.Response.ContentType = "application/json";
    //         context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

    //         var response = _env.IsDevelopment()
    //             ? new ApiException((int)HttpStatusCode.InternalServerError, ex.Message, ex.StackTrace.ToString())
    //             : new ApiException((int)HttpStatusCode.InternalServerError);

    //         var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    //         var json = JsonSerializer.Serialize(response, options);

    //         await context.Response.WriteAsync(json);
    //     }
    // }
}