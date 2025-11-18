//04_HtmlElements/index.js
document.addEventListener("DOMContentLoaded", () => {
    pageLoaded();
});


let in1;
let in2;
let btnRes;
let res;
function pageLoaded() {
    in1 = document.querySelector("#input1");
    in2 = document.querySelector("#input2");
    res = document.getElementById("lblRes");
    btnRes = document.getElementById("btnRes");
    btnRes.addEventListener("click", () => {
        calculate();
    });
}

const btn2 = document.getElementById("btn2");


btn2.addEventListener("click", () => {
    print("btn2 clicked" + btn2.id + "|" + btn2.innerText);
});

function calculate() {
    let in1txt = in1.value;
    let in2txt = in2.value;
    let num1 = parseInt(in1txt);
    let num2 = parseInt(in2txt);
    let sum = num1 + num2;
    res.innerText = sum;
}

/*btn2.addEventListener("click",func1());

function func1(){   }*/


function print(msg) {
    //get text area element reference
    const ta = document.getElementById("output");
    //--write to text area--
    if (ta) ta.value = msg;
    else console.log(msg);
}


function demoNative() {
    let out = "=== STEP 1: NATIVE TYPES ===\n";

    // String
    const s = "Hello World";
    out += "\n[String] s = " + s;
    out += "\nLength: " + s.length;
    out += "\nUpper: " + s.toUpperCase();

    // Number
    const n = 42;
    out += "\n\n[Number] n = " + n;

    // Boolean
    const b = true;
    out += "\n\n[Boolean] b = " + b;

    // Date
    const d = new Date();
    out += "\n\n[Date] now = " + d.toISOString();

    // Array
    const arr = [1, 2, 3, 4];
    out += "\n\n[Array] arr = [" + arr.join(", ") + "]";
    out += "\nPush 5 → " + (arr.push(5), arr.join(", "));
    out += "\nMap x2 → " + arr.map(x => x * 2).join(", ");

    // Functions as variables
    const add = function (a, b) { return a + b; };
    out += "\n\n[Function as variable] add(3,4) = " + add(3, 4);

    // Callback
    function calc(a, b, fn) { return fn(a, b); }
    const result = calc(10, 20, (x, y) => x + y);
    out += "\n[Callback] calc(10,20, x+y ) = " + result;

    print(out);
}
