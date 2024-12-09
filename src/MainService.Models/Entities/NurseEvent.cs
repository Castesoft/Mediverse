namespace MainService.Models.Entities;

public class NurseEvent
{
    public NurseEvent() {}
    
    public NurseEvent(int nurseId) => NurseId = nurseId;
    
    public int NurseId { get; set; }
    public int EventId { get; set; }
    public AppUser Nurse { get; set; } = null!;
    public Event Event { get; set; } = null!;
}