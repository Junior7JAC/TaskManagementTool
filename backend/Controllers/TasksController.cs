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
        public ActionResult<IEnumerable<TaskItem>> GetAllTasks()

        {
            return Ok(_context.Tasks.ToList());
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
