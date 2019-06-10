+++
date = "2019-06-10T06:00:00+00:00"
draft = true
featured_img = "/uploads/gopher-fragile.png"
slug = "golang-dependency-patterns"
tags = ["design_patterns", "golang"]
title = "Dependency Patterns in Go"

+++
As a working software engineer, one of the most common tasks I have to perform is tying N pieces of software together into one tidy bundle. This is a difficult problem to solve well. Although the concept is simple, reality rarely matches the expectation. Dependencies (one piece of code being reliant on a separate piece of code) and clean code are often opposing forces.

Here's an example from a [reddit post asking for advice on how to access dependencies when using the Gin framework](https://www.reddit.com/r/golang/comments/bxmy08/structuring_gin_api/?utm_source=share&utm_medium=web2x "Structuring Gin API Dependencies").

    package main
    
    import (
    	"bytes"
    	"fmt"
    	"net/http"
    	"os"
    	"time"
    
    	"github.com/gin-gonic/gin"
    	"github.com/plaid/plaid-go/plaid"
    )
    
    func handleError(err error) {
    	if err != nil {
    		panic(err)
    	}
    }
    
    func main() {
    	clientOptions := plaid.ClientOptions{
    		os.Getenv("PLAID_CLIENT_ID"),
    		os.Getenv("PLAID_SECRET"),
    		os.Getenv("PLAID_PUBLIC_KEY"),
    		plaid.Sandbox,  // Available environments are Sandbox, Development, and Production
    		&http.Client{}, // This parameter is optional
    	}
    	client, err := plaid.NewClient(clientOptions)
    	handleError(err)
    
    	router := gin.Default()
    	api := router.Group("/api")
    	{
    		api.GET("/", func(c *gin.Context) {
    			c.JSON(http.StatusOK, gin.H{
    				"message": "hello world",
    			})
    		})
    	}
    
    	api.POST("/get_access_token", func(c *gin.Context) {
    		c.Header("Content-Type", "application/json")
    		c.JSON(http.StatusOK, gin.H{
    			"message": "acesss token",
    		})
    		buf := new(bytes.Buffer)
    		buf.ReadFrom(c.Request.Body)
    		newStr := buf.String()
    
    		// POST /item/public_token/exchange
    		accessTokenResp, err := client.ExchangePublicToken(newStr)
    		handleError(err)
    		fmt.Println("Public token -> Access Token", accessTokenResp.AccessToken, "for item:", accessTokenResp.ItemID)
    	})
    	// Start and run the server
    	router.Run(":8080")
    }

This is a good start, but it could be better. The author of this snippet was interested in avoiding putting global state in the `main` function. Usually, a good call.