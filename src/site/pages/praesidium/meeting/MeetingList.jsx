import axios from "axios"
import { useEffect, useState } from 'react'
import { NavLink, Link, useLoaderData, useNavigate } from "react-router-dom"
import Calendar from '../../../components/Calendar'
import { BASEURL } from "../../../functionVault";


const MeetingList = () => {
    const [praesidium, meetingsList, isMember, isManager] = useLoaderData();
    
    const navigate = useNavigate();

    const [meetings, setMeetings] = useState(meetingsList);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        if (!isMember) {
            // leave this page if not member
            navigate('/praesidium');
        }
        if (!selectedDate) return; // Don't fetch if no date is selected

        const fetchMeetings = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (token) {
                    const config = {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    };
                    const formattedDate = selectedDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
                    const packet = {
                        pid: praesidium.id,
                        startDate: formattedDate,
                        endDate: null
                    };
                    console.log('packet', packet);
                    const response = await axios.post(BASEURL + 'meetings/filter_meetings', packet, config);
                    // const response = await axios.post(`${BASEURL}meetings/filter_meetings`, packet, config);
                    setMeetings(response.data); // Assuming response.data is an array of meetings
                } else {
                    console.log("Sign in to view meetings"); 
                }
            } catch (error) {
                console.error("Error fetching meetings:", error);
                setMeetings([]); // Reset meetings on error
            }
        };

        fetchMeetings();
    }, [selectedDate]);

    // Function to receive date from Calendar
    const handleDateSelect = (date) => {
        setSelectedDate(date);
        console.log("Selected Date:", date); // Fetch meetings here
    };

    return (
        <div className="">
            {/* sidebar */}
            <div className="sidebar">
                <nav className="nav flex-column">
                    <NavLink className="nav-link" to='../'>
                        <span className="icon">
                        <i class="fa-solid fa-shield-halved"></i>
                        </span>
                        <span className="description">Praesidium</span>
                    </NavLink>
                    {isManager? 
                    <NavLink className="nav-link" to='../meeting/create'>
                        <span className="icon">
                        <i class="fa-solid fa-plus"></i>
                        </span>
                        <span className="description">New meeting</span>
                    </NavLink>
                    : <></>}


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
            <main className="main-content pt-5">
                {/* <h2>Responsive Sidebar</h2> */}
                <p className="fs-3 text-dark">{praesidium.name} Praesidium</p>
                <div className="">
                    <Calendar handleDateChange={handleDateSelect} />
                </div>
                <div className="">
                    {meetings.map(meeting => {
                        const dateStr = new Date(meeting.date.split('-')).toDateString(); 
                        return (
                        <div className="border border-dark rounded rounded-3 p-3 my-2" key={meeting.id}>
                            <p className="fs-4">
                                <Link className="text-decoration-none text-dark" to={`${meeting.id}`}>
                                   <span className="mx-3"> Meeting {meeting.meeting_no}</span> | <span className="ms-3 text-primary fw-light fs-5">{dateStr}</span>
                                </Link>
                            </p>
                        </div>
                        )
                    })}

                </div>
            </main>
        </div>
    )
}

export default MeetingList


export const meetingListLoader = async ({ params }) => {
    const { pid } = params;
    const loc = "In the meeting list loader fxn";
    let praesidium, isMember, isManager, meetings = [];

    console.log(loc);
    // try {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const config = {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            };
            console.log(loc, pid);
            const praesidiumResponse = await axios.get(BASEURL + `praesidium/praesidium/${pid}`, config);
            praesidium = praesidiumResponse.data;

            const packet = {
                pid: praesidium.id,
                endDate: new Date().toISOString().split('T')[0]
            };
            console.log(loc, 'packet', packet);
            const meetingsResponse = await axios.post(BASEURL + 'meetings/filter_meetings', packet, config);
            meetings = meetingsResponse.data; 


            const legionaryResponse = await axios.get(BASEURL + 'accounts/legionary_info', config); 
            const legionary = legionaryResponse.data;

            isMember = praesidium.members.includes(legionary.id)
            isManager = praesidium.managers.includes(legionary.id); 

        } else {
            console.log("Sign in to get workLists")
        }

        return [praesidium, meetings, isMember, isManager];
    // }

}