import ChatContainer from '../../components/ChatContainer/ChatContainer'
import Right from '../../components/Right/Right'
import './Homepage.css'

function Homepage() {
  return (
    <div className='home-page'>
       <div className="home-container">
         <div className="home-container-left">
            <ChatContainer/>
         </div>
         <div className="home-container-right">
            <Right/>
         </div>
       </div>
    </div>
  )
}

export default Homepage
