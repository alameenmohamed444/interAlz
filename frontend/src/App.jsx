import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {ProtectedRoute, LoginOrSignin} from './components/protectedRoute/index.jsx'
import Login from './components/Login/index.jsx'
import SignIn from './components/signin/index.jsx'
import UploadResume from './components/uploadResume/index.jsx'
import Interview from './components/interview'
import SkillsExtracted from './components/skiilsExtracted/index.jsx'
import McqPage from './components/mcqPage/index.jsx'
import CodingPage from './components/codingPage/index.jsx'
import RecordComponent from './components/audioInterview'
import Result from './components/result/index.jsx'
import NotFound from './components/notFound/index.jsx'

const App = ()=>{
    return (
    <BrowserRouter>
    <Routes>
      <Route path = "/login" element = {<LoginOrSignin><Login/></LoginOrSignin>}/> 
      <Route path = "/signin" element = {<LoginOrSignin><SignIn/></LoginOrSignin>}/>
      <Route path = "/uploadResume" element = {<ProtectedRoute><UploadResume/></ProtectedRoute>}/>
      <Route path = "/interview" element = {<ProtectedRoute><Interview/></ProtectedRoute>}/>
      <Route path = "/skills-extracted" element = {<ProtectedRoute><SkillsExtracted/></ProtectedRoute>}/>
      <Route path = "/mcq/:id" element = {<ProtectedRoute>
        <McqPage/>
      </ProtectedRoute>}/>
      <Route path = "/coding/:id" element = {<ProtectedRoute><CodingPage/></ProtectedRoute>}/>
      <Route path = "/audio/interview" element = {<ProtectedRoute><RecordComponent/></ProtectedRoute>}/>
      <Route path = "/interview/result" element = {<ProtectedRoute><Result/></ProtectedRoute>}/>
      <Route path = "*" element = {<NotFound/>}/>
    </Routes>
    </BrowserRouter>
    )
}

export default App