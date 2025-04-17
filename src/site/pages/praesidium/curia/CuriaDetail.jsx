import { NavLink, useLoaderData } from "react-router-dom"
import axios from "axios";
import { removeRepeatedFromArray } from "../../../functionVault";
import { BASEURL } from "../../../functionVault";

const CuriaDetail = () => {
    const [curia, praesidia, isMember, isManager] = useLoaderData();
    const loc= "In curia details"; 
    console.log(loc, 'curia', curia); 
    console.log(loc, 'isManager', isManager);

    return (
        <div>
        {/* sidebar */}
        <div className="sidebar">
            <nav className="nav flex-column">
                {isManager ? 
                    <>
                    <NavLink className="nav-link" to='edit'>
                        <span className="icon">
                        <i class="fa-solid fa-pencil"></i>
                        </span>
                        <span className="description">Edit</span>
                    </NavLink>
                    <NavLink className="nav-link" to='announcement/create'>
                        <span className="icon">
                        <i class="fa-solid fa-plus"></i>
                        </span>
                        <span className="description">New announcement</span>
                    </NavLink>
                    </>
                    : <></>
                }
                
                {isMember? 
                <>
                <NavLink className="nav-link" to='announcement/'>
                    <span className="icon">
                    <i class="fa-solid fa-bullhorn"></i>
                    </span>
                    <span className="description">Announcements</span>
                </NavLink>
                </>
                : <></>}

                <NavLink className="nav-link" to=''>
                    <span className="icon">
                    <i class="fa-solid fa-briefcase"></i>
                    </span>
                    <span className="description">Management</span>
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

        {/* main content */}
        <div className="main-content pt-5">
            <p className="fs-3 text-dark">{curia.name} Curia</p>  

            {/* Location */}
            <div className="location border border-dark rounded rounded-3 p-3 my-2">
                
                <p className="fs-4 p-2 bg-secondary text-light">Location</p>

                <div className="row row-cols-lg-3 row-cols-md-2 row-cols-sm-2">
                    <div className="col-10 col-lg-6 col-md-5 col-sm-10">
                        <label htmlFor="">
                            <span className="me-1 fw-bold">State:</span>
                            <span>{curia.state}</span>
                        </label>
                    </div>
                    <div className="col-10 col-lg-6 col-md-5 col-sm-10">
                        <label htmlFor="">
                            <span className="me-1 fw-bold">Country:</span>
                            <span>{curia.country}</span>
                        </label>

                    </div>
                    <div className="row col-10 col-lg-10 col-md-10 col-sm-10">
                        <label htmlFor="curia">
                            <span className="me-1 fw-bold">Archdiocese:</span>
                            <span>Archdiocese of {curia.archdiocese}</span>
                        </label>
                    </div>
                    
                    <div className="row col-12">
                        <label htmlFor="">
                            <span className="me-1 fw-bold">Parish:</span>
                            <span>{curia.parish}</span>
                        </label>
                    </div>

                    <div className="row col-12">
                        <label htmlFor="">
                            <span className="me-1 fw-bold">Email:</span>
                            <span>{curia.email}</span>
                        </label>
                    </div>
                    
                </div> 
            </div> {/* Location */}


            <div className="praesidia border border-dark rounded rounded-3 p-3 my-2">
                <p className="fs-4 p-2 bg-secondary text-light">Praesidia</p>
                <div className="row">
                    {
                        praesidia.map(item => {
                            return (
                                <div className="col-12" key={item.id}>
                                    {item.name}
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
        </div>
    )
}

export default CuriaDetail


export const curiaDetailLoader = async ({ params }) => {
    const {cid} = params;
    // return the curiaObj, list of meeting numbers and dates
    const loc = "In the curia loader fxn";
    let curia, praesidia, isMember = false, isManager = false; 

    console.log(loc); 
    // try {
        const token = localStorage.getItem('accessToken'); 
        if (token) {
            const config = {
                headers: {
                    "Authorization": `Bearer ${token}` 
                }
            };
            console.log(loc, cid); 
            const curiaResponse = await axios.get(BASEURL+ `curia/curia/${cid}/`, config);
            curia = curiaResponse.data; 
            
            const praesidiaResponse = await axios.get(BASEURL + `praesidium/praesidium/?cid=${cid}`, config);
            praesidia = praesidiaResponse.data; 

            // Extract the curia ID from the curia data
            const curiaId = curia.id;
            console.log(loc, 'curia id', curiaId, curia); 
            
            // Get legionary 
            const legionaryResponse = await axios.get(BASEURL + 'accounts/legionary_info', config); 
            const legionary = legionaryResponse.data;

            const curiaeResponse = await axios.get(`${BASEURL}curia/curia/?uid=${legionary.id}`, config); 
            const curiae = removeRepeatedFromArray(curiaeResponse.data); 
            const curiaeIds = curiae.map(item => item.id); 
            // console.log(loc, 'curiae', curiae, curiaeIds.includes(curia.id))

            isMember = curiaeIds.includes(curia.id)
            isManager = curia.managers.includes(legionary.id); 
            
            console.log(loc, ':::', curia, isManager, legionary)

        } else {
            console.log("Sign in to get workLists")
        }


        return [curia, praesidia, isMember, isManager]; 
    // }

}
