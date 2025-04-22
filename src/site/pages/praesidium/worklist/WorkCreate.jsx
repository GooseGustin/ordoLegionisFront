import axios from "axios";
import { useEffect, useState } from "react"
import { Link, NavLink, useLoaderData, useNavigate } from "react-router-dom"
import { BASEURL } from "../../../functionVault";

const WorkCreate = () => {

    const [_, workListObj, praesidium, isMember, isManager] = useLoaderData();

    console.log("In work create", workListObj); 
    const navigate = useNavigate(); 
    
    useEffect(() => {
        if (!isManager) {
            // leave this page if not manager
            navigate('/praesidium');
        }
    }, []);

    const [workForm, setWorkForm] = useState({
        metrics: {},
        name: '', 
        active: false, 
        tracking: true
    })

    const [metrics, setMetrics] = useState([]); 

    const handleName = (e) => {
        setWorkForm({
            ...workForm,
            name: e.target.value
        }); 
    }

    const handleIsActive = (e) => {
        setWorkForm({
            ...workForm,
            active: e.target.checked
        }); 
    }

    const handleMetrics = (e) => {
        let metricsList = e.target.value.split(',');
        console.log('metricsList after splitting', metricsList); 
        metricsList = metricsList.map(item => item.trim());
        console.log('metricsList after trimming', metricsList)
        setMetrics(metricsList); 
        let metricsObj = {}; 
        for (let i in metricsList) {
            const met = metricsList[i]; 
            if (met !== '') {metricsObj[met] = true;}
        }
        setWorkForm({
            ...workForm, 
            metrics: metricsObj
        })
    }

    const handleSubmitForm = async (e) => {
        e.preventDefault(); 

        console.log(workForm); 
        workListObj['details'].push(workForm);
        const workListObjUpdate = {
            ...workListObj, 
        }

        console.log("In handle submit, worklistupdate", workListObjUpdate);
        try {
            const token = localStorage.getItem('accessToken');
            if (token) {
                const config = {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                };

                // if (method === 'create') {
                const response = await axios.put(BASEURL + `works/work_list/${workListObj.id}/`, workListObj, config);
                console.log("Success!", response)
                console.log("WorkList Operation Successful!");
                // navigate(`../worklist`) : navigate('worklist')
                navigate('../')

            } else {
                console.log("Sign in to operate on worklists")
            }
        } catch (err) {
            if (err.status === 401) {
                console.log("The session is expired. Please sign in again to operate on worklists")
            } else if (err.status === 400) {
                console.log("Probably tried to create worklist for praesidium with one already", err)
                workListObj ? navigate(`/worklists/${workListObj.id}`) : navigate('/worklists')
            } else {
                console.log("Error during operation", err)
            }
        }
    }
    
    return (
        <div className='create-work'>
        {/* sidebar */}
        <div className="sidebar">
            <nav className="nav flex-column">
                <NavLink className="nav-link" to='../'>
                    <span className="icon">
                    <i class="fa-solid fa-shield-halved"></i> 
                    </span>
                    <span className="description">Praesidium</span>
                </NavLink>
                <NavLink className="nav-link" to='../meeting/create'>
                    <span className="icon">
                    <i class="fa-solid fa-plus"></i>
                    </span>
                    <span className="description">New meeting</span>
                </NavLink>                
                <NavLink className="nav-link" to='../worklist'>
                    <span className="icon">
                    <i class="fa-solid fa-bars"></i>
                    </span>
                    <span className="description">Work List</span>
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
            
        <h2>Create a new work</h2>
        <form onSubmit={handleSubmitForm}>
            <div className="row">
                
            <div className="col-12">
                {/* <label htmlFor=""> */}
                    <span className="col-12">Name</span>
                    <input 
                        type="text" 
                        name="name" id="" 
                        className="form-control border border-dark "
                        onChange={handleName}
                    />
                {/* </label> */}
            </div>

            <div className="col-10 mt-3 ">
                    <label htmlFor="active">
                        <span className="me-4">Is an active work</span>
                        <input type="checkbox" name="active" id="" 
                            className="form-check-input mx-1"
                            onChange={handleIsActive}
                        />
                    </label>
                </div>
            </div>
                

            <div className="border border-dark rounded rounded-3 p-3 my-3">
            <p className="fs-4">Metrics (optional)</p>
            <p>Enter items to keep count of during the course of the work. Separate with commas</p>
            <div className="row row-cols-lg-3 row-cols-md-2 row-cols-sm-2">
                <div className="col-10 mx-2 row">
                    {/* <label htmlFor=""> */}
                        <span>No. of </span>
                        <input 
                            type="text" 
                            name="metrics" id="" 
                            placeholder="Eg, Active Catholics, Separated brethren, Patients..."
                            className="form-control border border-dark"
                            onChange={handleMetrics}
                        />
                    {/* </label> */}
                </div>

            </div>
            </div>
            <hr />
            
            <div className="row">
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

export default WorkCreate

