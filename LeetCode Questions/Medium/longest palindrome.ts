/**
    Given a string s, return the longest palindromic substring in s.

    Example 1:

    Input: s = "babad"
    Output: "bab"
    Explanation: "aba" is also a valid answer.

    Example 2:

    Input: s = "cbbd"
    Output: "bb" 
 */

function longestPalindrome(s: string): string {
    if (s.length < 2) return s;

    let start = 0;
    let maxLen = 1;

    // Helper function to expand around center
    function expandAroundCenter(left: number, right: number): number {
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            left--;
            right++;
        }
        return right - left - 1;
    }

    for (let i = 0; i < s.length; i++) {
        // Check for odd-length palindromes (center is at i)
        let len1 = expandAroundCenter(i, i);

        // Check for even-length palindromes (center is between i and i+1)
        let len2 = expandAroundCenter(i, i + 1);

        // Get the maximum length
        let len = Math.max(len1, len2);

        // Update start and maxLen if we found a longer palindrome
        if (len > maxLen) {
            maxLen = len;
            start = i - Math.floor((len - 1) / 2);
        }
    }

    return s.substring(start, start + maxLen);
}

console.log(longestPalindrome("babad"));
console.log(longestPalindrome("cbbd"));
