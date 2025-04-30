package ai

import (
	"backend/api/models"
	"context"
	"fmt"
	"math"
	"sort"
	"strings"

	openai "github.com/sashabaranov/go-openai"
)

type Assigner struct {
	client *openai.Client
}

func NewAssigner(apiKey string) *Assigner {
	return &Assigner{
		client: openai.NewClient(apiKey),
	}
}

// AnalyzeAndAssign finds the best user for a task
func (a *Assigner) AnalyzeAndAssign(task models.Task, users []models.User) (uint, error) {
	// First filter by skill match
	eligibleUsers := filterBySkills(task, users)
	if len(eligibleUsers) == 0 {
		return 0, fmt.Errorf("no users with matching skills")
	}

	// Score users based on multiple factors
	scores := make(map[uint]float64)
	for _, user := range eligibleUsers {
		scores[user.ID] = calculateUserScore(user, task)
	}

	// Get top 3 candidates
	candidates := rankUsers(scores, 3)

	// If clear winner, return immediately
	if len(candidates) == 1 || scores[candidates[0]]-scores[candidates[1]] > 0.2 {
		return candidates[0], nil
	}

	// For close candidates, use AI to decide
	return a.aiDecideBetween(task, candidates, eligibleUsers)
}

// rankUsers returns user IDs sorted by score in descending order
func rankUsers(scores map[uint]float64, limit int) []uint {
	type userScore struct {
		ID    uint
		Score float64
	}

	var ranked []userScore
	for id, score := range scores {
		ranked = append(ranked, userScore{id, score})
	}

	// Sort by score descending
	sort.Slice(ranked, func(i, j int) bool {
		return ranked[i].Score > ranked[j].Score
	})

	// Get top N results
	result := make([]uint, 0, limit)
	for i := 0; i < len(ranked) && i < limit; i++ {
		result = append(result, ranked[i].ID)
	}

	return result
}

func filterBySkills(task models.Task, users []models.User) []models.User {
	var eligible []models.User
	// Simple keyword matching - could enhance with embeddings later
	for _, user := range users {
		for _, tag := range user.SkillTags {
			if strings.Contains(strings.ToLower(task.Description), strings.ToLower(tag)) {
				eligible = append(eligible, user)
				break
			}
		}
	}
	return eligible
}

func calculateUserScore(user models.User, task models.Task) float64 {
	// Normalize workload (0-1 where 0 is best)
	workloadScore := 1 - math.Min(float64(user.Workload)/10.0, 1.0)

	// Productivity multiplier (higher is better)
	productivityScore := user.Productivity

	// Specialty bonus (2x if matches)
	specialtyBonus := 1.0
	if strings.Contains(strings.ToLower(task.Description), strings.ToLower(user.Specialty)) {
		specialtyBonus = 2.0
	}

	// Time estimation match (closer to user's average is better)
	timeMatch := 1 - math.Min(math.Abs(float64(task.Seconds-user.AvgTaskTime)/float64(user.AvgTaskTime)), 1.0)

	return workloadScore * productivityScore * specialtyBonus * timeMatch
}

func (a *Assigner) aiDecideBetween(task models.Task, candidateIDs []uint, users []models.User) (uint, error) {
	// Prepare candidate info for AI
	var candidatesInfo strings.Builder
	userMap := make(map[uint]models.User)
	for _, user := range users {
		userMap[user.ID] = user
	}

	for _, id := range candidateIDs {
		user := userMap[id]
		candidatesInfo.WriteString(fmt.Sprintf(`
Candidate ID: %d
- Skills: %v
- Current workload: %d tasks
- Productivity score: %.2f
- Specialty: %s
- Avg task time: %d seconds
`, user.ID, user.SkillTags, user.Workload, user.Productivity, user.Specialty, user.AvgTaskTime))
	}

	// Create AI prompt
	prompt := fmt.Sprintf(`Task Assignment Analysis:
Task Title: %s
Task Description: %s
Estimated Duration: %d seconds

Candidate Users:
%s

Please analyze and recommend the most suitable user ID for this task considering their skills, current workload, and productivity. Only respond with the ID number of the chosen user.`,
		task.Title, task.Description, task.Seconds, candidatesInfo.String())

	resp, err := a.client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: openai.GPT3Dot5Turbo,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: prompt,
				},
			},
		},
	)
	if err != nil {
		return 0, err
	}

	// Parse AI response
	var chosenID uint
	_, err = fmt.Sscanf(resp.Choices[0].Message.Content, "%d", &chosenID)
	return chosenID, err
}
