import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useLoaderData, NavLink } from 'react-router-dom'
import { BASEURL, parseObjectKeys } from '../../../functionVault';


const RenderDetailsForm = ({ workTypeName, workTypeMetrics, handleFunction, workListDetails }) => {
    /* Work types are what are displayed 
        Work list is which are selected */
    const loc = 'In work list form render details'
    // console.log(loc, 'worklistdetails', workListDetails);
    // console.log(loc, 'worktype metrics', workTypeMetrics)

    // Remove any duplicate metrics 
    // for (let item in workListDetails) {
    //     if (findAll(workListDetails, item).length > 1) {
    //         // remove item 
    //         // console.log(item, 'from workListDetails is repeated. Must remove')   
    //     }
    // }

    // Get the metrics in the worklist for this specific worktype 
    
    // specificWorkListDetail = {
    //     "metrics": {
    //         "No. of Catholics": true,
    //         "No. of athiests": false,
    //         "No. of catechumen": true,
    //         "No. of hindus": false,
    //         "No. of muslims": false,
    //         "No. of separated brethren": true
    //     },
    //     "name": "Home Visitation",
    //     "active": true,
    //     "tracking": true
    // }
    let specificWorkListDetail = workListDetails.filter(function (item) {
        return item.name == workTypeName;
    });

    // console.log("Specific worklist detail", specificWorkListDetail);
    // const allMetrics = specificWorkListDetail[0]
    //     ? parseObjectKeys(specificWorkListDetail[0]['metrics'])
    //     : [] 

    // console.log(loc, 'selected metrics for', workTypeName, '::', specificWorkListDetail[0]
    //     ? parseObjectKeys(specificWorkListDetail[0]['metrics'])
    //     : [] 
    // )

    // console.log(loc, 'all metrics', allMetrics); 

    return (
        <>
            <p className="fs-4 mt-3">{workTypeName}</p>
            <div className="row row-cols-lg-2 row-cols-md-2 bg-light border border-dark">
                {
                workTypeMetrics[0]? 
                workTypeMetrics.map(metric => ( 
                    <div className='col' key={metric}>
                        
                        <label htmlFor="">
                            <span className="me-4">{metric}</span>
                            <input 
                                type="checkbox" 
                                name={workTypeName + ">>>" + metric}
                                className="form-check-input"
                                defaultChecked={
                                    specificWorkListDetail[0]
                                    ? specificWorkListDetail[0]['metrics'][metric]
                                    : false
                                }
                                value={metric}
                                onChange={handleFunction}
                            />
                            <br />
                        </label>
                    </div>
                    )
                ): 
                <div className="col">
                    <span className="me-4">Include this work</span>
                    <input type="checkbox" 
                        name={workTypeName + ">>>" + 'tracking'} id=""
                        className='form-check-input'
                        defaultChecked={
                            specificWorkListDetail[0]
                            ? specificWorkListDetail[0]['tracking']
                            : false
                        } 
                        value='tracking'
                        onChange={handleFunction}
                    />

                </div>
                }
            </div>
            
        </>
    )
}

const WorkListForm = (props) => {
    let [allWorkTypeOptions, workListObj, praesidium, isMember, isManager] = useLoaderData(); 
    const loc = "In worklist form"; 
    const navigate = useNavigate();
    const { method } = props;

    
    useEffect(() => {
        if (!isMember) {
            // leave this page if not member
            navigate('/praesidium');
        }
    }, []);

    console.log(loc, 'Object and method', workListObj, method)
    console.log("Initial work type array", allWorkTypeOptions); 

    const [btnTitle, setBtnTitle] = useState(method == 'create' ? "Create" : "Edit");
    const defaultDetails = workListObj.details; // initialised as empty on praesidium creation
    console.log(loc, 'check 1', defaultDetails);
    const [details, setDetails] = useState(defaultDetails);
    const [formData, setFormData] = useState({
        praesidium: praesidium.id,
        details: defaultDetails
    })

    // extend work type options to be displayed to include those created by user 
    // Get all works, both in and outside details 
    const inbuiltWorkNames = []; 
    allWorkTypeOptions.forEach(item => {
        inbuiltWorkNames.push(item.name); 
    })
    const extraWorkNames = []; 
    defaultDetails.forEach(item => {
        extraWorkNames.push(item.name); 
    })
    // extend allWorkTypeOptions 
    for (let i in extraWorkNames) {
        const extraWorkName = extraWorkNames[i];
        if (!inbuiltWorkNames.includes(extraWorkName)) {
            const extraWorkItem = defaultDetails.filter(item => item.name === extraWorkName)[0];
            const extraWorkMetrics = parseObjectKeys(extraWorkItem['metrics'])
            const workType = {
                name: extraWorkName, metrics: extraWorkMetrics
            }
            allWorkTypeOptions.push(workType); 
        }
    }
    // give new identifiers for each worktype
    for (let i=0; i<allWorkTypeOptions.length; i++) {
        allWorkTypeOptions[i]['key'] = i; 
    }
    console.log("Extended and reindexed allWorkTypeOptions", allWorkTypeOptions); 

    // let otherWorkTypeOptions; 

    const handleWorkTracking = (workObj) => {
        const name = workObj.name; 
        const metrics = workObj.metrics; 
        if (parseObjectKeys(metrics).length > 0) {
            workObj.active = true; 
        }
        const metricNames = parseObjectKeys(metrics); 
        let atLeastOneMetricIsTrue = false; 
        for (let i in metricNames) {
            atLeastOneMetricIsTrue += metrics[metricNames[i]];  
        }
        atLeastOneMetricIsTrue = Boolean(atLeastOneMetricIsTrue);
        console.log("In handleWorkTracking, check 8", name, metrics, atLeastOneMetricIsTrue)
        
        if (workObj.active) { // easily track or untrack for active works with metrics
            workObj.tracking = atLeastOneMetricIsTrue; 
        } else { // if no metrics or inactive, 
            console.log('What to do with inactive works??')
        }
        
        console.log("In handleWorkTracking, check 9", workObj)
        return workObj; 
    }

    const handleCheckboxChange = (e) => {
        const loc = 'In handleCheckboxChange';
        // console.log(e.target.name, e.target.checked);
        let [workName, workMetric] = e.target.name.split('>>>'); 
        console.log(loc, workName, workMetric, e.target.checked); 
        let detailsCopy = details; 
        console.log('check 7', detailsCopy); 

        // If the work details exist
        for (let key in detailsCopy) {
            if (detailsCopy[key].name === workName) { // detail of interest
                if (workMetric === 'tracking') {
                    console.log("tracking inactive work", workMetric);
                    detailsCopy[key].tracking = e.target.checked; 
                } else {
                    console.log("tracking active work", workMetric)
                    detailsCopy[key].metrics[workMetric] = e.target.checked; 
                }
            }
        }
    
        // Check status of form element name coming in: in or not in details?
        const workDetailNames = [];  // Get names of works already in details 
        detailsCopy.forEach(function (item) {
            workDetailNames.push(item.name); 
        })
        const workTypesNames = [];  // Get names of worktypes
        allWorkTypeOptions.forEach(function (item) {
            workTypesNames.push(item.name); 
        })
        // Check where the work is contained
        // Work will either be 
        // in worktypes 
            // and in details => added from a worktype 
            // and not in details => not yet tracked from worktype
        // or in details but not in worktypes => created as new work 
        const nameInDetails = workDetailNames.includes(workName); 
        const nameInTypeArray = workTypesNames.includes(workName); 

        if (!nameInDetails && nameInTypeArray) { // not yet tracked from worktype
            const inactiveWorkType = { 
                metrics: {},
                name: workName, 
                active: false, 
                tracking: true
            }
            if (e.target.checked) { // add to details if selected
                detailsCopy.push(inactiveWorkType);
            } else { // untrack if unselected 
                const ind = detailsCopy.indexOf(inactiveWorkType);
                if (detailsCopy[ind]) {
                    detailsCopy[ind] = {
                        ...inactiveWorkType, 
                        tracking: false
                    }
                }
            }
        }
        console.log('check 6', detailsCopy); 
        setDetails(detailsCopy); 
        // detailsForForm = detailsCopy; 
    }

    const submitWorkList = async (e) => {
        setBtnTitle(method == 'create' ? "Creating" : "Editing");

        // untrack any works with no checked metrics 
        let detailsCopy = []; 
        for (let i=0; i<details.length; i++) {
            // track or untrack each work object in details
            let obj = handleWorkTracking(details[i]);
            detailsCopy.push(obj); 
        }

        e.preventDefault();
        const formDataCopy = {
            ...formData, 
            details: detailsCopy
        }
        setFormData(formDataCopy)
        try {
            console.log("In submit work", details)
            console.log('Trying to send', formData);
            const token = localStorage.getItem('accessToken');
            if (token) {
                const config = {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                };

                if (method === 'create') {
                    const response = await axios.post(BASEURL + "works/work_list/", formDataCopy, config);
                    console.log("Success!", response)
                } else if (method === 'edit') {
                    const response = await axios.put(BASEURL + `works/work_list/${workListObj.id}/`, formDataCopy, config);
                    console.log("Success!", response)
                }
                console.log("WorkList Operation Successful!");
                // alert("Worklist Edited")
                workListObj ? navigate(`../worklist`) : navigate('worklist')

            } else {
                console.log("Sign in to operate on worklists")
            }
        } catch (err) {
            if (err.status === 401) {
                console.log("The session is expired. Please sign in again to operate on worklists")
                navigate('/account/login');
            } else if (err.status === 400) {
                console.log("Probably tried to create worklist for praesidium with one already", err)
                workListObj ? navigate(`/worklists/${workListObj.id}`) : navigate('/worklists')
            } else {
                console.log("Error during operation", err)
            }
        } finally {
            setBtnTitle('Edit');
        }
    }

    // console.log('WorkTypes', allWorkTypeOptions)
    // const pageTitle = "Edit your worklist";
    // const btnTitle = "Edit";

    if (!allWorkTypeOptions) {
        return (
            <div>
                <p>You are logged out. Please sign in again to create workLists.</p>
                <p><Link to='../../login'>Login</Link></p>
            </div>
        )
    }

    return (
        <div>
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
                    <NavLink className="nav-link" to='../meeting'>
                        <span className="icon">
                        <i class="fa-solid fa-calendar-days"></i>
                        </span>
                        <span className="description">Meetings</span>
                    </NavLink>
                    {isManager?
                    <NavLink className="nav-link" to='../create_work'>
                        <span className="icon">
                        <i class="fa-solid fa-plus"></i>
                        </span>
                        <span className="description">New work</span>
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

            {/* main content */}
            <div className='worklist-form main-content'>
                <h2>Edit your work list</h2>
                <hr />
                <form onSubmit={submitWorkList}>
                    
                    <p className="fs-4">Praesidium: {praesidium.name}</p>
                    {
                        allWorkTypeOptions.map(workTypeObj => (
                            <RenderDetailsForm 
                                key={workTypeObj.key}
                                workTypeName={workTypeObj.name}
                                workTypeMetrics={workTypeObj.metrics}
                                handleFunction={handleCheckboxChange}
                                workListDetails={details}
                            />
                        ))
                    }
                    <hr />

                    {isManager?
                    <div className="row">
                        <div className="col-6">
                            <button type="submit" className="btn btn-outline-success col-12 rounded rounded-5">{btnTitle}</button>
                        </div>
                        <div className="col">
                            <Link to={`../`} className="btn btn-outline-primary col-12 rounded rounded-5">Cancel</Link>
                        </div>
                    </div>
                    : <></>}
                </form>
            </div>
        </div>
    )
}


export default WorkListForm

// loader function 
export const workListFormLoader = async ({ params }) => {
    // return the worktypes and the current worklist
    const loc = "In work list form loader";
    const { pid } = params;  
    let isMember = false, isManager = false; 

    const token = localStorage.getItem('accessToken'); 
    if (token) {
        // console.log(loc, 'Get the workList');
        const config = {
            headers: {
                "Authorization": `Bearer ${token}` 
            }
        }; 
        const workTypesResponse = await axios.get(BASEURL + "works/work_type_option/", config); 
        const allWorkTypeOptions = workTypesResponse.data;
        // console.log(loc, 'Work types response:', allWorkTypeOptions);
        const praesidiumResponse = await axios.get(BASEURL + `praesidium/praesidium/${pid}`, config);
        const praesidium = praesidiumResponse.data;

        // Fetch the worklist details 
        const workListResponse = await axios.get(BASEURL + `works/work_list/?pid=${pid}`, config); 
        praesidium.worklist = workListResponse.data; 

        const workListObj = workListResponse.data; 

        const legionaryResponse = await axios.get(BASEURL + 'accounts/legionary_info', config); 
        const legionary = legionaryResponse.data;

        isMember = praesidium.members.includes(legionary.id)
        isManager = praesidium.managers.includes(legionary.id); 

        return [allWorkTypeOptions, workListObj, praesidium, isMember, isManager];  
    } else {
        console.log("Sign in to get the work types")
        throw Error("Logged out")
    }
}


