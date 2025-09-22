/* 
    -> You are given an integer array height of length n. 
    -> There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).
    -> Find two lines that together with the x-axis form a container, such that the container contains the most water.
    -> Return the maximum amount of water a container can store.
    -> Notice that you may not slant the container.
    
    Input: height = [1,8,6,2,5,4,8,3,7]
    Output: 49
    Explanation: 
                The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. 
                In this case, the max area of water (blue section) the container can contain is 49.

*/

function maxArea(height: number[]): number {
    let left = 0;
    let right = height.length - 1;
    let maxWater = 0;

    while (left < right) {
        // Calculate current area
        const width = right - left;
        const currentHeight = Math.min(height[left], height[right]);
        const currentArea = width * currentHeight;

        // Update maximum water found so far
        maxWater = Math.max(maxWater, currentArea);

        // Move the pointer with smaller height
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }

    return maxWater;
}

// Test cases
console.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])); // Expected: 49
console.log(maxArea([1, 1])); // Expected: 1
console.log(maxArea([4, 3, 2, 1, 4])); // Expected: 16
console.log(maxArea([1, 2, 1])); // Expected: 2
