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

        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public bool IsServiceRecommended { get; set; } = false;
        public bool IsSatisfactionSurveyEmailSent { get; set; } = false;
        public bool IsSatisfactionSurveyCompleted { get; set; } = false;

        /// <summary>
        /// Pagado, Parcialmente Pagado, Reembolsado, Pendiente... etc
        /// Gestionable en la plataforma por el administrador
        /// </summary>
        public EventPaymentStatus EventPaymentStatus { get; set; }
        public EventService EventService { get; set; }
        public EventClinic EventClinic { get; set; }
        public DoctorEvent DoctorEvent { get; set; }
        public PatientEvent PatientEvent { get; set; }
        public EventPaymentMethodType EventPaymentMethodType { get; set; }
        public EventMedicalInsuranceCompany EventMedicalInsuranceCompany { get; set; }
        public ICollection<NurseEvent> NurseEvents { get; set; } = [];
        public ICollection<EventPrescription> EventPrescriptions { get; set; } = [];
        public ICollection<EventPayment> EventPayments { get; set; } = [];
    }

    public class EventPaymentStatus
    {
        public EventPaymentStatus() {}

        public int EventId { get; set; }
        public int PaymentStatusId { get; set; }
        public Event Event { get; set; }
        public PaymentStatus PaymentStatus { get; set; }
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

        public string Color { get; set; }

        public ICollection<EventPaymentStatus> EventPaymentStatuses { get; set; } = [];
    }

    public class Payment : BaseEntity
    {
        public Payment() {}
        
        public decimal Amount { get; set; }
        public string StripePaymentIntent { get; set; }
        
        public EventPayment EventPayment { get; set; }
        public PaymentPaymentMethod PaymentPaymentMethod { get; set; }
        public PaymentPaymentMethodType PaymentPaymentMethodType { get; set; }
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
        public Payment Payment { get; set; }
        public PaymentMethod PaymentMethod { get; set; }
    }

    public class PaymentPaymentMethodType
    {
        public PaymentPaymentMethodType() {}
        
        public PaymentPaymentMethodType(int paymentMethodTypeId) => PaymentMethodTypeId = paymentMethodTypeId;
        
        public int PaymentId { get; set; }
        public int PaymentMethodTypeId { get; set; }
        public Payment Payment { get; set; }
        public PaymentMethodType PaymentMethodType { get; set; }
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
        public Event Event { get; set; }
        public int PaymentId { get; set; }
        public Payment Payment { get; set; }
    }
}