package routers

import (
	"github.com/gin-gonic/gin"

	"backend/api/controllers"
	"backend/api/middleware"
)

func UserRoutes(router *gin.Engine) {
	user := router.Group("/user")
	{
		user.POST("/register", controllers.UserRegistration)
		user.POST("/login", controllers.UserLogin)
		user.PUT("/logout", middleware.AuthMiddleware, controllers.UserLogout)
		user.DELETE("/delete", middleware.AuthMiddleware, controllers.UserDeletion)
	}
}
