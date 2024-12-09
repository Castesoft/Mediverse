namespace MainService.Models.Entities
{
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

        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public bool IsServiceRecommended { get; set; } = false;
        public bool IsSatisfactionSurveyEmailSent { get; set; } = false;
        public bool IsSatisfactionSurveyCompleted { get; set; } = false;

        /// <summary>
        /// Pagado, Parcialmente Pagado, Reembolsado, Pendiente... etc
        /// Gestionable en la plataforma por el administrador
        /// </summary>
        public EventPaymentStatus EventPaymentStatus { get; set; } = null!;
        public EventService EventService { get; set; } = null!;
        public EventClinic EventClinic { get; set; } = null!;
        public DoctorEvent DoctorEvent { get; set; } = null!;
        public PatientEvent PatientEvent { get; set; } = null!;
        public EventPaymentMethodType EventPaymentMethodType { get; set; } = null!;
        public EventMedicalInsuranceCompany EventMedicalInsuranceCompany { get; set; } = null!;
        public List<NurseEvent> NurseEvents { get; set; } = [];
        public List<EventPrescription> EventPrescriptions { get; set; } = [];
        public List<EventPayment> EventPayments { get; set; } = [];
        public string? Evolution { get; set; }
        public string? NextSteps { get; set; }
    }

    public class EventPaymentStatus
    {
        public EventPaymentStatus() {}

        public int EventId { get; set; }
        public int PaymentStatusId { get; set; }
        public Event Event { get; set; } = null!;
        public PaymentStatus PaymentStatus { get; set; } = null!;
    }

    public class PaymentStatus : BaseEntity
    {
        public PaymentStatus() {}

        public PaymentStatus(string name, string color, string description)
        {
            Name = name;
            Color = color;
            Description = description;
        }

        public string? Color { get; set; }

        public List<EventPaymentStatus> EventPaymentStatuses { get; set; } = [];
    }

    public class Payment : BaseEntity
    {
        public Payment() {}
        
        public decimal? Amount { get; set; }
        public string? StripePaymentIntent { get; set; }
        
        public EventPayment EventPayment { get; set; } = null!;
        public PaymentPaymentMethod PaymentPaymentMethod { get; set; } = null!;
        public PaymentPaymentMethodType PaymentPaymentMethodType { get; set; } = null!;
    }

    public class PaymentPaymentMethod
    {
        public PaymentPaymentMethod() {}

        public PaymentPaymentMethod(int paymentId, int paymentMethodId)
        {
            PaymentId = paymentId;
            PaymentMethodId = paymentMethodId;
        }
        
        public int PaymentId { get; set; }
        public int PaymentMethodId { get; set; }
        public Payment Payment { get; set; } = null!;
        public PaymentMethod PaymentMethod { get; set; } = null!;
    }

    public class PaymentPaymentMethodType
    {
        public PaymentPaymentMethodType() {}
        
        public PaymentPaymentMethodType(int paymentMethodTypeId) => PaymentMethodTypeId = paymentMethodTypeId;
        
        public int PaymentId { get; set; }
        public int PaymentMethodTypeId { get; set; }
        public Payment Payment { get; set; } = null!;
        public PaymentMethodType PaymentMethodType { get; set; } = null!;
    }

    public class EventPayment
    {
        public EventPayment() {}

        public EventPayment(int eventId, int paymentId)
        {
            EventId = eventId;
            PaymentId = paymentId;
        }
        
        public int EventId { get; set; }
        public Event Event { get; set; } = null!;
        public int PaymentId { get; set; }
        public Payment Payment { get; set; } = null!;
    }
}