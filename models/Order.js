const mongoose=require('mongoose')
//create Order schema here  ctrl shift l

const OrderSchema= new mongoose.Schema(
    {
        userId:{type:String, required:true},
        products:[
            {
                productId:{type:String},
                quantity:{type:Number,default:1},

            }
        ],
      amount:{type:Number,required:true},
      address:{type:Object,required:true},
      status:{type:String,default:'pending'}
    },{timestamps:true}
)
module.exports=mongoose.model('Order',OrderSchema)