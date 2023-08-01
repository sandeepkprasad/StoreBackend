const conntectToDB = require("./db");
const express = require("express");
const cors = require("cors");

conntectToDB();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 5000;

app.use("/admin", require("./routes/adminAuth"));
app.use("/user", require("./routes/userAuth"));
app.use("/products", require("./routes/products"));
app.use("/cart", require("./routes/cart"));
app.use("/wishlist", require("./routes/wishlist"));

app.listen(PORT, () => {
  console.log("StoreWala is listening on PORT : " + PORT);
});
