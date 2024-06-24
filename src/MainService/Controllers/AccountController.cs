using AutoMapper;
using MainService.Core.DTOs;
using MainService.Core.Interfaces.Services;
using MainService.Errors;
using MainService.Extensions;
using MainService.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MainService.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;
        private readonly IUsersService _usersService;
        private readonly SignInManager<AppUser> _signInManager;

        public AccountController(UserManager<AppUser> userManager, ITokenService tokenService, IMapper mapper, IUsersService usersService, SignInManager<AppUser> signInManager)
        {
            _signInManager = signInManager;
            _usersService = usersService;
            _userManager = userManager;
            _mapper = mapper;
            _tokenService = tokenService;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetUserAsync()
        {
            return Ok(await _usersService.GenerateAccountDtoAsync(User.GetUserId()));
        }


        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto request)
        {
            if (await UserExists(request.UserName))
                return Conflict(new ApiResponse(409, $"El usuario {request.UserName} ya existe."));

            var user = _mapper.Map<AppUser>(request);

            user.UserName = request.UserName.ToLower();

            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
                return BadRequest(new ApiResponse(400, result.Errors.ToString()));

            var roleResult = await _userManager.AddToRoleAsync(user, "User");

            if (!roleResult.Succeeded)
                return BadRequest(new ApiResponse(400, result.Errors.ToString()));

            return Ok(await _usersService.GenerateAccountDtoAsync(user.Id));
        }

        // Login with username or email
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login([FromBody] LoginDto request)
        {
            var user = await _userManager.FindByNameAsync(request.UsernameOrEmail.ToLower());

            if (user == null)
                user = await _userManager.FindByEmailAsync(request.UsernameOrEmail.ToLower());

            if (user == null) return Unauthorized(new ApiResponse(401, "Nombre de usuario, correo electrónico, o contraseña incorrectos."));

            var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);

            if (!result.Succeeded) return Unauthorized(new ApiResponse(401, "Nombre de usuario, correo electrónico, o contraseña incorrectos."));

            return Ok(await _usersService.GenerateAccountDtoAsync(user.Id));
        }

        private async Task<bool> UserExists(string username)
        {
            return await _userManager.Users.AnyAsync(x => x.UserName == username.ToLower());
        }
    }
}