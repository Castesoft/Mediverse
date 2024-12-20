using System.ComponentModel.DataAnnotations;

namespace MainService.Core.DTOs.Events;
public class EventUpdateEvolutionDto
{
    [Required(ErrorMessage = "La evolución es requerida.")]
    public string? Content { get; set; }
}