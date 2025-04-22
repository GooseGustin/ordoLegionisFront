import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { NavLink, Link, useLoaderData, useNavigate } from 'react-router-dom'
import { removeRepeatedFromArray } from '../../../functionVault';
import { BASEURL } from "../../../functionVault";

const MeetingForm = (props) => {
    const loc = "In meeting form"; 
    const [praesidium, workList, works, meetingObj, recordObj, objNotes, isMember, isManager] = useLoaderData();
    const { method } = props;
    const creating = method === 'create';
    const navigate = useNavigate();

    useEffect(() => {
        if (!isMember) {
            // leave this page if not member
            navigate('/praesidium');
        }
    }, []);

    console.log(loc, 'worklist', workList)

    const today = new Date();
    const defaultDate = meetingObj ? meetingObj.date : today.toISOString().substring(0, 10);
    const defaultMeeting = meetingObj ? meetingObj.id : 1; 
    const defaultMeetingNo = meetingObj ? meetingObj.meeting_no : 1;
    const defaultNoPresent = meetingObj ? meetingObj.no_present : 1;
    const defaultOfficersAtMeeting = meetingObj ? meetingObj.officers_meeting_attendance : ["Vice President", "Treasurer"] // [];
    const defaultOfficersAtCuria = meetingObj ? meetingObj.officers_curia_attendance : [];
    const defaultNotes = objNotes
            ? objNotes
            : {
                meeting: null, 
                content: ''
            };
    const [officersMeetingAttendance, setOfficersMeetingAttendance] = useState(defaultOfficersAtMeeting);
    const [officersCuriaAttendance, setOfficersCuriaAttendance] = useState(defaultOfficersAtCuria); 
    const [notes, setNotes] = useState(defaultNotes);
    console.log("\n\nInitial notes", notes)

    const [meetingFormData, setMeetingFormData] = useState({
        praesidium: praesidium.id,
        date: defaultDate,
        meeting_no: defaultMeetingNo,
        no_present: defaultNoPresent,
        officers_meeting_attendance: defaultOfficersAtMeeting,
        officers_curia_attendance: defaultOfficersAtCuria, 
    })

    ////////////////////////////////////////////////////////////////////////
    const defaultAcctStatement = recordObj ? recordObj.acct_statement : {
        acf: 0, sbc: 0, balance: 0
    };
    const defaultStatementAcf = recordObj ? recordObj.acct_statement.acf : 0;
    const defaultStatementSbc = recordObj ? recordObj.acct_statement.sbc : 0;
    const defaultStatementBalance = recordObj ? recordObj.acct_statement.balance : 0;

    const defaultExpenses = recordObj ? recordObj.acct_statement.expenses : {
        extension: 0, remittance: 0, stationery: 0, altar: 0,
        bouquet: 0, others: {}
    };
    const defaultExpenseExtension = recordObj ? recordObj.acct_statement.expenses.extension : 0;
    const defaultExpenseRemittance = recordObj ? recordObj.acct_statement.expenses.remittance : 0;
    const defaultExpenseStationery = recordObj ? recordObj.acct_statement.expenses.stationery : 0;
    const defaultExpenseAltar = recordObj ? recordObj.acct_statement.expenses.altar : 0;
    const defaultExpenseBouquet = recordObj ? recordObj.acct_statement.expenses.bouquet : 0;
    const defaultExpenseOthers = recordObj ? recordObj.acct_statement.expenses.others : {purpose: '', value: 0};

    const defaultAcctAnnouncement = recordObj ? recordObj.acct_announcement : {
        sbc: 0, collection_1: 0, collection_2: 0
    };
    const defaultAnnouncementSbc = recordObj ? recordObj.acct_announcement.sbc : 0;
    const defaultAnnouncementCol1 = recordObj ? recordObj.acct_announcement.collection_1 : 0;
    const defaultAnnouncementCol2 = recordObj ? recordObj.acct_announcement.collection_2 : 0;

    const [financialRecord, setFinancialRecord] = useState({
        meeting: defaultMeeting,
        acct_statement: defaultAcctStatement,
        acct_announcement: defaultAcctAnnouncement
    })

    const activeWorksList = workList.details.filter(item => {
        return item.active
    })
    const activeWorks = activeWorksList.map(item => item.name);
    let defaultWorkDetails = {}
    let defaultAssignedWorks = []; 
    let defaultDoneWorks = [];

    console.log(loc, 'works', works);
    if (works) {
        works.forEach((work) => {
            defaultWorkDetails[work.type] = work.details;
            defaultAssignedWorks.push(work.type);
            if (work.done) {defaultDoneWorks.push(work.type)}
        })
    }
    const [doneWorks, setDoneWorks] = useState(defaultDoneWorks); 
    const [assignedWorks, setAssignedWorks] = useState(defaultAssignedWorks); 

    // console.log(loc, 'default work details', defaultWorkDetails); 
    const [workDetails, setWorkDetails] = useState(defaultWorkDetails)

    ///////////////////////////////////////
    const handleNotesChange = (e) => {
        setNotes({
            ...notes, 
            content: e.target.value
        });
        console.log('notes', notes, e.target.value); 
    }
    const handleWorkChange = (e) => {
        const loc = "In handle work change"; 
        console.log(loc, e.target.name);
        const targetName = e.target.name; 
        const metric = targetName.substring(targetName.lastIndexOf("_")+1); 
        const workType = targetName.substring(0, targetName.lastIndexOf("_")); 

        if (metric === 'done') {
            // console.log(loc, 'done?', e.target.checked); 
            let closet = removeRepeatedFromArray(doneWorks); 
            if (e.target.checked) {
                closet.push(workType); 
                setDoneWorks(closet);
            } else {
                closet.splice(closet.indexOf(workType), 1);
                setDoneWorks(closet); 
            }
        } else if (metric === 'assigned') {
            // console.log(loc, 'assigned?', e.target.checked); 
            let closet = removeRepeatedFromArray(assignedWorks); 
            if (e.target.checked) {
                closet.push(workType); 
                setAssignedWorks(closet);
            } else {
                closet.splice(closet.indexOf(workType), 1);
                setAssignedWorks(closet); 
            }
        } else  {
            // console.log(loc, 'metric', metric, e.target.value)
            let closet = workDetails; 
            closet[workType] = {
                ...closet[workType], 
                [metric]: e.target.value
            };
            setWorkDetails(closet); 
        }
        // console.log('assigned works', assignedWorks); 
        // console.log('done works', doneWorks); 
        // console.log('work details', workDetails); 
    }

    const [acctStatement, setAcctStatement] = useState(defaultAcctStatement);
    const handleStatementChange = (e) => {
        setAcctStatement({
            ...acctStatement,
            [e.target.name]: e.target.value * 1
        });
        console.log("handled statement", acctStatement);
    }

    const [acctAnnouncement, setAcctAnnouncement] = useState(defaultAcctAnnouncement);
    const handleAnnouncementChange = (e) => {
        setAcctAnnouncement({
            ...acctAnnouncement,
            [e.target.name]: e.target.value * 1
        });
        console.log('handled announcement', acctAnnouncement);
    }

    const [expenses, setExpenses] = useState(defaultExpenses);

    const pageTitle = method === 'create' ? "Create a meeting" : "Edit your meeting";
    const [btnTitle, setBtnTitle] = useState(method == 'create' ? "Create" : "Edit");


    const handleExpensesChange = (e) => {
        const [name, type] = e.target.name.split('_'); 
        if (name=='others') {
            if (type=='value') {
                setExpenses({
                    ...expenses,
                    others: {
                        ...expenses.others, 
                        value: e.target.value*1
                    }
                });
            } else {
                setExpenses({
                    ...expenses,
                    others: {
                        ...expenses.others, 
                        purpose: e.target.value
                    }
                });
            }
        } else {
            setExpenses({
                ...expenses,
                [e.target.name]: e.target.value * 1
            });
        }
        
        console.log("handled expenses", expenses, e)
    }

    const handleMeetingChange = (e) => {
        console.log(e.target.name); 
        setMeetingFormData({
            ...meetingFormData,
            [e.target.name]: e.target.value
        });
    }

    const handleAttendanceChange = (e) => {
        console.log(e.target.name)
        const officerMapping = {
            pres_at: "President", 
            vp_at: "Vice President", 
            sec_at: "Secretary", 
            tres_at: "Treasurer"
        }
        const targetName = e.target.name; 
        const council = targetName.substring(targetName.lastIndexOf("_")+1); 
        const officer = targetName.substring(0, targetName.lastIndexOf("_")); 
        
        const officeName = officerMapping[officer];
        if (council == 'meeting') { // If praesidium meeting 
            var closet = officersMeetingAttendance; 
            console.log('Closet meeting:', closet)
            if (!officersMeetingAttendance.includes(officeName)) { // If not already recorded, add to record
                closet.push(officeName);
            } else { // If already recorded, remove from record
                closet.splice(closet.indexOf(officeName), 1);
            }
            setOfficersMeetingAttendance(closet);
        } else if (council == 'curia') { // If curia meeting
            var closet = officersCuriaAttendance; 
            console.log('Closet curia:', closet)
            if (!officersCuriaAttendance.includes(officeName)) { // If not already recorded, add to record
                closet.push(officeName);
            } else { // If already recorded, remove from record
                closet.splice(closet.indexOf(officeName), 1)    ;
            }
            setOfficersCuriaAttendance(closet);
        }
        console.log(officersMeetingAttendance, officersCuriaAttendance);
        setMeetingFormData({
            ...meetingFormData, 
            officers_meeting_attendance: officersMeetingAttendance, 
            officers_curia_attendance: officersCuriaAttendance
        })
    }


    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('accessToken'); 
            if (token) {
                console.log('Delete the meeting');
                const config = {
                    headers: {
                        "Authorization": `Bearer ${token}` 
                    }
                }; 
                const res = await axios.delete(BASEURL+"meetings/meetings/"+ meetingObj.id +"/", config); 
                console.log("Successfully deleted"); 
                navigate("../")
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

    const submitMeeting = async (e) => {
        const loc = "In submit meeting";
        e.preventDefault();
        setBtnTitle(method == 'create' ? "Creating" : "Editing");
        try {
            // console.log('Trying to send', meetingFormData);
            const token = localStorage.getItem('accessToken');
            if (token) {
                const config = {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                };

                const acctStatementCopy = {
                    ...acctStatement,
                    expenses: expenses
                }

                let financialRecordCopy = {
                    ...financialRecord, 
                    acct_statement: acctStatementCopy, 
                    acct_announcement: acctAnnouncement 
                };

                // extend assignedWorks by doneWorks to capture all assigned works
                // console.log(loc, 'assigned and done works', assignedWorks, doneWorks);
                let allAssignedWorks = removeRepeatedFromArray(assignedWorks);
                doneWorks.forEach((item) => {
                    if (!assignedWorks.includes(item)) {
                        allAssignedWorks.push(item)
                    }
                })
                setAssignedWorks(allAssignedWorks);
                // console.log('\n\n', loc, 'assigned works copy', allAssignedWorks);

                // loop through assigned works and get works list for submission
                let meetId;  

                if (method === 'create') {
                    // Create meeting
                    // console.log(loc, "meeting form data", meetingFormData); 
                    const meetingResponse = await axios.post(BASEURL + "meetings/meetings/", meetingFormData, config);
                    // console.log("Success!", meetingResponse)
                    meetId = meetingResponse.data.id;

                    // create notes
                    // doesn't exist, create new 
                    const notesCopy = {
                        ...notes, 
                        meeting: meetId, 
                    }
                    console.log("creating meeting notes", notesCopy)
                    const notesResponse = await axios.post(BASEURL + "meetings/notes/", notesCopy, config); 

                    // Create financial record
                    financialRecordCopy = {
                        ...financialRecordCopy, 
                        meeting: meetId
                    };
                    // console.log(loc, "financial record form", financialRecordCopy)
                    const recordResponse = await axios.post(BASEURL + "finance/records/", financialRecordCopy, config);
                    // console.log("FinancialRecord created!", recordResponse.data);

                    // Create works
                    for (let i=0; i<allAssignedWorks.length; i++) {
                        const workItem = allAssignedWorks[i];
                        const workObj = {
                            type: workItem,
                            active: activeWorks.includes(workItem),
                            done: doneWorks.includes(workItem),
                            meeting: meetId,
                            details: workDetails[workItem]? workDetails[workItem]: {}
                        }
                        // console.log(loc, 'creating', workObj);
                        const workResponse = await axios.post(BASEURL + "works/work/", workObj, config);
                        // console.log("Success!", workResponse.data)
                    }


                } else if (method === 'edit') {

                    // Edit meeting
                    // console.log(loc, "meeting form data", meetingFormData); 
                    meetId = meetingObj.id;
                    const meetingResponse = await axios.put(BASEURL + `meetings/meetings/${meetId}/`, meetingFormData, config);
                    // console.log("Success!", meetingResponse)
                    

                    // edit notes
                    // notes is either null or it exists
                    const notesCopy = {
                        ...notes, 
                        meeting: meetId, 
                    }
                    setNotes(notesCopy); 
                    console.log("meeting notes for editing", notesCopy)
                    let notesResponse;
                    if (objNotes) { 
                        // Update if already exists
                        notesResponse = await axios.put(BASEURL + `meetings/notes/${notes.id}/`, notesCopy, config); 
                        console.log("notes edited", notesResponse.data)
                    } else {
                        // Create if none
                        notesResponse = await axios.post(BASEURL + "meetings/notes/", notesCopy, config); 
                        console.log("notes created for existing meeting", notesResponse.data)
                    }
                    // notesResponse = await axios.put(BASEURL + `meetings/notes/${notes.id}/`, notesCopy, config); 
                    
                    
                    // Edit financial record
                    financialRecordCopy = {
                        ...financialRecordCopy, 
                        meeting: meetId
                    };
                    // console.log(loc, "financial record form", financialRecordCopy)
                    const recordResponse = await axios.put(BASEURL + `finance/records/${recordObj.id}/`, financialRecordCopy, config);
                    // console.log("FinancialRecord edited!", recordResponse.data);

                    // De;lete and create works
                    for (let i=0; i<works.length; i++) {
                        await axios.delete(BASEURL + `works/work/${works[i]['id']}/`, config); 
                    }

                    for (let i=0; i<allAssignedWorks.length; i++) {
                        const workItem = allAssignedWorks[i];
                        // console.log(loc, doneWorks, doneWorks.includes(workItem))
                        const workObj = {
                            type: workItem,
                            active: activeWorks.includes(workItem),
                            done: doneWorks.includes(workItem),
                            meeting: meetId,
                            details: workDetails[workItem]? workDetails[workItem]: {}
                        }
                        // console.log(loc, 'editing:', workObj);
                        const workResponse = await axios.post(BASEURL + "works/work/", workObj, config);
                        // console.log("Successfully Edited!", workResponse.data)
                    }
                }
                console.log("Meeting Operation Successful!");

                navigate(`../${meetId}`) 

            } else {
                console.log("Sign in to operate on meetings")
            }
        } catch (err) {
            if (err.status === 401) {
                console.log("The session is expired. Please sign in again to operate on meetings")
                navigate('/account/login');
            } else {
                console.log("Error during operation", err)
            }

        }
        setBtnTitle('Edit');
    }


    return (
        <div className='meeting-form pt-3'>
            {/* sidebar */}
            <div className="sidebar">
                <nav className="nav flex-column">
                    <NavLink className="nav-link" to='../../'>
                        <span className="icon">
                        <i class="fa-solid fa-shield-halved"></i> 
                        </span>
                        <span className="description">Praesidium</span>
                    </NavLink>
                    {isManager? 
                    <NavLink className="nav-link" to='../create'>
                        <span className="icon">
                        <i class="fa-solid fa-plus"></i>
                        </span>
                        <span className="description">New meeting</span>
                    </NavLink>
                    : <></>}
                    <NavLink className="nav-link" to='../'>
                        <span className="icon">
                        <i class="fa-solid fa-calendar-days"></i>
                        </span>
                        <span className="description">Meetings</span>
                    </NavLink>
                    <NavLink className="nav-link" to='../../worklist'>
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
            <h2 className="mt-5">{pageTitle}</h2>
            <hr />
            <form onSubmit={submitMeeting}>

                <p className="fs-4">Praesidium: {praesidium.name}</p>

                    {!workList.details[0] && (
                        <p className="fs-5 mt-2 text-danger">Go to Work List to select works</p>
                    )}
                        

                <div className="row">
                    <div className="col">
                        <label htmlFor="date">
                        Date: <input
                                type="date" name='date'
                                id='date' className='form-control border border-dark'
                                onChange={handleMeetingChange}
                                defaultValue={defaultDate}
                            />
                        </label>
                    </div>
                </div>

                <div className="attendance border border-dark rounded rounded-3 p-3 my-2">
                <p className="fs-2 ">Attendance</p>
                <hr />
                <div className="row row-cols-lg-2">
                    <div className="col">
                        <label htmlFor="meeting_no">
                            <span className="me-1">Meeting no.</span>
                            <input
                                type="number"
                                name="meeting_no" id="meeting_no"
                                className='form-control-sm rounded rounded-3 border border-dark'
                                onChange={handleMeetingChange}
                                defaultValue={defaultMeetingNo} />
                        </label>
                    </div>
                    <div className="col">
                        <label htmlFor="no_present"> 
                            <span className="me-1">No. present</span>
                            <input
                                type="number"
                                name="no_present" id="no_present"
                                className='form-control-sm rounded rounded-3 border border-dark'
                                onChange={handleMeetingChange}
                                defaultValue={defaultNoPresent} />
                        </label>

                    </div>
                </div>

                <hr />
                <fieldset>
                <p className='fs-4'>Officers at meeting:</p>
                <div className="row">
                    <div className="col-md-3">
                        <label htmlFor="pres_at_meeting"><span className="me-4">President</span>
                        <input 
                            type="checkbox" 
                            className="form-check-input mx-1"
                            onChange={handleAttendanceChange} 
                            name="pres_at_meeting" id="pres_at_meeting" 
                            defaultChecked={defaultOfficersAtMeeting.includes("President")}
                        />
                    </label>
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="vp_at_meeting"><span className="me-4">Vice President</span>
                        <input 
                            type="checkbox" 
                            className="form-check-input mx-1"
                            onChange={handleAttendanceChange} 
                            name="vp_at_meeting" id="vp_at_meeting" 
                            defaultChecked={defaultOfficersAtMeeting.includes("Vice President")}
                        />
                    </label>
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="sec_at_meeting"><span className="me-4">Secretary</span>
                        <input 
                            type="checkbox" 
                            className="form-check-input mx-1"
                            onChange={handleAttendanceChange} 
                            name="sec_at_meeting" id="sec_at_meeting"                             
                            defaultChecked={defaultOfficersAtMeeting.includes("Secretary")}
                        />
                    </label>
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="tres_at_meeting"><span className="me-4">Treasurer</span>
                        <input 
                            type="checkbox" 
                            className="form-check-input mx-1"
                            onChange={handleAttendanceChange} 
                            name="tres_at_meeting" id="tres_at_meeting"
                            defaultChecked={defaultOfficersAtMeeting.includes("Treasurer")}
                        />
                    </label>
                    </div>
                </div>         
                </fieldset>
                <hr />
                <fieldset>
                <p className="fs-4">Officers at curia:</p>
                <div className="row">
                    <div className="col-md-3">
                        <label htmlFor="pres_at_curia"><span className="me-4">President</span>
                        <input 
                            type="checkbox" 
                            className="form-check-input mx-1"
                            onChange={handleAttendanceChange} 
                            name="pres_at_curia" id="pres_at_curia" 
                            defaultChecked={defaultOfficersAtCuria.includes("President")}
                        />
                    </label>
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="vp_at_curia"><span className="me-4">Vice President</span>
                        <input 
                            type="checkbox" 
                            className="form-check-input mx-1"
                            onChange={handleAttendanceChange} 
                            name="vp_at_curia" id="vp_at_curia" 
                            defaultChecked={defaultOfficersAtCuria.includes("Vice President")}
                        />
                    </label>
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="sec_at_curia"><span className="me-4">Secretary</span>
                        <input 
                            type="checkbox" 
                            className="form-check-input mx-1"
                            onChange={handleAttendanceChange} 
                            name="sec_at_curia" id="sec_at_curia"                             
                            defaultChecked={defaultOfficersAtCuria.includes("Secretary")}
                        />
                    </label>
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="tres_at_curia"><span className="me-4">Treasurer</span>
                        <input 
                            type="checkbox" 
                            className="form-check-input mx-1"
                            onChange={handleAttendanceChange} 
                            name="tres_at_curia" id="tres_at_curia"
                            defaultChecked={defaultOfficersAtCuria.includes("Treasurer")}
                        />
                    </label>
                    </div>
                </div>   
                </fieldset>
                </div>

                <div className="finances border border-dark rounded rounded-3 p-3 my-2">


                <p className="fs-2">Finances</p>                    
                {/* Acct Statement */}
                <hr />
                <fieldset>
                    <p className="fs-4">Account Statement</p>
                    <div className="acct-statement row row-cols-lg-3 row-cols-md-2">
                        <div className="col">
                            <label htmlFor="acf"><span className="me-1">ACF</span>
                                <input 
                                    type="number" name="acf" id=""
                                    className='form-control-sm rounded rounded-3 border border-dark'
                                    onChange={handleStatementChange}
                                    defaultValue={defaultStatementAcf} />
                            </label>
                        </div>
                        <div className="col">
                            <label htmlFor="sbc"><span className="me-1">SBC</span>
                                <input 
                                    type="number" name="sbc" id=""
                                    className='form-control-sm rounded rounded-3 border border-dark'
                                    onChange={handleStatementChange}
                                    defaultValue={defaultStatementSbc} />
                            </label>
                        </div>
                        <div className="col">
                            <label htmlFor="balance"><span className="me-1">Balance</span>
                                <input 
                                    type="number" name="balance" id=""
                                    className='form-control-sm rounded rounded-3 border border-dark'
                                    onChange={handleStatementChange}
                                    defaultValue={defaultStatementBalance} />
                            </label>
                        </div>
                    </div>
                </fieldset>

                {/* Expenses */}
                <hr />
                <p className="fs-4">Expenses</p>
                <fieldset>
                    <div className="expenses row row-cols-lg-3 row-cols-md-2 gy-2">
                        <div className="col">
                        <label htmlFor="remittance"><span className="me-1">Remittance</span>
                            <input type="number" name="remittance" id=""
                                className='form-control-sm rounded rounded-3 border border-dark'
                                onChange={handleExpensesChange} 
                                defaultValue={defaultExpenseRemittance} />
                        </label>
                        </div>
                        <div className="col">
                        <label htmlFor="extension"><span className="me-1">Extension</span>
                            <input type="number" name="extension" id=""
                                className='form-control-sm rounded rounded-3 border border-dark'
                                onChange={handleExpensesChange} 
                                defaultValue={defaultExpenseExtension}/>
                        </label>
                        </div>
                        <div className="col">
                        <label htmlFor="stationery"><span className="me-1">Stationery</span>
                            <input type="number" name="stationery" id=""
                                className='form-control-sm rounded rounded-3 border border-dark'
                                onChange={handleExpensesChange} 
                                defaultValue={defaultExpenseStationery} />
                        </label>

                        </div>
                        <div className="col">
                        <label htmlFor="altar"><span className="me-1">Altar</span>
                            <input type="number" name="altar" id=""
                                className='form-control-sm rounded rounded-3 border border-dark'
                                onChange={handleExpensesChange} 
                                defaultValue={defaultExpenseAltar} />
                        </label>

                        </div>
                        <div className="col">
                        <label htmlFor="bouquet"><span className="me-1">Spiritual Bouquet</span>
                            <input type="number" name="bouquet" id=""
                                className='form-control-sm rounded rounded-3 border border-dark'
                                onChange={handleExpensesChange} 
                                defaultValue={defaultExpenseBouquet} />
                        </label>

                        </div>
                        
                    </div>
                    <div className="row row-cols-lg-3 row-cols-md-2 mt-3 gy-2 border mx-2 p-2">
                        <div className="col col-md-2 col-lg-1">
                            <label htmlFor="">
                                <span className="me-1">Others</span>
                            </label>
                        </div>
                        <div className="col-md-10 col-sm-10">
                            <input 
                                type="text" name='others_purpose'
                                className="form-control border border-dark" 
                                placeholder='Purpose'
                                defaultValue={defaultExpenseOthers.purpose}
                                onChange={handleExpensesChange}
                                />
                        </div>
                        <div className="col-md-10 col-sm-10">
                            <input 
                                type="number" 
                                name="others_value" 
                                className='form-control-sm rounded rounded-3 border border-dark'
                                // placeholder='0'
                                defaultValue={defaultExpenseOthers.value}
                                onChange={handleExpensesChange} 
                            />
                            {/* <span className="icon ">
                                <i className="bi bi-grid">+</i>
                            </span> */}
                        </div>
                    </div>
                </fieldset>

                {/* Acct Announcement */}
                <hr />
                <fieldset>
                    <p className="fs-4">Account Announcement</p>
                    <div className="acct-announcementrow row row-cols-lg-3 row-cols-md-2">
                        <div className="col">
                            <label htmlFor="sbc"><span className="me-1">SBC</span>
                                <input 
                                    type="number" name="sbc" id=""
                                    className='form-control-sm rounded rounded-3 border border-dark'
                                    onChange={handleAnnouncementChange}
                                    defaultValue={defaultAnnouncementSbc} />
                            </label>
                        </div>
                        <div className="col">
                            <label htmlFor="collection_1"><span className="me-1">Collection 1</span>
                                <input 
                                    type="number" name="collection_1" id=""
                                    className='form-control-sm rounded rounded-3 border border-dark'
                                    onChange={handleAnnouncementChange}
                                    defaultValue={defaultAnnouncementCol1} />
                            </label>
                        </div>
                        <div className="col">
                            <label htmlFor="collection_2"><span className="me-1">Collection 2</span>
                                <input 
                                    type="number" name="collection_2" id=""
                                    className='form-control-sm rounded rounded-3 border border-dark'
                                    onChange={handleAnnouncementChange}
                                    defaultValue={defaultAnnouncementCol2} />
                            </label>
                        </div>
                    </div>
                </fieldset>
                </div>

                <div className="works border border-dark rounded rounded-3 p-3 my-2">

                {/* Works */}
                <p className="fs-2">Works</p>
                <hr />
                {workList.details[0]
                ?
                <fieldset className="px-3">
                    <div className="row row-cols-sm-2 row-cols-lg-2 row-cols-md-2">
                        {workList.details.map(typeObj => {
                            let validMetrics = []; 
                            for (let key in typeObj.metrics) {
                                if (typeObj.metrics[key]) {
                                    validMetrics.push(key)
                                }
                            }
                            return (
                                <div className="col mx-4 p-1" key={typeObj.id}>
                                    <div className="row work-type-obj">{typeObj.name}
                                    </div>
                                    <div className="row">
                                        <label htmlFor={typeObj.name+"_assigned"} className="px-4">
                                            <span className="me-4">Assigned</span>
                                        <input 
                                            type="checkbox" 
                                            name={typeObj.name+"_assigned"} id={typeObj.name+"_assigned"}
                                            className='ms-2 mx-1 me-2 form-check-input'
                                            defaultChecked={assignedWorks.includes(typeObj.name)}
                                            onChange={handleWorkChange}
                                            />
                                        </label>
                                        <label htmlFor={typeObj.name+"_done"}  className="px-4">
                                            <span className="-2">Done</span>
                                        <input 
                                            type="checkbox" 
                                            name={typeObj.name+"_done"} id={typeObj.name+"_done"} 
                                            className='mx-1 form-check-input'
                                            defaultChecked={doneWorks.includes(typeObj.name)}
                                            onChange={handleWorkChange}
                                        /></label>
                                    </div>
                                    <div className="row">
                                        {validMetrics.map(metric => (
                                            <label htmlFor={metric} key={metric}>
                                                <input 
                                                    type="number" 
                                                    name={typeObj.name + "_" + metric} 
                                                    className="form-control-sm rounded rounded-3 border border-dark" 
                                                    defaultValue={works? 
                                                        // Don't try to understand it; just feel it :)
                                                        works.filter(work => {
                                                            // console.log('In work form', work);
                                                            return work.type === typeObj.name;
                                                        })[0]? 
                                                        works.filter(work => {
                                                            // console.log('In work form', work);
                                                            return work.type === typeObj.name;
                                                        })[0]['details'][metric]: 0: 0
                                                    }
                                                    onChange={handleWorkChange}
                                                /> <span className="ms-1">{metric}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </fieldset>
                : <p className='text-danger'>Go to Work List to select works</p>
                }
                </div>

                <div className="notes border border-dark rounded rounded-3 mb-4">
                    <textarea 
                        name="notes" id="" 
                        rows="4"
                        className='form-control'
                        placeholder='Notes'
                        defaultValue={defaultNotes.content}
                        onChange={handleNotesChange}></textarea>
                </div>

                {isManager?
                <div className="row">
                {
                    (creating)? 
                    <>
                    <div className="col-6">
                        <button type="submit" className="btn btn-outline-success col-12 rounded rounded-5">{btnTitle}</button>
                    </div>
                    <div className="col">
                        <Link to="../../" className="btn btn-outline-primary col-12 rounded rounded-5">Cancel</Link>
                    </div>
                    </>
                    : 
                    <>
                    <div className="col-6">
                        <button type="submit" className="btn btn-outline-success col-12 rounded rounded-5">{btnTitle}</button>
                    </div>
                    <div className="col">
                        <Link to="../../" className="btn btn-outline-primary col-12 rounded rounded-5">Cancel</Link>
                    </div>
                    <div className="col">
                        <Link to='' 
                            className='btn btn-outline-danger col-12 rounded rounded-5'
                            onClick={handleDelete}
                        >Delete</Link>
                    </div>
                    </>
                }
                </div>
                : <></>
                }


            </form>
            </div>
        </div>
    )

}

export default MeetingForm


export const meetingFormLoader = async ({params}) => {
    // Get praesidium for meeting creation
    const loc = "In meeting form loader"; 
    const { pid, mid } = params; 
    // console.log(loc, pid, params);
    // console.log(loc, 'mid', mid);
    let praesidium, workList, works, meeting, record, notes; 
    let isMember = false, isManager = false; 

    // try {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const config = {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            };
            const praesidiumResponse = await axios.get(BASEURL + "praesidium/praesidium/" + pid, config);
            praesidium = praesidiumResponse.data; 
            const workListResponse = await axios.get(BASEURL + `works/work_list/?pid=${praesidium.id}`, config); 
            workList = workListResponse.data;

            if (mid) {
                // get meeting 
                const meetingResponse = await axios.get(BASEURL + "meetings/meetings/" + mid, config);
                meeting = meetingResponse.data; 
                console.log(loc, 'meeting obj', meeting)
                // get notes
                const nid = meeting.notes; 
                if (nid) {
                    const notesResponse = await axios.get(`${BASEURL}meetings/notes/${nid}/`, config); 
                    notes = notesResponse.data; 
                }
                // get financial record
                const recordResponse = await axios.get(BASEURL + "finance/records/?mid=" + mid, config);
                record = recordResponse.data; 
                console.log(loc, 'record obj', record)
                // get works 
                const worksResponse = await axios.get(BASEURL + `works/work/?mid=${mid}`, config);
                works = worksResponse.data; 
                console.log(loc, 'works array', works); 
            }

            // filter out untracked works from worklist 
            const details = workList.details; 
            workList.details = details.filter(obj => obj.tracking===true);

            // Add an id property to each workist worktype
            let count = 1;
            let workListWithIds = []; 
            workList.details.forEach(function (item) {
                workListWithIds.push({
                    ...item, 
                    id: count
                }); 
                count++;
            })
            workList.details = workListWithIds;

            const legionaryResponse = await axios.get(BASEURL + 'accounts/legionary_info', config); 
            const legionary = legionaryResponse.data;

            isMember = praesidium.members.includes(legionary.id)
            isManager = praesidium.managers.includes(legionary.id); 

        } else {
            console.log("Sign in to get praesidia paradisei")
        }
        
        return [praesidium, workList, works, meeting, record, notes, isMember, isManager]; 
    // }

}

