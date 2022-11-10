
const router = require("express").Router();
const jwt = require("jsonwebtoken")
const bcrypt=require("bcryptjs")
const register=require('../model/auth')
router.post("/register",async(req,res)=>{
    const emailExist=await register.findOne({email:req.body.email})
    let value=await req.body.password
    if(value!=req.body.confirmPassword){
        res.status(400).send({message:"password does not match"}
        )}
        
            if(emailExist){
                res.status(400).send({message:"Email already exist"})
            }
        
        else{
            try{ 
                const salt=await bcrypt.genSalt(10)
                const hashedPassword=await bcrypt.hash(req.body.password, salt)
                let user=new register({
                    firstName:req.body.firstName,
                    lastName:req.body.lastName,
                    email:req.body.email,
                    password:hashedPassword,
                    confirmPassword:hashedPassword,
                    
                })
                let savedUser=await user.save()
                
                const{password, ...data}=await savedUser.toJSON()
              /*    res.send(data )   */
        
                res.send({message:"account created"}) 
               } catch (error) {
              
               }
            }           
        
})


/* LOGIN */
router.post("/login",async (req,res)=>{
    /* checking if email exist */
    const userdt= await register.findOne({email:req.body.email})
    
    if(!userdt){
        return res.status(400).json({message:"User is not found!"})
    }else{
        //validation if password is correct
        const validatePassword=await bcrypt.compare(req.body.password,userdt.password)
        if(!validatePassword){
            return res.status(400).send({message:"email or password is wrong"})
        }else{
            const token = jwt.sign({ _id: userdt._id }, "secret");
            res.cookie("jwt", token, {
              httpOnly: true,
              maxAge: 24 * 60 * 60 * 100, //i day
            });
         return res.send({
            message:"success"
         })
        }
    }



 
    
    })
     
router.get('/user',async(req,res)=>{
    try{ 
    const cookie= req.cookies;
   const claims= jwt.verify(cookie.jwt,'secret')
   if(!claims){
     res.status(401).json({message:"  you are not signed in"})
   }else{
       const  user= await register.findOne({_id: claims._id})
       const{password, ...data}=await user.toJSON()
        return res.status(200).send(data) 
   }
}catch(error){
    console.log(error);
    return res.status(500).send({message:"You aren't signed in"})
}
})
router.post('/logout',async(req,res)=>{
     res.cookie("jwt","",{maxAge:0})
     res.send({message:"you logged out"})
})



module.exports=router;