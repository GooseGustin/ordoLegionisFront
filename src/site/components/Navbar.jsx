import axios from 'axios';
import { Link, NavLink, useNavigate } from 'react-router-dom'
import Logo from "../../assets/Ordo Legionis - Mark.svg"
import { BASEURL } from '../functionVault';

const Navbar = () => {
    const navigate = useNavigate();
    // const isLoggedIn = true;

    const handleLogout = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const refreshToken = localStorage.getItem("refreshToken");

            if (accessToken && refreshToken) {
                const config = {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    }
                };
                await axios.post(
                    BASEURL + 'accounts/logout/', { "refresh": refreshToken }, config
                )
                localStorage.removeItem("accessToken")
                localStorage.removeItem("refreshToken")
                // setIsLoggedIn(false); 
                // setUsername('');
                console.log('Logging out');
                navigate('/account/login');
            }
        } catch (err) {
            console.log("Failed to log out", err.response?.data || err.message)
        }
    }
    return (
        <div>
            <div className="container">
                <nav class="navbar fixed-top navbar-expand-lg navbar-dark bg-dark">
                    <div class="container-fluid">
                        {/* Logo */}
                        <Link class="navbar-brand text-white fs-4 text-decoration-none" to="/praesidium"><img src={Logo} alt="" className='nav-logo' /> OrdoLegionis</Link>
                        {/* <a class="navbar-brand" href="#">Navbar</a> */}
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        
                        <div class="sider collapse navbar-collapse" id="navbarNavAltMarkup">
                            <div class="navbar-nav">
                                <Link class="nav-link text-white mx-4" to="/praesidium">Home</Link>
                                <Link class="nav-link text-white mx-4" to="/notifications">
                                    <span className="icon">
                                        <i class="fa-solid fa-bell"></i> Notifications
                                    </span>
                                </Link>
                                <a class="nav-link disabled mx-2 text-decoration-none" href="#">Resources</a>
                                {/* <a class="nav-link disabled mx-2 text-decoration-none" href="#" tabindex="-1" aria-disabled="true">Upgrade</a> */}
                                <Link onClick={handleLogout}
                                    className='nav-link text-white text-decoration-none mx-2'
                                >
                                    <span className="icon">
                                        <i class="fa-solid fa-arrow-right-from-bracket"></i>
                                    </span> Logout
                                </Link>
                            </div>
                        </div>
                        
                    </div>
                </nav>
            </div>
        </div>

    )
}

const Navbar2 = () => {
    const navigate = useNavigate();
    const isLoggedIn = true;

    const handleLogout = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const refreshToken = localStorage.getItem("refreshToken");

            if (accessToken && refreshToken) {
                const config = {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    }
                };
                await axios.post(
                    BASEURL + 'accounts/logout/', { "refresh": refreshToken }, config
                )
                localStorage.removeItem("accessToken")
                localStorage.removeItem("refreshToken")
                // setIsLoggedIn(false); 
                // setUsername('');
                console.log('Logging out');
                navigate('/account/login');
            }
        } catch (err) {
            console.log("Failed to log out", err.response?.data || err.message)
        }
    }

    return (
        <div className="">
            {/* Navbar */}
            <nav class="navbar navbar-expand-lg fixed-top navbar-dark bg-dark">
                <div class="container">
                    {/* Logo */}
                    <Link class="navbar-brand text-white fs-4 text-decoration-none" to="/praesidium"><img src={Logo} alt="" className='nav-logo' /> OrdoLegionis</Link>

                    {/* Toggle button  */}
                    <button class="navbar-toggler shadow-none border-0" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    {/* Sidebar */}
                    <div class="sider offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                        {/* Sidebar header */}
                        <div class="offcanvas-header text-white border-bottom ">
                            <h5 class="offcanvas-title" id="offcanvasNavbarLabel"></h5>
                            <button type="button" class="btn-close btn-close-white shadow-none" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>

                        {/* Sidebar body */}
                        <div class="offcanvas-body d-flex flex-column flex-lg-row p-4 p-lg-0">
                            <ul class="navbar-nav justify-content-center align-items-center flex-grow-1 fs-5 flex-grow-1 pe-3">
                                {/* <li class="nav-item mx-2">
                                    <NavLink class="nav-link text-white text-decoration-none" aria-current="page" to="/">Home</NavLink>
                                </li>
                                <li class="nav-item mx-2">
                                    <NavLink class="nav-link text-white text-decoration-none" to="/praesidium">Praesidia</NavLink>
                                </li> */}
                                {/* <li class="nav-item mx-2">
                                    <NavLink class="nav-link text-white text-decoration-none" to="/resources">Resources</NavLink>
                                </li>
                                <li class="nav-item mx-2">
                                    <NavLink class="nav-link text-white text-decoration-none" to="/store">Store</NavLink>
                                </li>
                                <li class="nav-item mx-2">
                                    <NavLink class="nav-link text-white text-decoration-none" to="/pricing">Pricing</NavLink>
                                </li> */}
                                <li class="nav-item mx-2">
                                    <NavLink class="nav-link text-white text-decoration-none fs-5" to="/notifications">
                                        <span className="icon">
                                            <i class="fa-solid fa-bell"></i> {/* Notifications */}
                                        </span>
                                    </NavLink>
                                </li>
                            </ul>

                            {/* <form class="d-flex mt-3" role="search">
                                <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                                <button class="btn btn-outline-success" type="submit">Search</button>
                            </form> */}

                            {/* Login / Sign up */}
                            <div className="d-flex flex-column flex-lg-row justify-content-center align-items-center gap-3">
                                {/* {!isLoggedIn 
                                ? (
                                    <>
                                    <NavLink 
                                        to='account/login' 
                                        className='text-succesds text-decoration-none'
                                        style={{color: '#09fcf4'}}
                                        >Login</NavLink>
                                    <NavLink 
                                        to='account/register' 
                                        className='text-infho text-decoration-none ' // px-3 py-1 ms-2 rounded-4'
                                        style={{color: '#09fcf4'}}
                                    >Sign up</NavLink>
                                    <NavLink 
                                        onClick={handleLogout}
                                        className='text-white text-decoration-none'
                                    >
                                        <span className="icon">
                                            <i class="fa-solid fa-arrow-right-from-bracket"></i>
                                        </span> <span></span></NavLink>
                                    </>
                                )
                                :  <NavLink 
                                        onClick={handleLogout}
                                        className='nav-link text-white text-decoration-none'
                                    >
                                        <span className="icon">
                                        <i class="fa-solid fa-arrow-right-from-bracket"></i>
                                        </span> Logout
                                    </NavLink>
                                }    */}
                                <NavLink
                                    onClick={handleLogout}
                                    className='nav-link text-white text-decoration-none'
                                >
                                    <span className="icon">
                                        <i class="fa-solid fa-arrow-right-from-bracket"></i>
                                    </span> Logout
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar

