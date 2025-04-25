import React, { useState } from "react";
import "../../assets/calendar-02/css/style.css";
// import "../../assets/calendar_02/calendar-02/css/style.css";

const Calendar = ({ handleDateChange }) => {
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());
    const [selectedDay, setSelectedDay] = useState(today.getDate());

    const monthNames = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const handlePrevMonth = () => {
        setMonth((prev) => (prev === 0 ? 11 : prev - 1));
        if (month === 0) setYear((prev) => prev - 1);
        console.log("Month:", month)
    };

    const handleNextMonth = () => {
        setMonth((prev) => (prev === 11 ? 0 : prev + 1));
        if (month === 11) setYear((prev) => prev + 1);
        console.log("Month:", month)
    };

    const handleDayClick = (day) => {
        console.log("In Calendar, Selected day", day, month, year)
        setSelectedDay(day+1);
        handleDateChange(new Date(year, month, day+1))
    };

    return (
        <div className="container-fluid calendar-container">

            <div className="row calendar-header bg-secondary p-3">
                <div className="col col-lg-1 col-md-2 col-sm-10 text-center">
                    <span className="text-light" onClick={handlePrevMonth}><i className="fa-solid fa-arrow-left"></i></span>
                </div>
                <div className="col-lg-10 col-md-8 col-sm-10">
                    <h2 className="text-light text-center">{monthNames[month]} - {year}</h2>
                </div>
                <div className="col col-lg-1 col-md-2 col-sm-10 text-center">
                    <span className="text-light" onClick={handleNextMonth}><i className="fa-solid fa-arrow-right"></i></span>
                </div>
            </div>

            <div className="row">

                <table className="calendar">
                    <thead>
                        <tr>
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                <th key={day} className='px-md-3 px-lg-4'>{day}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(6)].map((_, week) => (
                            <tr key={week} >
                                {[...Array(7)].map((_, day) => {
                                    const date = day + week * 7 - firstDay + 1;
                                    return (
                                        <td
                                            key={day}
                                            className={
                                                date > 0 && date <= daysInMonth
                                                    ? date === selectedDay && month === today.getMonth() && year === today.getFullYear()
                                                        ? "today selected text-succfess px-5"
                                                        : "valid px-md-4 px-lg-5"
                                                    : "empty "
                                            }
                                            onClick={() => date > 0 && date <= daysInMonth && handleDayClick(date)}
                                        >
                                            {date > 0 && date <= daysInMonth ? date : ""}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Calendar;
