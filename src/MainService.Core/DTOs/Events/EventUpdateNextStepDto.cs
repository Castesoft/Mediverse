using System.ComponentModel.DataAnnotations;

namespace MainService.Core.DTOs.Events;
public class EventUpdateNextStepDto
{
    [Required(ErrorMessage = "El siguiente paso es requerido.")]
    public string? Content { get; set; }
}