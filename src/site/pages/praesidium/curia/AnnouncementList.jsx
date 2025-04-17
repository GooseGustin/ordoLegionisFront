import axios from "axios"
import { useLoaderData, useNavigate } from "react-router-dom"
import { NavLink, Link } from "react-router-dom";
import { removeRepeatedFromArray } from "../../../functionVault";
import { BASEURL } from "../../../functionVault";

const AnnouncementList = () => {
    const [announcements, isMember, isManager] = useLoaderData();
    console.log('announcements', announcements);

    return (
        <div>

            {/* sidebar */}
            <div className="sidebar">
                <nav className="nav flex-column">
                    {isMember? 
                    <NavLink className="nav-link" to='../'>
                        <span className="icon">
                        <i class="fa-solid fa-shield"></i>
                        </span>
                        <span className="description">Curia</span>
                    </NavLink>
                    : <></>}
                    {isManager? 
                    <NavLink className="nav-link" to='create'>
                        <span className="icon">
                        <i class="fa-solid fa-plus"></i>
                        </span>
                        <span className="description">New announcement</span>
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
            <main className="main-content">
                
                <div className="">
                    {announcements.map(item => {
                        return (
                            <div className="card my-2 border-0" key={item.id}>

                                <div className="card-header">
                                    <Link className='text-dark text-decoration-none' to={item.id.toString()}>
                                        <span className="fs-5">{item.title} | </span>
                                        <span className="text-info fs-6">Announcement </span>
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

export default AnnouncementList

export const announcementListLoader = async ({ params }) => {
    const { cid } = params;
    let announcements, isMember = false,isManager = false;

    // try {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const config = {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            };
            const curiaResponse = await axios.get(BASEURL+ `curia/curia/${cid}/`, config);
            const curia = curiaResponse.data; 
            const annResponse = await axios.get(`${BASEURL}curia/announcements/?cid=${cid}`, config);
            announcements = annResponse.data;

            const legionaryResponse = await axios.get(BASEURL + 'accounts/legionary_info', config); 
            const legionary = legionaryResponse.data;

            const curiaeResponse = await axios.get(`${BASEURL}curia/curia/?uid=${legionary.id}`, config); 
            const curiae = removeRepeatedFromArray(curiaeResponse.data); 
            const curiaeIds = curiae.map(item => item.id); 
            // console.log(loc, 'curiae', curiae, curiaeIds.includes(curia.id))

            isMember = curiaeIds.includes(curia.id); 
            isManager = curia.managers.includes(legionary.id); 
        } else {
            console.log('Sign in to access announcememnts')

        } 
        return [announcements, isMember, isManager]
    // }

}