using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MainService.Core.Helpers.Pagination;
using MainService.Models.Entities;
using MainService.Core.DTOs.User;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Services;
using MainService.Extensions;

namespace MainService.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController(IUnitOfWork uow, IMapper mapper) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<PagedList<PaymentDto>>> GetPagedListAsync([FromQuery] PaymentParams param)
        {
            var pagedList = await uow.PaymentRepository.GetPagedListAsync(param);

            Response.AddPaginationHeader(new PaginationHeader(pagedList.CurrentPage, pagedList.PageSize,
                pagedList.TotalCount, pagedList.TotalPages));

            return pagedList;
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<PaymentDto>> GetByIdAsync(int id)
        {
            var payment = await uow.PaymentRepository.GetByIdAsync(id);
            if (payment == null)
            {
                return NotFound($"Payment with ID {id} not found.");
            }

            return mapper.Map<PaymentDto>(payment);
        }

        [HttpPost]
        public async Task<ActionResult<PaymentDto>> CreateAsync([FromBody] PaymentDto paymentDto)
        {
            var payment = mapper.Map<Payment>(paymentDto);
            uow.PaymentRepository.Add(payment);
            await uow.Complete();

            var resultDto = mapper.Map<PaymentDto>(payment);
            return CreatedAtAction(nameof(GetByIdAsync), new { id = payment.Id }, resultDto);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<PaymentDto>> UpdateAsync(int id, [FromBody] PaymentDto paymentDto)
        {
            if (id != paymentDto.Id)
            {
                return BadRequest("Payment ID mismatch.");
            }

            var payment = await uow.PaymentRepository.GetByIdAsync(id);
            if (payment == null)
            {
                return NotFound($"Payment with ID {id} not found.");
            }

            mapper.Map(paymentDto, payment);
            await uow.Complete();

            return mapper.Map<PaymentDto>(payment);
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteAsync(int id)
        {
            var payment = await uow.PaymentRepository.GetByIdAsync(id);
            if (payment == null)
            {
                return NotFound($"Payment with ID {id} not found.");
            }

            uow.PaymentRepository.Delete(payment);
            await uow.Complete();

            return Ok();
        }
    }
}