var fs = require('fs');

//readFileSync
//console.log('A');
// var result = fs.readFileSync('syntax/sample.txt','utf8');//동기(순차적) sample 파일을 읽음
// console.log(result);
//console.log('B');//실행 결과 -> A sample.txt내용 B
console.log('A');
var result = fs.readFile('syntax/sample.txt'/*1*/,'utf8',function(err,result){/*2*/
    console.log(result);
});//비동기(병렬적)
console.log('B')//실행결과 -> A B sample.txt내용