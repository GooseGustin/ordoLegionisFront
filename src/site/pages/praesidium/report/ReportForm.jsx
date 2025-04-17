import { NavLink, Link, useLoaderData, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import axios from "axios";
import { parseObjectKeys } from "../../../functionVault";
import { BASEURL } from "../../../functionVault";

const log = console.log; 

const RenderCuriaAttendanceRow = ({reportFormData, handleAttendanceChange}) => {
    const officersToFormPrefixes = {
        "President": 'pres_at', 
        "Vice President": 'vp_at', 
        "Secretary": 'sec_at', 
        "Treasurer": 'tres_at'
    }
    const officers = ['President', 'Vice President', 'Secretary', 'Treasurer']
    return officers.map(item => {
        const prefix = officersToFormPrefixes[item]; 
        // console.log('In render curia in row, prefix', prefix)
        return (
            <tr key={item}>
                <td>{item}</td>
                <td>
                    <input type="number" 
                        name={prefix+'__curiaMeetingsHeld'} id="" 
                        className="form-control border border-dark"
                        defaultValue={reportFormData.no_curia_meetings_held[item]}
                        // value={reportFormData.total_curia_meetings_held[item]}
                        onChange={handleAttendanceChange}
                    />
                </td>
                <td>
                    <input type="number" 
                        name={prefix+'__curia'} id="" 
                        className="form-control border border-dark"
                        defaultValue={reportFormData.officers_curia_attendance[item]}
                        // value={reportFormData.officers_curia_attendance[item]}
                        onChange={handleAttendanceChange}
                    />
                </td>
                <td>
                <input type="number" 
                        name={prefix+'__curiaPrev'} id="" 
                        className="form-control border border-dark"
                        defaultValue={reportFormData.previous_curia_attendance[item]}
                        onChange={handleAttendanceChange}
                    />
                </td>
            </tr>
        )
    })
}

const RenderMeetingAttendanceRow = ({reportFormData, handleAttendanceChange}) => {
    const officersToFormPrefixes = {
        "President": 'pres_at', 
        "Vice President": 'vp_at', 
        "Secretary": 'sec_at', 
        "Treasurer": 'tres_at'
    }
    const officers = ['President', 'Vice President', 'Secretary', 'Treasurer']
    return officers.map(item => {
        const prefix = officersToFormPrefixes[item]; 
        // console.log('In render curia in row, prefix', prefix)
        return (
            <tr key={item}>
                <td>{item}</td>
                <td>
                    <input type="number" 
                        name={prefix+'__praesidiumMeetingsHeld'} id="" 
                        className="form-control border border-dark"
                        defaultValue={reportFormData.no_praesidium_meetings_held[item]}
                        value={reportFormData.no_praesidium_meetings_held[item]}
                        onChange={handleAttendanceChange}
                    />
                </td>
                <td>
                    <input type="number" 
                        name={prefix+'__meeting'} id="" 
                        className="form-control border border-dark"
                        defaultValue={reportFormData.officers_meeting_attendance[item]}
                        // value={reportFormData.officers_meeting_attendance[item]}
                        onChange={handleAttendanceChange}
                    />
                </td>
                <td>
                <input type="number" 
                        name={prefix+'__meetingPrev'} id="" 
                        className="form-control border border-dark"
                        defaultValue={reportFormData.previous_meeting_attendance[item]}
                        onChange={handleAttendanceChange}
                    />
                </td>
            </tr>
        )
    })
}

const RenderMembershipForm = ({ defaultMembership, handleMembershipChange }) => {
    const categoriesTitleMapping = {
        'affiliated_praesidia': "Affiliated praesidia (if any)", 
        'active_members': "Active members", 
        'probationary_members': "Probationary members", 
        'auxiliary_members': "Auxiliary members", 
        'praetorian_members': "Praetorian members", 
        'adjutorian_members': "Adjutorian members"
    }
    const categories = parseObjectKeys(categoriesTitleMapping); 

    return categories.map(item => {
        const title = categoriesTitleMapping[item]; 
        // console.log("in render membership form", title, item)
        return (
        <tr key={item}>
            <td>{title}</td>
            <td><input 
                type="number" name={item + '__senior'} id=""
                className='form-control border border-dark'
                onChange={handleMembershipChange}
                defaultValue={defaultMembership[item][0]} 
            /></td>
            <td><input 
                type="number" name={item + '__intermediate'} id=""
                className='form-control border border-dark'
                onChange={handleMembershipChange}
                defaultValue={defaultMembership[item][1]} 
            /></td>
            <td><input 
                type="number" name={item + '__junior'} id=""
                className='form-control border border-dark'
                onChange={handleMembershipChange}
                defaultValue={defaultMembership[item][2]} 
            /></td>
        </tr>
    )
    }); 
}

const RenderAchievementForm = ({ defaultAchievements, handleAchievementChange }) => {
    const categoriesTitleMapping = {
        "no_recruited": 'Recruited into the Legion',
        "no_baptized": 'Baptized',
        "no_confirmed": 'Confirmed',
        "no_first_communicants": 'First communicants',
        "no_married": 'Marriages solemnized',
        "no_converted": 'Converted to Christianity',
        "no_vocations": 'Called to vocations',
    }
    const categories = parseObjectKeys(categoriesTitleMapping); 

    return categories.map((item, key) => {
        const title = categoriesTitleMapping[item]; 
        return (
            <tr key={key}>
                {/* <td>{key+1}</td> */}
                <td>{title}</td>
                <td><input 
                    type="number" name={item + '__current'} id=""
                    className='form-control border border-dark'
                    onChange={handleAchievementChange}
                    defaultValue={defaultAchievements[item][0]} 
                /></td>
                <td><input 
                    type="number" name={item + '__previous'} id=""
                    className='form-control border border-dark'
                    onChange={handleAchievementChange}
                    defaultValue={defaultAchievements[item][1]} 
                /></td>
            </tr>
        )
    }); 
}

const ReportForm = ({ method }) => {
    const [praesidium, report, finSummary, prepDataInit, isMember, isManager] = useLoaderData();
    
    const navigate = useNavigate();

    useEffect(() => {
        if (!isMember) {
            // leave this page if not member
            navigate('/praesidium');
        }
    }, []);

    const loc = "In report form";
    // console.log(loc, 'method', method);
    console.log(loc, "initial report", report); 
    console.log(loc, 'initial prep data', prepDataInit)
    console.log(loc, 'financial summary', finSummary); 


    const creating = method == 'create';
    const [btnTitle, setBtnTitle] = useState(creating ? "Create" : "Edit");
    const [prepData, setPrepData] = useState(prepDataInit); 

    const defaultSubmissionDate = report? report.submission_date: null 
    const defaultLastSubmisisonDate = report? report.last_submission_date: null
    const defaultReportNumber = report? report.report_number: 1
    const defaultReportPeriod = report? report.report_period: 0
    const defaultLastCuriaVisitDate = report? report.last_curia_visit_date: null;
    const defaultLastCuriaVisitors = report? report.last_curia_visitors: '';
    const defaultCuriaAttendance = report
        ? report.officers_curia_attendance
        : prepData.officers_curia_attendance;
    const defaultMeetingAttendance = report
        ? report.officers_meeting_attendance
        : prepData.officers_meeting_attendance;
    const defaultPreviousCuriaAttendance = report
        ? report.previous_curia_attendance
        : {
            "President": 0,
            "Vice President": 0,
            "Secretary": 0,
            "Treasurer": 0
        };
    const defaultPreviousMeetingAttendance = report
        ? report.previous_meeting_attendance
        : {
            "President": 0,
            "Vice President": 0,
            "Secretary": 0,
            "Treasurer": 0
        };
    const defaultExtensionPlans = report? report.extension_plans: ''
    const defaultProblems = report? report.problems: ''
    const defaultRemarks = report? report.remarks: ''
    const defaultConclusion = report? report.conclusion: ''
    const defaultCuriaMeetingsHeld = report
    ? report.no_curia_meetings_held
    : prepData.no_curia_meetings_held;
    const defaultPraesidiumMeetingsHeld = report 
    ? report.no_praesidium_meetings_held 
    : prepData.no_praesidium_meetings_held;
    const defaultCuriaMeetingsHeldPrevious = report
    ? report.no_curia_meetings_held_previous
    : prepData.no_curia_meetings_held_previous;
    const defaultPraesidiumMeetingsHeldPrevious = report 
    ? report.no_praesidium_meetings_held_previous 
    : prepData.no_praesidium_meetings_held_previous;
    const defaultMeetingsExpected = report? report.no_meetings_expected: 0
    const defaultMeetingsHeld = report? report.no_meetings_held: 0
    const defaultAvgAttendance = report? report.avg_attendance: 0
    const defaultPoorAttendanceReason = report? report.poor_attendance_reason: ''
    const defaultMembership = report? report.membership: {
        "affiliated_praesidia": [0, 0, 0],
        "active_members": [0, 0, 0],
        "probationary_members": [0, 0, 0],
        "auxiliary_members": [0, 0, 0],
        "adjutorian_members": [0, 0, 0],
        "praetorian_members": [0, 0, 0]
    };
    const tempAchievement = {
        "no_recruited": [0, 0],
        "no_baptized": [0, 0],
        "no_confirmed": [0, 0],
        "no_first_communicants": [0, 0],
        "no_married": [0, 0],
        "no_converted": [0, 0],
        "no_vocations": [0, 0],
        "others": {}
    };
    // const defaultAchievements = report? report.achievement? report.achievement: tempAchievement: tempAchievement;
    const defaultAchievements = report? report.achievement: tempAchievement;
    const tempOtherKey = report? parseObjectKeys(report.achievements.others)[0] || '': '';
    const [otherAchievementName, setOtherAchievementName] = useState(report? tempOtherKey: '');
    const [otherAchievementValue, setOtherAchievementValue] = useState(
                report? 
                parseObjectKeys(report.achievement.others)[0]? 
                report.achievement.others[tempOtherKey]:
                [0, 0]:
                [0,0]
                ); 

    console.log(loc, 'other achievement', otherAchievementName, otherAchievementValue);

    const initialFxnAttendances = [
        {
            "name": "Acies",
            "date": null,
            "current_year_attendance": 0,
            "previous_year_attendance": 0,
        },
        {
            "name": "May Devotion",
            "date": "2024-05-01",
            "current_year_attendance": 0,
            "previous_year_attendance": 0,
        },
        {
            "name": "Edel Quinn Mass",
            "date": "2024-05-12",
            "current_year_attendance": 0,
            "previous_year_attendance": 0,
        },
        {
            "name": "Annual Enclosed Retreat",
            "date": null,
            "current_year_attendance": 0,
            "previous_year_attendance": 0,
        },
        {
            "name": "Mary's Birthday",
            "date": "2024-09-08",
            "current_year_attendance": 0,
            "previous_year_attendance": 0,
        },
        {
            "name": "Officers' Workshop",
            "date": null,
            "current_year_attendance": 0,
            "previous_year_attendance": 0,
        },
        {
            "name": "October Devotion",
            "date": "2024-10-01",
            "current_year_attendance": 0,
            "previous_year_attendance": 0,
        },
        {
            "name": "Departed Legionaries' Mass",
            "date": "2024-11-02",
            "current_year_attendance": 0,
            "previous_year_attendance": 0,
        },
        {
            "name": "Frank Duff's Mass",
            "date": "2024-11-12",
            "current_year_attendance": 0,
            "previous_year_attendance": 0,
        },
        {
            "name": "Legion Congress",
            "date": null,
            "current_year_attendance": 0,
            "previous_year_attendance": 0,
        },
        {
            "name": "Patrician Meetings",
            "date": null,
            "current_year_attendance": 0,
            "previous_year_attendance": 0,
        },
        {
            "name": "Annual General Reunion",
            "date": null,
            "current_year_attendance": 0,
            "previous_year_attendance": 0,
        },
        {
            "name": "Exporatio Dominicalis",
            "date": null,
            "current_year_attendance": 0,
            "previous_year_attendance": 0,
        },
        {
            "name": "Outdoor Function",
            "date": null,
            "current_year_attendance": 0,
            "previous_year_attendance": 0,
        }
    ]
    const defaultFxnAttendance = (report && report.fxn_attendances)? 
        report.fxn_attendances[0]? 
            report.fxn_attendances: 
            initialFxnAttendances: 
        initialFxnAttendances

    const defaultWorkSummaries = (report && report.workSummaries[0]) ? report.workSummaries: prepData.work_summaries
    const workSummariesIDMapping = (report && report.workSummaries) ? Object.fromEntries(
        report.workSummaries.map(item => [item.type, item.id])
    ): undefined; 
    console.log('work summaries id mapping', workSummariesIDMapping)

    const defaultPatriciansStart = report? report.patricians_start: ''; 
    const defaultPatriciansEnd = report? report.patricians_end: ''; 
    const defaultAudited = report? report.audited: false; 
    const defaultAuditor1 = report? report.auditor_1: ''; 
    const defaultAuditor2 = report? report.auditor_2: ''; 
    const defaultAccepted = report? report.read_and_accepted: true; 
    // const defaultReportProduction = 
    
    const convertFinSummaryForFrontend = (finSummaryObj) => {
        let finSummaryArray = []; 
        const num = finSummaryObj.acf.length; 
        // log('Convert fin summary for frontend', finSummaryObj, num);
        for (let i=0; i < num; i++) {
            const monthObj = {
                "month": finSummaryObj.month_year[i][0],
                "year": finSummaryObj.month_year[i][1],
                "bf": finSummaryObj.acf[i],
                "sbc": finSummaryObj.sbc[i],
                "balance": finSummaryObj.balance[i],
                "remittance": finSummaryObj.expenses.remittance[i],
                "expenses": {
                    "bouquet": finSummaryObj.expenses.bouquet[i],
                    "stationery": finSummaryObj.expenses.stationery[i],
                    "altar": finSummaryObj.expenses.altar[i],
                    "extension": finSummaryObj.expenses.extension[i],
                    "others": finSummaryObj.expenses.others[i]
                    }, 
                "report_production": finSummaryObj.report_production,
                "balance_at_hand": finSummaryObj.balance_at_hand
            }; 
            finSummaryArray.push(monthObj); 
        }
        // log('Backend to frontend', finSummaryArray); 
        return finSummaryArray; 
    }

    const [reportFormData, setReportFormData] = useState({
        audited: defaultAudited, 
        auditor_1: defaultAuditor1, 
        auditor_2: defaultAuditor2, 
        praesidium: praesidium.id, 
        submission_date: defaultSubmissionDate, 
        last_submission_date: defaultLastSubmisisonDate, 
        report_number: defaultReportNumber, 
        report_period: defaultReportPeriod, 
        last_curia_visit_date: defaultLastCuriaVisitDate, 
        last_curia_visitors: defaultLastCuriaVisitors, 
        officers_curia_attendance: defaultCuriaAttendance, 
        officers_meeting_attendance: defaultMeetingAttendance, 
        previous_curia_attendance: defaultPreviousCuriaAttendance, 
        previous_meeting_attendance: defaultPreviousMeetingAttendance,
        extension_plans: defaultExtensionPlans, 
        problems: defaultProblems, 
        remarks: defaultRemarks, 
        no_curia_meetings_held: defaultCuriaMeetingsHeld, 
        no_praesidium_meetings_held: defaultPraesidiumMeetingsHeld, 
        no_curia_meetings_held_previous: defaultCuriaMeetingsHeldPrevious, 
        no_praesidium_meetings_held_previous: defaultPraesidiumMeetingsHeldPrevious, 

        no_meetings_expected: defaultMeetingsExpected, 
        no_meetings_held: defaultMeetingsHeld, 
        avg_attendance: defaultAvgAttendance, 
        poor_attendance_reason: defaultPoorAttendanceReason, 
        membership_details: defaultMembership, 
        achievements: defaultAchievements, 
        function_attendances: defaultFxnAttendance, 
        work_summaries: defaultWorkSummaries, 
        work_total_and_average: report? report.work_total_and_average: {}, 
        financial_summary: finSummary? convertFinSummaryForFrontend(finSummary) :prepData.financial_summary,
        report_production: finSummary? finSummary.report_production: 0,
        balance_at_hand: finSummary? finSummary.balance_at_hand: 0,
        include_intermediate: report? report.include_intermediate: true, 
        include_empty_achievements: report? report.include_empty_achievements: true,
        patricians_start: defaultPatriciansStart, 
        patricians_end: defaultPatriciansEnd,
        read_and_accepted: defaultAccepted
    })
    console.log("\ninitial reportFormData", reportFormData); 

    let workSummaries = (report && report.workSummaries)? report.workSummaries: prepData.work_summaries; 
    if (!report) {
        for (let i in workSummaries) {
            let item = workSummaries[i]; 
            item.id = i;
        }
    }

    let financialSummary = finSummary? reportFormData.financial_summary :prepData.financial_summary; 
    for (let i in financialSummary) { // monthly objects
        let item = financialSummary[i]; 
        item.id = i*1;
    }
    
    const [finSummaryRender, setFinSummaryRender] = useState(financialSummary)
    // log("Setting ids for financialSummary", financialSummary)
    const sampleFinSummary = financialSummary[0];
    let expenditureKeys = parseObjectKeys(sampleFinSummary ? sampleFinSummary['expenses']: {}); //.slice(0,-1);
    let expenditureLen = expenditureKeys.length;

    const getSumOfOtherExpenditure = (othersList) => {
        let sum = 0; 
        othersList.forEach(othersObj => {
            for (let i in othersObj) {
                sum += othersObj[i]
            }
        })
        // console.log("Getting sum of others", othersList, sum)
        return sum; 
    }

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('accessToken'); 
            if (token) {
                console.log('Delete the report');
                const config = {
                    headers: {
                        "Authorization": `Bearer ${token}` 
                    }
                }; 
                const res = await axios.delete(BASEURL+"reports/report/"+report.id+"/", config); 
                console.log("Successfully deleted"); 
                navigate(method === 'create' ? "../": '../../')
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
    

    const convertFinSummaryForBackend = (monthlySummaries, report_id) => {
        let monthYearPairs = []; 
        let acf = [], sbc = [], balance = [], expenses = {
            'bouquet': [], 'stationery': [], 'altar': [], 'extension': [], 'remittance': [], 'others': []
        }, report_production = 0, balance_at_hand = 0; 

        for (let key in monthlySummaries) {
            const instance = monthlySummaries[key]; 
            monthYearPairs.push([instance.month, instance.year]); 
            acf.push(instance.bf); 
            sbc.push(instance.sbc); 
            balance.push(instance.balance); 
            expenses['bouquet'].push(instance.expenses.bouquet); 
            expenses['stationery'].push(instance.expenses.stationery);
            expenses['altar'].push(instance.expenses.altar);
            expenses['extension'].push(instance.expenses.extension);
            expenses['remittance'].push(instance.remittance);
            expenses['others'].push(instance.expenses.others);
            report_production = instance.report_production; 
            balance_at_hand = instance.balance_at_hand; 
        }
        const convertedFinSummary = {
            month_year: monthYearPairs, 
            acf: acf, 
            sbc: sbc, 
            balance: balance, 
            expenses: expenses, 
            report_production: report_production, 
            balance_at_hand: balance_at_hand,
            report: report_id 
        }
        console.log("Fin summary to backend", convertedFinSummary); 
        return convertedFinSummary;
    }

    const handleAutoFill = async () => {
        const startDate = reportFormData.last_submission_date;
        const endDate = reportFormData.submission_date; 
        console.log("Start and end dates", startDate, endDate);
        console.log("Entering auto fill, reportFormData", reportFormData)
        const packet = {
            pid: praesidium.id, 
            startDate: startDate, 
            endDate: endDate
        }
        try {
            const token = localStorage.getItem('accessToken');
            if (token) {
                const config = {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                };
                const prepDataResponse = await axios.post(BASEURL+'reports/get_report_prep_data', packet, config)
                const prepDataLocal = prepDataResponse.data;
                // console.log("In autofill, comparing finances of reportFormData and updated prepData", 
                //     reportFormData.financial_summary, prepDataLocal.financial_summary
                //     );
                // setPrepData(prepDataLocal); 
                setReportFormData({
                    ...reportFormData, 
                    ...prepDataLocal, 
                    financial_summary: prepDataLocal.financial_summary,
                    last_submission_date: startDate, 
                    submission_date: endDate
                })
                console.log("In autofill, Updated prep data", prepDataLocal.work_summaries, reportFormData.work_summaries)

                workSummaries = prepDataLocal.work_summaries; 
                for (let i in workSummaries) {
                    let item = workSummaries[i]; 
                    item.id = i;
                }

                financialSummary = prepDataLocal.financial_summary
                for (let i in financialSummary) {
                    let item = financialSummary[i]; 
                    item.id = i;
                }
                setFinSummaryRender(financialSummary)
                console.log('In autofill, updated prepData and finSummary to render', prepDataLocal, financialSummary)

            }   
        } catch (err) {
            console.log("Error on autofill", err)
        }

    }

    const handleReportChange = (e) => {
        const value = isNaN(e.target.value*1) ? e.target.value: e.target.value*1;
        setReportFormData({
            ...reportFormData,
            [e.target.name]: value
        })
        console.log("Handled report change", e.target.name, e.target.value, reportFormData); 
    }

    const handleReportCheck = (e) => {
        setReportFormData({
            ...reportFormData, 
            [e.target.name]: e.target.checked
        })
        console.log("Handled report check", e.target.name, e.target.checked, reportFormData); 
    }

    const handleFinanceChange = (e) => {
        console.log("Handle finance change", e.target.name, e.target.value);
        const targetName = e.target.name;
        const [year, month, title] = targetName.split('__'); 
        console.log(month, year, title)

        // find index in financial_summary 
        let financialSummaryCopy = reportFormData.financial_summary; 
        let ind; 
        for (let i in reportFormData.financial_summary) {
            const item = reportFormData.financial_summary[i]; 
            if (year==='report_production' || year==='balance_at_hand') {
                financialSummaryCopy[i][year] = e.target.value*1;
            }
            if (item.month==month && item.year==year) {
                ind = i
            } 
        }
        console.log("ind", ind)

        // update value
        switch (title) {
            case 'bf':
            case 'sbc': 
            case 'balance': 
            case 'remittance':
                financialSummaryCopy[ind][title] = e.target.value * 1; 
                break;
            default: 
                if (ind) financialSummaryCopy[ind]['expenses'][title] = e.target.value * 1; 
                break;
        }

        setReportFormData({
            ...reportFormData, 
            financial_summary: financialSummaryCopy
        })
        console.log("financial summary updated", financialSummaryCopy); 

    }

    const handleAttendanceChange = (e) => {
        const loc = "In handle attendance";
        console.log(e.target.name)
        const officerMapping = {
            pres_at: "President", 
            vp_at: "Vice President", 
            sec_at: "Secretary", 
            tres_at: "Treasurer"
        }
        const targetName = e.target.name; 
        // const council = targetName.substring(targetName.lastIndexOf("_")+1); 
        // const officer = targetName.substring(0, targetName.lastIndexOf("_")); 
        const [officer, council] = targetName.split('__'); 
        // log(loc, 'officer, council', officer, council)
        
        const officeName = officerMapping[officer];
        if (council == 'meeting') { // If praesidium meeting 
            setReportFormData({
                ...reportFormData, 
                officers_meeting_attendance: {
                    ...reportFormData.officers_meeting_attendance,
                    [officeName]: e.target.value*1
                }
            }); 
            // console.log(loc, reportFormData.officers_meeting_attendance)

        } else if (council == 'curia') { // If curia meeting
            setReportFormData({
                ...reportFormData, 
                officers_curia_attendance: {
                    ...reportFormData.officers_curia_attendance,
                    [officeName]: e.target.value*1
                }
            }); 
            // console.log(loc, reportFormData.officers_curia_attendance)
        } else if (council == 'curiaPrev') {
            setReportFormData({
                ...reportFormData, 
                previous_curia_attendance: {
                    ...reportFormData.previous_curia_attendance,
                    [officeName]: e.target.value*1
                }
            }); 
            // console.log(loc, reportFormData.previous_curia_attendance); 
            // console.log(e.target.value, reportFormData)
        } else if (council == 'meetingPrev') {
            setReportFormData({
                ...reportFormData, 
                previous_meeting_attendance: {
                    ...reportFormData.previous_meeting_attendance,
                    [officeName]: e.target.value*1
                }
            }); 
            // console.log(loc, reportFormData.previous_meeting_attendance); 
            // console.log(e.target.value, reportFormData)
        } else if (council == 'curiaMeetingsHeld') {
            setReportFormData({
                ...reportFormData, 
                no_curia_meetings_held: {
                    ...reportFormData.no_curia_meetings_held,
                    [officeName]: e.target.value*1
                }
            }); 
            // console.log(loc, reportFormData.no_praesidium_meetings_held); 
        } else if (council == 'praesidiumMeetingsHeld') {
            setReportFormData({
                ...reportFormData, 
                no_praesidium_meetings_held: {
                    ...reportFormData.no_praesidium_meetings_held,
                    [officeName]: e.target.value*1
                }
            }); 
            // console.log(loc, reportFormData.no_praesidium_meetings_held); 
        } else if (council == 'curiaMeetingsHeldPrevious') {
            setReportFormData({
                ...reportFormData, 
                no_curia_meetings_held_previous: {
                    ...reportFormData.no_curia_meetings_held_previous,
                    [officeName]: e.target.value*1
                }
            }); 
            // console.log(loc, reportFormData.no_praesidium_meetings_held); 
        } else if (council == 'praesidiumMeetingsHeldPrevious') {
            setReportFormData({
                ...reportFormData, 
                no_praesidium_meetings_held_previous: {
                    ...reportFormData.no_praesidium_meetings_held_previous,
                    [officeName]: e.target.value*1
                }
            }); 
            // console.log(loc, reportFormData.no_praesidium_meetings_held); 
        }
    }

    const handleFxnAttendanceChange = (e) => {
        const loc = "Handle fxn attendance change"; 
        const [targetName, key] = e.target.name.split('__'); 
        console.log(loc, targetName)

        // find index of changed fxn
        let ind; 
        for (let i in reportFormData.function_attendances) {
            if (reportFormData.function_attendances[i]['name']==targetName) {
                ind = i;
            }
        }

        // create and update copy of fxn attendance
        const value = isNaN(e.target.value*1) ? e.target.value: e.target.value*1;
        let functionAttendancesCopy = reportFormData.function_attendances; 
        functionAttendancesCopy[ind] = {
            ...functionAttendancesCopy[ind], 
            [key]: value
        }

        // update actual record
        setReportFormData({
            ...reportFormData, 
            function_attendances: functionAttendancesCopy
        })

        console.log(loc, functionAttendancesCopy[ind]);

    }

    const handleMembershipChange = (e) => {
        const suiteIndexMapping = {
            'senior': 0, 'intermediate': 1, 'junior': 2
        }; 
        // console.log("In membership change", e.target.name, e.target.value)
        const [category, suite] = e.target.name.split('__'); 
        let updatedCategory = reportFormData.membership_details[category]; 
        updatedCategory[suiteIndexMapping[suite]] = e.target.value*1; 
        // console.log(updatedCategory)
        setReportFormData({
            ...reportFormData, 
            membership_details: {
                ...reportFormData.membership_details,
                [category]: updatedCategory
            }
        });
        // console.log(reportFormData.membership_details, category, updatedCategory)
    }

    const handleAchievementChange = (e) => {
        const yearIndex = {
            current: 0, previous: 1
        }
        const targetName = e.target.name; 
        console.log('target name', targetName)
        const [name, year] = targetName.split('__'); 

        if (name!=='other') {
            let updatedAchievement = reportFormData.achievements[name]; 
            updatedAchievement[yearIndex[year]] = e.target.value*1; 
            console.log(updatedAchievement)
            
            setReportFormData({
                ...reportFormData, 
                achievements: {
                    ...reportFormData.achievements,
                    [name]: updatedAchievement
                }
            });
        } else {
            // other__name, other__current, other__previous
            if (year==='name') {
                setOtherAchievementName(e.target.value); 
            } else if (year === 'current') {
                setOtherAchievementValue([
                    e.target.value*1, otherAchievementValue[1]
                ])
            } else if (year === 'previous') {
                setOtherAchievementValue([
                    otherAchievementValue[0], e.target.value*1
                ])
            }
            let achievementsCopy = reportFormData.achievements; 
            achievementsCopy.others = {
                [otherAchievementName]: otherAchievementValue 
            }; 
            setReportFormData({
                ...reportFormData, 
                achievements: {
                    ...reportFormData.achievements, 
                    ...achievementsCopy
                }
            }); 
            console.log("Updated achievements", achievementsCopy)
        }
        console.log(reportFormData.achievements)
    }

    const handleWorkChange = (e) => {
        const loc = "Handle work change"; 
        const [targetName, metric] = e.target.name.split('__'); 
        console.log(loc, targetName, metric)

        // find index of changed work 
        let ind; 
        for (let i in reportFormData.work_summaries) {
            if (reportFormData.work_summaries[i]['type'] == targetName) {
                ind = i; 
            }
        }

        // create and update summary copy 
        let workSummariesCopy = reportFormData.work_summaries; 
        
        switch (metric) {
            case 'no_done':
            case 'no_assigned': 
                workSummariesCopy[ind][metric] = e.target.value * 1; 
                break;
            default: 
                workSummariesCopy[ind]['details'][metric] = e.target.value * 1; 
                break;
        }

        setReportFormData({
            ...reportFormData, 
            work_summaries: workSummariesCopy
        })

        console.log(loc, workSummariesCopy[ind]);
    }

    const handleWorkTotalOrAverage = (e) => {
        const [name, category] = e.target.name.split('_'); 
        let reportFormCopy = reportFormData.work_total_and_average; 

        reportFormCopy = {
            ...reportFormCopy, 
            [name]: {
                ...reportFormCopy[name], 
                [category]: e.target.checked
            }
        }; 
        setReportFormData({
            ...reportFormData, 
            work_total_and_average: reportFormCopy
        })
        console.log('In handle work total or average', reportFormCopy, reportFormData.work_total_and_average); 
    }

    const handleReportSubmission = async (e) => {
        e.preventDefault()
        const loc = "In handle report submission"; 
        setBtnTitle(method == 'create' ? "Creating" : "Editing");
        // console.log(loc, "finance to send comparison", reportFormData.financial_summary, prepData.financial_summary);
        
        try {
            const token = localStorage.getItem('accessToken');
            if (token) {
                const config = {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                };
                console.log(loc, reportFormData);
                let reportResponse;
                if (method == 'create') {
                    // create achievement [single pk]
                    const achievementResponse = await axios.post(
                        BASEURL + `reports/achievement/`, 
                        reportFormData.achievements,
                        config)
                    // reportFormData.achievements = achievementResponse.data.id; 

                    // create membership details  [list of single index]
                    const membershipDetailReponse = await axios.post(
                        `${BASEURL}reports/membership/`, 
                        reportFormData.membership_details, 
                        config
                        )
                    const membershipDetail = membershipDetailReponse.data; 

                    // create report 
                    reportResponse = await axios.post(
                        BASEURL + "reports/report/", 
                        {
                            ...reportFormData, 
                            membership_details:membershipDetail.id, 
                        },
                        config
                        )
                    console.log("\nSuccessfully created report!!", reportResponse.data); 

                    // create financial summary []
                    const convertedSummary = convertFinSummaryForBackend(reportFormData.financial_summary, reportResponse.data.id)
                    const financialSummaryReponse = await axios.post(
                        `${BASEURL}finance/summaries/`, 
                        convertedSummary, 
                        config
                        )
                    const financialSummary = financialSummaryReponse.data; 

                    // create function attendances 
                    for (let i in reportFormData.function_attendances) {
                        let attendanceResponse = await axios.post(
                            BASEURL + "reports/attendance/", 
                            {
                                ...reportFormData.function_attendances[i], 
                                report: reportResponse.data.id
                            }, 
                            config
                        )
                    }

                    // create work summaries
                    for (let i in reportFormData.work_summaries) {
                        console.log('Creating work summary', reportFormData.work_summaries[i])
                        let summaryResponse = await axios.post(
                            BASEURL + "works/summaries/", 
                            {
                                ...reportFormData.work_summaries[i], 
                                report: reportResponse.data.id
                            }, 
                            config
                        )
                    }

                    console.log(loc, 'Successfully created report', reportResponse); 
                    navigate(`../${reportResponse.data.id}`)
                } else if (method == 'edit') {
                    // edit membership details  [list of single index]
                    const membershipDetailReponse = await axios.put(
                        `${BASEURL}reports/membership/${report.membership.id}/`, 
                        reportFormData.membership_details, 
                        config
                        )
                    const membershipDetail = membershipDetailReponse.data; 
                    console.log('Succesfully edited membership details');

                    // edit report
                    reportResponse = await axios.put(
                            BASEURL + `reports/report/${report.id}/`, 
                            {
                                ...reportFormData, 
                                membership_details: membershipDetail.id, 
                            },
                            config);
                    console.log('Succesfully edited report', reportResponse);

                    // edit financial summary []
                    // const finSummaryResponse = await axios.get()
                    const convertedSummary = convertFinSummaryForBackend(reportFormData.financial_summary, reportResponse.data.id);
                    console.log('Converted Summary for sending to backend', convertedSummary, reportFormData.financial_summary)
                    const financialSummaryReponse = await axios.put(
                        `${BASEURL}finance/summaries/${report.financial_summary}/`, 
                        convertedSummary, 
                        config
                        );
                    const financialSummaryData = financialSummaryReponse.data; 
                    console.log('Succesfully edited financial summary', financialSummaryData);
                    // financialSummary = convertFinSummaryForFrontend(financialSummaryData);

                    // edit function attendances 
                    console.log("\nEditing attendances", report.function_attendances)
                    for (let i in report.function_attendances) {
                        let attendanceResponse = await axios.put(
                            BASEURL + `reports/attendance/${report.function_attendances[i]}/`, 
                            {
                                ...reportFormData.function_attendances[i], 
                                report: report.id
                            }, 
                            config
                        )
                    }
                    console.log('Succesfully edited fxn attenances');

                    // edit work summaries
                    for (let i in reportFormData.work_summaries) {
                        const work = reportFormData.work_summaries[i];
                        const summaryInstance = {
                            ...reportFormData.work_summaries[i], 
                            id: workSummariesIDMapping[work.type],
                            report: report.id
                        }  
                        console.log('Editing work summary', work, summaryInstance)
                        let summaryResponse = await axios.put(
                            BASEURL + `works/summaries/${summaryInstance['id']}/`, 
                            summaryInstance, 
                            config
                        )
                    }

                }
                const reportData = reportResponse.data; 
                
                const updatedReport = {
                    ...reportFormData,
                    ...reportData.data
                }
                console.log("Updated report", updatedReport);
                setReportFormData(updatedReport)
                
                setBtnTitle('Edit');
                
            }
        } catch (err) {
            if (err.status === 401) {
                console.log("The session is expired. Please sign in again to operate on reports")
                navigate('/account/login');
            } else {
                console.log("Error during operation", err)
            }
        }
    }


    return (
        <div className='report-form pt-5'>
            {/* sidebar */}
            <div className="sidebar">
                <nav className="nav flex-column">
                    <NavLink className="nav-link" to='../../'>
                        <span className="icon">
                        <i class="fa-solid fa-shield-halved"></i>
                        </span>
                        <span className="description">Praesidium</span>
                    </NavLink>
                    <NavLink className="nav-link" to='../'>
                        <span className="icon">
                        <i class="fa-solid fa-chart-simple"></i>
                        </span>
                        <span className="description">Reports</span>
                    </NavLink>
                    <NavLink className="nav-link" to='../../meeting'>
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
                    {
                        method=='edit'
                        ? 
                        <NavLink className="nav-link" to='preview'>
                            <span className="icon">
                            <i class="fa-solid fa-eye"></i>
                            </span>
                            <span className="desciption">Preview</span>
                        </NavLink>
                        : <></>
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
                <p className="fs-2 text-dark">Praesidium: {praesidium.name}</p>
                <form onSubmit={handleReportSubmission}>

                {/* History */}
                <div className="row row-cols-lg-3 row-cols-md-3">
                    <div className="row col col-12 border border-dark rounded rounded-3 p-3 my-2">
                    <div className="col col-lg-5 col-md-4 me-md-2 col-sm-12">
                        <label htmlFor="last_submission_date">
                        Last submission date: <input
                                type="date" name='last_submission_date'
                                id='date' className='form-control border border-dark '
                                onChange={handleReportChange}
                                defaultValue={defaultLastSubmisisonDate}
                            />
                        </label>
                    </div>
                    <div className="col col-lg-4 col-md-4 me-md-2 col-sm-12">
                        <label htmlFor="submission_date">
                        Submission date: <input
                                type="date" name='submission_date'
                                id='date' className='form-control  border border-dark '
                                onChange={handleReportChange}
                                defaultValue={defaultSubmissionDate}
                            />
                        </label>
                    </div>
                    <div className="col col-lg-2 col-md-3 col-sm-12 mt-lg-4 mt-md-4">
                        <button className="btn btn-primary" onClick={handleAutoFill} type="button">Auto fill</button>
                    </div>
                    </div>
                    <div className="col col-lg-6 col-md-6 col-sm-12">
                        <label htmlFor="report_number">
                            <span className="me-1">Report no.</span>
                            <input
                                type="number"
                                name="report_number" id="report_number"
                                className='form-control-sm rounded rounded-3  border border-dark '
                                onChange={handleReportChange}
                                value={reportFormData.report_number} 
                            />
                        </label>
                    </div>
                    <div className="col col-lg-6 col-md-6 col-sm-12">
                        <label htmlFor="report_period">
                            <span className="me-1">Report period (weeks)</span>
                            <input
                                type="number"
                                name="report_period" id="report_period"
                                className='form-control-sm rounded rounded-3 border border-dark '
                                onChange={handleReportChange}
                                value={reportFormData.no_meetings_expected}
                                // value={reportFormData.report_period} 
                            />
                        </label>
                    </div>
                </div>

                {/* Curia */}
                <div className="row border border-dark rounded rounded-3 p-3 my-2">
                    <p className="fs-3 text-primary">Curia</p>
                    <hr />
                    <p className="fs-4">Visiting</p> {/* Date of last visit by curia */}
                    <div className="col">
                        <label htmlFor="last_curia_visit_date">
                        Date of last visit by curia: <input
                                type="date" name='last_curia_visit_date'
                                id='date' className='form-control border border-dark '
                                onChange={handleReportChange}
                                defaultValue={defaultLastCuriaVisitDate}
                            />
                        </label>
                    </div>
                    <div className="col-12">
                        <label htmlFor="last_curia_visitors">
                            Names and praesidia of curia visitors: 
                        </label>
                        <textarea 
                            name="last_curia_visitors" id="" 
                            // cols="30" 
                            className="form-control border border-dark"
                            rows="2"
                            defaultValue={defaultLastCuriaVisitors}
                            onChange={handleReportChange}
                        ></textarea>
                    </div>
                    
                    <hr className="mt-4" />
                    <p className="fs-4">Officers Attendance</p>

                    <div className="row">
                        <table className="table-bordered">
                            <thead>
                                <tr>
                                    <th>Officer</th>
                                    <th>Current year</th>
                                    <th>No. meetings held in current year</th>
                                    <th>Previous year</th>
                                    <th>No. meetings held in previous year</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* <RenderCuriaAttendanceRow 
                                    reportFormData={reportFormData}
                                    handleAttendanceChange={handleAttendanceChange}
                                /> */}
                                <tr>
                                    <td>President</td>
                                    <td>
                                        <input type="number" 
                                            name={'pres_at__'+'curia'} id="" 
                                            className="form-control border border-dark"
                                            // defaultValue={reportFormData.officers_curia_attendance['President']}
                                            value={reportFormData.officers_curia_attendance['President']}
                                            onChange={handleAttendanceChange}
                                        />
                                    </td>
                                    <td>
                                        <input type="number" 
                                            name={'pres_at__'+'curiaMeetingsHeld'} id="" 
                                            className="form-control border border-dark"
                                            // defaultValue={reportFormData.no_curia_meetings_held['President']}
                                            value={reportFormData.no_curia_meetings_held['President']}
                                            onChange={handleAttendanceChange}
                                        />
                                    </td>
                                    <td>
                                    <input type="number" 
                                            name={'pres_at__'+'curiaPrev'} id="" 
                                            className="form-control border border-dark"
                                            defaultValue={reportFormData.previous_curia_attendance['President']}
                                            onChange={handleAttendanceChange}
                                        />
                                    </td>
                                    <td>
                                        <input type="number" 
                                            name={'pres_at__'+'curiaMeetingsHeldPrevious'} id="" 
                                            className="form-control border border-dark"
                                            // defaultValue={reportFormData.no_curia_meetings_held['President']}
                                            defaultValue={reportFormData.no_curia_meetings_held_previous['President']}
                                            onChange={handleAttendanceChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Vice President</td>
                                    <td>
                                        <input type="number" 
                                            name={'vp_at__'+'curia'} id="" 
                                            className="form-control border border-dark"
                                            // defaultValue={reportFormData.officers_curia_attendance['Vice President']}
                                            value={reportFormData.officers_curia_attendance['Vice President']}
                                            onChange={handleAttendanceChange}
                                        />
                                    </td>
                                    <td>
                                        <input type="number" 
                                            name={'vp_at__'+'curiaMeetingsHeld'} id="" 
                                            className="form-control border border-dark"
                                            // defaultValue={reportFormData.no_curia_meetings_held['Vice President']}
                                            value={reportFormData.no_curia_meetings_held['Vice President']}
                                            onChange={handleAttendanceChange}
                                        />
                                    </td>
                                    <td>
                                    <input type="number" 
                                            name={'vp_at__'+'curiaPrev'} id="" 
                                            className="form-control border border-dark"
                                            value={reportFormData.previous_curia_attendance['Vice President']}
                                            onChange={handleAttendanceChange}
                                        />
                                    </td>
                                    <td>
                                        <input type="number" 
                                            name={'vp_at__'+'curiaMeetingsHeldPrevious'} id="" 
                                            className="form-control border border-dark"
                                            defaultValue={reportFormData.no_curia_meetings_held_previous['Vice President']}
                                            onChange={handleAttendanceChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Secretary</td>
                                    <td>
                                        <input type="number" 
                                            name={'sec_at__'+'curia'} id="" 
                                            className="form-control border border-dark"
                                            // defaultValue={reportFormData.officers_curia_attendance['Secretary']}
                                            value={reportFormData.officers_curia_attendance['Secretary']}
                                            onChange={handleAttendanceChange}
                                        />
                                    </td>
                                    <td>
                                        <input type="number" 
                                            name={'sec_at__'+'curiaMeetingsHeld'} id="" 
                                            className="form-control border border-dark"
                                            // defaultValue={reportFormData.no_curia_meetings_held['Secretary']}
                                            value={reportFormData.no_curia_meetings_held['Secretary']}
                                            onChange={handleAttendanceChange}
                                        />
                                    </td>
                                    <td>
                                    <input type="number" 
                                            name={'sec_at__'+'curiaPrev'} id="" 
                                            className="form-control border border-dark"
                                            defaultValue={reportFormData.previous_curia_attendance['Secretary']}
                                            onChange={handleAttendanceChange}
                                        />
                                    </td>
                                    <td>
                                        <input type="number" 
                                            name={'sec_at__'+'curiaMeetingsHeldPrevious'} id="" 
                                            className="form-control border border-dark"
                                            defaultValue={reportFormData.no_curia_meetings_held_previous['Secretary']}
                                            onChange={handleAttendanceChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Treasurer</td>
                                    <td>
                                        <input type="number" 
                                            name={'tres_at__'+'curia'} id="" 
                                            className="form-control border border-dark"
                                            // defaultValue={reportFormData.officers_curia_attendance['Treasurer']}
                                            value={reportFormData.officers_curia_attendance['Treasurer']}
                                            onChange={handleAttendanceChange}
                                        />
                                    </td>
                                    <td>
                                        <input type="number" 
                                            name={'tres_at__'+'curiaMeetingsHeld'} id="" 
                                            className="form-control border border-dark"
                                            // defaultValue={reportFormData.no_curia_meetings_held['Treasurer']}
                                            value={reportFormData.no_curia_meetings_held['Treasurer']}
                                            onChange={handleAttendanceChange}
                                        />
                                    </td>
                                    <td>
                                    <input type="number" 
                                            name={'tres_at__'+'curiaPrev'} id="" 
                                            className="form-control border border-dark"
                                            defaultValue={reportFormData.previous_curia_attendance['Treasurer']}
                                            onChange={handleAttendanceChange}
                                        />
                                    </td>
                                    <td>
                                        <input type="number" 
                                            name={'tres_at__'+'curiaMeetingsHeldPrevious'} id="" 
                                            className="form-control border border-dark"
                                            defaultValue={reportFormData.no_curia_meetings_held_previous['Treasurer']}
                                            onChange={handleAttendanceChange}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>

                {/* Praesidium */}
                <div className="row border border-dark rounded rounded-3 p-3 my-2">
                    <p className="fs-3 text-primary">Praesidium</p>
                    {/* <hr className="mt-4" /> */}

                    <p className="fs-4">Officers Attendance</p>
                    <div className="row row-cols-lg-2 row-cols-md-2">
                        <div className="col">
                            <label htmlFor="acf"><span className="me-1">No. of meetings expected</span>
                                <input 
                                    type="number" name="no_meetings_expected" id=""
                                    className='form-control-sm rounded rounded-3 border border-dark'
                                    onChange={handleReportChange}
                                    value={reportFormData.no_meetings_expected}
                                />
                            </label>
                        </div>
                        <div className="col">
                            <label htmlFor="no_meetings_held"><span className="me-1">No. of meetings held</span>
                                <input 
                                    type="number" name="no_meetings_held" id="no_meetings_held"
                                    className='form-control-sm rounded rounded-3 border border-dark'
                                    onChange={handleReportChange}
                                    value={reportFormData.no_meetings_held} 
                                />
                            </label>
                        </div>
                    </div>


                    <div className="row mt-4">
                        <table className="table-bordered">
                            <thead>
                                <tr>
                                    <th>Officer</th>
                                    <th>Current year</th>
                                    <th>No. meetings held in current year</th>
                                    <th>Previous year</th>
                                    <th>No. meetings held in previous year</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>President</td>
                                    <td>
                                        <input type="number" 
                                            name={'pres_at__'+'meeting'} id="" 
                                            className="form-control border border-dark"
                                            // defaultValue={reportFormData.officers_meeting_attendance['President']}
                                            value={reportFormData.officers_meeting_attendance['President']}
                                            onChange={handleAttendanceChange}
                                        />
                                    </td>
                                    <td>
                                        <input type="number" 
                                            name={'pres_at__'+'praesidiumMeetingsHeld'} id="" 
                                            className="form-control border border-dark"
                                            // defaultValue={reportFormData.no_praesidium_meetings_held['President']}
                                            value={reportFormData.no_praesidium_meetings_held['President']}
                                            onChange={handleAttendanceChange}
                                        />
                                    </td>
                                    <td>
                                    <input type="number" 
                                            name={'pres_at__'+'meetingPrev'} id="" 
                                            className="form-control border border-dark"
                                            defaultValue={reportFormData.previous_meeting_attendance['President']}
                                            onChange={handleAttendanceChange}
                                        />
                                    </td>
                                    <td>
                                        <input type="number" 
                                            name={'pres_at__'+'praesidiumMeetingsHeldPrevious'} id="" 
                                            className="form-control border border-dark"
                                            // defaultValue={reportFormData.no_praesidium_meetings_held['President']}
                                            value={reportFormData.no_praesidium_meetings_held_previous['President']}
                                            onChange={handleAttendanceChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Vice President</td>
                                    <td>
                                        <input type="number" 
                                            name={'vp_at__'+'meeting'} id="" 
                                            className="form-control border border-dark"
                                            // defaultValue={reportFormData.officers_meeting_attendance['Vice President']}
                                            value={reportFormData.officers_meeting_attendance['Vice President']}
                                            onChange={handleAttendanceChange}
                                        />
                                    </td>
                                    <td>
                                        <input type="number" 
                                            name={'vp_at__'+'praesidiumMeetingsHeld'} id="" 
                                            className="form-control border border-dark"
                                            // defaultValue={reportFormData.no_praesidium_meetings_held['Vice President']}
                                            value={reportFormData.no_praesidium_meetings_held['Vice President']}
                                            onChange={handleAttendanceChange}
                                        />
                                    </td>
                                    <td>
                                    <input type="number" 
                                            name={'vp_at__'+'meetingPrev'} id="" 
                                            className="form-control border border-dark"
                                            defaultValue={reportFormData.previous_meeting_attendance['Vice President']}
                                            onChange={handleAttendanceChange}
                                        />
                                    </td>
                                    <td>
                                        <input type="number" 
                                            name={'vp_at__'+'praesidiumMeetingsHeldPrevious'} id="" 
                                            className="form-control border border-dark"
                                            value={reportFormData.no_praesidium_meetings_held_previous['Vice President']}
                                            onChange={handleAttendanceChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Secretary</td>
                                    <td>
                                        <input type="number" 
                                            name={'sec_at__'+'meeting'} id="" 
                                            className="form-control border border-dark"
                                            // defaultValue={reportFormData.officers_meeting_attendance['Secretary']}
                                            value={reportFormData.officers_meeting_attendance['Secretary']}
                                            onChange={handleAttendanceChange}
                                        />
                                    </td>
                                    <td>
                                        <input type="number" 
                                            name={'sec_at__'+'praesidiumMeetingsHeld'} id="" 
                                            className="form-control border border-dark"
                                            // defaultValue={reportFormData.no_praesidium_meetings_held['Secretary']}
                                            value={reportFormData.no_praesidium_meetings_held['Secretary']}
                                            onChange={handleAttendanceChange}
                                        />
                                    </td>
                                    <td>
                                    <input type="number" 
                                            name={'sec_at__'+'meetingPrev'} id="" 
                                            className="form-control border border-dark"
                                            defaultValue={reportFormData.previous_meeting_attendance['Secretary']}
                                            onChange={handleAttendanceChange}
                                        />
                                    </td>
                                    <td>
                                        <input type="number" 
                                            name={'sec_at__'+'praesidiumMeetingsHeldPrevious'} id="" 
                                            className="form-control border border-dark"
                                            value={reportFormData.no_praesidium_meetings_held_previous['Secretary']}
                                            onChange={handleAttendanceChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Treasurer</td>
                                    <td>
                                        <input type="number" 
                                            name={'tres_at__'+'meeting'} id="" 
                                            className="form-control border border-dark"
                                            // defaultValue={reportFormData.officers_meeting_attendance['Treasurer']}
                                            value={reportFormData.officers_meeting_attendance['Treasurer']}
                                            onChange={handleAttendanceChange}
                                        />
                                    </td>
                                    <td>
                                        <input type="number" 
                                            name={'tres_at__'+'praesidiumMeetingsHeld'} id="" 
                                            className="form-control border border-dark"
                                            // defaultValue={reportFormData.no_praesidium_meetings_held['Treasurer']}
                                            value={reportFormData.no_praesidium_meetings_held['Treasurer']}
                                            onChange={handleAttendanceChange}
                                        />
                                    </td>
                                    <td>
                                    <input type="number" 
                                            name={'tres_at__'+'meetingPrev'} id="" 
                                            className="form-control border border-dark"
                                            defaultValue={reportFormData.previous_meeting_attendance['Treasurer']}
                                            onChange={handleAttendanceChange}
                                        />
                                    </td>
                                    <td>
                                        <input type="number" 
                                            name={'tres_at__'+'praesidiumMeetingsHeldPrevious'} id="" 
                                            className="form-control border border-dark"
                                            value={reportFormData.no_praesidium_meetings_held_previous['Treasurer']}
                                            onChange={handleAttendanceChange}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="col mt-3">
                        <label htmlFor="avg_attendance"><span className="me-1">Average attendance</span>
                            <input 
                                type="number" name="avg_attendance" id="avg_attendance"
                                className='form-control-sm rounded rounded-3 border border-dark'
                                onChange={handleReportChange}
                                value={reportFormData.avg_attendance} 
                            />
                        </label>
                    </div>
                    
                    <div className="col-12">
                        <label htmlFor="poor_attendance_reason">
                            Reasons for poor attendance: 
                        </label>
                        <textarea 
                            name="poor_attendance_reason" id="poor_attendance_reason" 
                            className="form-control border border-dark"
                            rows="1"
                            defaultValue={defaultPoorAttendanceReason}
                            onChange={handleReportChange}
                        ></textarea>
                    </div>
                    
                    <div className="col-12 mt-1">
                        <label htmlFor="extension_plans">
                            Extension plans: 
                        </label>
                        <textarea 
                            name="extension_plans" id="extension_plans" 
                            className="form-control border border-dark"
                            rows="2"
                            defaultValue={defaultExtensionPlans}
                            onChange={handleReportChange}
                        ></textarea>
                    </div>
                </div>
                
                {/* Membership */}
                <div className="row border border-dark rounded rounded-3 p-3 my-2">
                    <p className="fs-3 text-primary">Membership</p>
                    <div className="row my-2 text-dark">
                        <div className="col">
                            <label htmlFor="include_intermediate">
                                Include Intermediates in report: 
                                <input type="checkbox" 
                                    name="include_intermediate" id="" 
                                    className="form-check-input ms-2"
                                    defaultChecked={reportFormData.include_intermediate? 'checked': ''}
                                    onChange={handleReportCheck}
                                />
                            </label>
                        </div>
                    </div>
                    <table className="table-bordered">
                        <thead>
                            <tr>
                                <td>Category</td>
                                <td>Senior</td>
                                <td>Intermediate</td>
                                <td>Junior</td>
                            </tr>
                        </thead>
                        <tbody>
                            <RenderMembershipForm 
                                defaultMembership={defaultMembership} 
                                handleMembershipChange={handleMembershipChange} 
                            />
                        </tbody>
                    </table>
                </div>

                {/* Achievements */}
                <div className="row border border-dark rounded rounded-3 p-3 my-2">
                    <p className="fs-3 text-primary">Achievements</p>
                    <div className="row my-2 text-dark">
                        <div className="col">
                            <label htmlFor="include_empty_achievements">
                                Include empty achievement rows in report: 
                                <input type="checkbox" 
                                    name="include_empty_achievements" id="" 
                                    className="form-check-input ms-2"
                                    defaultChecked={reportFormData.include_intermediate? 'checked': ''}
                                    onChange={handleReportCheck}
                                />
                            </label>
                        </div>
                    </div>
                    <table className="table-bordered">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Current year</th>
                                <th>Previous year</th>
                            </tr>
                        </thead>
                        <tbody>
                            <RenderAchievementForm 
                                defaultAchievements={defaultAchievements}
                                handleAchievementChange={handleAchievementChange}
                            />
                            <tr>
                                <td>
                                    <input 
                                        type="text" 
                                        name="other__name" id="" 
                                        className="form-control border border-dark" 
                                        placeholder="Other"
                                        onChange={handleAchievementChange}
                                        defaultValue={otherAchievementName}
                                    />
                                </td>
                                <td>
                                    <input 
                                        type="number" 
                                        name="other__current" id="" 
                                        className="form-control border border-dark" 
                                        onChange={handleAchievementChange}
                                        defaultValue={otherAchievementValue[0]}
                                    />
                                </td>
                                <td>
                                    <input 
                                        type="number" 
                                        name="other__previous" id="" 
                                        className="form-control border border-dark" 
                                        onChange={handleAchievementChange}
                                        defaultValue={otherAchievementValue[1]}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Works */}
                <div className="row border border-dark rounded rounded-3 p-3 my-2">
                    <p className="fs-3 text-primary">Works</p>
                    {
                        // workSummaries.map(summary => {
                        reportFormData.work_summaries.map(summary => {
                            // const workObj = reportFormData.work_summaries.filter(item => item.type === summary.type)[0]
                            let ind; 
                            for (let i in workSummaries) {
                                if (summary.type === reportFormData.work_summaries[i]['type']) {
                                    ind = i;
                                }
                            }
                            console.log('check 3', summary, reportFormData.work_summaries[ind])
                            return (
                                <div key={summary.id}>
                                <div className="row row-cols-lg-2 row-cols-md-2 border mx-1 p-3" key={summary.id}>
                                <div className="col-12">
                                    {/* title */}
                                    <p className="fs-4">
                                        {summary.type} 
                                        {summary.active? (
                                            <>
                                                <span className="mx-3">|</span>
                                                <span className="fs-6 text-primary"> Active</span>
                                            </>
                                            ): (<></>)}
                                    </p>
                                </div>
                                <div className="col-6">
                                <label htmlFor="no_assigned"><span className="me-1">No. assigned</span>
                                        <input 
                                            type="number" name={summary.type + "__no_assigned"} id=""
                                            className='form-control-sm rounded rounded-3 border border-dark'
                                            onChange={handleWorkChange}
                                            value={summary.no_assigned}
                                        />
                                    </label>
                                </div>

                                <div className="col-6">
                                    <label htmlFor="no_done"><span className="me-1">No. done</span>
                                        <input 
                                            type="number" name={summary.type + "__no_done"} id=""
                                            className='form-control-sm rounded rounded-3 border border-dark'
                                            onChange={handleWorkChange}
                                            value={summary.no_done}
                                        />
                                    </label>
                                </div>

                                {
                                    parseObjectKeys(summary.details).map(item => {
                                        return (
                                            <div className="col" key={item}>
                                                <label htmlFor={`${summary.type}__${item}`}>
                                                    <span className="me-1">{item}</span>
                                                    <input 
                                                        type="number" 
                                                        name={`${summary.type}__${item}`} id="" 
                                                        className="form-control border border-dark"
                                                        value={summary.details[item]}
                                                        onChange={handleWorkChange}
                                                    />
                                                </label>
                                            </div>
                                        )
                                    })
                                }
                                </div>
                                
                                {summary.active?
                                <>
                                    <div className="col-6">
                                        <label htmlFor="include_total"><span className="me-4">Include Total No.</span>
                                            <input 
                                                type="checkbox" name={summary.type + "_total"} id=""
                                                className='form-check-input rounded rounded-3 border border-dark'
                                                onChange={handleWorkTotalOrAverage}
                                                defaultChecked={
                                                    reportFormData.work_total_and_average[summary.type]?
                                                    reportFormData.work_total_and_average[summary.type]['total']: 
                                                    false
                                                }
                                            />
                                        </label>
                                    </div>

                                    <div className="col-6">
                                        <label htmlFor="include_avg"><span className="me-4">Include Average No.</span>
                                            <input 
                                                type="checkbox" name={summary.type + "_average"} id=""
                                                className='form-check-input rounded rounded-3 border border-dark'
                                                onChange={handleWorkTotalOrAverage}
                                                defaultChecked={
                                                    reportFormData.work_total_and_average[summary.type]?
                                                    reportFormData.work_total_and_average[summary.type]['average']: 
                                                    false
                                                }
                                            />
                                        </label>
                                    </div>
                                </>
                                : <></>}
                                </div>
                            )
                        })
                    }
                </div>

                {/* Function attendances */}
                <div className="fxn-attendance row  p-3 my-2">
                    <p className="fs-3 text-primary">Legion Functions with Attendance</p>
                    <table className="table border border-dark">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Date</th>
                            <th>Current year</th>
                            <th>Previous year</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            defaultFxnAttendance.map(fxn => (
                                <tr key={fxn.name}>
                                    <td>{fxn.name}</td>
                                    <td>
                                        {
                                            fxn.name !== 'Patrician Meetings'
                                            ? 
                                            <input 
                                                type="date" 
                                                name={fxn.name + "__date"} id="" 
                                                className="form-control border border-dark rounded rounded-3"
                                                defaultValue={fxn.date}
                                                onChange={handleFxnAttendanceChange}
                                            />
                                            : 
                                            <>
                                            <input type="month" name="patricians_start" id="" 
                                                className='form-control'
                                                onChange={handleReportChange}
                                                defaultValue={defaultPatriciansStart}
                                            />
                                            <input type="month" name="patricians_end" id=""  
                                                className='form-control'
                                                onChange={handleReportChange}
                                                defaultValue={defaultPatriciansEnd}
                                            />
                                            </>
                                        }
                                    </td>
                                    <td>
                                        <input type="number" 
                                            name={fxn.name + "__current_year_attendance"} id="" 
                                            className="form-control border border-dark rounded rounded-3"
                                            defaultValue={fxn.current_year_attendance}
                                            onChange={handleFxnAttendanceChange}
                                            />
                                    </td>
                                    <td>
                                        <input type="number" 
                                            name={fxn.name + "__previous_year_attendance"} id="" 
                                            className="form-control border border-dark rounded rounded-3"
                                            defaultValue={fxn.previous_year_attendance}
                                            onChange={handleFxnAttendanceChange}
                                            />
                                    </td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                </div>

                {/* Finance */}
                <div className="finance row  p-3 my-2">
                    <p className="fs-3 text-primary">Finance</p>
                    <table className="table table-bordered">
                        <thead className="">
                        <tr> {/* Top header row */}
                            <th></th>
                            <th colSpan={2} className="text-center">Income</th>
                            <th colSpan={expenditureLen+1} className="text-center">Expenditure</th>
                            <th></th>
                            {/* <th></th> */}
                        </tr>
                        <tr> {/* Second header row */}
                            <th className="text-center">Month</th>
                            <th className="text-center">BF</th>
                            <th className="text-center">SBC</th>
                            <th colSpan={expenditureLen} className="text-center">To Praesidium</th>
                            <th className="text-center">To Curia</th>
                            <th className="text-center">Balance</th>
                        </tr>
                        <tr> {/* Third header row */}
                            <th className="text-center"></th>
                            <th className="text-center"></th>
                            <th className="text-center"></th>

                            {
                                expenditureKeys.map(item => {
                                    // console.log("Check 1", item)
                                    return (<th key={item} className="text-center">{item}</th>)
                                })
                            }
                            <th className="text-center"></th>
                            <th className="text-center"></th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                finSummaryRender.map(item => {
                                    // console.log("Check 2", item);
                                    return (
                                    <tr key={item.id}>
                                        <th>{item.month}, {item.year}</th>
                                        <th>
                                            <input 
                                                type="number" 
                                                name={item.year+'__'+item.month+'__'+'bf'} id="" 
                                                className="form-control border border-dark rounded rounded-3"
                                                value={item.bf}
                                                onChange={handleFinanceChange}
                                            />
                                        </th>
                                        <th>
                                            <input 
                                                type="number" 
                                                name={item.year+'__'+item.month+'__'+'sbc'} id="" 
                                                className="form-control border border-dark rounded rounded-3"
                                                value={item.sbc}
                                                onChange={handleFinanceChange}
                                            />
                                        </th>
                                        <th>
                                            <input 
                                                type="number" 
                                                name={item.year+'__'+item.month+'__'+'bouquet'} id="" 
                                                className="form-control border border-dark rounded rounded-3"
                                                value={item.expenses.bouquet}
                                                onChange={handleFinanceChange}
                                            />
                                        </th>
                                        <th>
                                            <input 
                                                type="number" 
                                                name={item.year+'__'+item.month+'__'+'stationery'} id="" 
                                                className="form-control border border-dark rounded rounded-3"
                                                value={item.expenses.stationery}
                                                onChange={handleFinanceChange}
                                            />
                                        </th>
                                        <th>
                                            <input 
                                                type="number" 
                                                name={item.year+'__'+item.month+'__'+'altar'} id="" 
                                                className="form-control border border-dark rounded rounded-3"
                                                value={item.expenses.altar}
                                                onChange={handleFinanceChange}
                                            />
                                        </th>
                                        <th>
                                            <input 
                                                type="number" 
                                                name={item.year+'__'+item.month+'__'+'extension'} id="" 
                                                className="form-control border border-dark rounded rounded-3"
                                                value={item.expenses.extension}
                                                onChange={handleFinanceChange}
                                            />
                                        </th>
                                        <th>
                                            <input 
                                                type="number" 
                                                name={item.year+'__'+item.month+'__'+'others'} id="" 
                                                className="form-control border border-dark rounded rounded-3"
                                                value={getSumOfOtherExpenditure(item.expenses.others)}
                                                onChange={handleFinanceChange}
                                            />
                                        </th>
                                        <th>
                                            <input 
                                                type="number" 
                                                name={item.year+'__'+item.month+'__'+'remittance'} id="" 
                                                className="form-control border border-dark rounded rounded-3"
                                                value={item.remittance}
                                                onChange={handleFinanceChange}
                                            />
                                        </th>
                                        <th>
                                            <input 
                                                type="number" 
                                                name={item.year+'__'+item.month+'__'+'balance'} id="" 
                                                className="form-control border border-dark rounded rounded-3"
                                                value={item.balance}
                                                onChange={handleFinanceChange}
                                            />
                                        </th>
                                    </tr>)
                                })
                            }
                        </tbody>
                    </table>
                    <div className="row my-4">
                        <div className="col-6">
                            Cost of report production:
                            <input type="number" name="report_production" id="" 
                                className="border border-dark form-control" 
                                defaultValue={reportFormData.report_production}
                                onChange={handleFinanceChange}
                            />
                        </div>
                        <div className="col-6">
                            Balance at hand:
                            <input type="number" name="balance_at_hand" id="" 
                                className="border border-dark form-control" 
                                defaultValue={reportFormData.balance_at_hand}
                                onChange={handleFinanceChange}
                            />
                        </div>
                    </div>


                    
                </div>

                {/* Comments */}
                <div className="row border border-dark rounded rounded-3 p-3 my-2">
                    <p className="fs-3 text-primary">Comments</p>
                    <div className="col-12 mt-1">
                        <label htmlFor="problems">
                            Problems: 
                        </label>
                        <textarea 
                            name="problems" id="" 
                            className="form-control border border-dark"
                            rows="2"
                            defaultValue={defaultProblems}
                            onChange={handleReportChange}
                        ></textarea>
                    </div>
                    
                    <div className="col-12 mt-1">
                        <label htmlFor="remarks">
                            Remarks: 
                        </label>
                        <textarea 
                            name="remarks" id="" 
                            className="form-control border border-dark"
                            rows="2"
                            defaultValue={defaultRemarks}
                            onChange={handleReportChange}
                        ></textarea>
                    </div>

                    <div className="col-12 mt-1">
                        <label htmlFor="conclusion">
                            Conclusion: 
                        </label>
                        <textarea 
                            name="conclusion" id="" 
                            className="form-control border border-dark"
                            rows="2"
                            defaultValue={defaultConclusion}
                            onChange={handleReportChange}
                        ></textarea>
                    </div>
                </div>
                
                {/* Audited */}
                <div className="row my-2 text-dark">
                    <div className="col">
                        <label htmlFor="read_and_accepted">
                            Was this report read and accepted by the members? 
                            <input type="checkbox" 
                                name="read_and_accepted" id="" 
                                className="form-check-input ms-2"
                                defaultChecked={reportFormData.read_and_accepted? 'checked': ''}
                                onChange={handleReportCheck}
                            />
                        </label>
                    </div>
                </div>

                {/* Auditors */}
                <div className="row border border-dark rounded rounded-3 p-2 my-2">
                    <div className="col-6 mb-2">
                        <label htmlFor="remarks">
                            Auditor 1: 
                        </label>
                            <input 
                                name="auditor_1"
                                type="text" 
                                className="form-control border border-dark" 
                                value={reportFormData.auditor_1}
                                onChange={handleReportChange}
                            />
                    </div>

                    <div className="col-6 mb-2">
                        <label htmlFor="remarks">
                            Auditor 2:
                        </label> 
                            <input 
                                name="auditor_2"
                                type="text" 
                                className="form-control row border border-dark" 
                                value={reportFormData.auditor_2}
                                onChange={handleReportChange}
                            />
                    </div>

                </div>

                {/* Submission */}
                {isManager?
                <div className="row mt-5">
                {
                    (creating)? 
                    <>
                    <div className="col">
                        <button type="submit" className="btn btn-outline-success col-12 rounded rounded-5">{btnTitle}</button>
                    </div>
                    <div className="col">
                        <Link to="../../" className="btn btn-outline-primary col-12 rounded rounded-5">Cancel</Link>
                    </div>
                    </>
                    : 
                    <>
                    <div className="col">
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

export default ReportForm


export const reportFormLoader = async ({ params }) => {
    const {pid, rid} = params;
    const loc = "In the report form loader fxn";
    // console.log(loc, 'pid', pid);
    let praesidium, report, finSummary, prepData, isMember = false, isManager = false; 

    // console.log(loc); 
    // try {
        const token = localStorage.getItem('accessToken'); 
        if (token) {
            const config = {
                headers: {
                    "Authorization": `Bearer ${token}` 
                }
            };
            console.log(loc, pid); 
            const praesidiumResponse = await axios.get(BASEURL+ `praesidium/praesidium/${pid}`, config);
            

            praesidium = praesidiumResponse.data; 

            if (rid) {
                const reportResponse = await axios.get(BASEURL + `reports/report/${rid}`, config); 
                // if (!reportResponse.ok) {console.log("Didn't get the report from backend")}
                // else {console.log("Did get the report from the backend")}
                report = reportResponse.data; 
                const membershipResponse = await axios.get(BASEURL + `reports/membership/${report.membership_details}`, config)
                report.membership = membershipResponse.data; 
                const achievementResponse = await axios.get(BASEURL + `reports/achievement/${report.achievements.id}`, config)
                report.achievement = achievementResponse.data; 
                report.fxn_attendances = [];
                for (let i in report.function_attendances) {
                    // console.log(loc, 'index of fxn attendances', i, report.function_attendances[i])
                    const fxnInd = report.function_attendances[i];
                    const attendanceResponse = await axios.get(BASEURL + `reports/attendance/${fxnInd}`, config);
                    report.fxn_attendances.push(attendanceResponse.data); 
                }

                report.workSummaries = [];
                for (let i in report.work_summaries) {
                    // console.log(loc, 'index of fxn attendances', i, report.function_attendances[i])
                    const workSummaryInd = report.work_summaries[i];
                    const summaryResponse = await axios.get(BASEURL + `works/summaries/${workSummaryInd}`, config);
                    report.workSummaries.push(summaryResponse.data); 
                }

                const finSummaryResponse = await axios.get(`${BASEURL}finance/summaries/${report.financial_summary}`, config);
                finSummary = finSummaryResponse.data; 
            }

            // const workListResponse = await axios.get(`${BASEURL}works/work_list/?pid=${pid}`, config);
            // workList = workListResponse.data; 

            // Get prepData: 
            const packet = {
                pid: pid
            }
            const prepDataResponse = await axios.post(BASEURL + "reports/get_report_prep_data", packet, config);
            prepData = prepDataResponse.data;
            console.log(loc, 'prepdata', prepData)

            const legionaryResponse = await axios.get(BASEURL + 'accounts/user', config); 
            const legionary = legionaryResponse.data;

            // console.log(' praesidium.members',  praesidium.members, legionary.id)
            isMember = praesidium.members.includes(legionary.id)
            isManager = praesidium.managers.includes(legionary.id)


        } else {
            console.log("Sign in to get report")
        }

        return [praesidium, report, finSummary, prepData, isMember, isManager]; 

}

