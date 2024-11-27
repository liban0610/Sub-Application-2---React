using System;
using System.ComponentModel.DataAnnotations;

namespace Aplzz.Models
{
    public class AccountProfile
    {
        [Key]
        public int AccountId { get; set; }

        [Required]
        [MaxLength(100)]
        public string? Username { get; set; }

        [MaxLength(500)]
        public string? Bio { get; set; }

        [MaxLength(250)]
        public string? ProfilePicture { get; set; }

        [DataType(DataType.Date)]
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [DataType(DataType.Date)]
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
    }
}