package router

import (
	"embed"
	"github.com/gin-contrib/gzip"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"net/http"
	"strings"
	"veloera/common"
	"veloera/controller"
	"veloera/middleware"
)

func SetWebRouter(router *gin.Engine, buildFS embed.FS, indexPage []byte) {
	router.Use(gzip.Gzip(gzip.DefaultCompression))
	router.Use(middleware.GlobalWebRateLimit())
	router.Use(middleware.Cache())
	router.Use(static.Serve("/", common.EmbedFolder(buildFS, "web/dist")))
	router.GET("/veloera", func(c *gin.Context) {
		c.String(http.StatusOK, "如果您在阅读这个, 则证明该项目基于 Veloera 二次开发, 如果您在 /veloera 上阅读到了此文件, 那么该网站同样基于 Veloera.\nVeloera 是一个智能的开源 LLM API 网关, 为商用和大并发准备的. 该项目基于 GPL v3 开源, 附加条款适用.  \n访问源代码: https://github.com/Veloera/Veloera\n\n---\n\nIf you are reading this, it means the project is a secondary development based on Veloera. If you are reading this file under /veloera, then that site is also based on Veloera.\n\nVeloera is an intelligent open-source LLM API gateway, built for commercial use and high concurrency. This project is open-sourced under the GPL v3 license, with additional terms applicable.\nSource code available at: https://github.com/Veloera/Veloera")
	})

	router.NoRoute(func(c *gin.Context) {
		if strings.HasPrefix(c.Request.RequestURI, "/v1") || strings.HasPrefix(c.Request.RequestURI, "/api") || strings.HasPrefix(c.Request.RequestURI, "/assets") {
			controller.RelayNotFound(c)
			return
		}
		c.Header("Cache-Control", "no-cache")
		c.Data(http.StatusOK, "text/html; charset=utf-8", indexPage)
	})
}
