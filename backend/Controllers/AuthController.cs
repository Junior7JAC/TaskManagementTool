using Microsoft.AspNetCore.Mvc;
using YourApp.DTOs;
using backend.Services;
using backend.Data;
using backend.Models;
using System;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly UserService _userService;

        public AuthController(UserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                var user = await _userService.RegisterUserAsync(request.Email, request.Password);
                return Ok(new { message = "Registered", email = user.Email });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                Console.WriteLine($"Attempting login: {request.Email}");

                var user = await _userService.ValidateUserAsync(request.Email, request.Password);

                if (user == null)
                {
                    Console.WriteLine("User not found or invalid credentials.");
                    return Unauthorized();
                }

                var token = _userService.GenerateJwtToken(user);

                return Ok(new { token });
            }
            catch (Exception ex)
            {
                Console.WriteLine(" LOGIN ERROR: " + ex.Message);
                Console.WriteLine("STACK TRACE: " + ex.StackTrace);
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
