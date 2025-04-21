using System.Linq.Expressions;
using AutoMapper;
using MainService.Core.Interfaces.Data;
using MainService.Models;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Data;

public class Repository<T>(DataContext context, IMapper mapper) : IRepository<T> where T : class
{

    public async Task<T?> GetByIdAsync(int id)
    {
        return await context.Set<T>().FindAsync(id);
    }

    public async Task<List<T>> GetAllAsync()
    {
        return await context.Set<T>().ToListAsync();
    }

    public List<T> Find(Expression<Func<T, bool>> expression)
    {
        return context.Set<T>().Where(expression).ToList();
    }

    public void Add(T entity)
    {
        context.Set<T>().Add(entity);
    }

    public void AddRange(List<T> entities)
    {
        context.Set<T>().AddRange(entities);
    }

    public void Remove(T entity)
    {
        context.Set<T>().Remove(entity);
    }

    public void RemoveRange(List<T> entities)
    {
        context.Set<T>().RemoveRange(entities);
    }
}