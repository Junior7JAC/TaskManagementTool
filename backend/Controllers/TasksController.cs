using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using System.Collections.Generic;
using System.Linq;
using System;
using System.Threading.Tasks;

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

        // GET: /api/tasks
        [HttpGet]
        public ActionResult<IEnumerable<TaskItem>> GetAllTasks([FromQuery] string? filter = null)
        {
            var tasks = _context.Tasks.ToList();

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


        // GET: /api/tasks/5
        [HttpGet("{id}")]
        public ActionResult<TaskItem> GetTask(int id)
        {
            var task = _context.Tasks.Find(id);
            if (task == null) return NotFound();
            return Ok(task);
        }

        // POST: /api/tasks
        [HttpPost]
        public ActionResult<TaskItem> CreateTask(TaskItem task)
        {
            _context.Tasks.Add(task);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
        }

        // DELETE: /api/tasks/5
        [HttpDelete("{id}")]
        public IActionResult DeleteTask(int id)
        {
            var task = _context.Tasks.Find(id);
            if (task == null) return NotFound();

            _context.Tasks.Remove(task);
            _context.SaveChanges();
            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] TaskItem updatedTask)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound();

            task.Title = updatedTask.Title;
            task.IsCompleted = updatedTask.IsCompleted;
            task.DueDate = updatedTask.DueDate;

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
