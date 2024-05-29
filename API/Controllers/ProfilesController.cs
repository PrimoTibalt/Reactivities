using System.Security.Claims;
using API.DTOs;
using Application.Profiles;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class ProfilesController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;

        public ProfilesController(UserManager<AppUser> userManager)
        {
            _userManager = userManager;
        }

        [HttpGet("{username}")]
        public async Task<IActionResult> GetProfile(string username)
        {
            return HandleResult(await Mediator.Send(new Details.Query { Username = username }));
        }

        [Authorize]
        [HttpPut]
        public async Task<IActionResult> EditCurrentUser(EditUserDataDto editUserDataDto)
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));
            if (user == null) return BadRequest("User not found");
            return HandleResult(await Mediator.Send(new Edit.Command {Profile = new Profile {Bio = editUserDataDto.Bio, DisplayName = editUserDataDto.DisplayName, Username = user.UserName}}));
        }
    }
}