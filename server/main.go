package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/EthicalGopher/image_search/database"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/joho/godotenv"
	"github.com/markbates/goth"
	"github.com/markbates/goth/providers/facebook"
	"github.com/markbates/goth/providers/github"
	"github.com/markbates/goth/providers/google"
	"github.com/shareed2k/goth_fiber"
)

func init() {
	if err := godotenv.Load(); err != nil {
		log.Panic(err)
	}
	googleClientId := os.Getenv("GOOGLE_CLIENT_ID")
	googleClientSecret := os.Getenv("GOOGLE_CLIENT_SECRET")

	githubClientId := os.Getenv("GITHUB_CLIENT_ID")
	githubClientSecret := os.Getenv("GITHUB_CLIENT_SECRET")
	facebookClientId := os.Getenv("FACEBOOK_CLIENT_ID")
	facebookClientSecret := os.Getenv("FACEBOOK_CLIENT_SECRET")
	goth.UseProviders(
		google.New(googleClientId, googleClientSecret, "http://localhost:8080/api/auth/google/callback", "email", "profile"),
		github.New(githubClientId, githubClientSecret, "http://localhost:8080/api/auth/github/callback", "user:email"),
		facebook.New(facebookClientId, facebookClientSecret, "http://localhost:8080/api/auth/facebook/callback", "email", "public_profile"),
	)
}

func server() {
	app := fiber.New(fiber.Config{
		AppName: "Image Search",
	})
	store := session.New(session.Config{
		Expiration:     time.Hour * 72,
		CookieSecure:   false,
		CookieHTTPOnly: true,
	})
	//set cors
	app.Use(cors.New(cors.Config{
		AllowMethods:     "POST,GET",
		AllowOrigins:     "http://localhost:5173",
		AllowCredentials: true,
	}))

	//added the bucket stratagy
	app.Use(limiter.New(limiter.Config{
		Max:        20,
		Expiration: 30 * time.Second,
		LimitReached: func(c *fiber.Ctx) error {
			return c.SendStatus(fiber.StatusTooManyRequests)
		},
	}))
	//"/health" to see if the server is running or not
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.SendStatus(fiber.StatusOK)
	})
	api := app.Group("/api")
	//"/api/auth/:provider" authentication
	api.Get("/auth/:provider", goth_fiber.BeginAuthHandler)

	//"/api/auth/:provider/callback" redirect the user if successfull
	api.Get("/auth/:provider/callback", func(c *fiber.Ctx) error {
		user, err := goth_fiber.CompleteUserAuth(c)
		if err != nil {
			return c.Status(fiber.StatusNotFound).SendString(err.Error())
		}
		sess, err := store.Get(c)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
		}
		sess.Set("userId", user.UserID)
		if err = sess.Save(); err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
		}

		email := url.QueryEscape(user.Email)
		name := url.QueryEscape(user.Name)
		profilePic := url.QueryEscape(user.AvatarURL)
		redirectURL := fmt.Sprintf("http://localhost:5173?email=%s&name=%s&profilePic=%s", email, name, profilePic)
		return c.Redirect(redirectURL, fiber.StatusTemporaryRedirect)
	})

	//"/api/logout" to logout the user
	api.Get("/logout", func(c *fiber.Ctx) error {
		sess, err := store.Get(c)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
		}
		if err = sess.Destroy(); err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
		}
		return c.SendStatus(fiber.StatusOK)
	})

	api.Get("/top-searches", func(c *fiber.Ctx) error {
		topTerms, err := database.TopHistory()
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
		}
		return c.JSON(topTerms)
	})
	//"/api/search-guest" api  for random images for guest
	api.Get("/search-guest", func(c *fiber.Ctx) error {
		term := "random"
		page := c.Query("page")
		page_no, err := strconv.Atoi(page)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
		}
		usplash_api := os.Getenv("UNSPLASH_API")
		url := fmt.Sprintf("https://api.unsplash.com/search/photos/?client_id=%v&query=%v&page=%v", os.Getenv("UNSPLASH_ACCESS_KEY"), term, page_no)
		res, err := http.Get(url)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
		}
		defer res.Body.Close()
		var data any
		if err := json.NewDecoder(res.Body).Decode(&data); err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString("Failed to parse Unsplash response")
		}
		return c.JSON(data)

	})

	app.Use(func(c *fiber.Ctx) error {
		sess, err := store.Get(c)
		if err != nil {
			return c.SendStatus(fiber.StatusInternalServerError)
		}
		if sess.Get("userId") == nil {
			return c.SendStatus(fiber.StatusUnauthorized)
		}
		return c.Next()
	})
	//"/api/search" to search the photos
	api.Get("/search", func(c *fiber.Ctx) error {
		sess, err := store.Get(c)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
		}
		userId := sess.Get("userId").(string)
		term := c.Query("term")
		if term != "random" {
			if err := database.EnterData(userId, term); err != nil {
				log.Println("Failed to enter data into database:", err)
			}
		}
		term = strings.ToLower(strings.TrimSpace(term))
		page := c.QueryInt("page", 1)
		usplash_api := os.Getenv("UNSPLASH_API")
		        url := fmt.Sprintf("https://api.unsplash.com/search/photos/?client_id=%v&query=%v&page=%v", os.Getenv("UNSPLASH_ACCESS_KEY"), term, page)
		res, err := http.Get(url)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
		}
		defer res.Body.Close()
		var data any
		if err := json.NewDecoder(res.Body).Decode(&data); err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString("Failed to parse Unsplash response")
		}
		return c.JSON(data)

	})
	//"api/history" gives the recent searches of the user
	api.Get("/history", func(c *fiber.Ctx) error {
		sess, err := store.Get(c)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
		}
		userId := sess.Get("userId").(string)
		result, err := database.FindData(userId)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString(err.Error())

		}
		return c.Status(fiber.StatusOK).JSON(fiber.Map{"terms": result.Term, "time_stamp": result.Timestamp})
	})

	api.Post("/history/clear", func(c *fiber.Ctx) error {
		sess, err := store.Get(c)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
		}
		userId := sess.Get("userId").(string)
		if err := database.ClearHistory(userId); err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
		}
		return c.SendStatus(fiber.StatusOK)
	})
	//to show StatusNotFound for unknown paths
	app.Use(func(c *fiber.Ctx) error {
		return c.SendStatus(fiber.StatusNotFound)
	})

	//listening to http://localhost:8080
	if err := app.Listen(":8080"); err != nil {
		log.Panic(err)
	}
}
func main() {
	database.Connect()
	server()
	defer database.Disconnect()
}
