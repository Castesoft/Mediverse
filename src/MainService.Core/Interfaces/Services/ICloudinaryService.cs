#nullable enable

using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;

namespace MainService.Core.Interfaces.Services;
public interface ICloudinaryService
{
    Task<ImageUploadResult> UploadAsync(IFormFile file, ImageUploadParams uploadParams);
    Task<DeletionResult> DeleteAsync(string publicId);
}