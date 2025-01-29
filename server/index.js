const express=require('express')
const bodyParser=require('body-parser')
const mongoose=require('mongoose')
const dotenv=require('dotenv')
const cors=require('cors')
dotenv.config()
const app=express()
const AuthRoute=require('./routes/authRoute');
const UserRoute=require('./routes/userRoute');

mongoose.connect(process.env.MongoDB).then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Listening at port number ${process.env.PORT}`)
    })
}).catch((e)=>{
    console.log(e)
})



app.use(bodyParser.json({limit: '30mb', extended:true}))
app.use(bodyParser.urlencoded({limit: '30mb', extended:true}))
app.use(cors())

app.use('/auth', AuthRoute);
app.use('/user',UserRoute)