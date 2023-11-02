import './Navbar.css'

const Navbar = () => {
    return ( 
    <nav className="navbar">
        <h2><a href="/" className='site-title'>Spotify Party Blend</a></h2>
        <ul className='links'>
            <li><a href="/Settings">Settings</a></li>
        </ul>
    </nav> );
}
 //look into this when creating settingshttps://www.youtube.com/watch?v=SLfhMt5OUPI&t=93s&ab_channel=WebDevSimplified
export default Navbar;