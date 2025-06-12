using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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


        // Foreign key
        [ForeignKey("User")]
        public int? UserId { get; set; }

        // Navigation property
        public User? User { get; set; }
    }
}
