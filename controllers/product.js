const prisma = require("../config/prisma")
const cloudinary = require("cloudinary").v2

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// ────────────────────────────────────────────────────────────────
// Create Product
exports.create = async (req, res) => {
  try {
    const { title, description, price, quantity, categoryId, images } = req.body

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        categoryId: parseInt(categoryId),
        images: {
          create: images.map((item) => ({
            asset_id: item.asset_id,
            public_id: item.public_id,
            url: item.url,
            secure_url: item.secure_url,
          })),
        },
      },
    })

    res.send(product)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
}

// ────────────────────────────────────────────────────────────────
// List Products
exports.list = async (req, res) => {
  try {
    const { count } = req.params
    const products = await prisma.product.findMany({
      take: parseInt(count),
      orderBy: { createdAt: "desc" },
      include: { category: true, images: true },
    })
    res.send(products)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
}

// ────────────────────────────────────────────────────────────────
// Read Single Product
exports.read = async (req, res) => {
  try {
    const { id } = req.params
    const product = await prisma.product.findFirst({
      where: { id: Number(id) },
      include: { category: true, images: true },
    })
    res.send(product)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
}

// ────────────────────────────────────────────────────────────────
// Update Product
exports.update = async (req, res) => {
  try {
    const { title, description, price, quantity, categoryId, images } = req.body

    await prisma.image.deleteMany({
      where: { productId: Number(req.params.id) },
    })

    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: {
        title,
        description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        categoryId: parseInt(categoryId),
        images: {
          create: images.map((item) => ({
            asset_id: item.asset_id,
            public_id: item.public_id,
            url: item.url,
            secure_url: item.secure_url,
          })),
        },
      },
    })

    res.send(product)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
}

// ────────────────────────────────────────────────────────────────
// Remove Product
exports.remove = async (req, res) => {
  try {
    // 👉 ดึง id จากพารามิเตอร์ URL เช่น /api/product/123
    const { id } = req.params

    // 👉 ค้นหาสินค้าด้วย id และรวมข้อมูล images (เพื่อลบรูปด้วย)
    const product = await prisma.product.findFirst({
      where: { id: Number(id) },
      include: { images: true }, // รวมข้อมูลรูปภาพของสินค้าด้วย
    })

    // 👉 ถ้าไม่เจอสินค้า ให้ตอบกลับ 400 (bad request)
    if (!product) return res.status(400).json({ message: "Product not found" })

    // 👉 เตรียมลบรูปภาพทั้งหมดใน Cloudinary แบบ async
    const deletedImages = product.images.map(
      (image) =>
        new Promise((resolve, reject) => {
          cloudinary.uploader.destroy(image.public_id, (error, result) => {
            if (error) reject(error) // ❌ ลบไม่สำเร็จ
            else resolve(result) // ✅ ลบสำเร็จ
          })
        })
    )

    // 👉 รอให้การลบรูปทั้งหมดใน Cloudinary เสร็จสิ้น
    await Promise.all(deletedImages)

    // 👉 ลบสินค้าออกจากฐานข้อมูล
    await prisma.product.delete({ where: { id: Number(id) } })

    // ✅ ตอบกลับว่า ลบสำเร็จ
    res.send("Deleted Success")
  } catch (err) {
    // ❌ ถ้ามีข้อผิดพลาดใด ๆ ให้ส่งกลับ 500 (internal server error)
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
}

// ────────────────────────────────────────────────────────────────
// List Products by Filter
exports.listBy = async (req, res) => {
  try {
    const { sort, order, limit } = req.body
    const products = await prisma.product.findMany({
      take: limit,
      orderBy: { [sort]: order },
      include: { category: true, images: true },
    })
    res.send(products)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
}

// ────────────────────────────────────────────────────────────────
// Search Filters
exports.searchFilters = async (req, res) => {
  try {
    const { query, category, price } = req.body

    if (query) return await handleQuery(req, res, query)
    if (category) return await handleCategory(req, res, category)
    if (price) return await handlePrice(req, res, price)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
}

const handleQuery = async (req, res, query) => {
  try {
    const products = await prisma.product.findMany({
      where: { title: { contains: query } },
      include: { category: true, images: true },
    })
    res.send(products)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Search error" })
  }
}

const handlePrice = async (req, res, priceRange) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        price: {
          gte: priceRange[0],
          lte: priceRange[1],
        },
      },
      include: { category: true, images: true },
    })
    res.send(products)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
}

const handleCategory = async (req, res, categoryIds) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        categoryId: {
          in: categoryIds.map((id) => Number(id)),
        },
      },
      include: { category: true, images: true },
    })
    res.send(products)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
}

// ────────────────────────────────────────────────────────────────
// Upload Single Image to Cloudinary
exports.createImages = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.body.image, {
      public_id: `AbuHamid${Date.now()}`,
      resource_type: "auto",
      folder: "Ecom2025",
    })
    res.send(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
}

// ────────────────────────────────────────────────────────────────
// Remove Single Image from Cloudinary
exports.removeImage = async (req, res) => {
  try {
    const { public_id } = req.body
    cloudinary.uploader.destroy(public_id, () => {
      res.send("Remove Image Success!!!")
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
}
