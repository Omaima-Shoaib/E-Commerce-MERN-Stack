//we will use express router
const router = require("express").Router();
const User = require("../models/User");
const CryptoJs = require("crypto-js");
const jwt=require('jsonwebtoken')
//REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJs.AES.encrypt(
      req.body.password,
      process.env.PASS_SECRET_KEY
    ).toString(),
  });
  //this will save our user in the DB
  try {
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
    console.log(savedUser);
  } catch (e) {
    res.status(500).json(e);
    console.log(e.message);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(401).json("Wrong Credentials");
    const hashPass = CryptoJs.AES.decrypt(
      user.password,
      process.env.PASS_SECRET_KEY
    );
    const originalpassword = hashPass.toString(CryptoJs.enc.Utf8);
    originalpassword !== req.body.password && res.status(401).json("Wrong Credentials");
    const accessToken=jwt.sign({
        id:user._id,
        isAdmin:user.isAdmin
    },process.env.JWT_KEY,
    {expiresIn:'3d'})
    const { password, ...others } = user._doc;
    res.status(200).json({...others,accessToken});
  } catch (e) {
    res.status(500).json(e);
    console.log(e.message);
  }
});

module.exports = router;
