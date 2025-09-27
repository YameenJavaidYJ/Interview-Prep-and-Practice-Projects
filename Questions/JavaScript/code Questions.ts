// Array Majority Number
//     Q: Find majority element (appears > n/2 times)
//     A: Boyer-Moore Voting Algorithm - O(n) time, O(1) space

function majorityElement(nums) {
    let candidate = nums[0],
        count = 1;
    for (let i = 1; i < nums.length; i++) {
        count += nums[i] === candidate ? 1 : -1;
        if (count === 0) {
            candidate = nums[i];
            count = 1;
        }
    }
    return candidate;
}

// 2D Array Sort with Zeroes
// Q: Move all zeros to end while maintaining relative order
// A: Two-pointer approach or partition

function moveZeroes(nums) {
    let writeIndex = 0;
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== 0) nums[writeIndex++] = nums[i];
    }
    while (writeIndex < nums.length) nums[writeIndex++] = 0;
}
