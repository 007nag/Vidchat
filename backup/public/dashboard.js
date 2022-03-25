var username="";
var otheruser=""
var socket;
$.get("/loggedin",function(data)
    {
        if(data=="") 
        window.location.href="/login.html";
        else 
        username=data;
        createpeer();
        socket= io();
        socket.emit('store_data',{username:username});
        checkforother();
    socket.on('please_chat',function(data)
    {
        if (otheruser==data.from)
        {
            var messagecontainer= document.getElementById('messages');  
            messagecontainer.innerHTML+='<p class="message_left">'+data.message+'</p><br clear="all" />';
            messagecontainer.scrollTop = messagecontainer.scrollHeight;
        }
        else 
        {
            var notif=document.getElementById('notification');
            notif.innerHTML=' You got a message from '+data.from;
        }
        
    });
    });
function checkforother()
{
    $.get('/checkforother',function(data)
    {
        
        if(data!='')
        {
            document.getElementById('otheruser').innerHTML='You are chatting with '+data;
            otheruser=data;
            loadmessages();
        }
        
    });
}
function loadmessages()
{
    $.ajax({url:'/get_messages',
    data:JSON.stringify({from:username,to:otheruser}),
    contentType:'application/json',
    method:'POST',success:function(data)
    {
        
        var messagecontainer= document.getElementById('messages');
        messagecontainer.innerHTML='';
        for(var i=0;i<data.length;i++)
        {
            if(data[i]['from']==username)
            messagecontainer.innerHTML+='<p class="message_right">'+data[i]['message']+'</p><br clear="all" />';        
            else
            messagecontainer.innerHTML+='<p class="message_left">'+data[i]['message']+'</p><br clear="all" />';
        }
        messagecontainer.scrollTop = messagecontainer.scrollHeight;
    }
    });
}
function put_message()
{
    var msg= document.getElementById('chatmsg').value;
    var messagecontainer= document.getElementById('messages');
    messagecontainer.innerHTML+='<p class="message_right">'+msg+'</p><br clear="all" />';
    messagecontainer.scrollTop = messagecontainer.scrollHeight;
    $.ajax({url:'/put_messages',
    data:JSON.stringify({from:username,to:otheruser,message:msg}),
    contentType:'application/json',
    method:'POST',success:function(data)
    {
        socket.emit('want_to_chat',{to:otheruser,from:username,message:msg});
    }
    });
}
function search()
{   
    var name= document.getElementById('search_bar').value;
    var container= document.getElementById('names');
    container.innerHTML='';
    if (name!='')
    {
        $.ajax({
            'type':"POST",
            'contentType':'application/json',
            'data':JSON.stringify({name:name}),
            'url':'/search',
            'success':function(data)
            {
                for(var i=0;i<data.length;i++)
                {   
                    var na= data[i]['name']
                    if (na==username) continue;
                    container.innerHTML+='<p><button onclick=goto("'+na+'") class="usernames">'+data[i]['name']+'</button></p>';
                }
            }
        })
    }
    
}
function logout()
{
    $.get('/logout',function(data)
    {
        if(data=='yes')
        window.location.href="/login.html"
    })
}
function goto(name)
{
    $.ajax({
        'type':"POST",
        'contentType':'application/json',
        'data':JSON.stringify({name:name}),
        'url':'/goto',
        'success':function(data)
        {
            otheruser=name;
            document.getElementById('otheruser').innerHTML='You are chatting with '+name;
            loadmessages();   
        }
    });
}