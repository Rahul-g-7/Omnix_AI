import mongoose from "mongoose";

const paymentScheme= new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    paymentId:String,
    amount:Number,
    currency:{
        type:String,
        default:"INT"
    },
    credits:{
        type:Number
    },
    plan:{
        type:String
    },
    status:{
        type:String,
        enum:["created","paid","failed"],
        default:"created"
    }
},{timestamps:true})
const Payment=mongoose.model("Payment",paymentScheme)
export default Payment