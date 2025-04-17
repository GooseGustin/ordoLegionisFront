import axios from 'axios';
import { NavLink, useLoaderData, useNavigate } from 'react-router-dom'
import {parseObjectKeys, removeRepeatedObjectsFromArray} from '../../../functionVault'
import Vexillium from "../../../../assets/Vexillium_Legionis.png"
import { BASEURL } from "../../../functionVault";

const formatDate = (date) => {
    // console.log("in format date", date)
    if (date) {
        const dateObj = new Date(date.split('-')); 
        let dateStr = dateObj.toDateString(); 
        const [weekday, month, day, year] = dateStr.split(' '); 
        const formattedDate = day + ' ' + month + ' ' + year; 
        return [formattedDate, month, day, year];
    }
    return [null, null, null, null]; 
}

const RenderCuriaAttendance = ({ report }) => {
    const officers = ["President", "Vice President", "Secretary", "Treasurer"]; 
    return officers.map(item => (
        <tr key={item}>
            <td>{item}</td>
            <td>{report.no_curia_meetings_held[item]}</td>
            <td>{report.officers_curia_attendance[item]}</td>
            <td>{report.previous_curia_attendance[item]} out of {report.no_curia_meetings_held_previous[item]}</td>
        </tr>
    ))
}

const RenderPraesidiumAttendance = ({ report }) => {
    const officers = ["President", "Vice President", "Secretary", "Treasurer"]; 
    return officers.map(item => (
        <tr key={item}>
            <td>{item}</td>
            <td>{report.no_praesidium_meetings_held[item]}</td>
            <td>{report.officers_meeting_attendance[item]}</td>
            <td>{report.previous_meeting_attendance[item]} out of {report.no_praesidium_meetings_held_previous[item]}</td>
        </tr>
    ))
}


const RenderWorksInCells = ({ summary, active, work_total_and_average }) => {
    const numRows = Math.ceil(summary.length / 2);
    const validWorks = summary.filter(item => item.active === active);

    return (
        <>
            {Array.from({ length: numRows }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                    {validWorks.slice(rowIndex * 2, rowIndex * 2 + 2).map((work, index) => {
                        // calculate total or average 
                        // console.log("in render work in cells", work, work.details)
                        const metrics = parseObjectKeys(work.details)
                        let totalNo = 0;
                        metrics.forEach((item) => {
                            // console.log('Dont add no of homes', item); 
                            if (!item.includes('home')) { // || !item.includes('Homes') || item !== 'No of homes') {
                                // console.log('adding', item);
                                totalNo += work.details[item]; 
                            }
                        })
                        const total_or_average = work_total_and_average[work.type]; 
                        let total, average; 
                        if (total_or_average) {
                            const totalBool = total_or_average.total; 
                            const averageBool = total_or_average.average; 
                            if (totalBool) {
                                total = totalNo; 
                            } 
                            if (averageBool) {
                                average = isFinite(totalNo/work.no_done)? Math.ceil(totalNo/work.no_done): 0; 
                            }
                        }
                        return (
                        <td key={index} className="border p-2">
                            <strong>{work.type}</strong> <br />
                            Done: {work.no_done}, Assigned: {work.no_assigned}
                            {
                                (total || average) ?
                                <>
                                    <br /> 
                                    {total ? <>Total: {total}</>: <></>}
                                    {average ? <>, Average: {average}</>: <></>}
                                </>: <></>
                            }
                            <br />
                            {Object.entries(work.details).map(([key, value]) => (
                                <div key={key}>{key}: {value}</div>
                            ))}
                        </td>
                    )}
                    )}
                    {validWorks.length % 2 !== 0 && rowIndex === numRows - 1 && <td></td>}
                </tr>
            ))}
        </>
    );
};


const RenderAchievements = ({ achvObj, includeEmpties }) => {
    // current: no_baptized; previous: no_baptized__previous
    const achievementNames = {
        'no_baptized': 'Baptized', 
        'no_confirmed': "Confirmed", 
        'no_converted': "Converted to Christianity", 
        'no_first_communicants': 'First communicants', 
        'no_married': "Marriages solemnized", 
        'no_recruited': "Recruited into the Legion", 
        'no_vocations': "Called to vocation", 
        'no_promised': "Legion promises taken"
    }; 
    const objKeys = parseObjectKeys(achvObj); 
    if (objKeys.includes('id')) objKeys.shift(); // remove id 
    return (
        objKeys.map(item => {
            const isEmptyRow = achvObj[item][0] == 0 && achvObj[item][1] == 0;
            const name = achievementNames[item]; 
            // console.log('check 1', achvObj, item, name, isEmptyRow, achvObj[item])
            if (name) {
                if (!includeEmpties && !isEmptyRow) {
                    return (
                        <tr key={name}>
                            <td>{name}</td>
                            <td className='text-center'>{achvObj[item][0]}</td>
                            <td className='text-center'>{achvObj[item][1]}</td>
                        </tr>
                    )
                } else if (includeEmpties) {
                    return (
                        <tr key={name}>
                            <td>{name}</td>
                            <td className='text-center'>{achvObj[item][0]}</td>
                            <td className='text-center'>{achvObj[item][1]}</td>
                        </tr>
                    )
                }

            } else {
                const name = parseObjectKeys(achvObj[item])[0]; 
                if (name) {
                    const values = achvObj[item][name]; 
                    return (
                        <tr key='others'>
                            <td>{name}</td>
                            <td className='text-center'>{values[0]}</td>
                            <td className='text-center'>{values[1]}</td>
                        </tr>
                    )
                }
            }
        })
    )
}

const RenderMembership = ({ memberObj, includeIntermediate }) => {
    const membershipTitles = {
        affiliated_praesidia: 'Praesidia Affiliated (if any)', 
        active_members: "Active Members", 
        probationary_members: "Probationary Members", 
        auxiliary_members: "Auxiliary Members", 
        praetorian_members: "Praetorian Members", 
        adjutorian_members: "Adjutorian Members"
    }
    const objKeys = parseObjectKeys(memberObj); 
    // if (objKeys.includes('id')) objKeys.shift(); // remove id 
    const totalMembersSenior = memberObj.active_members[0]+memberObj.probationary_members[0]+memberObj.auxiliary_members[0]
    const totalMembersInter = memberObj.active_members[1]+memberObj.probationary_members[1]+memberObj.auxiliary_members[1]
    const totalMembersJunior = memberObj.active_members[2]+memberObj.probationary_members[2]+memberObj.auxiliary_members[2]
    return (
        <>
        {objKeys.map(item => {
            const name = membershipTitles[item]; 
            if (name) {
                return (
                    <tr key={name}>
                        <td>{name}</td>
                        <td className='text-center'>{memberObj[item][0]}</td>
                        {includeIntermediate && <td className='text-center'>{memberObj[item][1]}</td>}
                        <td className='text-center'>{memberObj[item][2]}</td>
                    </tr>
                )
            }
        })}
        <tr>
            <td>Total members</td>
            <td className='text-center'>{totalMembersSenior}</td>
            {includeIntermediate && <td className='text-center'>{totalMembersInter}</td>}
            <td className='text-center'>{totalMembersJunior}</td>
        </tr>
        </>
    )

}

const RenderFxnAttendanceDate = ({ fxnObj, report }) => {
    // <td>{formatDate(obj.date)[0]}</td>
    let dateItem, mayDevotionYear, octoberDevotionYear; 
    const [ss, submissionMonth, tt, submissionYear]= formatDate(report.submission_date); 
    const [uu, lastSubmissionMonth, vv, lastSubmissionYear] = formatDate(report.last_submission_date);
    mayDevotionYear = submissionMonth <= 4 ? lastSubmissionYear: submissionYear;
    octoberDevotionYear = submissionMonth <= 9 ? lastSubmissionYear: submissionYear;
    // const last_submission_month = formatDate(report.last_submission_date)[1]; 
    if (fxnObj.name == 'May Devotion') {
        dateItem = (<td className='table-date'>01 May to 31 May {mayDevotionYear}</td>)
    } else if (fxnObj.name == 'October Devotion') {
        dateItem = (<td className='table-date'>01 Oct to 31 Oct {octoberDevotionYear}</td>)
    } else if (fxnObj.name == 'Patrician Meetings') {
        const [w, m, d, y] = formatDate(report.patricians_start) 
        const [w2, m2, d2, y2] = formatDate(report.patricians_end)
        let patricians_range = m + ' ' + y + ' to ' + m2 + ' ' + y2; 
        dateItem = (<td className='table-date'>{patricians_range}</td>)
        // dateItem = (<td>{lastSubmissionMonth} {lastSubmissionYear} to {submissionMonth} {submissionYear}</td>)
    } else if (fxnObj.date) {
        dateItem = (<td className='table-date'>{formatDate(fxnObj.date)[0]}</td>); 
    } else {
        dateItem = (<td className='table-date'></td>)
    }
    return dateItem; 
}

function getTerm(app_date, sub_date) {
    // Takes in appointmentDate and submissionDate in order to get officer term
    // console.log("in get term", app_date, sub_date); 
    const appDate = new Date(app_date); 
    const subDate = new Date(sub_date); 

    let years = subDate.getFullYear() - appDate.getFullYear(); 
    // console.log('years', years);
    const hasAnniversaryPassed = subDate.getMonth() > appDate.getMonth() || (
            subDate.getMonth() === appDate.getMonth() && subDate.getDate() >= appDate.getDate()
        );
    // console.log("has passed", hasAnniversaryPassed)
    if (!hasAnniversaryPassed){
        years--; 
    }
    const term = Math.floor(years/3)+1;
    if (term <= 3) {
        return term; 
    } 
    return 3;
}

const Preview = () => {
    const [curia, praesidium, report, isMember, isManager] = useLoaderData(); 
    const navigate = useNavigate();

    // useEffect(() => {
    //     if (!isMember) {
    //         // leave this page if not member
    //         navigate('/praesidium');
    //     }
    // }, []);

    const loc = "In preview mode"; 
    console.log(loc, report)

    const tempOtherKey = parseObjectKeys(report.achievements.others)[0]
    const otherAchievementName = tempOtherKey;
    const otherAchievementValue = report.achievements.others[tempOtherKey]; 

    const includeIntermediate = report.include_intermediate || false; 
    
    const defaultMembership = report? report.membership: {
        id: 0, 
        affiliated_praesidia: [1, 0, 1], 
        active_members: [5, 0, 15], 
        probationary_members: [2, 0, 10], 
        auxiliary_members: [0, 0, 0], 
        praetorian_members: [0, 0, 0], 
        adjutorian_members: [0, 0, 0], 
        others: {'No. who took Legion promise': [2, 3]}
    }
    const defaultAchievements = report? report.achievements: {
        id: 0, 
        no_recruited: [0, 0],
        no_baptized: [0, 0], 
        no_confirmed: [0, 0],  
        no_first_communicants: [0, 0], 
        no_vocations: [0, 0], 
        no_marriages: [0, 0], 
        no_converted: [0, 0]
    }

    const listOutWorks = (workSummary, inactive) => {
        let workNames = [], validSummaries; 
        if (!inactive) {
            validSummaries = workSummary.filter(item => item.active); 
        } else {
            validSummaries = workSummary.filter(item => !item.active); 
        }
        validSummaries.forEach(item => workNames.push(item.type)); 
        const n = workNames.length; 
        let listString = '';
        for (let i=1; i<=n; i++) {
            listString += workNames[i-1]; 
            if (i < n) {
                listString += ', '; 
            } else {
                listString += '.'; 
            }
        } 
        // console.log('In list out works', workNames, listString);
        return listString; 
    }

    const sumUp = (arr) => {
        let sum = 0; 
        for (let i in arr) {
            sum += arr[i]; 
        }
        return sum;
    }

    const sumUpOthers = (arrOfArrOfObjs) => {
        let sum = 0; 
        console.log('summing others', arrOfArrOfObjs); 
        const othersArray = arrOfArrOfObjs.map(item => removeRepeatedObjectsFromArray(item));
        console.log('othersArray', othersArray)
        for (let i in othersArray) {
            const arrOfObjs = othersArray[i]; 
            for (let j in arrOfObjs) {
                const obj = arrOfObjs[j]; 
                for (let key in obj) {
                    sum += obj[key]; 
                }
                // console.log('sum', sum);
            }
        }
        // console.log(sum)
        return sum; 
    }

    const convertFinSummaryForFrontend = (finSummaryObj) => {1
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

    const calcPraesidiumExpenses = (monthlyFinanceObj, tag='') => {
        // console.log("In calc praesidium expenses", monthlyFinanceObj)
        try {
            let {bouquet, stationery, altar, extension, others} = monthlyFinanceObj.expenses; 
            let othersSum = 0; 
            // console.log('others', others)
            others = removeRepeatedObjectsFromArray(others);
            for (let i in others) {
                let othersKeys = parseObjectKeys(others[i]); 
                for (let j in othersKeys) {
                    const val = others[i][othersKeys[j]];
                    othersSum += val; 
                    // console.log('val, sum', val, othersSum);
                }
            }
            return bouquet + stationery + altar + extension + othersSum; 
        } catch (err) {
            let others = monthlyFinanceObj;
            let othersSum = 0; 
            others = removeRepeatedObjectsFromArray(others);
            for (let i in others) {
                let othersKeys = parseObjectKeys(others[i]); 
                for (let j in othersKeys) {
                    const val = others[i][othersKeys[j]];
                    othersSum += val; 
                }
            }
            if (tag === 'others') {
                // console.log("exiting", othersSum)
                return othersSum; 
            }
        }
    }

    const getAuditTotal = (name) => {
        const finances = report.financial_summary; 
        let total = 0;
        if (name === 'sbc') {
            finances.sbc.forEach(i => total += i); 
        } else if (name === 'remittance') {
            finances.expenses.remittance.forEach(i => total += i); 
        } else if (name === 'praesidium') {
            finances.expenses.bouquet.forEach(i => total += i); 
            finances.expenses.stationery.forEach(i => total += i); 
            finances.expenses.altar.forEach(i => total += i); 
            finances.expenses.extension.forEach(i => total += i); 
            finances.expenses.others.forEach(arr => total += calcPraesidiumExpenses(arr, 'others'))
        }
        return total;
    } 

    const getMonthlyBreakdown = (monthlyFinanceObj) => {
        let statement = []; 
        const remittance = monthlyFinanceObj.remittance; 
        const {bouquet, stationery, altar, extension, others} = monthlyFinanceObj.expenses; 
        if (remittance) {statement.push(`Remittance: ${currency}${remittance}`)}
        if (bouquet) {statement.push(`Spiritual bouquet: ${currency}${bouquet}`)}
        if (stationery) {statement.push(`Stationery: ${currency}${stationery}`)}
        if (altar) {statement.push(`Altar: ${currency}${altar}`)}
        if (extension) {statement.push(`Extension: ${currency}${extension}`)}
        for (let i in others) {
            let othersKeys = parseObjectKeys(others[i]); 
            for (let j in othersKeys) {
                const val = others[i][othersKeys[j]];
                // othersSum += val; 
                statement.push(`${othersKeys[j]}: ${currency}${val}`)
            }
        }
        statement = statement.join(', ')
        return statement
    }

    const handleDownload = async () => {
        try {
            const token = localStorage.getItem('accessToken'); 
            if (!token) {
                throw Error('Token not found. Sign in to download')
            }
            const config = {
                headers: {
                    "Authorization": `Bearer ${token}` , 
                    "Content-Type": "application/json", 
                    // "X-CSRFToken": getCookie("csrftoken"),
                }, 
                responseType: "blob" // Important for handling binary data
            };
            console.log("Downloading report", report.report_number)
            const packet = {
                pid: praesidium.id, 
                cid: curia.id, 
                rid: report.id, 
                membership: report.membership,
                financial_summary: report.financial_summary, 
                work_summary: report.work_summary, 
                fxn_attendances: report.fxn_attendances
            }
            const response = await axios.post(BASEURL + "reports/download", packet, config);
            const url = window.URL.createObjectURL(new Blob([response.data])); 
            const link = document.createElement('a'); 
            link.href = url; 
            const docName = `Report ${report.report_number} of ${praesidium.name}.docx`
            link.setAttribute('download', docName); 
            document.body.appendChild(link); 
            link.click();
            link.parentNode.removeChild(link); 
            // window.open(url, '_blank'); // Open the file in a new tab
            // console.log("Download complete")
            // const response = await fetch(
            //     BASEURL + "reports/download", 
            //     {
            //         method: "POST", 
            //         headers: {
            //             "Authorization": `Bearer ${token}` , 
            //             "Content-Type": "application/json", 
            //             "X-CSRFToken": getCookie("csrftoken"),
            //         }, 
            //         body: JSON.stringify(packet)
            //     }
            // ); 
            // if (!response.ok) {
            //     console.error("Failed to download report"); 
            //     return; 
            // }

            // Convert response to blob 
            // const blob = await response.blob(); 
            // const url = window.URL.createObjectURL(blob); 

            // // Create a temporary <a> element to trigger download 
            // const a = document.createElement("a"); 
            // a.href = url; 
            // a.download = "Legion_Report.docx"; 
            // document.body.appendChild(a); 
            // a.click()
            // document.body.removeChild(a);
            
        } catch (err) {
            console.log(err)
        }
        
    }

    const finances = convertFinSummaryForFrontend(report.financial_summary);
    let financesCopy = finances 
    let last_others = financesCopy[finances.length-1].expenses.others
    last_others.push({'Production of report': finances[0].report_production})
    financesCopy[finances.length-1].expenses.others = removeRepeatedObjectsFromArray(last_others); 
    // financesCopy[finances.length-1].expenses.others.push({'Production of report': finances[0].report_production})
    console.log('Converted finances for frontend', finances, financesCopy)
    const currency = '\u20A6';

    const fin_bf = report.financial_summary.acf[0];
    const fin_sbc = sumUp(report.financial_summary.sbc); 
    const fin_total_income = fin_bf + fin_sbc; 
    const fin_rem = sumUp(report.financial_summary.expenses.remittance); 
    const fin_bouq = sumUp(report.financial_summary.expenses.bouquet); 
    const fin_stat = sumUp(report.financial_summary.expenses.stationery); 
    const fin_ext = sumUp(report.financial_summary.expenses.extension); 
    const fin_alt = sumUp(report.financial_summary.expenses.altar); 
    const fin_rep = report.financial_summary.report_production; 
    const fin_others = sumUpOthers(report.financial_summary.expenses.others) - fin_rep; 
    const fin_total_exp = fin_rem + fin_bouq + fin_stat + fin_ext + fin_alt + fin_others + fin_rep; 
    const fin_surplus = fin_total_income - fin_total_exp; 
    // const fin_bal 

    return (
        <div className=''>
        {/* sidebar */}
        <div className="sidebar">
            <nav className="nav flex-column">
                <NavLink className="nav-link" to='../'>
                    <span className="icon">
                    <i class="fa-solid fa-chart-simple"></i>
                    </span>
                    <span className="description">Report</span>
                </NavLink>
                <NavLink className="nav-link" to='../../../'>
                    <span className="icon">
                    <i class="fa-solid fa-shield-halved"></i> 
                    </span>
                    <span className="description">Praesidium</span>
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

        <div className="main-content review pt-5 pe-5 me-5 text-dark">
            <div className="page border me-5 border-dark">
                <div className="row mx-3 container">
                    <div className="col mt-3 container px-5">
                        <div className="row fw-bold"> {/* Heading */}
                            <div className="col-2 pe-5">
                                {/* Legion Vexillium */}
                                <img className='vexillium' src={Vexillium} alt="Vexillium Legionis" />
                            </div>
                            <div className="col-8 text-center">
                                <p className='fs-5'>LEGIONIS MARIAE</p>
                                <p>{curia.name.toUpperCase()} CURIA</p>
                                <p>{curia.parish.toUpperCase()}</p>
                                <p>EMAIL: {curia.email}</p>
                                <p>PRAESIDIUM ANNUAL REPORT</p>
                            </div>
                            <div className="col-2  p-5">
                                
                            </div>
                        </div>
                        <div className="row mb-3"> {/* Submission dates */}
                            <div className="col">
                                <span className="fw-bold">Date of Report:</span> {formatDate(report.submission_date)[0]}
                            </div>
                            <div className="col">
                                <span className="fw-bold">Date of Last Report:</span> {formatDate(report.last_submission_date)[0]}
                            </div>
                        </div>
                        <div className="row"> {/* Meeting details */}
                            <p><span className="fw-bold me-1">1. Name of Praesidium:</span>{praesidium.name}</p>
                            <p><span className="fw-bold me-1">2. Address:</span>{praesidium.parish}</p>
                            <div className="row mb-3">
                                <div className="col">
                                    <span className="fw-bold me-1">3. Report No.:</span>{report.report_number}
                                </div>
                                <div className="col">
                                    <span className="fw-bold me-1">Date of Inauguration:</span>{formatDate(praesidium.inaug_date)[0]}
                                </div>
                            </div>
                            <p><span className="fw-bold me-1">4. Day/Time/Venue of Meeting:</span>{praesidium.meeting_time}, {praesidium.address}</p>
                            <p><span className="fw-bold me-1">5. Period of Report:</span>{report.report_period}</p>
                            <p><span className="fw-bold me-1">6. Date, Names and Praesidium of Last Curia Visitors:</span> {formatDate(report.last_curia_visit_date)[0]}, {report.last_curia_visitors}</p>
                        </div>
                        <div className="row"> {/* Officers details */}
                            <p className='title mt-2'><span className="fw-bold">7. Officers Details</span></p>
                            <table className=" table-bordered table-condensed">
                                <thead>
                                    <tr>
                                        <th>Office</th>
                                        <th>Name</th>
                                        <th>Appointed Date</th>
                                        <th>Term</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Spiritual Director</td>
                                        <td>{praesidium.spiritual_director}</td>
                                        <td>{formatDate(praesidium.spiritual_director_app_date)[0]}</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>President</td>
                                        <td>{praesidium.president}</td>
                                        <td>{formatDate(praesidium.pres_app_date)[0]}</td>
                                        <td>{getTerm(praesidium.pres_app_date, report.submission_date)}</td>
                                    </tr>
                                    <tr>
                                        <td>Vice President</td>
                                        <td>{praesidium.vice_president}</td>
                                        <td>{formatDate(praesidium.vp_app_date)[0]}</td>
                                        <td>{getTerm(praesidium.vp_app_date, report.submission_date)}</td>
                                    </tr>
                                    <tr>
                                        <td>Secretary</td>
                                        <td>{praesidium.secretary}</td>
                                        <td>{formatDate(praesidium.sec_app_date)[0]}</td>
                                        <td>{getTerm(praesidium.sec_app_date, report.submission_date)}</td>
                                    </tr>
                                    <tr>
                                        <td>Treasurer</td>
                                        <td>{praesidium.treasurer}</td>
                                        <td>{formatDate(praesidium.tres_app_date)[0]}</td>
                                        <td>{getTerm(praesidium.tres_app_date, report.submission_date)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="row"> {/* Curia Attendance */}
                            <p className='title mt-2'><span className="fw-bold">8. Attendance to Curia</span></p>
                            <table className=" table-bordered table-condensed">
                                <thead>
                                    <tr>
                                        <th>Officer</th>
                                        <th>Meetings Held</th>
                                        <th>Current Year Attendance</th>
                                        <th>Previous Year Attendance</th>
                                        {/* <th></th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    <RenderCuriaAttendance report={report} />
                                </tbody>
                            </table>
                        </div>
                        <div className="row"> {/* Praesidium Meeting Attendance */}
                            <p className='title mt-2'><span className="fw-bold">9. Attendance to Praesidium</span></p>
                            <table className=" table-bordered table-condensed">
                                <thead>
                                    <tr>
                                        <th>Officer</th>
                                        <th>Meetings Held</th>
                                        <th>Current Year Attendance</th>
                                        <th>Previous Year Attendance</th>
                                        {/* <th></th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    <RenderPraesidiumAttendance report={report} />
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div className="page border py-3 me-5 border-dark my-3">
                <div className="row mx-3 container"> 
                    <div className="col mt-3 container px-5">
                        <div className="row">{/* Membership */}
                            <p className='title'><span className="fw-bold">10. Membership</span></p>
                            <table className="table-bordered">
                                <thead>
                                    <tr>
                                        <th>Category</th>
                                        <th className='text-center'>Senior</th>
                                        {includeIntermediate && <th className='text-center'>Intermediate</th>}
                                        <th className='text-center'>Junior</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <RenderMembership 
                                        memberObj={defaultMembership} 
                                        includeIntermediate={includeIntermediate} 
                                    />
                                </tbody>
                            </table>
                        </div>
                        <div className="row"> {/* Meetings and Attendance */}
                            <p className="fw-bold mt-2">11. Meetings and Attendace</p>
                            <table className='table-bordered'>
                                <thead>
                                    <tr>
                                        <th>No. Expected Meetings</th>
                                        <th>No. Held Meetings</th>
                                        <th>Average Meeting Attenance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{report.no_meetings_expected}</td>
                                        <td>{report.no_meetings_held}</td>
                                        <td>{report.avg_attendance}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <p><span className="fs-bold me-1">Reason for poor attendance:</span>{report.poor_attendance_reason}</p>
                        </div>
                        <div className="row"> {/* Works Undertaken */}
                            <p className="fw-bold mt-2">12. Works Undertaken</p>
                            <p><strong>Active: </strong>{listOutWorks(report.work_summary, false)}</p>
                            <p><strong>Others: </strong>{listOutWorks(report.work_summary, true)}</p>
                        </div>
                        <div className="row"> {/* Efforts Made */}
                            <p className="fw-bold">13. Efforts Made</p>
                            <table className="table-bordered table-condensed">
                                <tbody>
                                <RenderWorksInCells 
                                    summary={report.work_summary} 
                                    active={true} 
                                    work_total_and_average={report.work_total_and_average}
                                />
                                </tbody>
                            </table>
                        </div>
                        
                    </div>
                </div>
            </div>

            <div className="page border py-3 me-5 border-dark my-3">
                <div className="row mx-3 container"> 
                    <div className="col mt-3 container px-5">
                        <div className="row mb-4"> {/* Other Works */}
                            <table className="table-bordered">
                                <thead>
                                    <tr>
                                        <th>Work</th>
                                        <th>No. assigned</th>
                                        <th>No. done</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        report.work_summary.filter(item => !item.active).map(item => (
                                            <tr>
                                                <td>{item.type}</td>
                                                <td>{item.no_assigned}</td>
                                                <td>{item.no_done}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className="row mb-4"> {/* Achievements */}
                            <p><strong>14. Achievements Recorded</strong></p>
                            <table className="table-bordered">
                                <thead>
                                    <tr className='text-center'>
                                        <th>Category</th>
                                        <th>Current year</th>
                                        <th>Previous year</th>
                                    </tr>
                                    
                                </thead>
                                <tbody>
                                    <RenderAchievements achvObj={defaultAchievements} includeEmpties={report.include_empty_achievements} />
                                    {otherAchievementName? otherAchievementName.trim() ? 
                                    (
                                        <tr>
                                            <td>{otherAchievementName}</td>
                                            <td className='text-center'>{otherAchievementValue[0]}</td>
                                            <td className='text-center'>{otherAchievementValue[1]}</td>
                                        </tr>
                                    ): <></>: <></>}
                                </tbody>
                            </table>
                        </div>
                        <div className="row"> {/* Extension Plans */}
                            <p><strong>15. Plans for Extension Work:</strong> {report.extension_plans}</p>
                        </div>
                        <div className="row"> {/* Functions Attendance */}
                            <p><strong>16. Legion Functions with Attendance</strong></p>
                            <table className="table-bordered attendance">
                                <thead>
                                    <tr>
                                        <th className='table-index'>S/N</th>
                                        <th className='text-center function-name'>Function</th>
                                        <th className='text-center'>Date</th>
                                        <th className='text-center'>Current year</th>
                                        <th className='text-center'>Previous year</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        report.fxn_attendances.map((obj, key) => (
                                            <tr key={key}>
                                                <td className='table-index'>{key+1}</td>
                                                <td className='function-name'>{obj.name}</td>
                                                <RenderFxnAttendanceDate fxnObj={obj} report={report} />
                                                {/* <td><input type="month" name="" id="" /></td> */}
                                                <td className='text-center'>{obj.current_year_attendance}</td>
                                                <td className='text-center'>{obj.previous_year_attendance}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="page border py-3 me-5 border-dark my-3">
                <div className="row mx-3 container"> 
                    <div className="col mt-3 container px-5">
                        <div className="row mb-4"> {/* Finance */}
                            <p><strong>17. Finance</strong></p>
                            <table className="table-bordered finance">
                                <thead>
                                    <tr>
                                        <th className="table-index">S/N</th>
                                        <th className='description'>Description</th>
                                        <th className='amount'>{currency}</th>
                                        <th className='amount'>{currency}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th className='table-index'>a.</th>
                                        <th className='description'>Income</th>
                                        <th className='amount'></th>
                                        <th className='amount'></th>
                                    </tr>
                                    <tr>
                                        <td className='table-index'>i.</td>
                                        <td className='description'>Amount Brought Forward from Last Report</td>
                                        <td className='amount'></td>
                                        <td className='amount'>{fin_bf}</td>
                                    </tr>
                                    <tr>
                                        <td className='table-index'>ii.</td>
                                        <td className='description'>SBC for the Period</td>
                                        <td className='amount'></td>
                                        <td className='amount'>{fin_sbc}</td>
                                    </tr>
                                    <tr>
                                        <td className='table-index'>iii.</td>
                                        <th className='description'>Total Income</th>
                                        <td className='amount'></td>
                                        <td className='amount'>{fin_total_income}</td>
                                    </tr>
                                    <tr>
                                        <th className='table-index'>b.</th>
                                        <th className='description'>Expenditure</th>
                                        <td className='amount'></td>
                                        <td className='amount'></td>
                                    </tr>
                                    <tr>
                                        <td className='table-index'>i.</td>
                                        <td className='description'>Monthly Remittance</td>
                                        <td className='amount'>{fin_rem}</td>
                                        <td className='amount'></td>
                                    </tr>
                                    <tr>
                                        <td className='table-index'>ii.</td>
                                        <td className='description'>Spiritual Bouquet</td>
                                        <td className='amount'>{fin_bouq}</td>
                                        <td className='amount'></td>
                                    </tr>
                                    <tr>
                                        <td className='table-index'>iii.</td>
                                        <td className='description'>Stationery</td>
                                        <td className='amount'>{fin_stat}</td>
                                        <td className='amount'></td>
                                    </tr>
                                    <tr>
                                        <td className='table-index'>iv.</td>
                                        <td className='description'>Altar</td>
                                        <td className='amount'>{fin_alt}</td>
                                        <td className='amount'></td>
                                    </tr>
                                    <tr>
                                        <td className='table-index'>v.</td>
                                        <td className='description'>Extension</td>
                                        <td className='amount'>{fin_ext}</td>
                                        <td className='amount'></td>
                                    </tr>
                                    <tr>
                                        <td className='table-index'>vi.</td>
                                        <td className='description'>Production of Report</td>
                                        <td className='amount'>{report.financial_summary.report_production}</td>
                                        <td className='amount'></td>
                                    </tr>
                                    <tr>
                                        <td className='table-index'>vii.</td>
                                        <td className='description'>Others</td>
                                        <td className='amount'>{fin_others}</td>
                                        <td className='amount'></td>
                                    </tr>
                                    <tr>
                                        <td className='table-index'>viii.</td>
                                        <th className='description'>Total Expenses</th>
                                        <td className='amount'></td>
                                        <td className='amount'>{fin_total_exp}</td>
                                    </tr>
                                    <tr>
                                        <td className='table-index'>ix.</td>
                                        <th className='description'>Surplus Funds to Curia</th>
                                        <td className='amount'></td>
                                        <td className='amount'>{fin_surplus}</td>
                                    </tr>
                                    <tr>
                                        <th className='table-index'>c.</th>
                                        <th className='description'>Balance at Hand</th>
                                        <td className='amount'></td>
                                        <td className='amount'>{report.financial_summary.balance_at_hand}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="row mb-4"> {/* Conclusion */}
                            <p><strong>18. Were the finances audited? </strong>{report.audited? 'Yes': 'No'}</p>
                            <p><strong>19. Problems: </strong>{report.problems}</p>
                            <p><strong>20. Was the report read and accepted by members before submission? </strong>{report.read_and_accepted? 'Yes': 'No'}</p>
                            <p><strong>21. Final Remarks: </strong>{report.remarks}</p>
                            <p><strong>22. Conclusion: </strong>{report.conclusion}</p>
                        </div>
                        <div className="row mb-4"> {/* Signatures */}
                            <div className="row px-5">
                                <div className="col">
                                    <div className="row">______________________</div>
                                    <div className="row text-center pe-5">
                                        <div className="col"><strong>{praesidium.president}</strong></div>
                                    </div>
                                    <div className="row text-center pe-5">
                                        <div className="col"><strong>President</strong></div>
                                    </div>
                                </div>
                                <div className="col-5"></div>
                                <div className="col">
                                    <div className="row">______________________</div>
                                    <div className="row text-center pe-5">
                                        <div className="col"><strong>{praesidium.secretary}</strong></div>
                                    </div>
                                    <div className="row text-center pe-5">
                                        <div className="col"><strong>Secretary</strong></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row mb-4 mt-4"> {/* Spiritual Director's Comment */}
                            <p><strong>Spiritual director's comment:  ....... ........  ....... ........  ....... ........  ....... ........  ....... ........  ....... ........  ....... ........  ....... ........  ....... ........  ....... ........  ....... ........ ....... ........  ....... ........  ....... ........  ....... ........  ....... ........  ....... ........  ....... ........  ....... ........  ....... ........  ....... ........  ....... ........ ....... ........  ....... ........  ....... ........  ....... ........  ....... ........  ....... ........  ....... ........  ....... ........  </strong></p>
                        </div>
                        <div className="row mb-4"> {/* Spiritual Director's Signature */}
                            <div className="row justify-content-center">
                                <div className="col text-center ">
                                    <div className="row text-center">
                                        <div className="col"><strong>______________________</strong></div>
                                    </div>
                                    <div className="row text-center ">
                                        <div className="col"><strong>{praesidium.spiritual_director}</strong></div>
                                    </div>
                                    <div className="row text-center ">
                                        <div className="col"><strong>Spiritual Director</strong></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="page border py-3 me-5 border-dark my-3">
                <div className="row mx-3 container"> 
                    <div className="col mt-3 container px-5">
                        <div className="row mb-4"> {/* Auditor's report */}
                            <p className='text-center h5 text-dark'><strong>Auditor's Report</strong></p>
                            <table className=" table-bordered finance audit">
                                <thead className="">
                                    <tr> {/* Top header row */}
                                        <th className='table-index'></th>
                                        <th></th>
                                        <th colSpan={2} className="text-center">Income</th>
                                        <th colSpan={2} className="text-center">Expenditure</th>
                                        <th></th>
                                    </tr>
                                    <tr> {/* Second header row */}
                                        <th className="text-center table-index">S/N</th>
                                        <th className="text-center">Month</th>
                                        <th className="text-center">BF ({currency})</th>
                                        <th className="text-center">SBC ({currency})</th>
                                        <th className="text-center">Curia ({currency})</th>
                                        <th className="text-center">Praesidium ({currency})</th>
                                        <th className="text-center">Balance ({currency})</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { 
                                        financesCopy.map((item, key) => {
                                            // console.log("Check 2", item);
                                            return (
                                            <tr key={item.id}>
                                                <td className='table-index'>{key+1}</td>
                                                <td>{item.month}, {item.year}</td>
                                                <td>
                                                    {item.bf}
                                                </td>
                                                <td>
                                                    {item.sbc}
                                                </td>
                                                <td>
                                                    {item.remittance}
                                                </td>
                                                <td>
                                                    {calcPraesidiumExpenses(item)}
                                                </td>
                                                <td>
                                                    {item.balance}
                                                </td>
                                            </tr>)
                                        })
                                    }
                                    <tr>
                                        <th></th>
                                        <th>Total</th>
                                        <th></th>
                                        <th>{getAuditTotal('sbc')}</th>
                                        <th>{getAuditTotal('remittance')}</th>
                                        <th>{getAuditTotal('praesidium')}</th>
                                        <th></th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="row mb-4"> {/* Analysis */}
                            <p className='text-center h5 text-dark'><strong>Analysis</strong></p>
                            <table className="table-bordered finance">
                                <thead>
                                    <tr>
                                        <th className='description'>Description</th>
                                        <th className='amount'>{currency}</th>
                                        <th className='amount'>{currency}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th className='description'>Income</th>
                                        <th className='amount'></th>
                                        <th className='amount'></th>
                                    </tr>
                                    <tr>
                                        <td className='description'>Amount Brought Forward from Last Report</td>
                                        <td className='amount'></td>
                                        <td className='amount'>{fin_bf}</td>
                                    </tr>
                                    <tr>
                                        <td className='description'>SBC for the Period</td>
                                        <td className='amount'></td>
                                        <td className='amount'>{fin_sbc}</td>
                                    </tr>
                                    <tr>
                                        <th className='description'>Total Income</th>
                                        <td className='amount'></td>
                                        <td className='amount'>{fin_total_income}</td>
                                    </tr>
                                    <tr>
                                        <th className='description'>Expenditure</th>
                                        <td className='amount'></td>
                                        <td className='amount'></td>
                                    </tr>
                                    <tr>
                                        <td className='description'>To Curia</td>
                                        <td className='amount'>{fin_rem}</td>
                                        <td className='amount'></td>
                                    </tr>
                                    <tr>
                                        <td className='description'>To Praesidium</td>
                                        <td className='amount'>{getAuditTotal('praesidium')}</td>
                                        <td className='amount'></td>
                                    </tr>
                                    
                                    <tr>
                                        <th className='description'>Total Expenses</th>
                                        <td className='amount'></td>
                                        <td className='amount'>{fin_total_exp}</td>
                                    </tr>
                                    <tr>
                                        <th className='description'>Surplus Funds to Curia</th>
                                        <td className='amount'></td>
                                        <td className='amount'>{fin_surplus}</td>
                                    </tr>
                                    <tr>
                                        <th className='description'>Balance at Hand</th>
                                        <td className='amount'></td>
                                        <td className='amount'>{report.financial_summary.balance_at_hand}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="page border py-3 me-5 border-dark my-3">
                <div className="row mx-3 container"> 
                    <div className="col mt-3 container px-5">
                        <div className="row mb-4"> {/* Breakdown */}
                            <p className='text-center h5 text-dark'><strong>Breakdown of Expenditure</strong></p>
                            <table className="attendance table-bordered finance audit">
                                <thead className="">
                                    <tr> {/* Top header row */}
                                        <th className='table-index'>S/N</th>
                                        <th className='function-name'>Month</th>
                                        <th>Item</th>
                                        <th className='amount'>Amount ({currency})</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { 
                                        financesCopy.map((item, key) => {
                                            // console.log("Check 2", item);
                                            return (
                                            <tr key={item.id}>
                                                <td className='table-index'>{key+1}</td>
                                                <td className='function-name'>{item.month}, {item.year}</td>
                                                <td>
                                                    {getMonthlyBreakdown(item)}
                                                </td>
                                                <td className='amount'>
                                                    {calcPraesidiumExpenses(item) + item.remittance}
                                                </td>
                                            </tr>)
                                        })
                                    }
                                    <tr>
                                        <th></th>
                                        <th className='function-name'>Total</th>
                                        <th></th>
                                        <th className='amount'>{getAuditTotal('remittance') + getAuditTotal('praesidium')}</th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="row mb-4"> {/* Conclusion */}
                            <p><strong>Observations:</strong></p>
                            <p><br /></p>
                            <p><strong>Recommendations:</strong></p>
                            <p><br /></p>
                            <p><strong>Conclusion:</strong></p>
                            <p><br /></p>
                        </div>
                        <div className="row mb-4">
                            <div className="col">
                                <div className="row text-center">
                                    <div className="col"><strong>______________________</strong></div>
                                </div>
                                <div className="row text-center pe-5">
                                    <div className="col"><strong>{report.auditor_1}</strong></div>
                                </div>
                                <div className="row text-center pe-5">
                                    <div className="col"><strong>Auditor 1</strong></div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="row text-center">
                                    <div className="col"><strong>______________________</strong></div>
                                </div>
                                <div className="row text-center pe-5">
                                    <div className="col"><strong>{report.auditor_2}</strong></div>
                                </div>
                                <div className="row text-center pe-5">
                                    <div className="col"><strong>Auditor 2</strong></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="my-4 ms-3">
                <div className="row">
                    {/* <div className="col-12"> */}
                        <button className="btn btn-outline-info" onClick={handleDownload}>Download</button>
                    {/* </div> */}
                </div>
            </div>
        </div>
            


        </div>
    )
}

export default Preview


export const reportPreviewLoader = async ({ params }) => {

    /*
    get: praesidium, curia, report
    */
    const loc = "In report preview loader"; 
    let curia, praesidium, report, prepData; 
    let isMember = false, isManager = false; 

    const {pid, rid} = params; 
    // try {k
        const token = localStorage.getItem('accessToken'); 
        if (token) {
            const config = {
                headers: {
                    "Authorization": `Bearer ${token}` 
                }
            };
            // console.log(loc, pid); 
            const praesidiumResponse = await axios.get(BASEURL+ `praesidium/praesidium/${pid}`, config);
            praesidium = praesidiumResponse.data; 

            const cid = praesidium.curia; 
            const curiaResponse = await axios.get(`${BASEURL}curia/curia/${cid}`, config); 
            curia = curiaResponse.data; 

            // if (rid) {
            const reportResponse = await axios.get(BASEURL + `reports/report/${rid}`, config); 
            report = reportResponse.data; 

            const membershipResponse = await axios.get(BASEURL + `reports/membership/${report.membership_details}`, config)
            report.membership = membershipResponse.data; 

            // const achievementResponse = await axios.get(BASEURL + `reports/achievement/${report.achievements.id}`, config)
            // report.achievement = achievementResponse.data; 

            report.fxn_attendances = [];
            for (let i in report.function_attendances) {
                // console.log(loc, 'index of fxn attendances', i, report.function_attendances[i])
                const fxnInd = report.function_attendances[i];
                const attendanceResponse = await axios.get(BASEURL + `reports/attendance/${fxnInd}`, config);
                report.fxn_attendances.push(attendanceResponse.data); 
            }

            const finSummaryResponse = await axios.get(`${BASEURL}finance/summaries/${report.financial_summary}`, config);
            const finSummary = finSummaryResponse.data; 
            report.financial_summary = finSummary; 


            // Get prepData: 
            const packet = {
                pid: pid
            }
            const prepDataResponse = await axios.post(BASEURL + "reports/get_report_prep_data", packet, config);
            prepData = prepDataResponse.data;

            report.work_summary = [];
                for (let i in report.work_summaries) {
                    // console.log(loc, 'index of fxn attendances', i, report.function_attendances[i])
                    const workSummaryInd = report.work_summaries[i];
                    const summaryResponse = await axios.get(BASEURL + `works/summaries/${workSummaryInd}`, config);
                    report.work_summary.push(summaryResponse.data); 
                }
            console.log(loc, 'work summary', report)
            // report.work_summary = prepData.work_summaries; 
            // console.log(loc, 'prepdata', prepData)
            // console.log(loc, 'report 1', report)

            const legionaryResponse = await axios.get(BASEURL + 'accounts/user', config); 
            const legionary = legionaryResponse.data;

            // console.log(' praesidium.members',  praesidium.members, legionary.id)
            isMember = praesidium.members.includes(legionary.id)
            isManager = praesidium.managers.includes(legionary.id)

        } else {
            console.log("Sign in to get workSummary")
        }

        return [curia, praesidium, report, isMember, isManager]; 
    // }
}

 