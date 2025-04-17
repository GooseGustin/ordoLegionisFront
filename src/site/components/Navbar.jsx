import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import Logo from "../../assets/Ordo Legionis - Mark.svg"
import { BASEURL } from '../functionVault';

const Navbar = () => {
    const navigate = useNavigate();
    const isLoggedIn = true; 
    
    // const [isAuthorized, setIsAuthorized] = useState(null);
    
    // useEffect(() => {
    //     auth().catch(() => setIsAuthorized(false))
    // }, [])

    // const refreshToken = async () => {
    //     const refreshToken = localStorage.getItem(refreshToken) 
    //     try {
    //         const res = await axios.post(BASEURL + 'token/refresh/', {
    //             refresh: refreshToken
    //         })
    //         if (res.status === 200) {
    //             localStorage.setItem(refreshToken, res.data.access)
    //             setIsAuthorized(true)
    //         } else {
    //             setIsAuthorized(false)
    //         }

    //     } catch (error) {
    //         console.log(error);
    //         setIsAuthorized(false)
    //     }
    // }

    // const auth = async () => {
    //     const token = localStorage.getItem(accessToken) 
    //     if (!token) {
    //         setIsAuthorized(false)
    //         return 
    //     }
    //     const decoded = jwtDecode(token)
    //     const tokenExpiration = decoded.exp 
    //     const now = Date.now() / 1000 

    //     if (tokenExpiration < now) {
    //         await refreshToken() 
    //     } else {
    //         setIsAuthorized(true) 
    //     }

    // }

    // const [isLoggedIn, setIsLoggedIn] = useState(false);

    // useEffect(() => { 

    //     const getUser = async () => {
    //         let loggedIn = false; 
    //         const loc = "In the navbar loader fxn";
    //         console.log(loc); 
    //         try {
    //             const token = localStorage.getItem('accessToken'); 
    //             if (token) {
    //                 const config = {
    //                     headers: {
    //                         "Authorization": `Bearer ${token}` 
    //                     }
    //                 };
    //                 // filter by user id
    //                 const userResponse = await axios.get(BASEURL + 'accounts/user', config); 
    //                 user = userResponse.data;
    //                 if (user) loggedIn = true; 
    //                 // console.log(loc, 'is logged in', loggedIn)

    //             } else {
    //                 // console.log("Sign in to use site")
    //                 throw Error(); 
    //             }
            
    //         } catch (err) {
    //             if (err.status == 401) {
    //                 loggedIn = false; 
    //             }
    //         } finally {
    //             setIsLoggedIn(loggedIn); 
    //         }
    //     }
    //     console.log('In get user hook', isLoggedIn)
    //     getUser();
    // }, [isLoggedIn])

    const handleLogout = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const refreshToken = localStorage.getItem("refreshToken");
      
            if (accessToken && refreshToken) {
                const config = {
                    headers: {
                      "Authorization":`Bearer ${accessToken}`
                    }
                  };
                await axios.post(
                    BASEURL + 'accounts/logout/', {"refresh": refreshToken}, config
                    )
                localStorage.removeItem("accessToken")
                localStorage.removeItem("refreshToken")
                // setIsLoggedIn(false); 
                // setUsername('');
                console.log('Logging out');
                navigate('/account/login');
            }
        } catch(err) {
            console.log("Failed to log out", err.response?.data || err.message) 
        }
    }

    return (
        <div className="">
            {/* Navbar */}
            <nav class="navbar navbar-expand-lg bg-light fixed-top navbar-dark bg-dark"> 
                <div class="container"> 
                    {/* Logo */} 
                    <Link class="navbar-brand text-white fs-4 text-decoration-none" to="/praesidium"><img src={Logo} alt="" className='nav-logo'/> OrdoLegionis</Link> 

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
                                        <i class="fa-solid fa-bell"></i>
                                    </span></NavLink>
                                </li>
                            </ul>

                            {/* <form class="d-flex mt-3" role="search">
                                <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                                <button class="btn btn-outline-success" type="submit">Search</button>
                            </form> */}

                            {/* Login / Sign up */}
                            <div className="d-flex flex-column flex-lg-row justify-content-center align-items-center gap-3">
                                {!isLoggedIn 
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
                                }   
                            </div>
                        </div>
                    </div> 
                </div> 
            </nav>
        </div>
    )
}

export default Navbar

