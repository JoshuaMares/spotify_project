import './Navbar.css'

const Navbar = () => {
    return ( <nav className="navbar">
        <h1>Spotify Party Blend</h1>
        <div className="links">
            <a href="/">Home</a>
            <a href="/Logout">Log Out</a>
            <a href="/Settings">Settings</a>
        </div>
    </nav> );
}
 
export default Navbar;