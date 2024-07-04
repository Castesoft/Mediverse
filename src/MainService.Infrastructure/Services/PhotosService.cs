using MainService.Core.Interfaces.Services;
using MainService.Models.Entities;
using Serilog;

namespace MainService.Infrastructure.Services;
public class PhotosService(IUnitOfWork uow, ICloudinaryService cloudinaryService) : IPhotosService
{
    public async Task<bool> DeleteAsync(Photo item)
    {
        var itemToDelete = await uow.PhotoRepository.GetByIdAsync(item.Id);

        if (!string.IsNullOrEmpty(itemToDelete.PublicId))
        {
            var deleteResult = await cloudinaryService.Delete(itemToDelete.PublicId);

            if (deleteResult.Result != "ok")
                Log.Information($"La foto con ID {item.Id} no pudo ser eliminada de Cloudinary. Resultado: {deleteResult.Result}.");
        }

        uow.PhotoRepository.Delete(itemToDelete);

        if (!await uow.Complete()) return false;

        return true;
    }
}