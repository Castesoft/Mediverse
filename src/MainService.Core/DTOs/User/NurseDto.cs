namespace MainService.Core.DTOs.User;
public class NurseDto : BaseUserDto
{
    public string Education { get; set; }
    public string Post { get; set; }
    public List<PermissionDto> Permissions { get; set; } = [];
}