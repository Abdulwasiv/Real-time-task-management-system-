package ai

import (
	"backend/api/models"
	"context"
	"encoding/json"
	"fmt"

	openai "github.com/sashabaranov/go-openai"
)

type Suggester struct {
	client *openai.Client
}

func NewSuggester(apiKey string) *Suggester {
	return &Suggester{
		client: openai.NewClient(apiKey),
	}
}

func (s *Suggester) GetTaskSuggestions(user models.User, recentTasks []models.Task) ([]string, error) {
	// Serialize recent tasks for AI context
	tasksJSON, _ := json.Marshal(recentTasks)

	prompt := fmt.Sprintf(`User Profile:
- Skills: %v
- Specialty: %s
- Recent Productivity: %.2f
- Average Task Time: %d seconds

Recent Tasks:
%s

Generate 5 personalized task suggestions for this user considering their skills and recent work patterns. Format as a JSON array of strings.`,
		user.SkillTags, user.Specialty, user.Productivity, user.AvgTaskTime, tasksJSON)

	resp, err := s.client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: openai.GPT3Dot5Turbo,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: prompt,
				},
			},
			ResponseFormat: &openai.ChatCompletionResponseFormat{
				Type: openai.ChatCompletionResponseFormatTypeJSONObject,
			},
		},
	)
	if err != nil {
		return nil, err
	}

	var suggestions []string
	err = json.Unmarshal([]byte(resp.Choices[0].Message.Content), &suggestions)
	return suggestions, err
}

func (s *Suggester) BreakDownTask(task models.Task) ([]models.Task, error) {
	prompt := fmt.Sprintf(`Break down the following task into smaller subtasks:
Original Task: %s
Description: %s
Estimated Duration: %d seconds

Provide the breakdown as a JSON array of task objects with title, description, and estimatedSeconds fields.`,
		task.Title, task.Description, task.Seconds)

	resp, err := s.client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: openai.GPT3Dot5Turbo,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: prompt,
				},
			},
			ResponseFormat: &openai.ChatCompletionResponseFormat{
				Type: openai.ChatCompletionResponseFormatTypeJSONObject,
			},
		},
	)
	if err != nil {
		return nil, err
	}

	var subtasks []models.Task
	err = json.Unmarshal([]byte(resp.Choices[0].Message.Content), &subtasks)
	return subtasks, err
}
