using System.ComponentModel.DataAnnotations;

namespace MainService.Core.DTOs.Subscriptions;

public class SubscriptionDeleteDto
{
    [Required(ErrorMessage = "El motivo 'Demasiado caro' es obligatorio")]
    public required bool TooExpensive { get; set; }

    [Required(ErrorMessage = "El motivo 'No se utiliza lo suficiente' es obligatorio")]
    public required bool NotEnoughUse { get; set; }

    [Required(ErrorMessage = "El motivo 'Encontré una alternativa' es obligatorio")]
    public required bool FoundAlternative { get; set; }

    [Required(ErrorMessage = "El motivo 'Faltan características' es obligatorio")]
    public required bool MissingFeatures { get; set; }

    [Required(ErrorMessage = "El motivo 'Problemas técnicos' es obligatorio")]
    public required bool TechnicalProblems { get; set; }

    [Required(ErrorMessage = "El motivo 'Soporte deficiente' es obligatorio")]
    public required bool PoorSupport { get; set; }

    [Required(ErrorMessage = "El motivo 'Otro' es obligatorio")]
    public required bool OtherReason { get; set; }

    [MaxLength(1500, ErrorMessage = "El comentario es demasiado largo. Debe tener menos de 1500 caracteres.")]
    public string? Feedback { get; set; }
}