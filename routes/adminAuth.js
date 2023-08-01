const express = require("express");
const Admin = require("../models/Admin");
const fetchAdmin = require("../middleware/fetchAdmin");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT = "success";
// ROUTE 1 - POST - Admin register :
router.post(
  "/register",
  [
    body("name", "name should be atleast 3 characters.").isLength({
      min: 3,
    }),
    body("username", "username should be atleast 6 characters.").isLength({
      min: 6,
    }),
    body(
      "password",
      "password should be atleast atleast 8 characters."
    ).isLength({ min: 8 }),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    try {
      let admin = await Admin.findOne({ username: req.body.username });

      if (admin) {
        return res
          .status(400)
          .json({ success, error: "Admin is already registered." });
      }

      const salt = await bcrypt.genSalt(10);
      const genPassword = await bcrypt.hash(req.body.password, salt);

      admin = await Admin.create({
        name: req.body.name,
        username: req.body.username,
        password: genPassword,
      });

      const data = {
        admin: {
          id: admin.id,
        },
      };

      const jwtData = jwt.sign(data, JWT);
      success = true;
      res.json({ success, jwtData });
    } catch (error) {
      res.status(500).send("Internal server error.");
    }
  }
);

//ROUTE 2 - POST  - Admin login:
router.post(
  "/login",
  [
    body("username", "username should be atleast 6 characters.").isLength({
      min: 6,
    }),
    body("password", "password should be atleast 8 characters.").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    const admin = await Admin.findOne({ username: req.body.username });

    if (!admin) {
      return res
        .status(400)
        .json({ success, error: "Invalid username or password." });
    }

    try {
      const passCompared = await bcrypt.compare(
        req.body.password,
        admin.password
      );

      if (!passCompared) {
        return res
          .status(400)
          .json({ success, error: "Invalid username or password." });
      }

      const payload = {
        admin: {
          id: admin.id,
        },
      };

      const jwtData = jwt.sign(payload, JWT);
      success = true;
      res.json({ success, jwtData });
    } catch (error) {
      res.status(500).send("Internal server error.");
    }
  }
);

//ROUTE 3 - POST - Get admin :
router.post("/getadmin", fetchAdmin, async (req, res) => {
  try {
    const adminId = req.admin.id;

    const admin = await Admin.findById(adminId).select("-password");
    res.send(admin);
  } catch (error) {
    res.status(500).send("Internal server error.");
  }
});

module.exports = router;
