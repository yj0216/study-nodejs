var args = process.argv;
console.log(args[2]);
console.log('A');
console.log('B');
if(args[2] == '1')//안에 값에 따라 결과가 달라짐
console.log('C1');
else
console.log('C2');
console.log('D');

// PS C:\Users\USER\Desktop\종합\nodejs>  node syntax/conditional.js egoing(이름)
//   'C:\\Program Files\\nodejs\\node.exe',
//   'C:\\Users\\USER\\Desktop\\종합\\nodejs\\syntax\\conditional.js',
//   'egoing'
// ]
// A
// B
// C2
// D
//console.log(args[2]); ps에 3번쨰에 값을 출력함