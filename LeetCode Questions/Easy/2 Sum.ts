/*
    Given an array of integers nums and an integer target, return indices of the 
    two numbers such that they add up to target.

    You may assume that each input would have exactly one solution, and you may not use the same element twice.
    You can return the answer in any order.

    Example 1:

    Input: nums = [2,7,11,15], target = 9
    Output: [0,1]
    Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
    Example 2:

    Input: nums = [3,2,4], target = 6
    Output: [1,2]
    Example 3:

    Input: nums = [3,3], target = 6
    Output: [0,1]
*/

// Solution 1: Hash Map (Optimal) - O(n) time, O(n) space
function twoSum(nums: number[], target: number): number[] {
    const numMap = new Map<number, number>();

    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];

        if (numMap.has(complement)) {
            return [numMap.get(complement)!, i];
        }

        numMap.set(nums[i], i);
    }

    return []; // Should never reach here given problem constraints
}

// Test cases
console.log("Hash Map Solution:");
console.log("Test 1:", twoSum([2, 7, 11, 15], 9)); // [0,1]
console.log("Test 2:", twoSum([3, 2, 4], 6)); // [1,2]
console.log("Test 3:", twoSum([3, 3], 6)); // [0,1]

/*
Time Complexity Analysis:

Hash Map Solution: O(n)
- Single pass through the array
- Map operations (has, get, set) are O(1) on average

Brute Force Solution: O(n²)
- Nested loops checking all pairs

Space Complexity Analysis:

Hash Map Solution: O(n)
- Map can store up to n elements in worst case

Algorithm Explanation (Hash Map):
1. Create a map to store number -> index pairs
2. For each number, calculate its complement (target - current number)
3. If complement exists in map, return the indices
4. Otherwise, store current number and its index in the map
5. This ensures we find the pair in a single pass

Why Hash Map is Optimal:
- Avoids nested loops
- Single pass through the array
- Trade space for time efficiency
- Most commonly used approach in interviews
*/
