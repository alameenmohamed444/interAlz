const { exec } = require("child_process")
const { promisify } = require("util")
const fs = require("fs")
const path = require("path")


const runCode = async (req, res, next)=>{
    try{
        const {codingValue, selectedLanguage, testCases, execute} = req.body;
        const executeCode = promisify(exec)
        if(selectedLanguage === "Python"){
            const filePath = path.join(__dirname, "../codeFolder/userCode.py")
            const formatTestCase = `test_cases = ${JSON.stringify(testCases)}`
            await fs.promises.writeFile(filePath, codingValue + "\n\n" + formatTestCase + "\n\n" + execute)
            console.log("executing")
            const {stdout, stderr} = await executeCode(`python "${filePath}"`, {timeout: 5000})               
            console.log(stderr, stdout)
            return stderr ? res.status(200).json({data:stderr}): res.status(200).json({data:stdout})   
        }
        else if(selectedLanguage === "JavaScript"){
            console.log("started")
            const formatTestCase = `const testCases = ${JSON.stringify(testCases)}`
            const filePath = path.join(__dirname, "../codeFolder/userCode.js")
            await fs.promises.writeFile(filePath, codingValue + "\n\n" + formatTestCase + "\n\n" + execute)
            console.log("executing")
            const {stdout, stderr} = await executeCode(`node "${filePath}"`, {timeout: 5000})               
            console.log(stderr, stdout)
            
            return stderr ? res.status(200).json({data:stderr}): res.status(200).json({data:stdout})
            
        
        }
        else if (selectedLanguage === "C++"){
            const filePath = path.join(__dirname, "../codeFolder/userCode.py")
            const exePath = path.join(__dirname, "../codeFolder/userCode.exe");
            const formatCppValue = (value) => {
    if (typeof value === "string") {
        return `"${value.replace(/"/g, '\\"')}"`;
    }

    if (typeof value === "number") {
        return String(value);
    }

    if (Array.isArray(value)) {
        return `{${value.map(formatCppValue).join(", ")}}`;
    }

    return "nullptr";
            };

            const formatCppTestCases = (testCases) => {
                return `
            struct TestCase {
                int testCaseId;
                vector<vector<string>> input;
                vector<vector<string>> expectedOutput;
            };

            vector<TestCase> testCases = {
            ${testCases.map(tc => `    {
                    ${tc.testCaseId},
                    ${formatCppValue(tc.input)},
                    ${formatCppValue(tc.expectedOutput)}
                }`).join(",\n")}
            };
            `;
            };
            const formatTestCase = formatCppTestCases(testCases);
            await fs.promises.writeFile(filePath, codingValue + "\n\n" + formatTestCase + "\n\n" + execute)
            
            console.log("executing")
            const compileCommand = `g++ "${filePath}" -o "${exePath}"`;

            const { stdout: compileOut, stderr: compileErr } =
                await executeCode(compileCommand, { timeout: 5000 });

            if (compileErr) {
                return res.status(200).json({
                    data: compileErr
                });
            }

            const { stdout, stderr } =
                await executeCode(`"${exePath}"`, { timeout: 5000 });

            return res.status(200).json({
                data: stderr || stdout
            });
            
        
        }
        else if (selectedLanguage === "Java"){
            const filePath = path.join(__dirname, "../codeFolder/userCode.py")
            const formatJavaString = (value) => {
    return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
            };

            const formatJava2DArray = (value) => {
                return `new String[][] {
                    ${value.map(row =>
                        `{${row.map(formatJavaString).join(", ")}}`
                    ).join(",\n        ")}
                }`;
            };

            const formatJavaTestCases = (testCases) => {
                return `
            class TestCase {
                int testCaseId;
                String[][] input;
                String[][] expectedOutput;

                TestCase(
                    int testCaseId,
                    String[][] input,
                    String[][] expectedOutput
                ) {
                    this.testCaseId = testCaseId;
                    this.input = input;
                    this.expectedOutput = expectedOutput;
                }
            }

            TestCase[] testCases = {
            ${testCases.map(tc => `    new TestCase(
                    ${tc.testCaseId},
                    ${formatJava2DArray(tc.input)},
                    ${formatJava2DArray(tc.expectedOutput)}
                )`).join(",\n")}
            };
            `;
            };

            const formatTestCase = formatJavaTestCases(testCases);

            await fs.promises.writeFile(
                filePath,
                `import java.util.*;

            ${codingValue}

            ${formatTestCase}

            ${execute}`
            );


            await fs.promises.writeFile(
    filePath,
    `import java.util.*;

${codingValue}

${formatTestCase}

${execute}`
            );

            const { stdout: compileOut, stderr: compileErr } =
                await executeCode(`javac "${filePath}"`, {
                    timeout: 5000
                });

                if (compileErr) {
                    return res.status(200).json({
                        data: compileErr
                    });
                }

                const { stdout, stderr } =
                    await executeCode(
                        `java -cp "${path.dirname(filePath)}" Main`,
                        { timeout: 5000 }
                    );

                return res.status(200).json({
                    data: stderr || stdout
                });


        }

        
    } catch (error) {

        next(error)
    }
}

module.exports = runCode