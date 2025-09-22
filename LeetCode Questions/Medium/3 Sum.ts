/*
    Given an integer array nums, return all the triplets 

    [nums[i], nums[j], nums[k]] such that 
    
        i != j,
        i != k, 
        j != k, 
        nums[i] + nums[j] + nums[k] == 0.

    Notice that the solution set must not contain duplicate triplets.

    Example 1:

    Input: nums = [-1,0,1,2,-1,-4]  
    Output: [[-1,-1,2],[-1,0,1]]
    Explanation: 
    nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0.
    nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0.
    nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0.
    The distinct triplets are [-1,0,1] and [-1,-1,2].
    Notice that the order of the output and the order of the triplets does not matter.
    Example 2:

    Input: nums = [0,1,1]
    Output: []
    Explanation: The only possible triplet does not sum up to 0.
    Example 3:

    Input: nums = [0,0,0]
    Output: [[0,0,0]]
    Explanation: The only possible triplet sums up to 0. 

    */

function threeSum(nums: number[]): number[][] {
    const result: number[][] = [];

    // Sort the array to enable two-pointer technique
    // Sorting takes O(n log n)
    nums.sort((a, b) => a - b);

    for (let i = 0; i < nums.length - 2; i++) {
        // Skip duplicates for the first element
        if (i > 0 && nums[i] === nums[i - 1]) {
            // skip the iteration
            continue;
        }

        let left = i + 1;
        let right = nums.length - 1;

        while (left < right) {
            const sum = nums[i] + nums[left] + nums[right];

            if (sum === 0) {
                result.push([nums[i], nums[left], nums[right]]);

                // Skip duplicates for the second element
                while (left < right && nums[left] === nums[left + 1]) {
                    left++;
                }

                // Skip duplicates for the third element
                while (left < right && nums[right] === nums[right - 1]) {
                    right--;
                }

                left++;
                right--;
            } else if (sum < 0) {
                left++;
            } else {
                right--;
            }
        }
    }

    return result;
}

// Test cases
console.log("Test 1:", threeSum([-1, 0, 1, 2, -1, -4])); // [[-1,-1,2],[-1,0,1]]
console.log("Test 2:", threeSum([0, 1, 1])); // []
console.log("Test 3:", threeSum([0, 0, 0])); // [[0,0,0]]

/*
Time Complexity: O(n²)
- Sorting takes O(n log n)
- The nested loop (outer loop + two pointers) takes O(n²)
- Overall: O(n log n) + O(n²) = O(n²)

Space Complexity: O(1) (excluding the output array)
- We only use a constant amount of extra space for variables

Algorithm Explanation:
1. Sort the array to enable the two-pointer technique
2. Fix the first element (i) and use two pointers (left, right) for the remaining elements
3. If sum equals 0, add to result and skip duplicates
4. If sum is less than 0, move left pointer right
5. If sum is greater than 0, move right pointer left
6. Skip duplicates to avoid duplicate triplets in the result
*/
