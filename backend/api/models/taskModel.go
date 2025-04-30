package models

import (
	"time"

	"gorm.io/gorm"
)

type Task struct {
	gorm.Model
	Title            string
	Description      string
	CreatedBy        uint
	User             User `gorm:"foreignKey:CreatedBy;references:id"`
	PlannedStartTime time.Time
	PlannedEndTime   time.Time
	ActualStartTime  time.Time
	ActualEndTime    time.Time
	Seconds          int64
	Status           int  `gorm:"default:0"`
	Priority         int  `gorm:"default:1"` // 1-5 scale
	Complexity       int  `gorm:"default:1"` // 1-3 scale
	AssignedTo       uint `gorm:"default:null"`
}
