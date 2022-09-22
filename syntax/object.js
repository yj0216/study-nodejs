var members = ['egoing', 'k8805', 'hoya'];
console.log(members[1]);
var i = 0;
while(i<members.length){
    console.log('array ',members[i]);
    i += 1;

}
var roles = {
    'programmer': 'egoing',//<-object 모든 data에 고유한 이름을 주어야함
    'designer': 'k8805',
    'manager': 'hoya'
}
console.log(roles.designer);

for(var name in roles){//name 안으로 roles 객체 안에 있는 내용을 집어넣음
    console.log('object => ',name, 'value => ',roles[name]);
}