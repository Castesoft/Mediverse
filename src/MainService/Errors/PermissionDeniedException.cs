namespace MainService.Errors;
public class PermissionDeniedException : Exception
{
    public PermissionDeniedException(string? email, string permission)
        : base($"El usuario {email} no tiene el permiso de {permission.ToLower()}.")
    {
    }
}