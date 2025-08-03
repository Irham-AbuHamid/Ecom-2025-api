// Step 1: Imports
require("dotenv").config()
const express = require("express")
const app = express()
const morgan = require("morgan")
const { readdirSync } = require("fs")
const cors = require("cors")

// Step 2: Middleware
app.use(morgan("dev"))
app.use(express.json({limit: "10mb"}))
app.use(cors())

// Step 3: Routes
readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)))

// Step 4: Start Server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`)
})
