const express = require("express");
const Wishlist = require("../models/Wishlist");
const fetchUser = require("../middleware/fetchUser");
const router = express.Router();

//ROUTE - GET 1 : Get cart products by user.
router.get("/getwishlist", fetchUser, async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ user: req.user.id });
    res.send(wishlist);
  } catch (error) {
    res.status(500).send("Internal server error.");
  }
});

//ROUTE - POST 1 : Add a product.
router.post("/addwishlist", fetchUser, async (req, res) => {
  const { admin, image, title, description, price, category, available } =
    req.body;

  try {
    const wishlist = new Wishlist({
      admin,
      image,
      title,
      description,
      price,
      category,
      available,
      user: req.user.id,
    });

    const saveWishlist = await wishlist.save();
    console.log(saveWishlist);
    res.json(saveWishlist);
  } catch (error) {
    res.status(500).send("Internal server error.");
  }
});

//ROUTE - DELETE 2 : Delete a cart product.
router.delete("/deletewishlist/:id", fetchUser, async (req, res) => {
  try {
    let wishlist = await Wishlist.findById(req.params.id);

    if (!wishlist) {
      return res.status(404).json({ error: "Product not found." });
    }

    wishlist = await Wishlist.findByIdAndDelete(req.params.id);
    res.json({ success: "Product deleted." });
  } catch (error) {
    res.status(500).send("Internal server error.");
  }
});

module.exports = router;
