using AutoMapper;
using MainService.Core.DTOs;
using MainService.Core.DTOs.Patients;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Services;
using MainService.Errors;
using MainService.Extensions;
using MainService.Models.Entities;
using Microsoft.AspNetCore.Mvc;

namespace MainService.Controllers
{
    public class PatientsController : BaseApiController
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;

        public PatientsController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _uow = unitOfWork;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<PatientDto>>> GetPagedList([FromQuery] UserParams param)
        {
            var pagedList = await _uow.UserRepository.GetPagedListAsync(param);

            Response.AddPaginationHeader(
                new PaginationHeader(
                    pagedList.CurrentPage,
                    pagedList.PageSize,
                    pagedList.TotalCount,
                    pagedList.TotalPages
                )
            );

            return Ok(pagedList);
        }
        
        [HttpGet("prescription-information/{doctorId}")]
        public async Task<ActionResult<PrescriptionInformationDto>> GetPrescriptionInformation([FromRoute] int doctorId)
        {
            var prescriptionInformation = await _uow.UserRepository.GetPrescriptionInformationAsync(doctorId);

            return Ok(prescriptionInformation);
        }

        [HttpGet("all")]
        public async Task<ActionResult<List<AppUser>>> GetAllAsync()
        {
            var itemsToReturn = await _uow.UserRepository.GetAllAsync();

            if (itemsToReturn.Count == 0) return NoContent();

            return itemsToReturn;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PatientDto>> GetByIdAsync([FromRoute] int id)
        {
            var item = await _uow.UserRepository.GetByIdAsync(id);

            if (item == null)
                return NotFound(new ApiResponse(404, $"Cuerno con ID {id} no encontrado."));

            var itemToReturn = _mapper.Map<PatientDto>(item);
            return itemToReturn;
        }
    }
}