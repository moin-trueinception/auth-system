/*✔ Block scoped
✔ Re-assign allowed
 ✔Re-declare not allowed
 */
var a=10;
var a =20;
console.log("hello world",a);
console.log("hello world")

/*✔ Block scoped
✔ Re-assign allowed
❌ Re-declare not allowed
 */
let b=19
 b = 50
 console.log(b)

 /*✔ Block scoped
❌ Re-assign allowed
❌ Re-declare not allowed
 */
 const c = 99



 const appName = "my name is todo";
 function hello() {
    console.log(appName);
 }

 console.log(hello())

if(true){
    let x=10;
 }
 //console.log(x) they give error 

if(true){
    var y = "hello how are you"
 }
 console.log(y) // bad behaviour

 /* 3️⃣ Hoisting (Interview + Bug topic 🔥)

JavaScript code run hone se pehle memory me declare ho jata hai */

var z;
console.log(z);
 z = 20;