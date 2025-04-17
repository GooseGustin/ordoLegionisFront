import { NavLink, useLoaderData } from "react-router-dom"
import { shuffle } from "../../functionVault";

const Notifications = () => {
    const loc = "In notifications";
    const [posts, questions, requests, announcements, reminders] = useLoaderData();
    
    let elements = announcements.concat(reminders); 
    // elements = shuffle(elements); 
    console.log(loc, 'Elements', elements);

    return (
        <div>
        {/* sidebar */}
        <div className="sidebar">
            <nav className="nav flex-column">
                {/* settings  */}
                <NavLink className="nav-link" to='/'>
                    <span className="icon">
                    <i class="fa-solid fa-house"></i>
                    </span>
                    <span className="description">Home</span>
                </NavLink>

            </nav>
        </div>

        {/* main content */}
        {
            elements[0] ? 
            <main className="main-content">
                {/* <h2>Responsive Sidebar</h2> */}
                <div className="">
                {elements.map(element => { 

                    const typeToPath = {
                        'post': '/social/post/', 
                        'question': '/social/question/', 
                        'prayer request': '/social/request/', 
                        'announcement': `/curia/${element.curia}/announcement/`, 
                        'reminder': `/praesidium/${element.praesidium}/reminder/`
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
                            <span>You have no new notifications</span>
                        </div>
                    </div>
                </div>
            </main>
            }

        </div>
    )
}

export default Notifications
