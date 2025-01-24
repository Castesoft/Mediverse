using MainService.Core.Helpers.Params;
using MainService.Models.Entities;

public class UserParams : BaseParams
{
    public string? Roles { get; set; }
    public Roles Role { get; set; }
    public int? DoctorId { get; set; }

    public List<int> RoleIds
    {
        get
        {
            if (string.IsNullOrEmpty(Roles))
                return [];

            try
            {
                return Roles.Split(',')
                    .Where(x => !string.IsNullOrWhiteSpace(x))
                    .Select(x =>
                    {
                        if (int.TryParse(x.Trim(), out var roleId))
                            return roleId;
                        throw new ArgumentException($"Invalid role ID format: {x}");
                    })
                    .ToList();
            }
            catch (Exception ex)
            {
                throw new ArgumentException("Error parsing role IDs. Format should be comma-separated integers.", ex);
            }
        }
    }
}