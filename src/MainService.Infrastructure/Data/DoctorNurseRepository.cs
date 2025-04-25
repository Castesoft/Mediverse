using AutoMapper;
using AutoMapper.QueryableExtensions;
using MainService.Core.DTOs.DoctorNurses;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Data;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Data;

public class DoctorNurseRepository(DataContext context, IMapper mapper)
    : Repository<DoctorNurse>(context, mapper), IDoctorNurseRepository
{
    private readonly DataContext _context = context;
    private readonly IMapper _mapper = mapper;

    public async Task<DoctorNurse?> FindByCompositeKeyAsync(int doctorId, int nurseId)
    {
        return await _context.DoctorNurses
            .FirstOrDefaultAsync(dn => dn.DoctorId == doctorId && dn.NurseId == nurseId);
    }

    public async Task<List<DoctorNurse>> FindByDoctorIdAsync(int doctorId)
    {
        return await _context.DoctorNurses
            .Include(dn => dn.Nurse)
            .Where(dn => dn.DoctorId == doctorId)
            .ToListAsync();
    }

    public async Task<List<DoctorNurse>> FindByNurseIdAsync(int nurseId)
    {
        return await _context.DoctorNurses
            .Include(dn => dn.Doctor)
            .Where(dn => dn.NurseId == nurseId)
            .ToListAsync();
    }

    public async Task<PagedList<DoctorNurseDto>> GetPagedDoctorNurseConnectionsAsync(DoctorNurseParams param)
    {
        var query = _context.DoctorNurses
            .Include(dn => dn.Doctor).ThenInclude(d => d.UserPhoto!).ThenInclude(up => up.Photo)
            .Include(dn => dn.Doctor).ThenInclude(d => d.DoctorSpecialty!).ThenInclude(ds => ds.Specialty)
            .Include(dn => dn.Nurse).ThenInclude(n => n.UserPhoto!).ThenInclude(up => up.Photo)
            .AsQueryable();


        if (param.DoctorId.HasValue)
        {
            query = query.Where(dn => dn.DoctorId == param.DoctorId.Value);
        }

        if (param.NurseId.HasValue)
        {
            query = query.Where(dn => dn.NurseId == param.NurseId.Value);
        }

        if (!string.IsNullOrWhiteSpace(param.DoctorName))
        {
            var nameTerm = param.DoctorName.ToLower();
            query = query.Where(dn => (dn.Doctor.FirstName + " " + dn.Doctor.LastName).ToLower().Contains(nameTerm));
        }

        if (!string.IsNullOrWhiteSpace(param.NurseName))
        {
            var nameTerm = param.NurseName.ToLower();
            query = query.Where(dn => (dn.Nurse.FirstName + " " + dn.Nurse.LastName).ToLower().Contains(nameTerm));
        }

        if (!string.IsNullOrWhiteSpace(param.DoctorSpecialty))
        {
            var specialtyTerm = param.DoctorSpecialty.ToLower();
            query = query.Where(dn =>
                dn.Doctor.DoctorSpecialty != null &&
                dn.Doctor.DoctorSpecialty.Specialty.Name!.ToLower().Contains(specialtyTerm));
        }

        if (!string.IsNullOrWhiteSpace(param.Search))
        {
            var searchTerm = param.Search.ToLower();
            query = query.Where(dn =>
                (dn.Doctor.FirstName + " " + dn.Doctor.LastName).ToLower().Contains(searchTerm) ||
                (dn.Nurse.FirstName + " " + dn.Nurse.LastName).ToLower().Contains(searchTerm) ||
                (dn.Doctor.Email != null && dn.Doctor.Email.ToLower().Contains(searchTerm)) ||
                (dn.Nurse.Email != null && dn.Nurse.Email.ToLower().Contains(searchTerm)) ||
                (dn.Doctor.DoctorSpecialty != null && dn.Doctor.DoctorSpecialty.Specialty.Name != null &&
                 dn.Doctor.DoctorSpecialty.Specialty.Name.ToLower().Contains(searchTerm))
            );
        }


        if (!string.IsNullOrEmpty(param.Sort))
        {
            query = param.Sort.ToLower() switch
            {
                "doctorname" => param.IsSortAscending == true
                    ? query.OrderBy(dn => dn.Doctor.FirstName).ThenBy(dn => dn.Doctor.LastName)
                    : query.OrderByDescending(dn => dn.Doctor.FirstName).ThenByDescending(dn => dn.Doctor.LastName),
                "nurseame" => param.IsSortAscending == true
                    ? query.OrderBy(dn => dn.Nurse.FirstName).ThenBy(dn => dn.Nurse.LastName)
                    : query.OrderByDescending(dn => dn.Nurse.FirstName).ThenByDescending(dn => dn.Nurse.LastName),
                "doctorspecialty" => param.IsSortAscending == true
                    ? query.OrderBy(dn => dn.Doctor.DoctorSpecialty!.Specialty.Name)
                    : query.OrderByDescending(dn => dn.Doctor.DoctorSpecialty!.Specialty.Name),

                _ => query.OrderByDescending(dn => dn.CreatedAt)
            };
        }
        else
        {
            query = query.OrderByDescending(dn => dn.CreatedAt);
        }

        var projectedQuery = query.ProjectTo<DoctorNurseDto>(_mapper.ConfigurationProvider);

        return await PagedList<DoctorNurseDto>.CreateAsync(projectedQuery, param.PageNumber, param.PageSize);
    }
}