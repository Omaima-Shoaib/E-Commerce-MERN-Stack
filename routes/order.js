const Order = require("../models/Order");

const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

//we will use express router
const router = require("express").Router();
//CREATE order
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (e) {
    res.status(500).json(e);
  }
});
//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (e) {
    res.status(500).json(e);
  }
});

// //DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    //find product model
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted");
  } catch (e) {
    res.status(500).json(e);
  }
});
//Get USER ORDERS
//Edit the following to be orders instead of Cart
//the id used is the user id not the cart id so that we can get the user data user id is a forign key
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    // const { password, ...others } = Product._doc;

    res.status(200).json(orders);
  } catch (e) {
    res.status(500).json(e);
  }
});

//Get cart of all orders and only admin can do this
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (e) {
    res.status(500).json(e);
  }
});
//Get monthly income
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  try {
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousMonth },
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (e) {
    res.status(500).json(e);
  }
});
module.exports = router;
