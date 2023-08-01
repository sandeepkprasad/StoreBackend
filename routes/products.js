const express = require("express");
const Products = require("../models/Products");
const fetchAdmin = require("../middleware/fetchAdmin");
const router = express.Router();

//ROUTE - GET 1 : Get all products by user.
router.get("/allproducts", async (req, res) => {
  try {
    const allProducts = await Products.find();
    res.send(allProducts);
  } catch (error) {
    res.status(500).send("Internal server error.");
  }
});

//ROUTE - GET 2 : Get products by admin.
router.get("/getproducts", fetchAdmin, async (req, res) => {
  try {
    const products = await Products.find({ admin: req.admin.id });
    res.send(products);
  } catch (error) {
    res.status(500).send("Internal server error.");
  }
});

//ROUTE - POST 1 : Add a product.
router.post("/addproduct", fetchAdmin, async (req, res) => {
  const { image, title, description, price, category, available } = req.body;

  try {
    const product = new Products({
      image,
      title,
      description,
      price,
      category,
      available,
      admin: req.admin.id,
    });

    const saveProduct = await product.save();
    console.log(saveProduct);
    res.json(saveProduct);
  } catch (error) {
    res.status(500).send("Internal server error.");
  }
});

//ROUTE - PUT 2 : Update a product.
router.put("/updateproduct/:id", fetchAdmin, async (req, res) => {
  const { image, title, description, price, category, available } = req.body;

  const newProduct = {};

  if (image) {
    newProduct.image = image;
  }

  if (title) {
    newProduct.title = title;
  }

  if (description) {
    newProduct.description = description;
  }

  if (price) {
    newProduct.price = price;
  }

  if (category) {
    newProduct.category = category;
  }

  if (available) {
    newProduct.available = available;
  }

  let product = await Products.findById(req.params.id);

  if (!product) {
    return res.status(404).send("Product not found.");
  }

  if (product.admin.toString() !== req.admin.id) {
    return res.status(401).send("Admin not allowed.");
  }

  product = await Products.findByIdAndUpdate(
    req.params.id,
    { $set: newProduct },
    { new: true }
  );

  res.json(product);
});

//ROUTE - DELETE 3 : Delete a product.
router.delete("/deleteproduct/:id", fetchAdmin, async (req, res) => {
  try {
    let product = await Products.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    product = await Products.findByIdAndDelete(req.params.id);
    res.json({ success: "Product deleted." });
  } catch (error) {
    res.status(500).send("Internal server error.");
  }
});

module.exports = router;
