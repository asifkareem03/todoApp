//import mongoose
const mongoose=require('mongoose')

const { Schema } = mongoose;

//connect db with MongoDB Locally
// mongoose.connect('mongodb://localhost:27017/todoApp',{useNewUrlParser:true})


// connect db with Atlas
mongoose.connect('mongodb+srv://asifkareem:Asif.1234@cluster0.2vxj7.mongodb.net/todoApp?retryWrites=true&w=majority')

//Schema Creation
// const schema = new Schema({ 
//     name:String,
//     uname:String,
//     password:String, 
//     lists:{
//         type: mongoose.SchemaTypes.Mixed,
//         default:{}
//     }},
//     { minimize: false });
// const User = mongoose.model('User', schema);

// Model Creation
const User=mongoose.model('User',{
    name:String,
    uname:String,
    password:String,
    lists:[]
})

module.exports={
    User
}