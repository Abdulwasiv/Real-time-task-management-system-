// controllers/task_ai.go
package controllers

import (
	"backend/api/ai"
	"backend/api/initializers"
	"backend/api/models"
	"backend/api/websocket"
	"net/http"

	"github.com/gin-gonic/gin"
)

func AssignTask(c *gin.Context, assigner *ai.Assigner) {
	var task models.Task
	if err := c.ShouldBindJSON(&task); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get all users (in real app, paginate or filter)
	var users []models.User
	if err := initializers.DB.Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}

	assignedTo, err := assigner.AnalyzeAndAssign(task, users)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Update task assignment
	task.AssignedTo = assignedTo
	if err := initializers.DB.Save(&task).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to assign task"})
		return
	}

	// Broadcast assignment
	hub := c.MustGet("hub").(*websocket.Hub)
	broadcastTaskUpdate(hub, "assign", task)

	c.JSON(http.StatusOK, gin.H{
		"message":    "Task assigned successfully",
		"assignedTo": assignedTo,
	})
}

func GetTaskSuggestions(c *gin.Context, suggester *ai.Suggester) {
	userID := c.GetUint("user_id")

	var user models.User
	if err := initializers.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Get recent tasks
	var recentTasks []models.Task
	if err := initializers.DB.Where("assigned_to = ?", userID).
		Order("created_at desc").
		Limit(5).
		Find(&recentTasks).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch recent tasks"})
		return
	}

	suggestions, err := suggester.GetTaskSuggestions(user, recentTasks)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"suggestions": suggestions})
}

func BreakdownTask(c *gin.Context, suggester *ai.Suggester) {
	taskID := c.Param("id")

	var task models.Task
	if err := initializers.DB.First(&task, taskID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	subtasks, err := suggester.BreakDownTask(task)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"subtasks": subtasks})
}
