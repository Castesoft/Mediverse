using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MainService.Core.Helpers.Pagination;
using MainService.Models.Entities;
using MainService.Core.Extensions;
using MainService.Core.DTOs.Subscriptions;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Services;
using MainService.Extensions;
using MainService.Models.Helpers.Enums;

namespace MainService.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class SubscriptionsController(IUnitOfWork uow, IMapper mapper) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<PagedList<SubscriptionDto>>> GetPagedListAsync([FromQuery] SubscriptionParams param)
        {
            if (param.FromSection != SiteSection.Admin)
            {
                param.DoctorId = User.GetUserId();
            }

            var pagedList = await uow.SubscriptionRepository.GetPagedListAsync(param);

            Response.AddPaginationHeader(new PaginationHeader(pagedList.CurrentPage, pagedList.PageSize,
                pagedList.TotalCount, pagedList.TotalPages));

            return pagedList;
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<SubscriptionDto>> GetByIdAsync(int id)
        {
            var subscription = await uow.SubscriptionRepository.GetByIdAsync(id);
            if (subscription == null)
            {
                return NotFound($"Subscription with ID {id} not found.");
            }

            return mapper.Map<SubscriptionDto>(subscription);
        }

        [HttpPost]
        public async Task<ActionResult<SubscriptionDto>> CreateSubscriptionAsync(
            [FromBody] SubscriptionDto subscriptionDto)
        {
            var subscription = mapper.Map<Subscription>(subscriptionDto);
            uow.SubscriptionRepository.Add(subscription);
            await uow.Complete();

            var resultDto = mapper.Map<SubscriptionDto>(subscription);
            return CreatedAtAction(nameof(GetByIdAsync), new { id = subscription.Id }, resultDto);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<SubscriptionDto>> UpdateSubscriptionAsync(int id,
            [FromBody] SubscriptionDto subscriptionDto)
        {
            if (id != subscriptionDto.Id)
            {
                return BadRequest("Subscription ID mismatch.");
            }

            var subscription = await uow.SubscriptionRepository.GetByIdAsync(id);
            if (subscription == null)
            {
                return NotFound($"Subscription with ID {id} not found.");
            }

            mapper.Map(subscriptionDto, subscription);
            await uow.Complete();

            return mapper.Map<SubscriptionDto>(subscription);
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteSubscriptionAsync(int id)
        {
            var subscription = await uow.SubscriptionRepository.GetByIdAsync(id);
            if (subscription == null)
            {
                return NotFound($"Subscription with ID {id} not found.");
            }

            uow.SubscriptionRepository.Delete(subscription);
            await uow.Complete();

            return Ok();
        }
    }
}