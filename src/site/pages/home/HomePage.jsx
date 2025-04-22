import axios from "axios";
import { Link, NavLink, useLoaderData, useNavigate } from "react-router-dom"
import { removeRepeatedObjectsFromArray } from "../../functionVault";
import { shuffle } from "../../functionVault";
import { BASEURL } from "../../functionVault";

const HomePage = () => {
    const loc = "In home page";

    // const navigate = useNavigate();
    // const homeReady = false; 

    // useEffect(() => {
    //     if (!homeReady) {
    //         // leave this page if not member
    //         navigate('/praesidium');
    //     }
    // }, []);

    const [posts, questions, requests, announcements, reminders] = useLoaderData();
    
    let elements = posts.concat(questions, requests, announcements, reminders); 
    elements = shuffle(elements); 
    console.log(loc, 'Elements', elements);

    return (
        <div className="">
            {/* sidebar */}
            <div className="sidebar">
                <nav className="nav flex-column">
                    <NavLink className="nav-link " to='social/post/create'>
                        <span className="icon">
                            <i className="fa-solid fa-right-from-bracket fa-lg"></i> 
                        </span>
                        <span className="description">
                            New Post
                        </span>
                    </NavLink>
                    <NavLink className="nav-link" to='social/question/create'>
                        <span className="icon">
                            <i className="fa-solid fa-right-from-bracket fa-lg"></i> 
                        </span>
                        <span className="description">New Question</span>
                    </NavLink>
                    <NavLink className="nav-link" to='social/request/create'>
                        <span className="icon">
                            <i className="fa-solid fa-right-from-bracket fa-lg"></i> 
                        </span>
                        <span className="description">New Prayer Request</span>
                    </NavLink>

                    {/* settings  */}
                    <NavLink className="nav-link" to=''>
                        <span className="icon">
                        <i class="fa-solid fa-question"></i>
                        </span>
                        <span className="description">Help</span>
                    </NavLink>

                    {/* contact  */}
                    <NavLink className="nav-link" to=''>
                        <span className="icon">
                        <i class="fa-solid fa-message"></i>
                        </span>
                        <span className="description">Contact</span>
                    </NavLink>
                </nav>
            </div>

            {/* main  */}
            {
            elements[0] ? 
            <main className="main-content">
                {/* <h2>Responsive Sidebar</h2> */}
                <div className="">
                {elements.map(element => { 

                    const typeToPath = {
                        'post': 'social/post/', 
                        'question': 'social/question/', 
                        'prayer request': 'social/request/', 
                        'announcement': `curia/${element.curia}/announcement/`, 
                        'reminder': `praesidium/${element.praesidium}/reminder/`
                    }; 
                    const path = typeToPath[element.type] + element.id;
                    // console.log('element', element); 
                    return (
                    
                    <div className="card my-4 border border-2 border-primary" key={element.id + element.type}>
                        
                        <div className="card-header">
                            <NavLink className='text-dark text-decoration-none' to={path}>
                                {element.title 
                                ? (<span className="fs-5">{element.title} <span className="fs-2">|</span> </span>) 
                                : <></>}
                                <span className="text-info fs-6">{element.type} </span>
                                <span className="fs-2">|</span>
                                <span className="fs-6 text-muted text-end"> {element.creator_name}</span>      
                            </NavLink>
                        </div>
                        
                        <NavLink className='text-dark text-decoration-none' to={path}>
                            <div className="card-body post rounded border border-3 border-dark">
                                {element.content.slice(0, 120)} 
                                { element.content.length > 120? <>...</>: <></>}
                            </div>
                        </NavLink>
                    </div>
                );
                }
                )}
                </div>
            </main>
            : 
            <main className="main-content">
                <div className="container my-5">
                    <div className="row">
                        <div className="col">
                            <span>You are logged out. Please login <Link to="../account/login">here</Link></span>
                        </div>
                    </div>
                </div>
            </main>
            }
        </div>
    )
}

export default HomePage

export const homeLoader = async () => {
    // Get posts, questions, prayer_requests, announcements, reminders
    let posts = []; 
    let questions = []; 
    let requests = []; 
    let announcements = []; 
    let reminders = []; 
    let praesidia = [];

    const loc = "In the home loader fxn";
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
            const user = userResponse.data;
            
            const curiaResponse = await axios.get(`${BASEURL}curia/curia/?uid=${user.id}`, config); 
            const curiae = curiaResponse.data.map(curia => {
                return {...curia, type: 'curia'};
            }); 
            console.log(loc, 'curia', curiae)

            const praesidiaResponse = await axios.get(`${BASEURL}praesidium/praesidium/?uid=${user.id}`, config);
            const praesidia = removeRepeatedObjectsFromArray(praesidiaResponse.data.map(praesidium => {
                return {...praesidium, type: 'praesidium'};
            })); 
            console.log(loc, 'praesidia', praesidia)

            const postResponse = await axios.get(BASEURL + "social/posts/", config); 
            const questionResponse = await axios.get(BASEURL + "social/questions/", config); 
            const requestResponse = await axios.get(BASEURL + "social/requests/", config); 

            // const praesidiaResponse = await axios.get(BASEURL+ "praesidium/praesidium/", config);

            posts = postResponse.data.map(post => {
                return {
                    ...post, type: 'post'
                };
            }); 
            questions = questionResponse.data.map(question => {
                return {
                    ...question, type: 'question'
                }; 
            }); 
            requests = requestResponse.data.map(request => {
                return {
                    ...request, type: 'request'
                }
            }); 

            for (let curia of curiae) {
                const announcementResponse = await axios.get(BASEURL + `curia/announcements/?cid=${curia.id}`, config); 
                for (let announcement of announcementResponse.data) {
                    announcements.push({
                        ...announcement, type: 'announcement'
                    });
                }
            }
            for (let praesidium of praesidia) {
                const reminderResponse = await axios.get(BASEURL + `praesidium/reminders/?pid=${praesidium.id}`, config);
                for (let reminder of reminderResponse.data) {
                    reminders.push({
                        ...reminder, type: 'reminder'
                    });
                }
            } 

        } else {
            console.log("Sign in to get workLists")
            throw Error("Not signed in")
        }
        return [posts, questions, requests, announcements, reminders]; 
}
