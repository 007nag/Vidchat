const express = require('express')
const session= require('express-session');
const app= express();
const socket= require('socket.io');
const bodyparser= require('body-parser');
const cookieparser= require('cookie-parser');
var jsonparser = bodyparser.json()
var MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://nag007:12345678A@cluster0-wiohs.mongodb.net/mydb";
const {loginfunc,registerfunc}= require('./loginregister.js');
const {getmessages,putmessages}= require('./message.js');
const {search}= require('./search.js');
const { request } = require('express');
app.use(express.static("public"));
app.use(session({
  key:'user_in',
  secret:'secret',
  resave:false,
  saveUninitialized:false,
  cookie:{expires:600000}}))
const server=app.listen(3000,async function()
{ 
  console.log('listening');  
}
);
const io=socket(server);
app.post('/goto',jsonparser,async function(req,res)
{
  var name=req.body['name'];
  req.session.otheruser=name;
  res.send('yes');
});
app.post('/search',jsonparser,async function(req,res)
{
  var name=req.body['name'];
  const client = new MongoClient(uri,{useUnifiedTopology: true});
  var x=await search(client,name);
  res.send(x);
  client.close();
});
app.get('/loggedin',function(req,res)
{
  if(req.session.user) 
    res.send(req.session.user)
  else 
    res.send('')
});
app.get('/logout',function(req,res)
{
  if(req.session.destroy())
    res.send('yes');
  else
  res.send('no');
});

app.route('/login.html').get(function(req,res)
{
  if (!req.session.user)
  {
    res.redirect('/login.html');
    console.log('not signed in');
  }
  else{
    res.redirect('/dashboard.html');
    console.log('signed in');
  }  
}) 
app.post('/public/sendlogin',jsonparser,async function(req,res)
{ 
  
  try{
    const client = new MongoClient(uri,{useUnifiedTopology: true});
    var email=req.body['email'],password=req.body['password'];
  var z=await loginfunc(client,email,password);
  if (z==undefined || z.length==0)
  {
    res.send('no');
  }
  else 
  {
    req.session.user=email;
    res.send('yes');
    
  }
  }
  catch(err){res.send('no');}
  finally{
    client.close();
  }
  
});
app.post('/get_messages',jsonparser,async function(req,res)
{ 
  const client = new MongoClient(uri,{useUnifiedTopology: true});
  try
  {
    var from=req.body.from,to=req.body.to;
    res.send( await getmessages(client,from,to));
  }
  catch {res.send('');}
  finally{
    client.close(); 
  }

}
);
app.post('/put_messages',jsonparser,async function(req,res)
{ 
  const client = new MongoClient(uri,{useUnifiedTopology: true});
  try
  {
    var from=req.body.from,to=req.body.to,mess=req.body.message;
    res.send( await putmessages(client,from,to,mess));
  }
  catch {res.send('no');}
  finally{
    client.close();
  }
}
);
app.post('/public/sendregister',jsonparser,async function(req,res)
{ 
  const client = new MongoClient(uri,{useUnifiedTopology: true});
  try{
    var email=req.body['email'],password=req.body['password'];
  var z=await registerfunc(client,email,password);
  res.send(z);
  }
  catch(err){
    console.log(err)
    res.send('no');}
  finally{
    client.close();
  }
  
});
app.get('/checkforother',function(req,res)
{
  if(req.session.otheruser)
  res.send(req.session.otheruser)
  else
  res.send('')
})
var username_id={}
var id_username={}
io.on('connection',function(socket)
{
  socket.on('disconnect',function()
  { 
    let usnm= id_username[socket.id];
    delete id_username[socket.id]
    if(username_id[usnm]!=undefined)
    delete  username_id[usnm];
    console.log('deleted '+usnm);
  });
  socket.on('store_data',function(data)
  {
    username_id[data.username]=socket.id;
    id_username[socket.id]=data.username;
    console.log('added '+data.username);
  });
socket.on('want_to_chat',function(data){
  let to_id= username_id[data.to]
  if(to_id!=undefined)
    {
      io.to(to_id).emit("please_chat",{from:data.from,message:data.message});
    }
});
}
);
  
/*io.on('want_to_chat',function(data)
{
  
  socket.emit('coming');
  io.to(socket.id).emit("coming");
  io.to(data.to).emit("please_chat",{from:data.from});
})*/
