const Porduct = require("../models/Porduct");
// const Product = require("../models/Porduct");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

//we will use express router


// CREATE product
const router = require("express").Router();
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Porduct(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (e) {
    res.status(500).json(e);
  }
});

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Porduct.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (e) {
    res.status(500).json(e);
  }
});

// //DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    //find product model
    await Porduct.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted");
  } catch (e) {
    res.status(500).json(e);
  }
});


//GEt Product  everyone can see any product\
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Porduct.findById(req.params.id);
    // const { password, ...others } = Product._doc;

    res.status(200).json(product);
  } catch (e) {
    res.status(500).json(e);
  }
});

// //Get all products
router.get("/", async (req, res) => {
  //we will use two queries, we will fetch using category
  const qNew = req.query.new;
  const qCategory = req.query.category;

  try {
    let products;
    if (qNew) {
      //get the newest products
      products = await Porduct.find().sort({ createdAt: -1 }).limit(5);
    } else if (qCategory) {
      //we will use a condition
      //get product by category
      products = await Porduct.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      //get all the products
      products = await Porduct.find();
    }

    res.status(200).json(products);
  } catch (e) {
    res.status(500).json(e);
  }
});
module.exports = router;