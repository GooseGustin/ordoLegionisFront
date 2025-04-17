import axios from 'axios';
import React, { useState } from 'react'
import { Link, NavLink, useLoaderData, useNavigate } from 'react-router-dom';

const BASEURL = "http://localhost:8000/api/";

const QuestionForm = (props) => {
    const navigate = useNavigate(); 
    const { method } = props; 
    const [questionObj, user, answers] = useLoaderData(); 

    const defaultContent = questionObj? questionObj.content : '';
    const [formData, setFormData] = useState({
        content: defaultContent, 
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

    const handleSubmitForm = async (e) => {
        e.preventDefault();

        try {
            console.log('Trying to send', formData); 
            console.log('questionObj', questionObj)
            const token = localStorage.getItem('accessToken'); 
                if (token) {
                    const config = {
                        headers: {
                            "Authorization": `Bearer ${token}`, 
                            "Content-Type": "multipart/form-data"
                        }
                    }; 

                    let questionResponse;
                    if (method==='create') {
                        questionResponse = await axios.post(`${BASEURL}social/questions/`, formData, config);
                        console.log("Success!", questionResponse.data) 
                    } else if (method==='edit') {
                        questionResponse = await axios.put(`${BASEURL}social/questions/${questionObj.id}/`, formData, config);
                        console.log("Success!", questionResponse.data) 

                        for (let key in answers) {
                            await axios.delete(`${BASEURL}social/answers/${answers[key].id}/`, config);
                        }
                        console.log("Successfully erased all answers of this question"); 
                    } 
    
                    console.log("Question Operation Successful!"); 
                    questionObj ? navigate(`../`): navigate(`../${questionResponse.data.id}`)
                    
                } else {
                    console.log("Sign in to operate on questions")
                }
        } catch (err) {
            if (err.status === 401) {
                console.log("The session is expired. Please sign in again to operate on questions")
                navigate('/account/login');
            } else {
                console.log("Error during operation", err)              
            }
            
        } // finally {
        //     setIsLoading(false);
        // }
    } 
        

    const pageTitle = method=='create' ? "Create a question": "Edit your question"; 
    const btnTitle = method=='create' ? "Create": "Edit"; 

    return (
        <div className='create-work'>
        {/* sidebar */}
        <div className="sidebar">
            <nav className="nav flex-column">
                {
                    method=='edit'
                    ? <NavLink className="nav-link" to='../create'>
                        <span className="icon">
                            <i className="fa-solid fa-right-from-bracket fa-lg"></i> 
                        </span>
                        <span className="description">New question</span>
                    </NavLink>
                    : <></>
                }
                <NavLink className="nav-link" to='../'>
                    <span className="icon">
                        <i className="fa-solid fa-right-from-bracket fa-lg"></i> 
                    </span>
                    <span className="description">My questions</span>
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
            
        <h2>{pageTitle}</h2>
        {
            method=='edit'
            ? <p className="my-3"><span className="text-danger">Note</span>: Editing this question will erase all previous answers</p>
            : <></>
        }
        <form onSubmit={handleSubmitForm} >

            <div className="row mt-3 ">
                <label htmlFor="content">
                    {/* <span className="me-4">Content</span> */}
                    <textarea 
                        name="content" id="" 
                        // cols="30" 
                        rows="10"
                        className='form-control border border-dark rounded rounded-3'
                        placeholder='Question'
                        onChange={handleChange}
                        defaultValue={defaultContent}
                    ></textarea>
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

export default QuestionForm


export const questionFormLoader = async ({ params }) => {
    const { id } = params; // id of question for edit 
    
    let obj, user, answers; 
    // try {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const config = {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            };
            if (id) {
                const response = await axios.get(BASEURL + `social/questions/${id}`, config);
                obj = response.data; 
                console.log('In question form loader, question', obj);
                
                const answersResponse = await axios.get(BASEURL + `social/answers/?qid=${obj.id}`, config);
                answers = answersResponse.data; 
                
            
            }
            const userResponse = await axios.get(BASEURL + 'accounts/user', config); 
            user = userResponse.data;

            console.log('user', user)
            // const curiaResponse = await axios.get(BASEURL + 'curia/curia/', config);
            // curiaList = curiaResponse.data; 
        } else {
            console.log("Sign in to get questions")
        }
    // } catch(err) {
    //     if (err.status === 401) {
    //         console.log("The session is expired. Please sign in again to view praesidia")
    //         // setErrStatus(401); 
    //     } else {
    //         console.error("Error fetching curia:", err);
    //     }
    // }
    return [obj, user, answers];
}

