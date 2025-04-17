import axios from "axios";
import { useEffect } from "react";
import { Link, NavLink, useLoaderData, useNavigate } from "react-router-dom"
import Navbar from "../../components/Navbar"
import { BASEURL, removeRepeatedFromArray } from "../../functionVault";

const shuffle = function (list) {
    // For each element in the array, swap with a randomly chosen lower element
    var len = list.length;
    for (var i = len - 1; i > 0; i--) {
        var r = Math.floor(Math.random() * (i + 1)), temp; // Random number
        temp = list[i], list[i] = list[r], list[r] = temp; // Swap
    }
    return list;
};

const PraesidiaList = () => {
    const loc = "In praesidia list";

    const [praesidia, curiae] = useLoaderData();
    
    let elements = praesidia.concat(curiae); 
    // elements = shuffle(elements); 
    console.log(loc, 'Elements', elements);


    const navigate = useNavigate();
    const homeReady = false; 

    useEffect(() => {
        // if (!homeReady) {
            // leave this page if not member
        navigate('/praesidium');
        // }
    }, []);

    return (
        <div className="">
            {/* sidebar */}
            <div className="sidebar">
                <nav className="nav flex-column">
                    <NavLink className="nav-link" to='create'>
                        <span className="icon">
                        <i class="fa-solid fa-shield-halved"></i>
                        </span>
                        <span className="description"> 
                            New Praesidium
                        </span>
                    </NavLink>
                    <NavLink className="nav-link" to='../curia/create'>
                        <span className="icon">
                        <i class="fa-solid fa-shield"></i>
                        </span>
                        <span className="description">New Curia</span>
                    </NavLink>


                    {/* help  */}
                    <NavLink className="nav-link" to='help'>
                        <span className="icon">
                        <i class="fa-solid fa-question"></i> 
                        </span>
                        <span className="description">Help</span>
                    </NavLink>

                    {/* contact  */}
                    <NavLink className="nav-link" to='/contact'>
                        <span className="icon">
                        <i class="fa-solid fa-message"></i>
                        </span>
                        <span className="description">Contact</span>
                    </NavLink>
                </nav>
            </div>

            {/* main  */}
            {
            elements[0]
            ? 
                <main className="main-content">
                {/* <h2>Responsive Sidebar</h2> */}
                <div className="">
                {elements.map(element => (
                    <div className="card my-2 border-0" key={element.iden + element.type}>
                        <div className="card-header">
                            <span className="text-primary">{element.type} | </span>
                            <span className="text-muted">{element.parish} </span>      
                        </div>
                        <div className="card-body post rounded border border-3 border-dark">
                            <div className="row h3">
                                <Link className="text-decoration-none text-dark" to={
                                    (element.type === 'praesidium')? 
                                    `${element.id}`: `../curia/${element.id}`
                                }>{element.name}</Link>
                            </div>
                            {
                                element.type === 'praesidium'? 
                                (
                                    <div className="row meeting-and-report">
                                        <div className="col">
                                            <Link to={`${element.id}/meeting/create`} className="btn btn-outline-info col-12 rounded rounded-5">New Meeting</Link>
                                        </div>
                                        <div className="col">
                                            <Link to={`${element.id}/report`} className=" btn btn-outline-info col-12 rounded rounded-5">View Report</Link>
                                        </div>
                                    </div>
                                ) : (<></>)
                            }
                        </div>
                    </div>
                ))}
                
                </div> 
                </main>

            :   
            <main className="main-content">
                <div className="container my-5">
                    <div className="row ">
                            <div className="col">
                                <p>You are not a member of any praesida or have not created any praesidia or curia.</p>
                                <p>Go to Help for a short and easy guide to setup.</p>
                            </div>
                        </div>
                    </div>
            </main>
            }
        </div>
    )
}

export default PraesidiaList

export const praesidiaListLoader = async () => {
    // Get praesidia and curia and link to the last reports for each praesidium
    let praesidia = [];
    let curiae = []; 
    let user; 

    const loc = "In the praesidiaList loader fxn";
    console.log(loc); 
    // try {
        const token = localStorage.getItem('accessToken'); 
        if (token) {
            const config = {
                headers: {
                    "Authorization": `Bearer ${token}` 
                }
            };
            // filter by user id
            const userResponse = await axios.get(BASEURL + 'accounts/user', config); 
            user = userResponse.data;
            
            const curiaResponse = await axios.get(`${BASEURL}curia/curia/?uid=${user.id}`, config); 
            curiae = curiaResponse.data.map(curia => {
                return {...curia, type: 'curia'};
            }); 
            console.log(loc, 'curia', curiae)

            const praesidiaResponse = await axios.get(`${BASEURL}praesidium/praesidium/?uid=${user.id}`, config);
            praesidia = removeRepeatedFromArray(praesidiaResponse.data.map(praesidium => {
                return {...praesidium, type: 'praesidium'};
            })); 
            console.log(loc, 'praesidia', praesidia)

        } else {
            console.log("Sign in to get curia")
            throw Error()
        }
        return [praesidia, curiae]; 
    // }
}

