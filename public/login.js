var criticalsection=false;
$.get("/loggedin",function(data)
    {
        if(data!="") 
        window.location.href="/dashboard.html";
    });
function login(){
    var email=document.getElementById('loginemail').value;
    var pass=document.getElementById('loginpass').value;
    var data= {email:email,password:pass};
    if (email=='' || pass=='')
    {
        alert('enter email and password');
    }
    else
    {
        if(!criticalsection){
            criticalsection=true;
            $.ajax({
                type: "POST",
                url: 'http://localhost:3000/public/sendlogin',
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (response) {
                    if (response=='yes')
                    {
                        alert('success');
                        window.location.href = "http://localhost:3000/dashboard.html";
                    }
                    else 
                    {
                        alert('please enter correct details');
                    }
                    criticalsection=false;
                }
            });
        }
        else {
            console.log('critical');
        }
}
}
function register(){
    var email=document.getElementById('user').value;
    var pass=document.getElementById('pass').value;
    var data= {email:email,password:pass};
    if (email=='' || pass=='')
    {
        alert('enter username and password');
    }
    else
    {
        if(!criticalsection){
            criticalsection=true;
            $.ajax({
                type: "POST",
                url: 'http://localhost:3000/public/sendregister',
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (response) {
                    console.log(response)
                    if (response=='yes')
                    {
                        alert('success');
                    }
                    else 
                    {
                        alert('please enter correct details');
                    }
                    criticalsection=false;
                }
            });
        }
        else {
            console.log('critical');
        }
}
}
