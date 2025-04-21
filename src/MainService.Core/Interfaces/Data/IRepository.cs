using System.Linq.Expressions;

namespace MainService.Core.Interfaces.Data;

public interface IRepository<T> where T : class
{
    Task<T?> GetByIdAsync(int id);
    Task<List<T>> GetAllAsync();
    List<T> Find(Expression<Func<T, bool>> expression);
    void Add(T entity);
    void AddRange(List<T> entities);
    void Remove(T entity);
    void RemoveRange(List<T> entities);
}