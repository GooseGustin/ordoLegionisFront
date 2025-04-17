import axios from "axios";
import { useState } from "react";
import { Link, NavLink, useLoaderData, useNavigate } from "react-router-dom"
import { BASEURL } from "../../../functionVault";

const CuriaForm = (props) => {
    const [curiaObj, isManager] = useLoaderData(); 
    const loc = 'In curia form'; 

    const { method } = props;
    const creating = method === 'create';

    console.log(loc, 'curia', curiaObj); 
    console.log(loc, 'isManager', isManager);
    const navigate = useNavigate();


    const defaultName = curiaObj? curiaObj.name: ''
    const defaultEmail = curiaObj? curiaObj.email: ''
    const defaultInaugDate = curiaObj? curiaObj.inaug_date: null
    // consol
    const defaultState = curiaObj? curiaObj.state: 'Plateau'
    const defaultCountry = curiaObj? curiaObj.country: 'Nigeria'
    const defaultArchdiocese = curiaObj? curiaObj.archdiocese: ''
    const defaultParish = curiaObj? curiaObj.parish: ''

    const [curiaForm, setCuriaForm] = useState({
        name: defaultName, 
        email: defaultEmail, 
        inaug_date: defaultInaugDate,
        state: defaultState, 
        country: defaultCountry, 
        archdiocese: defaultArchdiocese, 
        parish: defaultParish
    }); 

    const handleFormChange = (e) => {
        console.log("In handle change", e.target.name, e.target.value);
        const temp = {
            ...curiaForm,
            [e.target.name]: e.target.value 
        }
        setCuriaForm(temp)
        console.log(temp)
    }

    const states = [
        'Plateau', 'Sokoto', 'Abia', 'Abeokuta', 'Benin', 'Benue', 
        'Lagos', 'Abuja', 'Ibadan'
    ]
    const countries = [
        'Nigeria', 'Ghana', 'South Africa', 'Italy', 'Dublin'
    ]
    // const obj = undefined;


    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('accessToken'); 
            if (token) {
                console.log('Delete the curia');
                const config = {
                    headers: {
                        "Authorization": `Bearer ${token}` 
                    }
                }; 
                const res = await axios.delete(BASEURL+"curia/curia/"+curiaObj.id+"/", config); 
                console.log("Successfully deleted"); 
                navigate("../../../praesidium")
            }  else {
                console.log("Sign in to delete the announcement")
            }
        } catch (err) {
            if (err.status === 401) {
                console.log("The session is expired. Please sign in again to delete this curia")
                navigate('/account/login');
            } else {
                console.error("Error deleting the announcement:", err);
            }
        }
    }

    const submitForm = async (e) => {
        e.preventDefault(); 
        try {
            const token = localStorage.getItem('accessToken');
            if (token) {
                const config = {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                };
                let curiaResponse;
                if (creating) {
                    curiaResponse = await axios.post(`${BASEURL}curia/curia/`, curiaForm, config);
                } else {
                    curiaResponse = await axios.put(`${BASEURL}curia/curia/${curiaObj.id}/`, curiaForm, config);
                }
                const curiaFeedback = curiaResponse.data; 
                console.log('In submit curia form, code', curiaFeedback.status);
                
                navigate(creating? '../../praesidium': '../');
            } else {
                console.log("Sign in to get praesidia")
                // navigate('../')
            }
        } catch (err) {
            if (err.status === 401) {
                console.log("The session is expired. Please sign in again to view praesidia")
                navigate('/account/login');
            } else {
                console.error("Error fetching curia:", err);
            }
        }
    }

    const pageTitle = creating ? "Create a curia" : "Edit your curia";

    return (
        <div>
        {/* sidebar */}
        <div className="sidebar">
            <nav className="nav flex-column">
                {
                    method === 'edit'? 
                    (
                    <NavLink className="nav-link" to='../'>
                        <span className="icon">
                        <i class="fa-solid fa-shield"></i>
                        </span>
                        <span className="description">Curia</span>
                    </NavLink>
                    ): <></>
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

        {/* main content */}
        <div className="main-content">
            <h2 className="mt-4">{pageTitle}</h2>
            <form onSubmit={submitForm}>
                <div className="row col-10">
                    <label htmlFor="name">
                        <span>Name</span>
                        <input 
                            type="text" 
                            name="name" id="" 
                            placeholder="Our Lady..."
                            className="form-control border border-dark"
                            defaultValue={defaultName}
                            onChange={handleFormChange}
                        />
                    </label>
                </div>
                <div className="row col-10">
                    <label htmlFor="email">
                        <span>Email</span>
                        <input 
                            type="email" 
                            name="email" id="" 
                            // placeholder=""
                            className="form-control border border-dark"
                            defaultValue={defaultEmail}
                            onChange={handleFormChange}
                        />
                    </label>
                </div>
                <div className="row row-cols-lg-2 row-cols-md-2 mt-2">
                    <div className="col col-lg-12 col-md-12 col-sm-12">
                        <label htmlFor="">
                            <span className="me-1">Inauguration date</span>
                            <input 
                                type="date" name="inaug_date" id="" 
                                className="form-control-sm border border-dark"
                                defaultValue={defaultInaugDate}
                                onChange={handleFormChange}
                            />
                        </label>
                    </div>

                </div>
                
            
            {/* Location */}
            <div className="location border border-dark rounded rounded-3 p-3 my-2">
                
                <p className="fs-4">Location</p>

                <div className="row row-cols-lg-3 row-cols-md-2 row-cols-sm-2">
                    <div className="col-5 col-md-5 col-lg-6 col-sm-10">
                        <label htmlFor="">
                            <span>State</span>
                            <select name="state" id="" 
                                defaultValue={defaultState}
                                onChange={handleFormChange}
                                className="form-control border border-dark">
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
                                onChange={handleFormChange} 
                                defaultValue={defaultCountry}
                                className="form-control border border-dark">
                                {countries.map(country => (
                                    <option 
                                        value="country"
                                        key={country}
                                    >{country}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <div className="row col-10 col-lg-10 col-md-10 col-sm-10">
                        <label htmlFor="curia">
                            <span className="">Archdiocese of</span>
                            <input 
                                type="text" 
                                name='archdiocese' id=''
                                className='form-control border border-dark'
                                defaultValue={defaultArchdiocese}
                                onChange={handleFormChange}
                            />
                        </label>
                    </div>
                    <div className="row col-10 col-lg-10 col-md-10 col-sm-10">
                        <label htmlFor="paris">
                            <span className="">Parish</span>
                            <input 
                                type="text" 
                                name='parish' id='parish'
                                className='form-control border border-dark'
                                defaultValue={defaultParish}
                                onChange={handleFormChange}
                            />
                        </label>
                    </div>
                    
                </div> 
            </div> {/* Location */}
                        

            <div className="row">
                {
                    (creating)? 
                    <>
                    <div className="col">
                        <button type="submit" className="btn btn-outline-success col-12 rounded rounded-5">Save</button>
                    </div>
                    <div className="col">
                        <Link to="../" className="btn btn-outline-primary col-12 rounded rounded-5">Cancel</Link>
                    </div>
                    </>: 
                    <></>
                }
                
                {
                    (isManager && !creating) ? 
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
                    : <></> 
                }
            </div>

                
            </form>
        </div>

        </div>
    )
}

export default CuriaForm


export const curiaFormLoader = async ({params}) => {
    let curiaObj, isManager; 

    // Get curia id 
    const {cid} = params;
    console.log('In curia form loader, cid', cid); 

    // Get curia object 
    // try {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const config = {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            };
            if (cid) {
                const curiaResponse = await axios.get(BASEURL + `curia/curia/${cid}`, config);
                curiaObj = curiaResponse.data; 
                console.log('In curia form loader, curia', curiaObj);

                const legionaryResponse = await axios.get(BASEURL + 'accounts/legionary', config); 
                const legionary = legionaryResponse.data;
                isManager = curiaObj.managers.includes(legionary.id); 
            }
            
        } else {
            console.log("Sign in to get praesidia paradisei")
        }
    
        return [curiaObj, isManager]; 
    // }
}