var fs = requirs('fs');
fs.readFile('sample.txt','utf8',function(err,data){
    console.log(data);
});