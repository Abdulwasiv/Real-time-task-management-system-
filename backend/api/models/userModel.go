package models

import (
	"time"

	"github.com/lib/pq"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username string `gorm:"unique;not null"`
	Email    string `gorm:"unique;not null"`
	Password string `gorm:"not null"`
	Phone    string
	DOB      time.Time
	UserRole uint `gorm:"default:0"`
	Role     Role `gorm:"foreignKey:UserRole;references:id"`

	SkillTags    pq.StringArray `gorm:"type:text[]"` // Postgres array of skills
	Workload     int            `gorm:"default:0"`   // Current task count
	Productivity float64        `gorm:"default:1.0"` // Productivity score (0.5-2.0)
	AvgTaskTime  int64          // Average seconds per task
	Specialty    string         // Primary specialty

}

