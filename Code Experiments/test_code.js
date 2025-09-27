// function test() {
//     if (true) {
//         var x = 10; // function-scoped
//     }

//     console.log(x); // ✅ Works! x is visible here
// }
//console.log(x); // ❌ Error: x is not defined
//test();

// const test2 = (...args) => {
//     console.log(args);
// };

// test2(1, 2, 3);

// async function name() {
//     return await Promise.resolve({id: 2});
// }

// console.log(name());

// Pending Promise

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const rotation = (times) => {
    arr[-1] = 9;

    console.log(arr);
};

rotation(5);
