package routers

import (
	"github.com/gin-gonic/gin"

	"backend/api/ai"
	"backend/api/controllers"
	"backend/api/middleware"
	"backend/api/websocket"
)

func TaskRoutes(router *gin.Engine, hub *websocket.Hub, aiAssigner *ai.Assigner, aiSuggester *ai.Suggester) {
	tasks := router.Group("/task")
	{
		tasks.GET("/ws", middleware.AuthMiddleware, middleware.InjectHub(hub), func(c *gin.Context) {
			websocket.ServeWs(hub, c)
		})
		tasks.POST("/create", middleware.AuthMiddleware, middleware.InjectHub(hub), controllers.CreateTask)
		tasks.POST("/bulkupload", middleware.AuthMiddleware, middleware.InjectHub(hub), controllers.CreateTaskBulk)
		tasks.GET("/", controllers.GetTasks)
		tasks.PUT("/update/", middleware.AuthMiddleware, middleware.InjectHub(hub), controllers.UpdateTask)
		tasks.DELETE("/delete/", middleware.AuthMiddleware, middleware.InjectHub(hub), controllers.DeleteTask)
		tasks.POST("/assign", middleware.AuthMiddleware, middleware.InjectHub(hub), func(c *gin.Context) {
			controllers.AssignTask(c, aiAssigner)
		})

		tasks.GET("/suggestions", middleware.AuthMiddleware, middleware.InjectHub(hub), func(c *gin.Context) {
			controllers.GetTaskSuggestions(c, aiSuggester)
		})

		tasks.POST("/breakdown/:id", middleware.AuthMiddleware, middleware.InjectHub(hub), func(c *gin.Context) {
			controllers.BreakdownTask(c, aiSuggester)
		})
	}
}

func InjectHub(hub *websocket.Hub) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("hub", hub)
		c.Next()
	}
}

