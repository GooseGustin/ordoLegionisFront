import axios from "axios";
import { useState } from "react";
import { Link, NavLink, useLoaderData, useNavigate } from "react-router-dom";
import { BASEURL } from "../../functionVault";

const PraesidiumForm = (props) => {
    const loc = "In praesidium form";

    const { method } = props; 
    // curiae options should be filtered based on state and country 
    const [praesidiumObj, curiae, isManager] = useLoaderData();
    const navigate = useNavigate();
    
    console.log(loc, 'praesidium', praesidiumObj, method)
    console.log(loc, 'curiae', curiae); 

    const creating = method==='create';
    // const isManager = !creating;

    // isManager = praesidiumObj? praesidiumObj.managers.includes(user.id): false;
    console.log("user is qualified to delete this praesidium", isManager); 


    // define defaults
    const states = [
        'Abia', 'Abuja', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 
        'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 
        'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 
        'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
    ]
    const countries = [
        'Nigeria'  // , 'Ghana', 'South Africa', 'Italy', 'Dublin'
    ]
    const defaultName = praesidiumObj? praesidiumObj.name: ''
    const defaultState = praesidiumObj? praesidiumObj.state: 'Plateau'
    const defaultCountry = praesidiumObj? praesidiumObj.country: 'Nigeria'
    const defaultParish = praesidiumObj? praesidiumObj.parish: ""
    const defaultCuria = praesidiumObj? praesidiumObj.curia: 1 // null
    const defaultAddress = praesidiumObj? praesidiumObj.address: ''
    const defaultMeetingTime = praesidiumObj? praesidiumObj.meeting_time: ''
    const defaultInaugDate = praesidiumObj? praesidiumObj.inaug_date: '' // null 
    const defaultSD = praesidiumObj? praesidiumObj.spiritual_director: ''
    const defaultSDAppDate = praesidiumObj? praesidiumObj.spiritual_director_app_date: ''
    const defaultPresident = praesidiumObj? praesidiumObj.president: ''
    const defaultPresAppDate = praesidiumObj? praesidiumObj.pres_app_date: '' // null
    const defaultVicePresident = praesidiumObj? praesidiumObj.vice_president: ''
    const defaultVPAppDate = praesidiumObj? praesidiumObj.vp_app_date: '' // null
    const defaultSecretary = praesidiumObj? praesidiumObj.secretary: ''
    const defaultSecAppDate = praesidiumObj? praesidiumObj.sec_app_date: '' // null
    const defaultTreasurer = praesidiumObj? praesidiumObj.treasurer: ''
    const defaultTresAppDate = praesidiumObj? praesidiumObj.tres_app_date:'' // null
    const defaultNextDeadline = praesidiumObj? praesidiumObj.next_report_deadline: '' 


    const [praesidiumForm, setPraesidiumForm] = useState({
        name: defaultName, 
        state: defaultState, 
        country: defaultCountry,
        parish: defaultParish,
        curia: defaultCuria, 
        address: defaultAddress, 
        meeting_time: defaultMeetingTime, 
        inaug_date: defaultInaugDate,
        spiritual_director: defaultSD, 
        spiritual_director_app_date: defaultSDAppDate, 
        president: defaultPresident, 
        pres_app_date: defaultPresAppDate, 
        vice_president: defaultVicePresident, 
        vp_app_date: defaultVPAppDate, 
        secretary: defaultSecretary, 
        sec_app_date: defaultSecAppDate,
        treasurer: defaultTreasurer, 
        tres_app_date: defaultTresAppDate, 
        next_report_deadline: defaultNextDeadline, 
        reports: praesidiumObj? praesidiumObj.reports: [], 
        work_list: praesidiumObj? praesidiumObj.work_list: []
    })

    const handleChange = (e) => {
        console.log("In handle change", e.target.name, e.target.value)
        setPraesidiumForm({
            ...praesidiumForm, 
            [e.target.name]: e.target.value
        })
    }

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('accessToken'); 
            if (token) {
                console.log('Delete the praesidium');
                const config = {
                    headers: {
                        "Authorization": `Bearer ${token}` 
                    }
                }; 
                const res = await axios.delete(BASEURL+"praesidium/praesidium/"+praesidiumObj.id+"/", config); 
                console.log("Successfully deleted"); 
                navigate(creating? "../": '../../')
            }  else {
                console.log("Sign in to delete the announcement")
            }
        } catch (err) {
            if (err.status === 401) {
                console.log("The session is expired. Please sign in again to delete this announcement")
                navigate('/account/login');
            } else {
                console.error("Error deleting the announcement:", err);
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        const loc = "In submit form"; 
        console.log(loc, 'praesidium', praesidiumForm);
        try {
            const token = localStorage.getItem('accessToken');
            if (token) {
                const config = {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                };
                let praesidiumResponse;
                if (creating) {
                    praesidiumResponse = await axios.post(`${BASEURL}praesidium/praesidium/`, praesidiumForm, config);
                    // Create initial worklist
                    const initialWorkList = {
                        "praesidium": praesidiumResponse.data.id,
                        "details": []
                    }
                    const workListResponse = await axios.post(`${BASEURL}works/work_list/`, initialWorkList, config);
                    console.log("Initialising worklist", workListResponse.data); 
                    navigate(`../${praesidiumResponse.data.id}`);
                } else {
                    praesidiumResponse = await axios.put(`${BASEURL}praesidium/praesidium/${praesidiumObj.id}/`, praesidiumForm, config);
                }
                
                const praesidiumFeedback = praesidiumResponse.data; 
                console.log('In submit praesidium form, code', praesidiumFeedback, praesidiumResponse.status);
                
            } else {
                console.log("Sign in to get praesidia paradisei")
                // navigate('../')
            }
        } catch (err) {
            if (err.status === 401) {
                console.log("The session is expired. Please sign in again to view praesidia")
                // setErrStatus(401); 
            } else {
                console.error("Error fetching curia:", err);
            }
        }
    }

    const pageTitle = creating ? "Create a praesidium" : "Edit your praesidium";
    return (
        <div>
        {/* sidebar */}
        <div className="sidebar">
            <nav className="nav flex-column">
                    
                <NavLink className="nav-link" to='../'>
                    <span className="icon">
                    <i class="fa-solid fa-shield-halved"></i>
                    </span>
                    {
                    !creating? 
                    <span>Praesidium</span>: 
                    <span>Praesidia</span>
                    }
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
        <div className="main-content">
            <h2 className="mt-4">{pageTitle}</h2>
            <form onSubmit={handleSubmit}>
                <div className="row col-10">
                    <label htmlFor="">
                        <span>Name</span>
                        <input 
                            type="text" 
                            name="name" id="" 
                            placeholder="Our Lady..."
                            className="form-control border border-dark"
                            defaultValue={defaultName}
                            onChange={handleChange}
                        />
                    </label>
                </div>
        
            {/* Location */}
            <div className="location border border-dark rounded rounded-3 p-3 my-2">
                
                <p className="fs-4">Location</p>

                <div className="row row-cols-lg-3 row-cols-md-2 row-cols-sm-2">
                    <div className="col-5 col-md-5 col-lg-6 col-sm-10">
                        <label htmlFor="">
                            <span>State</span>
                            <select name="state" id="" 
                                className="form-control border border-dark"
                                defaultValue={defaultState}
                                onChange={handleChange}>
                                {states.map(state => (
                                    <option 
                                        value={state}
                                        key={state}
                                    >{state}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <div className="col-10 col-lg-6 col-md-5 col-sm-10">
                        <label htmlFor="">
                            <span>Country</span>
                            <select name="country" id="" 
                                className="form-control border border-dark"
                                defaultValue={defaultCountry}
                                onChange={handleChange}>
                                {countries.map(country => (
                                    <option 
                                        value={country}
                                        key={country}
                                    >{country}</option>
                                ))}
                            </select>
                        </label>

                    </div>
                    <div className="row col-10 col-lg-10 col-md-10 col-sm-10">
                        <label htmlFor="parish">
                            <span className="">Parish</span>
                            <input 
                                type="text" 
                                name='parish' id=''
                                className='form-control border border-dark'
                                defaultValue={defaultParish}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <div className="row col-10 col-lg-7 col-md-6 col-sm-10">
                        <label htmlFor="address">
                            <span>Meeting location</span>
                            <input 
                                type="text" 
                                name="address" id="" 
                                className="form-control border border-dark"
                                defaultValue={defaultAddress}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <div className="col-10 col-lg-5 col-md-6 col-sm-10">
                        <label htmlFor="meeting_time">
                            <span>Meeting time</span>
                            <input 
                                type="text" 
                                name="meeting_time" id="" 
                                className="form-control border border-dark"
                                defaultValue={defaultMeetingTime}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <div className="row col-10 col-lg-10 col-md-10 col-sm-10">
                        
                        <label htmlFor="curia">
                            <span className="">Curia</span>
                            {
                            curiae[0]? 
                            <select name="curia" id="" 
                                className="form-control border border-dark"
                                onChange={handleChange}>
                                {curiae.map(curia =>
                                    <option
                                        value={curia.id}
                                        key={curia.id}
                                        defaultValue={defaultCuria}
                                    >{curia.name}, {curia.parish}</option>
                                    )
                                } 
                            </select>: 
                            <select className="form-control border border-dark">
                                <option value="">No options. Please create a curia first</option>
                            </select>
                            }
                        </label>
                        
                    </div>
                </div> 
            </div> {/* Location */}
                        
            <div className="dates rounded rounded-3 border border-dark p-3 my-3">
                <p className="fs-4">Dates</p>
                <div className="row row-cols-lg-2 row-cols-md-2">
                    <div className="col col-lg-12 col-md-12 col-sm-12">
                        <label htmlFor="">
                            <span className="me-1">Inauguration date</span>
                            <input 
                                type="date" name="inaug_date" id="" 
                                className="form-control-sm border border-dark"
                                defaultValue={defaultInaugDate}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <div className="col col-lg-12 col-md-12 col-sm-12 gy-2">
                        <label htmlFor="">
                            <span className="me-1">Report submission deadine</span>
                            <input 
                                type="date" name="next_report_deadline" id="" 
                                className="form-control-sm border border-dark"
                                defaultValue={defaultNextDeadline}
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                </div>
            </div> {/* Dates */}
                
                
            <div className="officers rounded rounded-3 border border-dark p-3 my-3">
                
            <p className="fs-4">Officers</p>
                <div className="row row-cols-lg-2 row-cols-md-2">
                    <div className="col col-lg-6 col-md-6 col-sm-10">
                        <label htmlFor="">
                            <span className="me-1">Spiritual Director</span>
                            <input 
                                type="text" name="spiritual_director" id="" 
                                className="form-control border border-dark"
                                defaultValue={defaultSD}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <div className="col col-lg-6 col-md-6 col-sm-10 mt-4">
                        <label htmlFor="">
                            <span className="me-1 mb-3">Appointment date</span>
                            <input 
                                type="date" name="spiritual_director_app_date" id="" 
                                defaultValue={defaultSDAppDate}
                                onChange={handleChange}
                                className="form-control-sm border border-dark"
                            />
                        </label>
                    </div>

                    <div className="col col-lg-6 col-md-6 col-sm-10 ">
                        <label htmlFor="">
                            <span className="me-1">President</span>
                            <input 
                                type="text" name="president" id="" 
                                className="form-control border border-dark"
                                defaultValue={defaultPresident}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <div className="col col-lg-6 col-md-6 col-sm-10 mt-4">
                    <label htmlFor="">
                            <span className="me-1">Appointment date</span>
                            <input 
                                type="date" name="pres_app_date" id="" 
                                className="form-control-sm border border-dark"
                                defaultValue={defaultPresAppDate}
                                onChange={handleChange}
                            />
                        </label>
                        <hr className="mt-3" />
                    </div>
                    
                    <div className="col col-lg-6 col-md-5 col-sm-10">
                        <label htmlFor="">
                            <span className="me-1">Vice President</span>
                            <input 
                                type="text" name="vice_president" id="" 
                                className="form-control border border-dark"
                                defaultValue={defaultVicePresident}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <div className="col col-lg-6 col-md-6 col-sm-10 mt-4">
                        <label htmlFor="">
                            <span className="me-1">Appointment date</span>
                            <input 
                                type="date" name="vp_app_date" id="" 
                                className="form-control-sm border border-dark"
                                defaultValue={defaultVPAppDate}
                                onChange={handleChange}
                            />
                        </label>
                        <hr className="mt-3" />
                    </div>
                    <div className="col col-lg-6 col-md-5 col-sm-10">
                        <label htmlFor="">
                            <span className="me-1">Secretary</span>
                            <input 
                                type="text" name="secretary" id="" 
                                className="form-control border border-dark"
                                defaultValue={defaultSecretary}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <div className="col-10 col-lg-6 col-md-6 col-sm-10 mt-4">
                        <label htmlFor="">
                            <span className="me-1">Appointment date</span>
                            <input 
                                type="date" name="sec_app_date" id="" 
                                className="form-control-sm border border-dark"
                                defaultValue={defaultSecAppDate}
                                onChange={handleChange}
                            />
                        </label>
                        <hr className="mt-3" />
                    </div>
                    <div className="col col-lg-6 col-md-5 col-sm-10">
                        <label htmlFor="">
                            <span className="me-1">Treasurer</span>
                            <input 
                                type="text" name="treasurer" id="" 
                                className="form-control border border-dark"
                                defaultValue={defaultTreasurer}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <div className="col-10 col-lg-6 col-md-6 col-sm-10 mt-4">
                        <label htmlFor="">
                            <span className="me-1">Appointment date</span>
                            <input 
                                type="date" name="tres_app_date" id="" 
                                className="form-control-sm border border-dark"
                                defaultValue={defaultTresAppDate}
                                onChange={handleChange}
                            />
                        </label>
                        <hr className="mt-3" />
                    </div>
                    <div className="col-10 col-lg-6 col-md-5- col-sm-10"></div>
                </div>

            </div>

            <div className="row">
                {
                    (creating && curiae[0]) ? // Creating?
                    <>
                    <div className="col">
                        <button type="submit" className="btn btn-outline-success col-12 rounded rounded-5">Save</button>
                    </div>
                    <div className="col">
                        <Link to="../" className="btn btn-outline-primary col-12 rounded rounded-5">Cancel</Link>
                    </div>
                    </>
                    :  // Editing
                    <></>
                }
                {
                    (!creating && isManager && curiae[0]) ? 
                    <>
                    <div className="col">
                        <button type="submit" className="btn btn-outline-success col-12 rounded rounded-5">Save</button>
                    </div>
                    <div className="col">
                        <Link to="../" className="btn btn-outline-primary col-12 rounded rounded-5">Cancel</Link>
                    </div>
                    <div className="col">
                        <Link to='' 
                            className='btn btn-outline-danger col-12 rounded rounded-5'
                            onClick={handleDelete}
                        >Delete</Link>
                    </div>
                    </>
                    :
                    <></>
                }
            </div> 

                
            </form>
        </div>

        </div>
    )
}

export default PraesidiumForm

export const praesidiumFormLoader = async ({params}) => {
    let curiaList = []; 
    let praesidiumObj; 
    let isManager = false;

    // Get curia id 
    const {pid} = params;
    console.log('In praesidium form loader, pid', pid); 

    // Get curia praesidiumObject 
    // try {
    const token = localStorage.getItem('accessToken');
    // console.log('token', token)
    if (token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        };
        
        const curiaResponse = await axios.get(BASEURL + 'curia/curia', config);
        curiaList = curiaResponse.data; 
        console.log('curia response', curiaResponse)

        if (pid) { // Editing an existing praesidium
            const praesidiumResponse = await axios.get(BASEURL + `praesidium/praesidium/${pid}`, config);
            praesidiumObj = praesidiumResponse.data; 
            console.log('In praesidium form loader, praesidium', praesidiumObj);
            
            const legionaryResponse = await axios.get(BASEURL + 'accounts/user', config); 
            const legionary = legionaryResponse.data;
            // console.log(' praesidium.members',  praesidium.members, legionary.id)
            isManager = praesidiumObj.managers.includes(legionary.id)
        }
    } else {
        console.log("Sign in to get praesidia paradisei")
        }
        
    return [praesidiumObj, curiaList, isManager]; 

}
