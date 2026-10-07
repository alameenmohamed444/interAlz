def groupAnagrams(strs):
    groups = {}

    for word in strs:
        key = ''.join(sorted(word))

        if key not in groups:
            groups[key] = []

        groups[key].append(word)

    return list(groups.values())

test_cases = [{"testCaseId":1,"input":[["eat","tea","tan","ate","nat","bat"]],"expectedOutput":[["eat","tea","ate"],["tan","nat"],["bat"]]},{"testCaseId":2,"input":[[""]],"expectedOutput":[[""]]},{"testCaseId":3,"input":[["a"]],"expectedOutput":[["a"]]}]


import json

passed = 0

def normalize(value):
    if isinstance(value, list):
        # Recursively normalize nested lists
        normalized = [normalize(item) for item in value]

        # Sort nested groups so order does not matter
        if all(isinstance(item, list) for item in normalized):
            return sorted(
                normalized,
                key=lambda x: json.dumps(x, sort_keys=True)
            )

        return normalized

    return value


for i in range(len(test_cases)):

    tc = test_cases[i]

    try:
        args = tc["input"]

        result = groupAnagrams(*args)

        expected = tc["expectedOutput"]

        sorted_result = normalize(result)
        sorted_expected = normalize(expected)

        is_passed = sorted_result == sorted_expected

        if is_passed:
            passed += 1

        print(json.dumps({
            "testCaseId": tc["testCaseId"],
            "passed": is_passed,
            "expected": expected,
            "result": result
        }))

    except Exception as error:

        print(json.dumps({
            "testCaseId": tc["testCaseId"],
            "passed": False,
            "expected": tc["expectedOutput"],
            "result": str(error)
        }))


print(json.dumps({
    "total": len(test_cases),
    "passed": passed,
    "failed": len(test_cases) - passed
}))
