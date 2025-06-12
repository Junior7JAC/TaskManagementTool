using System.Collections.Generic;

namespace backend.Models
{
    public class User
    {
        public int Id { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }

        public bool IsAdmin { get; set; } = false;

        public ICollection<TaskItem>? Tasks { get; set; }
    }
}
