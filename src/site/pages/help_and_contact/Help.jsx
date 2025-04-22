import React from 'react'
import { Link, NavLink } from 'react-router-dom'

const Help = ({ pageKey, method }) => {
    console.log('in help', pageKey, method)

    console.log('help page', pageKey); 

    const backLink = method? method=='create'? '../create': '../edit' : '../'; 
    console.log('backLink', backLink);

    const helpDocs = {
        praesidium_list : (
            <>
            <h5>Welcome to the list of praesidia and curiae</h5>
            <p>This page contains praesidia that you are a manager of or a member of as well as curiae that you manage or curiae that any praesidia you belong to is associated with. Only managers can edit praesidium and curia.</p>
            <p>Follow the following steps to setup:</p>
            <ul>
                <li>Create a praesidium: Fill in the details of your praesidium. If the curia you are associated with is not listed among the options, then it must first be created.</li>
                <li>Create a curia: Enter the details of your curia and save. Return and create your praesidium.</li>
                <li>Create a work list: You must create a work list containing the list of works that your praesidium carries out. Only the metrics you select will be shown on your meetings page and ultimately on your report.</li>
                <li>Record meetings: From the praesidia list page or the praesidium's details page, you can then create records of your meetings.</li>
            </ul>
            <hr />
            <p>The Help button on each page always gives valuable tips. Make reference when uncertain.</p>
            </>
        ),
        praesidium_form: (
            <>
            <p>This page contains the form for creating or editing a praesidium.</p>
            <ul>
                <li>Fill in the details of your praesidium. </li>
                <li>If the curia your praesidium belongs to is not listed among the options, a member of the curia (preferably an officer) should create the curia in order to become its first manager. If no member of the curia can do so, you must create the curia yourself in order for it to appear among the options. </li>
                <li>Head to the <Link to='/curia/create'>New Curia</Link> page and create a new curia. The creator becomes the first manager. </li>
                <li>Return to the praesidium form and now select the newly created curia. Creating a praesidium makes you its manager.</li>
            </ul>
            <p>Note that becoming a curia manager makes you responsible for all announcements to be made by that curia.</p>
            <p>Note that becoming a praesidium manager makes you responsible for all the praesidium's reminders</p>
            </>
        ), 
        praesidium_details: (
            <>
            <p>The details of the praesidium created are shown on this page.</p>
            <ul>
                <li>Any member of the praesidium can view its details</li>
                <li>Only a manager can edit the details of the praesidium</li>
            </ul>
            </>
        ), 
        meeting_list: (
            <div className="container">
                <p>This page contains a list of all the meetings from the praesidium's inauguration to the current date ordered by date.</p>
                <p>The calendar above the list can be used to filter and find individual meetings by date. Selecting the date displays only the meeting(s) for that day.</p>
                <p>To restore the list of all meetings, you must refresh the page.</p>
                <p>You can select any meeting to view and edit.</p>
            </div>
        ), 
        meeting_form: (
            <div className="container">
                <p>This page contains a form for creating or editing meetings.</p>
                <p>Only a manager can create or edit a meeting. Members are free to view, but not edit or create meetings.</p>
                <p>To create a meeting, you must first have created your work list from the <Link to='../../../worklist'>Work List</Link> form</p>
                <p>In the Attendance section, Officers at curia refers to the officers that attended the most last curia meeting. This should only be filled at the meeting immediately after the curia meeting occured, otherwise it should be left blank. The count for each officer will be summed up in the report automatically.</p>
                <p>In the Finances section, any expenses not classified under Remittance, Extension, Stationery, Altar, or Spiritual bouquet can be defined in the Others field along with the cost.</p>
                <p>Under Account Announcment, Collections 1 and 2 are only to be filled if there is need to record any collections separate from the SBC that your praesidium holds during the meeting.</p>
                <p>In the Works section, active works are listed with their corresponding metrics, as specified in <Link to='../../../worklist'>Work list</Link>.</p>
                <p>Checking a work as Done automatically means it was assigned, therefore, also checking it as Assigned is not necessary</p>
                <p>Checking Assigned but not checking done means the work was assigned but not done. This is how to record works undone.</p>
                <p>Any works not assigned will not be recorded, so entering values while the work is not marked as assigned (either by checking Assigned or Done) is futile because it will not be saved.</p>
            </div>
        ), 
        worklist_form: (
            <div className="container">
                <p>This page contains the form for editing your work list, which is the list of works along with their tracked metrics for each praesidium.</p>
                <p>Active works have named metrics, while inactive works simply have a <q>Include this work</q> checkbox for it to be included in the list</p>
                <p>The works selected here will appear on each meeting form and will ultimately be computed and shown on the report.</p>
                <p>If your praesidium carries out any work not listed here, or the metric is not given among the options, you may create a new work with your desired metrics in the <Link to='../../create_work'>New work</Link> form</p>
                <p>Make sure to complete the work list selection before creating a report.</p>
                <p><strong>Note: the work list form currently has some faults, so refresh the page to ensure the works are correctly selected before creating meetings and reports.</strong></p>
            </div>
        ), 
        create_work_form: (
            <div className="container">
                <p>This page contains the form for the creation of a new work which is not listed on the work list form or a work for which the correct metrics are not listed.</p>
                <p>Enter the name of the work correctly and then the list of metrics separated by commas. For example, if tracking number of patients, Catholics, separated brethren, Muslims, and Hindus while on Hospital Visitation, you would enter: <strong>Patients, Catholics, Separated brethren, Muslims, Hindus</strong>.</p>
                <p>For any inactive work with no metrics to be tracked, just enter the name and leave the Metrics field empty.</p>
                <p>The new work will appear in the work list page and can be selected just as any other work.</p>
                <p><strong>Note: Ensure to enter the details of the new work correctly as the work cannot be edited or deleted.</strong></p>
            </div>
        ), 
        curia_form: (
            <div className="container">
                <p>This page contains the form for creating or editing a curia.</p>
                <p>It is ideal for an officer of the curia to create and become the manager of the curia in order for the accurate information be entered and updated as needed and for announcements to be made to associated praesidia.</p>
                <p>Enter the curia details and save.</p>
                <p>The curia creator becomes the first manager. Only the manager can edit or delete the curia.</p>
            </div>
        ), 
        curia_details: (
            <div className="container">
                <p>This page contains the details of the curia.</p>
                <p>Members of associated praesidia can view the curia details. Only managers can edit or delete the curia.</p>
                <p>Members of associated praesidia can view the curia announcements. Only managers can edit or delete announcements.</p>
            </div>
        ), 
        announcement_list: (
            <div className="container">
                <p>This page contains the list of the curia's announcements.</p>
                <p>Announcements will be shown under the <Link to='/notifications'>Notifications</Link> of each praesidium associated to the curia.</p>
                <p>Only managers of the curia can create or edit announcements.</p>
            </div>
        ), 
        announcement_details: (
            <div className="container">
                <p>This page contains the details of the announcement that will be seen by all members of praesidia associated to this curia.</p>
                <p>Only managers of the curia can edit or delete the announcememnt</p>
            </div>
        ), 
        announcement_form: (
            <div className="container">
                <p>This page contains the form for creating or editing an announcement.</p>
                <p>Only managers of the curia can create or edit announcements.</p>
            </div>
        ), 
        reminder_list: (
            <div className="container">
                <p>This page contains the list of reminders for the praesidium.</p>
                <p>All members can view the reminders. Only managers can create or edit reminders.</p>
                <p>Reminders show up on the <Link to="/notifications">Notifications</Link> page until their deadlines pass or they are deleted.</p>
            </div>
        ), 
        reminder_form: (
            <div className="container">
                <p>This page contains the form for creating or editing a reminder.</p>
                <p>Only managers can create or edit reminders.</p>
                <p>The date of creation is automatically set. The deadline for the reminder is optional.</p>
                <p>Reminders show up on the <Link to="/notifications">Notifications</Link> page until their deadlines pass or they are deleted.</p>
            </div>
        ), 
        reminder_details: (
            <div className="container">
                <p>This page contains the details of this reminder. It will be seen by all members of the praesidium.</p>
                <p>Only managers of the curia can edit or delete the reminder</p>
            </div>
        ), 
        report_list: (
            <div className="container">
                <p>This page contains a list of the praesidium's reports.</p>
                <p>Only praesidium managers can create or edit reports.</p>
            </div>
        ), 
        report_form: (
            <div className="container">
                <p>This page contains the form for creating or editing praesidium reports.</p>
                <p>Only praesidium managers can create or edit reports.</p>
                <p>The form is divided into sections for submission dates, curia, praesidium, membership, achievements, works, legion functions with attendance, finances, comments, and auditors.</p>
                <p>You can fill and change the value of any field on the form.</p>
                <p>At the submission dates section at the top of the form, the <b>Auto fill</b> button can help fill in the form by performing calculations for various values from meetings in a range specified by the last and next submission dates. The Auto fill automatically fills in the following:</p>
                <ul>
                    <li>Report period in weeks</li>
                    <li>Officers attendance to curia meetings for the period (current year)</li>
                    <li>Officers attendance to praesidium meetings for the period (current year)</li>
                    <li>No. of meetings expected</li>
                    <li>No. of meetings held</li>
                    <li>Average attendance over the period</li>
                    <li>For each work, the no. assigned, no. done, and the total for each metric recorded</li>
                    <li>Finances for each month during the period</li>
                </ul>
                <p>Attendances for the previous year must be entered manually.</p>
                <p>In the Achievements section, any additional achievement can be entered in the bottom row.</p>
                <p>In the Works section, each work has below its metrics two checkboxes (<b>Include Total No.</b> and <b>Include Average No.</b>) for indicating whether or not the total or average of the metrics should be calculated and included in the report. For example, checking Include Total No. under Home Visitation will include the total no. of persons encountered as recorded in meetings (while excluding No. of homes).</p>
                <p>In the Legion Functions with Attendance section, although May and October devotions span the entire months, what is actually needed here is to specify the year. As long as the correct year is selected, any date within the month will work fine. Also, for the Patrician meetings, the start and end months are to be specified.</p>
                <p>In the Finances section, the only months that appear are those for which meetings have been recorded. That is, if no meetings are recorded for the month of June, the month of June will not appear. As long as no meeting is recorded for any month within the report period, that month will not appear in the report. To make the month appear, record at least one meeting for that month.</p>
                <p>Auto fill fills the Finances section for each month by summing the amount brought forward (BF), secret bag collection (SBC), expenses to praesidium, remittance to curia, and the balance for each meeting in each month. Any inconsistencies will be clear to see from this table.</p>
                <p><strong>Note:</strong> Because the financial records from meeting 1 are carried over from the previous meeting (which is outside the report period), the finances are summed beginning from meeting 2 up to the submission date. Given this, there's no need to start the use the Auto fill while specifying the last submission date as that of meeting 2. Just set it to the date for meeting 1</p>
            </div>
        ), 
        report_preview: (
            <div className="container">
                <p>This page shows a nice preview of the expected report. The sizes of the pages are fixed, so if the content exceeds the page, it may pour out of the page, but the final prepared document will look better.</p>
                <p>Almost all the values displayed can be edited from the previous report form.</p>
                <p>The terms of the officers are automatically calculated based on the current date and the appointment dates that were saved when creating the praesidium.</p>
                <p><strong>Note:</strong> Because the financial records from meeting 1 are carried over from the previous meeting (which is outside the report period), the finances are summed beginning from meeting 2 up to the submission date. Given this, there's no need to start the use the Auto fill while specifying the last submission date as that of meeting 2. Just set it to the date for meeting 1</p>
                <p>The Finances section, Auditor's Report, and Breakdown of Expenditure are retrieved from the report form and the meetings' finances.</p>
                <p>If you are satisfied with the preview, you can download the Word document version using the Download button at the bottom of the page.</p>
            </div>
        )

    }

    return (
        <div>
        {/* sidebar */}
        <div className="sidebar">
            <nav className="nav flex-column">
                {/* settings  */}
                <NavLink className="nav-link" to={backLink}>
                    <span className="icon">
                    <i class="fa-solid fa-arrow-left"></i>
                    </span>
                    <span className="description">Back</span>
                </NavLink>
            </nav>
        </div>

        {/* main content */}
        <div className="main-content fs-5 text-dark">
            {helpDocs[pageKey]}
        </div>

        </div>
    )
}

export default Help
