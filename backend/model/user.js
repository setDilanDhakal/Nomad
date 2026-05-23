import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    
    fullName: {
        type: String,
        required: [true, 'fullname is Required']
    },
    email: {
        type: String,
        required: [true, 'Email is Required']
    },
    password: {
        type: String,
        required: [true, 'Password is Required']
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    image:{
        type: String
    },
    mobileNo: {
        type: String,
        default: ""
    }
},{timestamps:true});


export default mongoose.model('User', userSchema);
