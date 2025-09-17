function test() {
        
    if (true) {
        var x = 10;   // function-scoped
    }

    console.log(x); // ✅ Works! x is visible here
}
console.log(x); // ❌ Error: x is not defined
test();