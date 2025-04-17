import axios from 'axios';
import React, { useState } from 'react'
import { Link, NavLink, useLoaderData, useNavigate } from 'react-router-dom';

const BASEURL = "http://localhost:8000/api/";

const RequestForm = (props) => {
    const navigate = useNavigate(); 
    const { method } = props; 
    const [requestObj, legionary] = useLoaderData(); 

    // const [title, setTitle] = useState(); 

    console.log("in request form", requestObj)
    if (legionary) {
        console.log(legionary.user.username)
    }
    const defaultContent = requestObj? requestObj.content : '';
    const defaultTitle = requestObj? requestObj.title : '';
    const defaultImg = requestObj? requestObj.image: null 
    const [formData, setFormData] = useState({
        content: defaultContent
        // flags: []
    })

    const handleChange = (e) => {
        const targetName = e.target.name; 
        let value = e.target.value; 
        if (targetName == 'image') {
            // change value
            value = e.target.files[0];
        } 
        setFormData({
            ...formData, 
            [targetName]: value
        }); 
        console.log(targetName, value, formData)
    }

    const handleSubmitForm = async (e) => {
        e.preventDefault();

        try {
            console.log('Trying to send', formData); 
            console.log('requestObj', requestObj)
            const token = localStorage.getItem('accessToken'); 
                if (token) {
                    const config = {
                        headers: {
                            "Authorization": `Bearer ${token}`, 
                            "Content-Type": "multipart/form-data"
                        }
                    }; 

                    // const formDataToSend = new FormData();
                    // formDataToSend.append('content', form)

                    // Append form fields conditionally
                    // for (const key in formData) {
                    //     if (key === "image") {
                    //         if (formData[key] instanceof File) {  // Only append if it's a new file
                    //             formDataToSend.append(key, formData[key]);
                    //         }
                    //     } else {
                    //         formDataToSend.append(key, formData[key]);
                    //     }
                    // }

                    let requestResponse;
                    if (method==='create') {
                        requestResponse = await axios.post(`${BASEURL}social/requests/`, formData, config);
                        console.log("Success!", requestResponse.data) 
                    } else if (method==='edit') {
                        requestResponse = await axios.put(`${BASEURL}social/requests/${requestObj.id}/`, formData, config);
                        console.log("Success!", requestResponse.data) 
                    } 
    
                    console.log("Request Operation Successful!"); 
                    requestObj ? navigate(`../`): navigate(`../${requestResponse.data.id}`)
                    
                } else {
                    console.log("Sign in to operate on requests")
                }
        } catch (err) {
            if (err.status === 401) {
                console.log("The session is expired. Please sign in again to operate on requests")
                navigate('/account/login');
            } else {
                console.log("Error during operation", err)              
            }
            
        } // finally {
        //     setIsLoading(false);
        // }
    } 
        

    const pageTitle = method=='create' ? "Create a request": "Edit your request"; 
    const btnTitle = method=='create' ? "Create": "Edit"; 

    return (
        <div className='create-work'>
        {/* sidebar */}
        <div className="sidebar">
            <nav className="nav flex-column">
                <NavLink className="nav-link" to='../'>
                    <span className="icon">
                        <i className="bi bi-grid"></i>
                        <i className="fa-solid fa-right-from-bracket fa-lg"></i> 
                    </span>
                    <span className="description">Praesidium</span>
                </NavLink>
                <NavLink className="nav-link" to='../meeting/create'>
                    <span className="icon">
                        <i className="bi bi-grid"></i>
                        <i className="fa-solid fa-right-from-bracket fa-lg"></i> 
                    </span>
                    <span className="description">New meeting</span>
                </NavLink>
                <NavLink className="nav-link" to='../worklist'>
                    <span className="icon">
                        <i className="bi bi-grid"></i>
                        <i className="fa-solid fa-right-from-bracket fa-lg"></i> 
                    </span>
                    <span className="description">Worklist</span>
                </NavLink>


                {/* settings  */}
                <NavLink className="nav-link" to=''>
                    <span className="icon">
                        <i className="bi bi-gear"></i>
                        <i className="fa-solid fa-right-from-bracket fa-lg"></i> 
                    </span>
                    <span className="description">Help</span>
                </NavLink>

                {/* contact  */}
                <NavLink className="nav-link" to=''>
                    <span className="icon">
                        <i className="bi bi-gear"></i>
                        <i className="fa-solid fa-right-from-bracket fa-lg"></i> 
                    </span>
                    <span className="description">Contact</span>
                </NavLink>
            </nav>
        </div>
        
        {/* main content */}
        <div className="main-content">
            
        <h2>Create a new prayer request</h2>
        <form onSubmit={handleSubmitForm} >

            <div className="row mt-3 ">
                <label htmlFor="content">
                    {/* <span className="me-4">Content</span> */}
                    <textarea 
                        name="content" id="" 
                        // cols="30" 
                        rows="10"
                        className='form-control border border-dark rounded rounded-3'
                        placeholder='Prayer'
                        onChange={handleChange}
                    >{defaultContent}</textarea>
                </label>
            </div>
            
            <div className="row mt-3">
                <div className="col-6">
                    <button type="submit" className="btn btn-outline-success col-12 rounded rounded-5">Save</button>
                </div>
                <div className="col">
                    <Link to="../" className="btn btn-outline-primary col-12 rounded rounded-5">Cancel</Link>
                </div>
            </div>
        </form>
        </div>

        </div>
    )
}

export default RequestForm


export const requestFormLoader = async ({ params }) => {
    const { id } = params; // id of request for edit 
    
    let obj, legionary; 
    // try {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const config = {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            };
            if (id) {
                const response = await axios.get(BASEURL + `social/requests/${id}`, config);
                obj = response.data; 
                console.log('In request form loader, request', obj);
                
                const lid = obj.legionary; 
                const legResponse = await axios.get(BASEURL + `accounts/legionary/${lid}`, config);
                legionary = legResponse.data; 
            }
            // const curiaResponse = await axios.get(BASEURL + 'curia/curia/', config);
            // curiaList = curiaResponse.data; 
        } else {
            console.log("Sign in to get requests")
        }
    // } catch(err) {
    //     if (err.status === 401) {
    //         console.log("The session is expired. Please sign in again to view praesidia")
    //         // setErrStatus(401); 
    //     } else {
    //         console.error("Error fetching curia:", err);
    //     }
    // }
    return [obj, legionary];
}

