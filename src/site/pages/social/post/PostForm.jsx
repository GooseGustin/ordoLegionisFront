import axios from 'axios';
import React, { useState } from 'react'
import { Link, NavLink, useLoaderData, useNavigate } from 'react-router-dom';

const BASEURL = "http://localhost:8000/api/";

const PostForm = (props) => {
    const navigate = useNavigate(); 
    const { method } = props; 
    const [postObj, legionary, user] = useLoaderData(); 

    // const [title, setTitle] = useState(); 
    const qualifiedToDelete = legionary? legionary.user.username === user.username: false; 
    console.log('Is authenticated', user.is_authenticated)

    console.log("in post form", postObj); 
    const defaultLegionary = legionary? legionary.user.username: ''; 
    if (legionary) {
        // defaultLegionary = ;
        console.log(defaultLegionary);
    }
    const defaultContent = postObj? postObj.content : '';
    const defaultTitle = postObj? postObj.title : '';
    const defaultImg = postObj? postObj.image: null 
    const [formData, setFormData] = useState({
        content: defaultContent, 
        title: defaultTitle, 
        image: defaultImg , 
        creator_name: user.username
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


    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('accessToken'); 
            if (token) {
                console.log('Get the post');
                const config = {
                    headers: {
                        "Authorization": `Bearer ${token}` 
                    }
                }; 
                const res = await axios.delete(`${BASEURL}social/posts/${postObj.id}/`, config); 
                console.log("Successfully deleted"); 
                navigate('../../')
            }  else {
                console.log("Sign in to delete the announcement")
            }
        } catch (err) {
            if (err.status === 401) {
                console.log("The session is expired. Please sign in again to delete this announcement")
            } else {
                console.error("Error deleting the announcement:", err);
            }
        }
    }


    const handleSubmitForm = async (e) => {
        e.preventDefault();

        try {
            console.log('Trying to send', formData); 
            console.log('postObj', postObj)
            const token = localStorage.getItem('accessToken'); 
                if (token) {
                    const config = {
                        headers: {
                            "Authorization": `Bearer ${token}`, 
                            "Content-Type": "multipart/form-data"
                        }
                    }; 

                    const formDataToSend = new FormData();

                    // Append form fields conditionally
                    for (const key in formData) {
                        if (key === "image") {
                            if (formData[key] instanceof File) {  // Only append if it's a new file
                                formDataToSend.append(key, formData[key]);
                            }
                        } else {
                            formDataToSend.append(key, formData[key]);
                        }
                    }

                    let postResponse;
                    if (method==='create') {
                        postResponse = await axios.post(`${BASEURL}social/posts/`, formDataToSend, config);
                        console.log("Success!", postResponse.data) 
                    } else if (method==='edit') {
                        postResponse = await axios.put(`${BASEURL}social/posts/${postObj.id}/`, formDataToSend, config);
                        console.log("Success!", postResponse.data) 
                    } 
    
                    console.log("Post Operation Successful!"); 
                    postObj ? navigate(`../`): navigate(`../${postResponse.data.id}`)
                    
                } else {
                    console.log("Sign in to operate on posts")
                }
        } catch (err) {
            if (err.status === 401) {
                console.log("The session is expired. Please sign in again to operate on posts")
                navigate('/account/login');
            } else {
                console.log("Error during operation", err)              
            }
            
        } // finally {
        //     setIsLoading(false);
        // }
    } 
        

    const pageTitle = method=='create' ? "Create a post": "Edit your post"; 
    const btnTitle = method=='create' ? "Create": "Edit"; 

    return (
        <div className=''>
        {/* sidebar */}
        <div className="sidebar">
            <nav className="nav flex-column">
                {
                    method=='edit'? 
                    <NavLink className="nav-link" to='../../create'>
                        <span className="icon">
                            <i className="fa-solid fa-right-from-bracket fa-lg"></i> 
                        </span>
                        <span className="description">New post</span>
                    </NavLink>
                    : <></>
                }
                
                <NavLink className="nav-link" to='../'>
                    <span className="icon">
                        <i className="fa-solid fa-right-from-bracket fa-lg"></i> 
                    </span>
                    <span className="description">My posts</span>
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
            
        <h2>Create a new post</h2>
        <form onSubmit={handleSubmitForm}>
            <div className="row ">
                <label htmlFor="title">
                    <span>Title</span>
                    <input 
                        type="text" 
                        name="title" id="" 
                        className="form-control border border-dark rounded rounded-3"
                        onChange={handleChange}
                        defaultValue={defaultTitle}
                    />
                </label>
            </div>

            <div className="row mt-3 ">
                <label htmlFor="content">
                    {/* <span className="me-4">Content</span> */}
                    <textarea 
                        name="content" id="" 
                        // cols="30" 
                        rows="10"
                        className='form-control border border-dark rounded rounded-3'
                        placeholder='Content'
                        onChange={handleChange}
                    >{defaultContent}</textarea>
                </label>
            </div>

            {
                postObj 
                ? (
                    <div className="container">
                        <img src={postObj.image} alt="" />
                    </div>
                )
                : <></>
            }

            <div className="row mt-3">
                <label htmlFor="image">
                    <span className="me-4">Image</span>
                    <input 
                        type="file" name="image" id="" 
                        className='form-control border border-dark rounded rounded-3'
                        onChange={handleChange}
                    />
                </label>
            </div>
                
            
            <div className="row mt-3">
                <div className="col">
                    <button type="submit" className="btn btn-outline-success col-12 rounded rounded-5">Save</button>
                </div>
                <div className="col">
                    <Link to={method=='edit'? '../': '../../../'}
                        className="btn btn-outline-primary col-12 rounded rounded-5"
                    >Cancel</Link>
                </div>
                {
                    (qualifiedToDelete && method=='edit')
                    ? <div className="col">
                        <Link 
                            to=''
                            className='btn btn-outline-danger col-12 rounded rounded-5'
                            onClick={handleDelete}
                        >Delete</Link>
                    </div>
                    : <></>
                }
            </div>
        </form>
        </div>

        </div>
    )
}

export default PostForm


export const postFormLoader = async ({ params }) => {
    const { id } = params; // id of post for edit 
    console.log('In post form loader, id', id); 
    
    let legionary, obj, user; 
    // try {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const config = {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            };
            if (id) {
                const response = await axios.get(BASEURL + `social/posts/${id}`, config);
                obj = response.data; 
                console.log('In post form loader, post', obj);

                const lid = obj.legionary; 
                const legResponse = await axios.get(BASEURL + `accounts/legionary/${lid}`, config);
                legionary = legResponse.data; 
            }
            const userResponse = await axios.get(BASEURL + 'accounts/user', config); 
            user = userResponse.data;
        } else {
            console.log("Sign in to get posts")
        }
    // } catch(err) {
    //     if (err.status === 401) {
    //         console.log("The session is expired. Please sign in again to view praesidia")
    //         // setErrStatus(401); 
    //     } else {
    //         console.error("Error fetching curia:", err);
    //     }
    // }
    return [obj, legionary, user];
}

