using MainService.Core.DTOs.User;

namespace MainService.Core.DTOs.Nurses;
public class NurseDto : BaseUserDto
{
    public int EventsCount { get; set; } = 0;
    public int PrescriptionsCount { get; set; } = 0;
    public int OrdersCount { get; set; } = 0;
    public bool HasAccount { get; set; }
}