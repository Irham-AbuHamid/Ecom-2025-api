const prisma = require("../config/prisma")

exports.create = async (req, res) => {
  // logic to create a new category
  try {
    const { name } = req.body // destructure name from request body
    const category = await prisma.category.create({
      data: {
        name: name,
      },
    })
    res.send(category)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: " server error" })
  }
}
exports.list = async (req, res) => {
  // logic to list all categories
  try {
    const category = await prisma.category.findMany()
    res.send(category)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: " server error" })
  }
}
exports.remove = async (req, res) => {
  // logic to delete a category by id
  try {
    const { id } = req.params // destructure id from request params
    const category = await prisma.category.delete({
      where: {
        id: Number(id), // convert id to number
      },
    })
    console.log(category)
    res.send(category)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: " server error" })
  }
}
