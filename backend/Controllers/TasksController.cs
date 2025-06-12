using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using System.Collections.Generic;
using System.Linq;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;



namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TasksController(AppDbContext context)
        {
            _context = context;
        }
        private int GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            Console.WriteLine("JWT UserId Claim: " + claim?.Value);

            if (claim == null)
                throw new Exception("No user ID claim found in JWT.");

            return int.Parse(claim.Value);
        }



        private bool IsAdmin()
        {
            try
            {
                var userId = GetUserId();
                var user = _context.Users.Find(userId);
                return user != null && user.IsAdmin;
            }
            catch
            {
                return false;
            }

        }


        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAllTasks([FromQuery] string? filter = null)
        {
            Console.WriteLine("Entered GetAllTasks");
            try
            {
                var userId = GetUserId();
                var isAdmin = IsAdmin();
                Console.WriteLine($" User ID: {userId} | IsAdmin: {isAdmin}");

                var tasks = isAdmin
                    ? await _context.Tasks.ToListAsync()
                    : await _context.Tasks.Where(t => t.UserId == userId).ToListAsync();


                if (!string.IsNullOrEmpty(filter))
                {
                    var now = DateTime.UtcNow;

                    tasks = filter switch
                    {
                        "day" => tasks.Where(t => t.DueDate.HasValue && t.DueDate.Value.Date == now.Date).ToList(),
                        "week" => tasks.Where(t => t.DueDate.HasValue && t.DueDate.Value >= now.Date && t.DueDate.Value <= now.Date.AddDays(7 - (int)now.DayOfWeek)).ToList(),
                        "month" => tasks.Where(t => t.DueDate.HasValue &&
                                                     t.DueDate.Value.Month == now.Month &&
                                                     t.DueDate.Value.Year == now.Year).ToList(),
                        _ => tasks
                    };
                }

                return Ok(tasks);
            }
            catch (Exception ex)
            {
                Console.WriteLine($" ERROR in GetTasks: {ex.Message}");
                return StatusCode(500, "Something went wrong.");
            }
        }



        [HttpGet("{id}")]
        [Authorize]
        public ActionResult<TaskItem> GetTask(int id)
        {
            var userId = GetUserId();
            var task = _context.Tasks.Find(id);

            if (task == null) return NotFound();
            if (!IsAdmin() && task.UserId != userId) return Forbid();

            return Ok(task);
        }

        // POST: /api/tasks
        [HttpPost]
        [Authorize]
        public ActionResult<TaskItem> CreateTask(TaskItem task)
        {
            task.UserId = GetUserId();
            _context.Tasks.Add(task);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
        }

        // DELETE: /api/tasks/5
        [HttpDelete("{id}")]
        [Authorize]
        public IActionResult DeleteTask(int id)
        {
            var userId = GetUserId();
            var task = _context.Tasks.Find(id);

            if (task == null) return NotFound();
            if (!IsAdmin() && task.UserId != userId) return Forbid();

            _context.Tasks.Remove(task);
            _context.SaveChanges();
            return NoContent();
        }

        // PUT: /api/tasks/5
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] TaskItem updatedTask)
        {
            var userId = GetUserId();
            var task = await _context.Tasks.FindAsync(id);

            if (task == null) return NotFound();
            if (!IsAdmin() && task.UserId != userId) return Forbid();

            task.Title = updatedTask.Title;
            task.IsCompleted = updatedTask.IsCompleted;
            task.DueDate = updatedTask.DueDate;

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}