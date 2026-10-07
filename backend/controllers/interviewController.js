const {GoogleGenAI} = require('@google/genai')

const {updateQuestion, getQuestions} = require("../services/resumeData")


const interviewQuestions = async (req, res, next)=>{
    try{

        
        const {Languages, FrameworksAndLibraries, DatabasesAndCloud, ToolsAndAI, username} = req.body
        const llm = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY})

        const prompt = `
            You are an expert technical interviewer and coding assessment designer.

            You must generate a personalized technical interview based on the candidate's skills.

            CANDIDATE SKILLS:

            Languages:
            ${JSON.stringify(Languages)}

            Frameworks and Libraries:
            ${JSON.stringify(FrameworksAndLibraries)}

            Databases and Cloud:
            ${JSON.stringify(DatabasesAndCloud)}

            Tools and AI:
            ${JSON.stringify(ToolsAndAI)}


            INTERVIEW REQUIREMENTS

            Generate:

            1. Exactly 2 MCQ rounds.
            2. Each MCQ round must contain exactly 5 questions.
            3. Exactly 2 coding questions.
            4. Generate 15 interview questions on the ${Languages}, ${FrameworksAndLibraries}, ${DatabasesAndCloud}, ${ToolsAndAI} 


            ----------------------------------------------
            INTERVIEW QUESTION RULES
            -----------------------------------------------
              Do ask questions which not relavent to the mentioned skills
              generate  question 5 EASY 5 MEDIUM 5 HARD 
              first quetion with the questionId 1 should be a question about self introduction and like how 
              the interviewer Start and interview with a question be friendly as well  
            --------------------------------------------------
            MCQ RULES
            --------------------------------------------------

            Generate MCQ questions based on the candidate's actual technical skills.

            The MCQ questions can cover:
            - Programming languages
            - Frameworks
            - Databases
            - Backend concepts
            - Frontend concepts
            - APIs
            - Tools
            - AI
            - Software engineering concepts

            Do not ask questions about technologies that are not present in the candidate's skills.

            Each MCQ must contain:
            - question
            - exactly 4 options
            - correctAnswer
            - explanation
            - topic
            - difficulty


            --------------------------------------------------
            CODING QUESTION RULES
            --------------------------------------------------

            The coding questions MUST be determined using the following priority rules.

            RULE 1 — BACKEND CANDIDATE

            If the candidate has backend-related technologies such as:
            Node.js, Express, Python backend frameworks, Java, Spring, Django, Flask, FastAPI, PHP, Laravel, Ruby, Rails, C#, .NET, Go, or backend/database/API related technologies:
            
            Generate EXACTLY 2 DSA / programming problems.
            Do NOT generate React, HTML, CSS or UI-building questions for these coding questions.

            RULE 2 — FRONTEND-ONLY CANDIDATE

            If the candidate does NOT have backend technologies and their skills are primarily frontend:
            Generate EXACTLY 2 practical frontend coding questions.

            RULE 3 — LANGUAGE SELECTION

            The primary language for the coding question must come from the candidate's Languages list.

            RULE 4 — CODING QUESTION DIFFICULTY

            Generate interview-level questions (Medium difficulty).

            RULE 5 — TEST CASES

            Every coding question MUST contain at least 3 test cases.

          Test cases must contain REAL executable values, not placeholder text.

          The "input" field must contain ONLY the actual input value.

          IMPORTANT:
          - For string inputs, do NOT include quotation marks as part of the string value.
          - Correct: "input": "abcabcbb"
          - Incorrect: "input": "\"abcabcbb\""
          - Correct: "input": "bbbbb"
          - Incorrect: "input": "\"bbbbb\""

          - For integer inputs, use JSON numbers.
            Correct: "input": 10
            Incorrect: "input": "10"

          - For array inputs, use JSON arrays.
            Correct: "input": [1, 2, 3, 4]
            Incorrect: "input": "[1,2,3,4]"

          - For multiple parameters, "input" MUST be a JSON array containing
            the parameters in the same order as the function parameters.

            Example:
            functionName: "twoSum"
            parameters: nums, target

            Correct:
            "input": [[2,7,11,15], 9]

            Incorrect:
            "input": "[[2,7,11,15],9]"

          - "expectedOutput" MUST use the correct JSON data type matching the
            function's actual return type.

            Integer return:
            "expectedOutput": 3

            String return:
            "expectedOutput": "hello"

            Boolean return:
            "expectedOutput": true

            Array return:
            "expectedOutput": [1, 2, 3]

          NEVER store expected numeric values as strings.

          NEVER add extra quotation marks around string input values.

          The test cases must be directly usable by a program without requiring
          additional parsing of the individual input values.

          RULE 6 TEST CASE INPUT STRUCTURE:

            The "input" field represents the arguments passed to the function.

            Therefore, "input" MUST ALWAYS be an array where each element
            represents one function parameter.

            Examples:

            If the function is:

            function groupAnagrams(strs)

            where strs is an array of strings, use:

            "input": [
                ["eat", "tea", "tan", "ate", "nat", "bat"]
            ]

            NOT:

            "input": ["eat", "tea", "tan", "ate", "nat", "bat"]

            If the function is:

            function twoSum(nums, target)

            use:

            "input": [
                [2, 7, 11, 15],
                9
            ]

            If the function is:

            function add(a, b)

            use:

            "input": [
                5,
                3
            ]

            The number of elements in "input" MUST exactly match the number
            of parameters in the generated function.

            RULE 7 — DYNAMIC STARTER CODE

            The "starterCode" parameter MUST be an array of objects containing starter code tailored specifically to the generated coding problem for 4 languages: "JavaScript", "Python", "Java", and "C++".

            Requirements for starterCode objects:
            - Each object must have keys: "language" (string) and "code" (string).
            - The starter code must dynamically adapt to the problem's requirements, parameter names, type signatures, and the exact "functionName" defined for the question.
            - Do NOT include the solution logic—only the function declaration, parameters, and return statement placeholder.
            - Format multi-line code properly inside JSON string values.


            --------------------------------------------------
            OUTPUT FORMAT
            --------------------------------------------------

            Return ONLY valid JSON.
            Do NOT use Markdown formatting or \`\`\`json wrappers.

            {
              "mcqRounds": [
                {
                  "roundId": 1,
                  "title": "MCQ Round 1",
                  "isCompleted": "false",
                  "score": "0",
                  "questions": [
                    {
                      "questionId": 1,
                      "question": "Question text",
                      "options": [
                        "Option A",
                        "Option B",
                        "Option C",
                        "Option D"
                      ],
                      "correctAnswer": "Option A",
                      
                      "explanation": "Short explanation",
                      "topic": "JavaScript",
                      "difficulty": "Medium"
                    }
                  ]
                },
                {
                  "roundId": 2,
                  "title": "MCQ Round 2",
                  "isCompleted": "false",
                  "score": "0",
                  "questions": [
                    {
                      "questionId": 1,
                      "question": "Question text",
                      "options": [
                        "Option A",
                        "Option B",
                        "Option C",
                        "Option D"
                      ],
                      "correctAnswer": "Option B",
                      "explanation": "Short explanation",
                      "topic": "JavaScript",
                      "difficulty": "Medium"
                    }
                  ]
                }
              ],
              "codingQuestions": [
                {
                  "questionId": 1,
                  "title": "Coding Question Title",
                  "description": "Detailed problem description",
                  "category": "DSA",
                  "language": "JavaScript",
                  "difficulty": "Medium",
                  "isCompleted": "false",
                  "score": "0",
                  "instructions": [
                    "Instruction 1",
                    "Instruction 2"
                  ],
                  "functionName": "solveProblem",
                  "starterCode": [
                    {
                      "language": "JavaScript",
                      "code": "// Generate JavaScript starter code dynamically matching functionName and parameters"
                    },
                    {
                      "language": "Python",
                      "code": "# Generate Python starter code dynamically matching functionName and parameters"
                    },
                    {
                      "language": "Java",
                      "code": "// Generate Java starter code dynamically matching functionName, types, and parameters"
                    },
                    {
                      "language": "Cpp",
                      "code": "// Generate C++ starter code dynamically matching functionName, types, and parameters"
                    }
                  ],
                  "testCases": [
                    {
                      "testCaseId": 1,
                      "input": "Input",
                      "expectedOutput": "Expected output"
                    },
                    {
                      "testCaseId": 2,
                      "input": "Input",
                      "expectedOutput": "Expected output"
                    },
                    {
                      "testCaseId": 3,
                      "input": "Input",
                      "expectedOutput": "Expected output"
                    }
                  ]
                }
              ]

              interviewQuestions: [

                {
                  questionId : 1,
                  question: ""
                }


              
              ]

            }


            FINAL VALIDATION:

            Before returning the response, verify:

            - "starterCode" is an array of objects where each object contains "language" and "code".
            - The code inside "starterCode" dynamically reflects the generated question's functionName and expected parameters for JavaScript, Python, Java, and C++.
            - Exactly 2 MCQ rounds (5 questions each) and 2 coding questions exist.
            - Return only valid JSON without markdown block wrappers.
            `;


        
          const isQuestionExists = await getQuestions(username)        

          if(isQuestionExists){
            return res.status(200).json({data:isQuestionExists})
          }

          const response = await llm.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: prompt
          })
          const text = response.text
          const dbData = await updateQuestion(text, username)
      
          res.status(200).json({message: "success", data: dbData})

    }catch(error){
        next(error)
    }
}

module.exports = interviewQuestions