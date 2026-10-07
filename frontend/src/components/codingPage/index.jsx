import { useEffect, useState} from "react"

import './index.css'
import { TailSpin } from "react-loader-spinner";
import failure from '../../assets/failure.png'
import Cookies from "js-cookie"
import {useNavigate, useParams} from "react-router-dom";
import {v4 as uuidv4} from "uuid"
import Editor from '@monaco-editor/react'

const views = {
    success: "Success",
    failure: "Failure",
    loading: "Loading"
}


const CodingPage = ()=>{
    const navigate = useNavigate()
    const { id: codingId } = useParams()
    const navbarData = [{itemId: 1, item: "question"}, {itemId: 2, item: "playground"}]
    const [currentView, updateView] = useState(views.loading)
    const [codingData, updateCodingData] = useState(null)
    const [codingValue, updateCodingValue] = useState() 
    const [selected, updateSelected] = useState(navbarData[0].item)
    const languageList = [{id: 1, lang: "JavaScript"}, {id: 2, lang: "Python"}, {id: 3, lang: "Cpp"}, {id:4, lang: "Java"}]
    const [selectedLanguage, updateSelectedLanguage] = useState(languageList[0].lang)
    const [outputData, updateoutputData] = useState("")
    const userData = Cookies.get("jwtToken") 
    const [score, updateScore] = useState(0)
    const [timer, updateTimer] = useState(60 * 60)    
    const [isFinished, updateIsFinished] = useState(false)
    
    
    
    
    
    
    
    

    useEffect(()=>{
        if (!codingData) return 
        
        updateCodingValue(codingData.starterCode[0].code)
        
        
    
    }, [codingData])


    
    useEffect(()=>{
        const getCodingQuestion = async()=>{
            try{
                
                const {token} = JSON.parse(userData)
            
                const option = {
                method: "GET",
                headers:{
                    "Content-Type": "application/json",
                    accept: "application/json",
                    authorization: `Bearer ${token}`
                }
                }
                const response = await fetch(`http://localhost:3000/interview/questions/coding/${codingId}`, option)
                if(response.ok){
                    const data = await response.json()
                    console.log(data) 
                    updateCodingData(data.data[0])
                    
                    updateView(views.success)
                }
            }catch(error){
                console.log(error)

                updateView(views.failure)
            }
        }
        getCodingQuestion()
    }, [])


    useEffect(()=>{
    if(timer <= 0) {
        updateIsFinished(true)
        return
    }      
    const timeId = setInterval(()=>{
        updateTimer(prevTime => prevTime - 1)
    }, 1000)

    return ()=>clearInterval(timeId)
    }, [timer])


    const getValue = (value)=>{
         updateCodingValue(value)
    }

    const findSelectLanguage = (e)=>{
        updateSelectedLanguage(e.target.value)
        codingData.starterCode.filter(each=> each.language === e.target.value ? updateCodingValue(each.code): each)
    }

    const getTestcaseCode = (language,functionName)=>{
        if (language === "JavaScript"){
            return `
let passed = 0;

for (let i = 0; i < testCases.length; i++) {
const result = ${functionName}(...testCases[i].input);
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
`;
        }
        else if(language === "Python"){
            return `
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

        result = ${functionName}(*args)

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
`;
        }
        else if(language === "Java"){

            return `
int passed = 0;

for (int i = 0; i < testCases.length; i++) {

    try {

        String[] input = testCases[i];

        List<List<String>> result =
            ${functionName}(input);

        // Normalize result
        for (List<String> group : result) {
            Collections.sort(group);
        }

        Collections.sort(
            result,
            (a, b) -> a.toString().compareTo(b.toString())
        );

        List<List<String>> expected =
            expectedTestCases[i];

        for (List<String> group : expected) {
            Collections.sort(group);
        }

        Collections.sort(
            expected,
            (a, b) -> a.toString().compareTo(b.toString())
        );

        boolean isPassed = result.equals(expected);

        if (isPassed) {
            passed++;
        }

        System.out.println(
            "{\\"testCaseId\\":" +
            (i + 1) +
            ",\\"passed\\":" +
            isPassed +
            "}"
        );

    } catch (Exception error) {

        System.out.println(
            "{\\"testCaseId\\":" +
            (i + 1) +
            ",\\"passed\\":false}"
        );
    }
}

System.out.println(
    "{\\"total\\":" + testCases.length +
    ",\\"passed\\":" + passed +
    ",\\"failed\\":" +
    (testCases.length - passed) +
    "}"
);
`;

        }
        else if(language === "Cpp"){
            return `
int passed = 0;

for (int i = 0; i < testCases.size(); i++) {

    try {

        auto result = ${functionName}(testCases[i].input);

        auto expected = testCases[i].expectedOutput;

        // Normalize group order
        sort(result.begin(), result.end());
        sort(expected.begin(), expected.end());

        bool isPassed = (result == expected);

        if (isPassed) {
            passed++;
        }

        cout << "{"
             << "\\"testCaseId\\":" << testCases[i].testCaseId
             << ",\\"passed\\":" << (isPassed ? "true" : "false")
             << "}" << endl;

    }
    catch (...) {

        cout << "{"
             << "\\"testCaseId\\":" << testCases[i].testCaseId
             << ",\\"passed\\":false"
             << "}" << endl;
    }
}

cout << "{"
     << "\\"total\\":" << testCases.size()
     << ",\\"passed\\":" << passed
     << ",\\"failed\\":" << testCases.size() - passed
     << "}" << endl;
`;
        }
    }

    const runCode = async()=>{
          
        try{
            
            const {token} = JSON.parse(userData)
            
            const languageExecuter = getTestcaseCode(selectedLanguage, codingData.functionName)
            
            const options = {
                method: "POST",
                headers: {
                    "Content-Type":"application/json",
                    accept: "application/json",
                    authorization: `Bearer ${token}`
                }, 
                body: JSON.stringify({codingValue, selectedLanguage, testCases: codingData.testCases, execute:languageExecuter})
            }
            const response = await fetch("http://localhost:3000/interview/runcode", options)
            
            if(response.ok){
                const data = await response.json()
                console.log(data)  
                const passedMatches = data.data.match(/"passed":true/g)
                const passedCount = passedMatches ? passedMatches.length : 0 
                if(passedCount > score){
                    updateScore(passedCount)
                }
                updateoutputData(data.data)              
            }
    
    }catch(error){
        console.log(error)
    }
    
    }    

    const nextCoding = async()=>{
        try{
            const {token} = JSON.parse(userData)
            const rawOutput = outputData?.output || ""
            const passedMatches = rawOutput.match(/PASSED/g)
            const finalScore = passedMatches ? passedMatches.length : 0
            
            const options = {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    accept: "application/json",
                    authorization: `Bearer ${token}`
                },
                body: JSON.stringify({questionId:codingData.questionId, score: finalScore, isCompleted: true, code: codingValue})
            }
            const response = await fetch(`http://localhost:3000/interview/questions/update/coding/${codingId}`, options)
            if(response.ok){
                navigate("/interview", {replace:true})
            }
        
        }catch(error){
            updateView(views.failure)
        }
    }







    const formatOutput = (outputData)=>{
        if(!outputData) return
        const parsedOutput = outputData.trim().split("\n")
        return parsedOutput
    }




    const renderSuccessView = ()=>{
        const {title, difficulty, description} = codingData
        const passedMatches = outputData.match(/"passed"\s*:\s*true/g)
        const passedCount = passedMatches ? passedMatches.length : 0 
        const minutes = String(Math.floor(timer / 60)).padStart(2, "0")
        const seconds = String((timer % 60)).padStart(2, "0")

        const showOutput = formatOutput(outputData)
        
        return !isFinished ? (
            <div>

                <ul className="questions-navbar">
                    {
                      navbarData.map(each=>
                        <li key = {each.itemId}>
                        <button onClick = {()=> updateSelected(each.item)} className= {selected === each.item ? "selected-btn": "inter-btn"}>
                            <a>{each.item}</a>
                        </button>
                        </li>
                      )
                    }
                </ul>
                <div className="timer-container">
                    <h1>{minutes}: {seconds}</h1>
                </div>
                {selected === "question" && <div className="coding-question-container">
                    
                    <h2>{title}</h2>
                    
                    <p className= {difficulty === "Medium" ? "yellow": difficulty === "Easy" ? "green": "red"}>{difficulty}</p>
                    <p>{description}</p>

                    <ul className="examples-container">
                        <h2>Examples</h2>
                        {
                            codingData.testCases.map(each=>
                                <li key = {each.testCaseId}>
                                  <div>
                                    <p>Input: {JSON.stringify(each.input[0])}</p>
                                  </div>
                                  <div>
                                    <p>Output: {JSON.stringify(each.expectedOutput)}</p>
                                  </div>
                                </li>
                            )
                        }
                    </ul>


                    <ul className="instructions-container">
                        <h2>Instructions</h2>
                    {
                        codingData.instructions.map(each=>
                            <li key = {uuidv4()}>
                                {each}
                            </li>
                        )
                    }
                    </ul>
                        
                </div>}
                {selected === "playground" &&<div id = "CodingPlayground" className="coding-box">
                    <div>
                        <select className="language-options" onChange = {findSelectLanguage}>
                            {
                                languageList.map(each=>
                                    <option key = {each.id} value = {each.lang}>{each.lang}</option>
                                )
                            }
                        </select>
                    </div>    
                    <Editor
                     language= {selectedLanguage.toLowerCase()}
                     onChange= {getValue}
                     value= {codingValue}
                     theme="vs-dark"
                     height= "50vh"
                     options = {{
                        minimap:{enabled: false},
                        scrollBeyondLastLine: false,
                        lineNumbers: "on",
                        bracketPairColorization: {enabled:true},
                        autoClosingBrackets: 'always',
                        autoClosingQuotes: 'always',
                        matchBrackets: 'always',
                        formatOnPaste: true,
                        suggestOnTriggerCharacters: true,
                        folding: true,
                        smoothScrolling: true,
                        fixedOverflowWidgets: true
                     }}
                    />
                    <div className="run-btn-container">
                      <button className="run-btn" onClick = {runCode}>Run</button>
                      <p>Click once Wait</p>
                    </div>    
                    {outputData && <div className="output-section">
                       <h2>output</h2>
                       <div className="output-container">
                         <div>
                            <p className="whitespace-pre-line">{showOutput}</p>
                         </div>   
                       </div>
                       {passedCount === codingData.testCases.length && <div className = "next-coding-container">
                         <button onClick={nextCoding}>Next</button>
                       </div>} 
                    </div>}   
                </div>}
                
            </div>
        ): 
        (<div className="coding-score-section">
            <div className="coding-score-container">
              <h1>Score</h1>
              <p>Score: {score}</p>
              <p>{score === 3 ? "PASS": "FAIL"}</p>
              <button onClick={nextCoding} className="score-code-btn">Next</button>
            </div>
        </div>)

    }


    const renderFailureView = ()=>{
        return (
            <div className='failure-view'>
                <div>
                    <img src = {failure} alt = "image" className = "failure-image"/>
                </div>
                <h1>Faliure</h1>
                <p>Something Went Wrong</p>
                <p>Please try again Later</p>
            </div>
        )
    }
    
    const renderLoadingView = ()=>{
        return (
            <div className="loading-view">
                <TailSpin color="#4F46E5"/>
                <p>question Loading</p>
            </div>
        )
    }
        
    switch(currentView){
        case "Success":
            return renderSuccessView()
        case "Failure":
            return renderFailureView()
        case "Loading":
            return renderLoadingView()
        default: 
            return null            
    }
}

export default CodingPage