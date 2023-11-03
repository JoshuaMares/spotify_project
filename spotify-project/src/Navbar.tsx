import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import './Navbar.css'

const Navbar = () => {
    return ( 
    <nav className="navbar">
        <h1><a href="/" className='site-title'>Spotify Mixers</a></h1>
        <div className='links'>
            <a href="/Settings"><FontAwesomeIcon icon={faGear}/></a>
        </div>
    </nav> );
}
 //look into this when creating settingshttps://www.youtube.com/watch?v=SLfhMt5OUPI&t=93s&ab_channel=WebDevSimplified
export default Navbar;