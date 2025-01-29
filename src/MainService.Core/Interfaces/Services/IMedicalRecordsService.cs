using MainService.Core.DTOs.MedicalRecord;
using Microsoft.AspNetCore.Mvc;

namespace MainService.Core.Interfaces.Services;

public interface IMedicalRecordsService
{
    Task<ActionResult<MedicalRecordDto>> UpdateMedicalRecordAsync(int userId, MedicalRecordUpdateDto request);
}