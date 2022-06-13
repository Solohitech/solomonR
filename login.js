const express=require('express')
const session=require('express-session')
const mongodbsession=require('connect-mongodb-session')(session);
const mongoose=require('mongoose')
const dbschema= require('./model/user')
const app=express()
const PORT=process.env.PORT||3232

//mongoUrl
const mongourl='mongodb://localhost:27017/storage';
//mongoconnection
         mongoose.connect(mongourl,
         	{useUniFiedToPology:true},
  	            {useNewUrlParser:true}).then(()=>{
  		          console.info('database connection success!')
  	                 }).catch(e=>{
  		                    console.info(e)

                               	});

  						 		   const store= new mongodbsession({
  		                             uri:mongourl,
  	                    	      	collection:'mysession'
                       	 });

//session middle ware function
                    app.use(session({
	                     resave: false,
	           saveUninitialized:false, 
	          secret:"key that will sign cookie",
	          store:store
          }));

//views engine middle ware function
app.set('view engine','ejs')
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))

//Authenticating
const isAuth=(req,res,next)=>{
	if(req.session.isAuth){
		next()
	}else{
		res.redirect('/login')
	}
}

                      app.get('/',(req,res)=>{
	       //req.session.isAuth=true;
//	console.info(req.session);
	//res.send('solohitechnology09')
//	console.log(req.session.id)

	       res.status(200).render('Creat_Acc')
         })

app.get('/register',(req,res)=>{
	res.status(200).render('register')
});

app.get('/login',(req,res)=>{
	res.status(200).render('login')
});


app.post('/register',async (req,res)=>{

	const {username,email,password}=req.body
	let userid =  await dbschema.findOne({email});

	if(userid){
		return res.redirect('register')
	}

 const users= new dbschema({username,email,password})
await users.save();
res.redirect('login')
})


app.post('/login',async(req,res)=>{
	const {email,password}=req.body

	let check= await dbschema.findOne({email})
	
	if(!check){
		return res.redirect('login')
	}
	req.session.isAuth=true;
	res.status(200).render('land')
  
})

app.get('/Dash_B',isAuth,(req,res)=>{
	res.status(200).render('Dash_B')
})


app.post('/logout',(req,res)=>{
req.session.destroy((e)=>{
	if(e) throw e;
	res.redirect('/')
})
})



app.listen(PORT,()=>console.info('server running on ',PORT))
