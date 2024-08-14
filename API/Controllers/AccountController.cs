using System.Security.Claims;
using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly TokenService _tokenService;
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;

        public AccountController(UserManager<AppUser> userManager, TokenService tokenService, IConfiguration config)
        {
            _httpClient = new HttpClient
            {
                BaseAddress = new Uri("https://oauth2.googleapis.com")
            };
            _config = config;
            _tokenService = tokenService;
            _userManager = userManager;
        }

        [AllowAnonymous]
        [HttpPost("google")]
        public async Task<ActionResult<UserDto>> GoogleLogin(string accessToken)
        {
            var tokenInfo = await _httpClient.GetFromJsonAsync<TokenInfo>("tokeninfo?id_token=" + accessToken);
            if (tokenInfo.Aud != _config["Authentication:Google:ClientId"])
                return Unauthorized();

            var user = await _userManager.Users.Include(p => p.Photos)
                .FirstOrDefaultAsync(x => x.Email == tokenInfo.Email);

            if (user is not null) return GetUserDto(user);
            
            user = new AppUser {
                DisplayName = tokenInfo.GivenName + ' ' + tokenInfo.FamilyName,
                Photos = [
                    new Photo {
                        Id = "ggl_"+ tokenInfo.Picture.Split("/a/")[1],
                        Url = tokenInfo.Picture,
                        IsMain = true
                    }
                ],
                UserName = tokenInfo.Email,
                Email = tokenInfo.Email
            };

            var result = await _userManager.CreateAsync(user);
            if (!result.Succeeded) return BadRequest("Problem creating user account");

            await SetRefreshToken(user);
            return GetUserDto(user);
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.Users.Include(p => p.Photos)
                .FirstOrDefaultAsync(x => x.Email == loginDto.Email);
            if (user is null) return Unauthorized();
            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);
            if (result)
            {
                await SetRefreshToken(user);
                return GetUserDto(user);
            }

            return Unauthorized();
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await _userManager.Users.AnyAsync(x => x.UserName == registerDto.Username))
            {
                ModelState.AddModelError("username", "Username taken");
                return ValidationProblem();
            }

            if ((await _userManager.Users.ToListAsync()).Any(u => u.Email.ToUpperInvariant() == registerDto.Email.ToUpperInvariant()))
            {
                ModelState.AddModelError("email", "Email taken");
                return ValidationProblem();
            }

            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Username
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (result.Succeeded)
            {
                await SetRefreshToken(user);
                return GetUserDto(user);
            }

            return BadRequest(result.Errors);
        }

        [Authorize]
        [HttpPost("refreshToken")]
        public async Task<ActionResult<UserDto>> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            var user = await _userManager.Users
                .Include(r => r.Photos)
                .Include(r => r.RefreshTokens)
                .FirstOrDefaultAsync(x => x.UserName == User.FindFirstValue(ClaimTypes.Name));

            if (user == null) return Unauthorized();

            var oldToken = user.RefreshTokens.SingleOrDefault(x => x.Token == refreshToken);

            if (oldToken != null && !oldToken.IsActive)
                return Unauthorized();

            if (oldToken != null) oldToken.Revoked = DateTime.UtcNow;

            return GetUserDto(user);
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.Users.Include(p => p.Photos).Include(p => p.RefreshTokens)
                .FirstOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));

            if (!user.RefreshTokens.Any(t => t.IsActive))
                await SetRefreshToken(user);

            return GetUserDto(user);
        }

        private async Task SetRefreshToken(AppUser user)
        {
            var refreshToken = _tokenService.GenerateRefreshToken();

            user.RefreshTokens.Add(refreshToken);
            await _userManager.UpdateAsync(user);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7)
            };

            Response.Cookies.Append("refreshToken", refreshToken.Token, cookieOptions);
        }

        private UserDto GetUserDto(AppUser user)
        {
            return new UserDto
            {
                DisplayName = user.DisplayName,
                Image = user.Photos?.FirstOrDefault(x => x.IsMain)?.Url,
                Token = _tokenService.CreateToken(user),
                Username = user.UserName
            };
        }
    }
}