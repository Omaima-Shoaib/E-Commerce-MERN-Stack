const Cart = require("../models/Cart");

const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

//we will use express router
const router = require("express").Router();
//CREATE Cart
router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (e) {
    res.status(500).json(e);
  }
});
//UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (e) {
    res.status(500).json(e);
  }
});

// //DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    //find product model
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has been deleted");
  } catch (e) {
    res.status(500).json(e);
  }
});
//Get USER CART
//the id used is the user id not the cart id so that we can get the user data user id is a forign key
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    // const { password, ...others } = Product._doc;

    res.status(200).json(cart);
  } catch (e) {
    res.status(500).json(e);
  }
});

//Get cart of all users and only admin can do this
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (e) {
    res.status(500).json(e);
  }
});

module.exports = router;