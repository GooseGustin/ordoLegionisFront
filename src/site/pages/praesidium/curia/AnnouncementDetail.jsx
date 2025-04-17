import { Link, NavLink, useLoaderData, useNavigate } from 'react-router-dom'

const AnnouncementDetail = () => {
    const [announcementObj, curia, isMember, isManager] = useLoaderData();
    console.log("in announcement detail") // , curia)
    // const navigate = useNavigate(); 
    // const isManager = true; 

    const annDate = announcementObj.date
        ? new Date(announcementObj.date.split('-')).toDateString()
        : null
    const annDeadline = announcementObj.deadline
        ? new Date(announcementObj.deadline.split('-')).toDateString()
        : null

    return (
        <div>

            {/* sidebar */}
            <div className="sidebar">
                <nav className="nav flex-column">
                    {isManager? 
                    <>
                    <NavLink className="nav-link" to='edit'>
                        <span className="icon">
                        <i class="fa-solid fa-pencil"></i>
                        </span>
                        <span className="description">Edit</span>
                    </NavLink>
                    <NavLink className="nav-link" to='../../'>
                        <span className="icon">
                        <i class="fa-solid fa-shield"></i>
                        </span>
                        <span className="description">Curia</span>
                    </NavLink>
                    <NavLink className="nav-link" to='../create'>
                        <span className="icon">
                        <i class="fa-solid fa-plus"></i>
                        </span>
                        <span className="description">New announcement</span>
                    </NavLink>
                    <NavLink className="nav-link" to='../'>
                        <span className="icon">
                        <i class="fa-solid fa-bullhorn"></i>
                        </span>
                        <span className="description">Announcements</span>
                    </NavLink>
                    </>
                    : <></>
                    }

                    {(!isManager && isMember)? 
                    <>
                    <NavLink className="nav-link" to='../../'>
                        <span className="icon">
                            <i className="fa-solid fa-right-from-bracket fa-lg"></i> 
                        </span>
                        <span className="description">Curia</span>
                    </NavLink>
                    <NavLink className="nav-link" to='../'>
                        <span className="icon">
                        <i class="fa-solid fa-bullhorn"></i>
                        </span>
                        <span className="description">Announcements</span>
                    </NavLink>
                    </>
                    : <></>
                    }


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


            {/* main-content */}
            <main className="main-content text-dark">
                <div className="row my-2 text-start">
                    <div className="col-lg-8 fs-5">
                    Announcement by <span className='text-info'>{curia.name} Curia</span>
                    </div>
                    <div className="col col-lg-4 fs-5">
                        <span className="text-info">{annDate}</span>
                    </div>
                </div>
                
                <div className="row my-2 text-center text-dark fs-5">
                    <span className="display-5">{announcementObj.title}</span>
                </div>

                <div className="row p-2">
                    <hr />
                    {
                    annDeadline 
                    ?   (<div className="col border border-danger rounded rounded-5 ms-3">
                            <span className="fw-bold">Deadline:</span> {annDeadline}
                        </div>)
                    :   (<></>)
                    }
                </div>

                <div className="row">
                    <div className="col text-center">
                    <img src={announcementObj.image} alt="" />
                    </div>
                </div>

                <div className="row p-3 my-4 fs-4">
                    {announcementObj.content}
                </div>
            </main>
        </div>
    )
}

export default AnnouncementDetail
