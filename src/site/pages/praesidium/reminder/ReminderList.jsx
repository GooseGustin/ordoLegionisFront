import axios from "axios"
import { useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom"
import { NavLink, Link } from "react-router-dom";
import { BASEURL } from "../../../functionVault";

const ReminderList = () => {
    const [reminders, isMember] = useLoaderData();
    console.log('reminders', reminders);

    const navigate = useNavigate()

    useEffect(() => {

        if (!isMember) {
            navigate('/praesidium'); 
        }
                
    }, [])


    return (
        <div>

            {/* sidebar */}
            <div className="sidebar">
                <nav className="nav flex-column">
                    {
                        (isMember) ? 
                        <>
                        <NavLink className="nav-link" to='../'>
                            <span className="icon">
                            <i class="fa-solid fa-shield-halved"></i>
                            </span>
                            <span className="description">Praesidium</span>
                        </NavLink>
                        <NavLink className="nav-link" to='create'>
                            <span className="icon">
                            <i class="fa-solid fa-plus"></i>
                            </span>
                            <span className="description">New reminder</span>
                        </NavLink>
                        </>: <></>
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

            {/* main  */}
            <main className="main-content">
                
                <div className="">
                    {reminders.map(item => {
                        return (
                            <div className="card my-2 border-0" key={item.id}>

                                <div className="card-header">
                                    <Link className='text-dark text-decoration-none' to={item.id.toString()}>
                                        <span className="text-info fs-6">Reminder </span>
                                    </Link>
                                </div>

                                <Link className='text-dark text-decoration-none' to={item.id.toString()}>
                                    <div className="card-body post rounded border border-3 border-dark">
                                        {item.content.slice(0, 120)}
                                        {item.content.length > 120 ? <>...</> : <></>}
                                    </div>
                                </Link>

                            </div>
                        );
                    }
                    )}
                </div>
            </main>
        </div>
    )
}

export default ReminderList

export const reminderListLoader = async ({ params }) => {
    const { pid } = params;
    let reminders, isMember;

    // try {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const config = {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            };
            const praesidiumResponse = await axios.get(BASEURL + `praesidium/praesidium/${pid}`, config);
            const praesidiumObj = praesidiumResponse.data; 

            const reminderResponse = await axios.get(`${BASEURL}praesidium/reminders/?pid=${pid}`, config);
            reminders = reminderResponse.data;

            const legionaryResponse = await axios.get(BASEURL + 'accounts/user', config); 
            const legionary = legionaryResponse.data;
            isMember = praesidiumObj.members.includes(legionary.id)

        } else {
            console.log('Sign in to access reminders')
        }
        
        return [reminders, isMember]
    // }

}