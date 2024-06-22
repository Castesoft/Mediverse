using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;

namespace MainService.Core.Interfaces.Services;
public interface ICloudinaryService
{
    Task<ImageUploadResult> Upload(IFormFile file, ImageUploadParams uploadParams);
    Task<DeletionResult> Delete(string publicId);
}