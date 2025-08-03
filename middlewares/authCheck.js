const jwt = require("jsonwebtoken")
const prisma = require("../config/prisma")

// Middleware: ตรวจสอบ JWT Token
exports.authCheck = async (req, res, next) => {
  try {
    const headerToken = req.headers.authorization
    if (!headerToken || !headerToken.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided or invalid format" })
    }

    const token = headerToken.split(" ")[1]
    const decoded = jwt.verify(token, process.env.SECRET)
    req.user = decoded

    // ดึง user จากฐานข้อมูล (อาจถูกปิดใช้งาน)
    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
    })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (!user.enabled) {
      return res.status(403).json({ message: "Account is disabled" })
    }

    next()
  } catch (error) {
    console.error("AuthCheck Error:", error)
    res.status(401).json({ message: "Invalid or expired token" })
  }
}

// Middleware: ตรวจสอบสิทธิ์ Admin
exports.adminCheck = async (req, res, next) => {
  try {
    const { email } = req.user
    const adminUser = await prisma.user.findUnique({ where: { email } })

    if (!adminUser) {
      return res.status(404).json({ message: "User not found" })
    }

    if (adminUser.role !== "admin") {
      return res.status(403).json({ message: "Access Denied: Admins only" })
    }

    next()
  } catch (error) {
    console.error("AdminCheck Error:", error)
    res.status(500).json({ message: "Admin access error" })
  }
}
