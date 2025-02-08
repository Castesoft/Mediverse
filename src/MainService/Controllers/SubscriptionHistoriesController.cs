using AutoMapper;
using MainService.Core.DTOs.Subscriptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MainService.Core.Interfaces.Services;
using MainService.Models.Entities;

namespace MainService.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class SubscriptionHistoriesController(IUnitOfWork uow, IMapper mapper) : BaseApiController
    {
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
            return CreatedAtAction(nameof(GetHistoryBySubscriptionId), new { subscriptionId = history.SubscriptionId },
                mapper.Map<SubscriptionHistoryDto>(history));
        }
    }
}