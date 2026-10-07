import { useState } from 'react'
import Logo from '../../assets/logoimage.webp'
import Cookies from 'js-cookie'
import './index.css'


const Navbar = ({selectedBar})=>{
    const barData = [{id: 1, value: "Upload"}, {id: 2, value:"Interview"}, {id: 3, value:"Result"}]
    const [isVisible, updateVisible] = useState(false)
    const cookiesData = Cookies.get("jwtToken")
    const {username} = JSON.parse(cookiesData)
    console.log(username)
    return (
        <nav className='nav-container'>
            <div className='nav-logo-container'>
                <img src = {Logo} className='nav-image'/>
                <p>InterAlz</p>
            </div>
            <ul className='navigation-container'>
              {
                barData.map(eachBar=>
                    <li key = {eachBar.id}  className = {eachBar.value == selectedBar ? "selected-style": ""}>
                        <a>{eachBar.value}</a>
                    </li>
                )
              }
            </ul>
            <div className='profile-rapper' onClick = {()=> updateVisible(!isVisible)}>
                <div className = "profile-container">
                    <p>{username.slice(0, 2)}</p>
                </div>
                
            </div>
        </nav>
    )
}

export default Navbar