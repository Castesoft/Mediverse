using MainService.Core.Interfaces.Data;
using MainService.Models;
using MainService.Models.Entities;

namespace MainService.Infrastructure.Data;

public class ManualPaymentDetailRepository(DataContext context) : IManualPaymentDetailRepository
{
    public void Add(ManualPaymentDetail item)
    {
        context.ManualPaymentDetails.Add(item);
    }

    public void Delete(ManualPaymentDetail item)
    {
        context.ManualPaymentDetails.Remove(item);
    }

    public void Update(ManualPaymentDetail item)
    {
        context.ManualPaymentDetails.Update(item);
    }
}