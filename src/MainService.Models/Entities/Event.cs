namespace MainService.Models.Entities;

public class Event : BaseEntity
{
    public Event() {}

    public Event(bool allDay, DateTime dateFrom, DateTime dateTo, string timeFrom, string timeTo)
    {
        if (!allDay && !string.IsNullOrEmpty(timeFrom) && !string.IsNullOrEmpty(timeTo))
        {
            TimeSpan fromTimeSpan = TimeSpan.Parse(timeFrom);
            TimeSpan toTimeSpan = TimeSpan.Parse(timeTo);

            DateFrom = dateFrom.Add(fromTimeSpan);
            DateTo = dateTo.Add(toTimeSpan);
        }
        else
        {
            DateFrom = dateFrom;
            DateTo = dateTo;
        }
    }
    
    public EventService EventService { get; set; }
    public EventClinic EventClinic { get; set; }
    public DoctorEvent DoctorEvent { get; set; }
    public PatientEvent PatientEvent { get; set; }
    public ICollection<NurseEvent> NurseEvents { get; set; } = [];
    public ICollection<EventPrescription> EventPrescriptions { get; set; } = [];
    public DateTime DateFrom { get; set; } = DateTime.UtcNow;
    public DateTime DateTo { get; set; } = DateTime.UtcNow;
}