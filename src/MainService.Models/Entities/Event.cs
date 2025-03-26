namespace MainService.Models.Entities;

public class Event : BaseEntity
{
    public Event()
    {
        Payments = [];
    }

    public Event(bool allDay, DateTime dateFrom, DateTime dateTo)
    {
        DateFrom = dateFrom;
        DateTo = dateTo;
        AllDay = allDay;
        Payments = [];
    }

    public bool AllDay { get; set; }
    public DateTime? DateFrom { get; set; }
    public DateTime? DateTo { get; set; }
    public bool IsServiceRecommended { get; set; } = false;
    public bool IsSatisfactionSurveyEmailSent { get; set; } = false;
    public bool IsSatisfactionSurveyCompleted { get; set; } = false;

    public List<Payment> Payments { get; set; }
    public EventService EventService { get; set; } = null!;
    public EventClinic EventClinic { get; set; } = null!;
    public DoctorEvent DoctorEvent { get; set; } = null!;
    public PatientEvent PatientEvent { get; set; } = null!;
    public EventPaymentMethodType EventPaymentMethodType { get; set; } = null!;
    public EventMedicalInsuranceCompany EventMedicalInsuranceCompany { get; set; } = null!;
    public List<NurseEvent> NurseEvents { get; set; } = [];
    public List<EventPrescription> EventPrescriptions { get; set; } = [];
    public PaymentStatus? PaymentStatus { get; set; }

    public string? Evolution { get; set; }
    public string? NextSteps { get; set; }
    
    public int? BillingAddressId { get; set; } 
    public Address? BillingAddress { get; set; } 
}