const mongoose=require('mongoose')
//create Cart schema here  ctrl shift l
const CartSchema= new mongoose.Schema(
    {
        userId:{type:String, required:true, unique:true},
        products:[
            {
                productId:{type:String},
                quantity:{type:Number,default:1},

            }
        ],
      
    },{timestamps:true}
)
module.exports=mongoose.model('Cart',CartSchema)