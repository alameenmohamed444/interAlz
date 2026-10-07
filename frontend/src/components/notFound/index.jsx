import './index.css'
import notFound from '../../assets/notfound.png'
const NotFound = ()=>{
    return (
        <div className='notfound-section'>
            <div className='notfound-container'>
                <h1>Not Found</h1>
                <div>
                    <img src = {notFound} alt='logo' className='image'/>
                </div>
                <p>The Page you are looking for is not available</p>
            </div>
        </div>
    )
}

export default NotFound