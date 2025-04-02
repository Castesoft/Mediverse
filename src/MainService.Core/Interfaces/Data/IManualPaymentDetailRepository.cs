using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Data;

public interface IManualPaymentDetailRepository
{
    void Add(ManualPaymentDetail item);
    void Delete(ManualPaymentDetail item);
    void Update(ManualPaymentDetail item);
}