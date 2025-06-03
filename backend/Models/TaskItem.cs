using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class TaskItem
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public bool IsCompleted { get; set; } = false;

        public DateTime? DueDate { get; set; }
    }
}
