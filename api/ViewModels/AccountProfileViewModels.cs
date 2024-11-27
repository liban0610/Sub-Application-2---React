using Aplzz.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Aplzz.ViewModels
{
    public class AccountProfileViewModel
    {
        public int AccountId { get; set; } // Needed for Update/Delete actions

        [Required]
        [MaxLength(100)]
        [Display(Name = "Username")]
        public string Username { get; set; } = string.Empty; // Initialize with a default non-null value

        [MaxLength(500)]
        [Display(Name = "Bio")]
        public string? Bio { get; set; } // Make nullable, since bio may not always be set

        [Display(Name = "Profile Picture URL")]
        [DataType(DataType.ImageUrl)]
        public string? ProfilePicture { get; set; } // Make nullable as this may not always have a value

        [Display(Name = "Date Created")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Set default to current date/time

        [Display(Name = "Last Updated")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow; // Set default to current date/time

        // New properties added for Index view
        public IEnumerable<AccountProfile> Profiles { get; set; } = new List<AccountProfile>(); // Initialize with an empty list

        public string CurrentViewName { get; set; } = string.Empty; // Initialize with a default non-null value
    }
}