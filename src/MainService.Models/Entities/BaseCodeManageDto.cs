using System.ComponentModel.DataAnnotations;

namespace MainService.Models.Entities
{
    public class BaseCodeManageDto {
        [Required(ErrorMessage = "El nombre es requerido.")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "El nombre debe tener entre 3 y 100 caracteres.")]
        public string? Name { get; set; }

        [Required(ErrorMessage = "El código es requerido.")]
        [StringLength(100, MinimumLength = 1, ErrorMessage = "El código debe tener entre 1 y 100 caracteres.")]
        public string? Code { get; set; }

        public int? CodeNumber { get; set; }
        public string? Description { get; set; }
        public string? Color { get; set; }
        public string? LastName { get; set; }
        public bool? Enabled { get; set; }
        public bool? Visible { get; set; }
    }
}