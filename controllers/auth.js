const prisma = require("../config/prisma")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// REGISTER
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" })
    }

    const existingUser = await prisma.user.findFirst({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    const hashPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        email,
        password: hashPassword,
        role: "user", // or "admin"
        enabled: true,
      },
    })

    res.json({ message: "User registered successfully" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error" })
  }
}

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findFirst({ where: { email } })
    if (!user || !user.enabled) {
      return res.status(400).json({ message: "User not found or disabled" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" })
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    }

    jwt.sign(payload, process.env.SECRET, { expiresIn: "1d" }, (err, token) => {
      if (err)
        return res.status(500).json({ message: "Token generation failed" })
      res.json({ token, payload })
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error" })
  }
}

// CURRENT USER
exports.currentUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: req.user.email },
    })

    if (!user || !user.enabled) {
      return res.status(400).json({ message: "User not found or disabled" })
    }

    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error" })
  }
}
