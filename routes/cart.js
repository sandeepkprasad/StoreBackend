const express = require("express");
const Cart = require("../models/Cart");
const fetchUser = require("../middleware/fetchUser");
const router = express.Router();

//ROUTE - GET 1 : Get cart products by user.
router.get("/getcart", fetchUser, async (req, res) => {
  try {
    const cart = await Cart.find({ user: req.user.id });
    res.send(cart);
  } catch (error) {
    res.status(500).send("Internal server error.");
  }
});

//ROUTE - POST 1 : Add a product.
router.post("/addcart", fetchUser, async (req, res) => {
  const { admin, image, title, description, price, category, available } =
    req.body;

  try {
    const cart = new Cart({
      admin,
      image,
      title,
      description,
      price,
      category,
      available,
      user: req.user.id,
    });

    const saveCart = await cart.save();
    console.log(saveCart);
    res.json(saveCart);
  } catch (error) {
    res.status(500).send("Internal server error.");
  }
});

//ROUTE - DELETE 2 : Delete a cart product.
router.delete("/deletecart/:id", fetchUser, async (req, res) => {
  try {
    let cart = await Cart.findById(req.params.id);

    if (!cart) {
      return res.status(404).json({ error: "Product not found." });
    }

    cart = await Cart.findByIdAndDelete(req.params.id);
    res.json({ success: "Product deleted." });
  } catch (error) {
    res.status(500).send("Internal server error.");
  }
});

module.exports = router;
