function getmessages(client,from,to)
{
    var client= client;
    try{
        const mypromise= ()=>
        {
          return new Promise((resolve,reject)=>
          {
            client.connect( function(err) {
              db=client.db('chat');
              var mi,ma;
              ma=from>to?from:to;
              mi=from>to?to:from;
              console.log(ma+" "+mi);
              var users= db.collection(ma+" "+mi);
              users.find({}).toArray((err,res)=>{
                if (err!=null) reject();
                resolve(res);
              });
            });
          });
        }
        const fun = async ()=>
          {
            var x= await mypromise()
            console.log('yes')
            return x;
          }

        var ret=fun()
        //client.close()
        return ret
      }
      catch(err) {console.log('this is error')}
}

function putmessages(client,from,to,mess){
    var client= client;
    try{
        const mypromise= ()=>
        {
          return new Promise((resolve,reject)=>
          {
            client.connect( function(err) {
              db=client.db('chat');
              var mi,ma;
              ma=from>to?from:to;
              mi=from>to?to:from;
              console.log(ma+" "+mi+" hhh");
              var users= db.collection(ma+" "+mi);
              if(users.insertOne({'from':from,'message':mess}))
              resolve('yes')
              else
              resolve('no')
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
exports.getmessages=getmessages
exports.putmessages=putmessages