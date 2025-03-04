using AutoMapper;
using MainService.Core.DTOs.Subscriptions;
using MainService.Core.Extensions;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MainService.Core.Interfaces.Services;
using MainService.Extensions;
using MainService.Models.Entities;
using MainService.Models.Helpers.Enums;

namespace MainService.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class SubscriptionHistoriesController(IUnitOfWork uow, IMapper mapper) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<PagedList<SubscriptionHistoryDto>>> GetPagedListAsync(
            [FromQuery] SubscriptionHistoryParams param)
        {
            if (param.FromSection != SiteSection.Admin)
            {
                param.DoctorId = User.GetUserId();
            }

            var pagedList = await uow.SubscriptionHistoryRepository.GetPagedListAsync(param);

            Response.AddPaginationHeader(new PaginationHeader(pagedList.CurrentPage, pagedList.PageSize,
                pagedList.TotalCount, pagedList.TotalPages));

            return pagedList;
        }

        [HttpGet("subscription/{subscriptionId:int}")]
        public async Task<ActionResult<List<SubscriptionHistoryDto>>> GetHistoryBySubscriptionId(int subscriptionId)
        {
            var histories = await uow.SubscriptionHistoryRepository.GetHistoryBySubscriptionIdAsync(subscriptionId);
            if (histories.Count == 0)
            {
                return NotFound($"No subscription history found for subscription ID {subscriptionId}.");
            }

            return mapper.Map<List<SubscriptionHistoryDto>>(histories);
        }

        [HttpPost]
        public async Task<ActionResult<SubscriptionHistoryDto>> CreateHistoryAsync(
            [FromBody] SubscriptionHistoryDto historyDto)
        {
            var history = mapper.Map<SubscriptionHistory>(historyDto);
            uow.SubscriptionHistoryRepository.Add(history);
            await uow.Complete();
            return CreatedAtAction(nameof(GetHistoryBySubscriptionId), new { subscriptionId = history.UserSubscriptionId },
                mapper.Map<SubscriptionHistoryDto>(history));
        }
    }
}