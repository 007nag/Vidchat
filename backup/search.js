function search(client,name)
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
              var pattern = ".*"+name+".*";
              users.find({'name':{$regex:pattern,$options:'i'}}).toArray((err,res)=>{
                if (err!=null) reject();
                resolve(res);
              });
            });
          });
        }
        const fun = async ()=>
          {
            var x= await mypromise();return x;
          }
        var ret=fun()
        //client.close()
        return ret
      }
      catch(err) {}
}
exports.search= search;