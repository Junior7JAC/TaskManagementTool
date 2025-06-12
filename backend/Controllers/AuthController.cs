using Microsoft.AspNetCore.Mvc;
using YourApp.DTOs;
using backend.Services;
using backend.Data;
using backend.Models;
using System;
using System.Threading.Tasks;
using System.Text.RegularExpressions;


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
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
                return BadRequest(new { message = "Email and password are required." });

            var emailRegex = new Regex(@"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", RegexOptions.IgnoreCase);
            if (!emailRegex.IsMatch(request.Email))
                return BadRequest(new { message = "Invalid email format." });

            if (request.Password.Length < 4)
                return BadRequest(new { message = "Password must be at least 4 characters long." });

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
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
                return BadRequest(new { message = "Email and password are required." });

            var emailRegex = new Regex(@"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", RegexOptions.IgnoreCase);
            if (!emailRegex.IsMatch(request.Email))
                return BadRequest(new { message = "Invalid email format." });

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
