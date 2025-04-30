package main

import (
	"os"

	"github.com/gin-contrib/cors"

	"github.com/gin-gonic/gin"

	"backend/api/ai"
	"backend/api/initializers"
	"backend/api/routers"
	"backend/api/websocket"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectToDB()
	initializers.SyncDatabase()
}

func main() {
	r := gin.Default()

	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Welcome to TASK MANAGEMENT SYSTEM",
		})
	})

	wsHub := websocket.NewHub()
	go wsHub.Run()

	openaiAPIKey := os.Getenv("OPENAI_API_KEY")
	aiAssigner := ai.NewAssigner(openaiAPIKey)
	aiSuggester := ai.NewSuggester(openaiAPIKey)

	routers.UserRoutes(r)
	routers.TaskRoutes(r, wsHub, aiAssigner, aiSuggester)

	r.Run()

	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost:4173", "http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))
}
