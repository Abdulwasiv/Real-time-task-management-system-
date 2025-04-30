package controllers

import (
	"backend/api/models"
	"backend/api/websocket"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"time"

	"backend/api/initializers"

	"github.com/gin-gonic/gin"
)

func CreateTask(c *gin.Context) {
	userID := c.GetUint("user_id")

	var user models.User
	err := initializers.DB.First(&user, userID).Error
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "User not found",
		})
		return
	}

	var body struct {
		Title            string `json:"title" binding:"required"`
		Description      string `json:"description" binding:"required"`
		PlannedStartTime int64  `json:"planned_start_time" binding:"required"`
		PlannedEndTime   int64  `json:"planned_end_time" binding:"required"`
		Seconds          int64  `json:"seconds" binding:"required"`
	}

	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Fields are empty",
		})
		return
	}

	if body.PlannedEndTime < body.PlannedStartTime {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid Start Time cannot be before End Time",
		})
		return
	}

	startTime := time.Unix(body.PlannedStartTime, 0)
	startTime.Format(time.RFC3339)

	endTime := time.Unix(body.PlannedEndTime, 0)
	endTime.Format(time.RFC3339)

	newTask := models.Task{
		Title:            body.Title,
		Description:      body.Description,
		CreatedBy:        userID,
		PlannedStartTime: startTime,
		PlannedEndTime:   endTime,
		Seconds:          body.Seconds,
		ActualStartTime:  startTime,
		ActualEndTime:    endTime,
	}

	result := initializers.DB.Create(&newTask)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error creating task",
		})
		return
	}
	hub := c.MustGet("hub").(*websocket.Hub)
	broadcastTaskUpdate(hub, "create", newTask)

	c.JSON(http.StatusOK, gin.H{
		"message": "Task created successfully",
	})
}

func CreateTaskBulk(c *gin.Context) {
	userID := c.GetUint("user_id")
	file_ptr, getErr := c.FormFile("taskBulkUpload")

	if getErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to get file",
		})
		return
	}

	file, openErr := file_ptr.Open()
	if openErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to open file",
		})
		return
	}

	defer file.Close()

	reader := csv.NewReader(file)

	var tasks []models.Task

	reader.Read()

	for {
		row, err := reader.Read()
		if err == io.EOF {
			break
		} else if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Error reading CSV",
			})
			return
		}

		layout := "2006-01-02 15:04:05"
		plannedStartTime, err := time.Parse(layout, row[2]+" "+row[3])

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Error parsing planned start time",
			})
			return
		}

		plannedEndTime, err := time.Parse(layout, row[4]+" "+row[5])

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Error parsing planned end time",
			})
			return
		}

		seconds, err := strconv.ParseInt(row[6], 10, 64)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Error parsing seconds",
			})
			return
		}

		task := models.Task{
			Title:            row[0],
			Description:      row[1],
			PlannedStartTime: plannedStartTime,
			PlannedEndTime:   plannedEndTime,
			Seconds:          seconds,
			CreatedBy:        userID,
		}

		tasks = append(tasks, task)
	}

	insertErr := initializers.DB.Create(&tasks).Error
	if insertErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Error inserting tasks into the database",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": fmt.Sprintf("Successfully uploaded %d tasks", len(tasks)),
	})
}

func GetTasks(c *gin.Context) {
	task_id := c.Query("task_id")

	var tasks []models.Task
	err := initializers.DB.Find(&tasks, task_id).Error

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error getting tasks",
		})
		return
	}

	c.JSON(http.StatusOK, tasks)
}

func UpdateTask(c *gin.Context) {
	task_id := c.Query("task_id")

	var task models.Task
	err := initializers.DB.First(&task, task_id).Error

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Task not found",
		})
		return
	}

	var body struct {
		Title            string `json:"title"`
		Description      string `json:"description"`
		PlannedStartTime int64  `json:"planned_start_Time"`
		PlannedEndTime   int64  `json:"planned_end_Time"`
		ActualStartTime  int64  `json:"actual_start_Time"`
		ActualEndTime    int64  `json:"actual_end_Time"`
		Seconds          int64  `json:"seconds"`
	}

	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Fields are empty",
		})
		return
	}

	if body.Title != "" {
		task.Title = body.Title
	}

	if body.Description != "" {
		task.Description = body.Description
	}

	if body.PlannedStartTime != 0 {
		task.PlannedStartTime = time.Unix(body.PlannedStartTime, 0)
		task.PlannedStartTime.Format(time.RFC3339)
	}

	if body.PlannedEndTime != 0 {
		task.PlannedEndTime = time.Unix(body.PlannedEndTime, 0)
		task.PlannedEndTime.Format(time.RFC3339)
	}

	if body.ActualStartTime != 0 {
		task.ActualStartTime = time.Unix(body.ActualStartTime, 0)
		task.ActualStartTime.Format(time.RFC3339)
	}

	if body.ActualEndTime != 0 {
		task.ActualEndTime = time.Unix(body.ActualEndTime, 0)
		task.ActualEndTime.Format(time.RFC3339)
	}

	if body.Seconds != 0 {
		task.Seconds = body.Seconds
	}

	if !task.PlannedStartTime.Before(task.PlannedEndTime) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid Start Time cannot be before End Time",
		})
		return
	}

	if !task.ActualStartTime.Before(task.ActualEndTime) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid Start Time cannot be before End Time",
		})
		return
	}

	err = initializers.DB.Save(&task).Error

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error updating task",
		})
		return
	}

	hub := c.MustGet("hub").(*websocket.Hub)
	broadcastTaskUpdate(hub, "update", task)

	c.JSON(http.StatusOK, gin.H{
		"message": "Details added successfully",
		"task":    task,
	})
}

func DeleteTask(c *gin.Context) {
	task_id := c.Query("task_id")

	var task models.Task
	err := initializers.DB.First(&task, task_id).Error

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Task not found",
		})
		return
	}

	err = initializers.DB.Delete(&models.Task{}, task_id).Error

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error deleting task",
		})
		return
	}

	hub := c.MustGet("hub").(*websocket.Hub)
	broadcastTaskUpdate(hub, "delete", task)

	c.JSON(http.StatusOK, gin.H{
		"message": "Task deleted successfully",
	})
}

func broadcastTaskUpdate(hub *websocket.Hub, action string, task models.Task) {
	message := map[string]interface{}{
		"action": action,
		"task":   task,
	}
	msgBytes, _ := json.Marshal(message)
	hub.Broadcast <- msgBytes
}
