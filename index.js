const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors=require('cors')
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute=require("./routes/product")
const cartRoute=require("./routes/cart")
const orderRoute=require("./routes/order")
const stripeRoute=require("./routes/stripe")
dotenv.config();
//never share this secret key!

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("successfully 0_0 DB 0_0 connected"))
  .catch((e) => console.log(e.message));
app.use(cors())
app.use(express.json());

//routes
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders",orderRoute);
app.use("/api/checkout",stripeRoute);


app.listen(process.env.PORT || 5000, () => {
  console.log("backend server is running!");
});
