function a(){
    console.log('A');
}
//익명 함수 변수만으로 함수 출력 가능
var a = function(){
    console.log('A');
}

function slowfunc(callback){//변수 a(함수)를 callback이라는 매개 변수로 받음
    callback();//a 실행
}

slowfunc(a);//a를 인자로 보냄