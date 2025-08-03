const express = require("express")
const router = express.Router()

// Controllers
const { register, login, currentUser } = require("../controllers/auth")

// Middleware
const { authCheck, adminCheck } = require("../middlewares/authCheck")

// Public routes
router.post("/register", register)
router.post("/login", login)

// Protected routes
router.post("/current-user", authCheck, currentUser)
router.post("/current-admin", authCheck, adminCheck, currentUser) // ใช้ currentUser เพราะจะได้ user info

module.exports = router
