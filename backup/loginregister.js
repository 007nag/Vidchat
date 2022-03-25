function loginfunc(client,email,password)
{
 var client= client;
    try{
        const mypromise= ()=>
        {
          return new Promise((resolve,reject)=>
          {
            client.connect( function(err) {
              db=client.db('chat');
              var users= db.collection('users');
              users.find({'name':email,'password':password}).toArray((err,res)=>{
                if (err!=null) reject();
                resolve(res);
              });
            });
          });
        }
        const fun = async ()=>
          {
            var x= await mypromise()
            console.log('okay')
            return x;
          }

        var ret=fun()
        //client.close()
        return ret
      }
      catch(err) {console.log('this is error')}
      
}
function registerfunc(client,email,password)
{
 var client= client;
    try{
        const mypromise= ()=>
        {
          return new Promise((resolve,reject)=>
          {
            client.connect( function(err) {
              db=client.db('chat');
              var users= db.collection('users');
              users.find({'name':email}).toArray((err,res)=>{
                if (err!=null) {resolve('no')
              return
              }
                if (res.length!=0){
                  resolve('no'); return;
                } 
                if (users.insertOne({'name':email,'password':password}))
                  {resolve('yes');return;}
                resolve('no');
              });
            });
          });
        }
        const fun = async ()=>
          {
            var x= await mypromise()
            return x;
          }
        var ret=fun()
        console.log(ret)
        return ret
      }
      catch(err) {console.log(err+'ook')}
      
}
exports.loginfunc= loginfunc;
exports.registerfunc=registerfunc;