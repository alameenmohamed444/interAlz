function groupAnagrams(strs) {
    const groups = {};

    for (let str of strs) {
        // Sort characters to create a common key
        const key = str.split("").sort().join("");

        // Create group if it doesn't exist
        if (!groups[key]) {
            groups[key] = [];
        }

        // Add the original word
        groups[key].push(str);
    }

    return Object.values(groups);
    
}

const testCases = [{"testCaseId":1,"input":[["eat","tea","tan","ate","nat","bat"]],"expectedOutput":[["eat","tea","ate"],["tan","nat"],["bat"]]},{"testCaseId":2,"input":[[""]],"expectedOutput":[[""]]},{"testCaseId":3,"input":[["a"]],"expectedOutput":[["a"]]}]


let passed = 0;

for (let i = 0; i < testCases.length; i++) {
const result = groupAnagrams(...testCases[i].input);
const expected = testCases[i].expectedOutput;

// Sort copies before comparing
const sortedResult = [...result].sort((a, b) => a - b);
const sortedExpected = [...expected].sort((a, b) => a - b);

const isPassed =
    JSON.stringify(sortedExpected) === JSON.stringify(sortedResult);

if (isPassed) {
    passed++;
}

console.log(
    JSON.stringify({
        testCaseId: testCases[i].testCaseId,
        passed: isPassed,
        expected: expected,
        result: result
    })
);
}

console.log(
JSON.stringify({
    total: testCases.length,
    passed: passed,
    failed: testCases.length - passed
})
);
