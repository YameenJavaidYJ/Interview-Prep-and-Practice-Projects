function test() {
        
    if (true) {
        var x = 10;   // function-scoped
    }

    console.log(x); // ✅ Works! x is visible here
}
//console.log(x); // ❌ Error: x is not defined
//test();


const test2 = (...args)  => {
    console.log(args)
}


test2(1,2,3);

async function name() {
    return await Promise.resolve({ id: 2 });
}

console.log(name());