var offset="VidChatoffset";
var peer;
var stream;
function turnoncamera()
{
    navigator.mediaDevices.getUserMedia({video:true,audio:true}).then((stre)=>
    {
        stream=stre;
        document.getElementById('vid').srcObject= stre; 
});

}
function createpeer()
{
    peer= new Peer(offset+username);
    peer.on('call',function(call)
    {     
        call.answer(stream);
        call.on('stream',function(strea)
        {
            console.log('stream coming');
            document.getElementById('vid2').srcObject=strea
        })
    });
}
    function callpeer()
    {
        var call=peer.call(offset+otheruser,stream);
           console.log('called',call);
            call.on('stream',function(strea)
        {
            console.log('yes');
            document.getElementById('vid2').srcObject=strea;
        })
    }