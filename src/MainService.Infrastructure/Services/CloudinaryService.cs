using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using MainService.Core.Interfaces.Services;
using MainService.Core.Settings;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace MainService.Infrastructure.Services;
public class CloudinaryService : ICloudinaryService
{
    private readonly Cloudinary _cloudinary;
    public CloudinaryService(IOptions<CloudinarySettings> config)
    {
        var acc = new Account
       (
           config.Value.CloudName,
           config.Value.ApiKey,
           config.Value.ApiSecret
       );

        _cloudinary = new Cloudinary(acc);
    }

    public async Task<DeletionResult> DeleteAsync(string publicId)
    {
        var deleteParams = new DeletionParams(publicId);

        return await _cloudinary.DestroyAsync(deleteParams);
    }

    public async Task<ImageUploadResult> UploadAsync(IFormFile file, ImageUploadParams uploadParams)
    {
        var uploadResult = new ImageUploadResult();

        if (file.Length > 0)
        {
            using var stream = file.OpenReadStream();
            uploadResult = await _cloudinary.UploadAsync(uploadParams);
        }

        return uploadResult;
    }
}