using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace MainService.Core.DTOs.Addresses
{
    public class ClinicCreateDto : BaseClinicManageDto {}
    public class ClinicUpdateDto : BaseClinicManageDto {}
    
    public class BaseClinicManageDto
    {
        [Required(ErrorMessage = "El nombre es requerido.")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "El nombre debe tener entre 3 y 100 caracteres.")]
        public string? Name { get; set; }

        [StringLength(500, MinimumLength = 3, ErrorMessage = "La descripción debe tener entre 3 y 500 caracteres.")]
        public string? Description { get; set; }

        [Required(ErrorMessage = "La calle es requerida.")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "La calle debe tener entre 3 y 100 caracteres.")]
        public string? Street { get; set; }

        [StringLength(20, ErrorMessage = "El número interior debe tener máximo 20 caracteres.")]
        public string? InteriorNumber { get; set; }

        [Required(ErrorMessage = "El número exterior es requerido.")]
        [StringLength(20, MinimumLength = 1, ErrorMessage = "El número exterior debe tener entre 1 y 20 caracteres.")]
        public string? ExteriorNumber { get; set; }
        [Required(ErrorMessage = "La colonia es requerida.")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "La colonia debe tener entre 3 y 100 caracteres.")]
        public string? Neighborhood { get; set; }
        [Required(ErrorMessage = "La ciudad es requerida.")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "La ciudad debe tener entre 3 y 100 caracteres.")]
        public string? City { get; set; }
        [Required(ErrorMessage = "El estado es requerido.")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "El estado debe tener entre 3 y 100 caracteres.")]
        public string? State { get; set; }
        [Required(ErrorMessage = "El país es requerido.")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "El país debe tener entre 3 y 100 caracteres.")]
        public string? Country { get; set; }
        [Required(ErrorMessage = "El código postal es requerido.")]
        [Range(10000, 99999, ErrorMessage = "El código postal debe tener 5 dígitos.")]
        public string? Zipcode { get; set; }
        [Required(ErrorMessage = "El rol de la dirección es requerido.")]
        public bool? IsMain { get; set; }

        // THESE ARE PROPERTIES THAT ARE NOT REQUIRED IN THE DTO FOR THE COORDINATES
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        public int? MainImageIndex { get; set; }
        public List<IFormFile> Files { get; set; } = [];
        public List<string>? RemovedImageIds { get; set; }
    }
}

/*

{
  "name": "clinica principal",
  "description": "",
  "street": "La Gloria",
  "interiorNumber": "",
  "exteriorNumber": "123",
  "neighborhood": "Hacienda del Rosario",
  "city": "Zapopan",
  "state": "Jalisco",
  "country": "México",
  "zipcode": 45030
}

*/
