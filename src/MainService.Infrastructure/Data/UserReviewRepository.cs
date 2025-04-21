using AutoMapper;
using MainService.Core.Interfaces.Data;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Data;

public class UserReviewRepository(DataContext context, IMapper mapper) : Repository<UserReview>(context, mapper), IUserReviewRepository
{
    private readonly DataContext _context = context;

    public async Task<List<UserReview>> FindByUserIdAsync(int userId)
    {
        return await _context.UserReviews
            .Where(ur => ur.UserId == userId)
            .ToListAsync();
    }
}
