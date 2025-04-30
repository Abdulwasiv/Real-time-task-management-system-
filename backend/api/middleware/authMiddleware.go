package middleware

import (
	"backend/api/initializers"
	"backend/api/models"
	"backend/api/websocket"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware(c *gin.Context) {
	fmt.Println("In AuthMiddleware middleware")

	tokenString, err := c.Cookie("jwt")

	if err != nil {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	// Validate cookie
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {

		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(os.Getenv("JWT_SECRET")), nil
	})

	if err != nil {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// Checking expiration
		if float64(time.Now().Unix()) > claims["exp"].(float64) {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		// Find user with token subject
		var user models.User
		initializers.DB.First(&user, "id = ?", claims["sub"])

		if user.ID == 0 {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		c.Set("user_id", user.ID)

		// Continue
		c.Next()
		
	} else {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}
}

// Example WebSocket Hub injection middleware
func InjectHub(hub *websocket.Hub) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("hub", hub)
		c.Next()
	}
}

