const express = require("express");
const Order = require("../models/Order");
const fetchAdmin = require("../models/Admin");
const fetchUser = require("../middleware/fetchUser");
const router = express.Router();

//ROUTE - GET 1 : Get cart products by user.
router.get("/getorder", fetchUser, async (req, res) => {
  try {
    const order = await Order.find({ user: req.user.id });
    res.send(order);
  } catch (error) {
    res.status(500).send("Internal server error.");
  }
});

//ROUTE - GET 2 : Get cart products by admin.
router.get("/getallorder", fetchAdmin, async (req, res) => {
  try {
    const order = await Order.find({ admin: req.admin.id });
    res.send(order);
  } catch (error) {
    res.status(500).send("Internal server error.");
  }
});

//ROUTE - POST 1 : Add a product.
router.post("/addorder", fetchUser, async (req, res) => {
  const { admin, image, title, description, price, category, available } =
    req.body;

  try {
    const order = new Order({
      admin,
      image,
      title,
      description,
      price,
      category,
      available,
      user: req.user.id,
    });

    const saveOrder = await order.save();
    console.log(saveOrder);
    res.json(saveOrder);
  } catch (error) {
    res.status(500).send("Internal server error.");
  }
});

//ROUTE - DELETE 2 : Delete a cart product.
router.delete("/deleteOrder/:id", fetchUser, async (req, res) => {
  try {
    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Product not found." });
    }

    order = await Order.findByIdAndDelete(req.params.id);
    res.json({ success: "Product deleted." });
  } catch (error) {
    res.status(500).send("Internal server error.");
  }
});

module.exports = router;
