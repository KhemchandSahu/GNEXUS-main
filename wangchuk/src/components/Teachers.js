import React, { useState, useEffect, useRef } from 'react';
import './teachers.css';
import Calendar from './Calender'; 
import Clock from './Clock';
import CalendarWrapper from './wrapper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons';
// import { database } from '../firebase';
// import { getDatabase } from 'firebase/database';
import axios from 'axios';
import { getDatabase, ref, set, onValue, get} from "firebase/database";
// import Timetable from '../../../backend/models/Timetable';
axios.defaults.baseURL = 'https://gcnexus.onrender.com/api';
const Teachers = () => {
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const [isAttendanceBarVisible, setIsAttendanceBarVisible] = useState(true);
    const [date, setDate] = useState(new Date());
    const [currMonth, setCurrMonth] = useState(date.getMonth());
    const [currYear, setCurrYear] = useState(date.getFullYear());
    const calendarRef = useRef(null);
    const months = ["January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"];
    const weeks = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const [timetableData, setTimetableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState('');
    const [timetable, setTimetable] = useState({});
    const [scheduleForDay, setScheduleForDay] = useState('');
    const [dayName, setDayName] = useState('');
    const headerRef = useRef(null);
    const [headerText, setHeaderText] = useState('');
    const [students, setStudents] = useState([]);
    const [totalPresent, setTotalPresent] = useState();
    const [totalAbsent, setTotalAbsent] = useState();
    const [totalAttendance, setTotalAttendance] = useState();
    const [attendance, setAttendance] = useState({});
    const [file, setFile] = useState(null);
    const [updatedate, setUpdateDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [documents, setDocuments] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState('');
    const [dates, setDates] = useState([]);
    const [name, setName] = useState('');
    const [selectedattDate, setselectedattDate] = useState('');


    const ScheduleComponent = () => {
        const [date, setDate] = useState(new Date());
        const [dayName, setDayName] = useState('');

        const handleDateChange = (event) => {
            const newDate = new Date(event.target.value);
            setDate(newDate);
        };
    }


    


    useEffect(() => {
        const getDayName = (dateObj) => {
            const options = { weekday: 'long' };
            return new Intl.DateTimeFormat('en-US', options).format(dateObj);
        };

        const headerElement = document.querySelector('.schedule-header-date');
        if (headerElement) {
            const headerDate = new Date(headerElement.getAttribute('date'));
            const dayName = getDayName(headerDate);

            setDayName(dayName);

            const fetchData = async () => {
                try{
                    const response = await axios.get(`https://gcnexus.onrender.com/api/timetable/${userName}/${dayName}`)
                    console.log(`API response:`, response.data);
                }catch(error){
                    console.error('Error fetching the data', error);
                }
            };

            fetchData();
        }
    }, [date]);
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 800) {
                if (calendarRef.current) {
                    calendarRef.current.style.display = 'none';
                }
            } else {
                if (calendarRef.current) {
                    calendarRef.current.style.display = 'block';
                }
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (calendarRef.current) {
            const renderCalendar = () => {
                const firstDayofMonth = new Date(currYear, currMonth, 1).getDay();
                const lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate();
                const lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay();
                const lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();
                let liTag = "";

                for (let i = firstDayofMonth; i > 0; i--) {
                    liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
                }

                for (let i = 1; i <= lastDateofMonth; i++) {
                    let isToday = i === date.getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear() ? "active" : "";
                    liTag += `<li class="${isToday}">${i}</li>`;
                }

                for (let i = lastDayofMonth; i < 6; i++) {
                    liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
                }

                if (calendarRef.current) {
                    calendarRef.current.querySelector('.days').innerHTML = liTag;
                    calendarRef.current.querySelector('.current-date').innerText = date.toDateString();
                }
            };

            renderCalendar();
        }
    }, [currMonth, currYear, date]);

    

    useEffect(() => {
        const fetchuserData = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            console.log("User name", user);
            if(user) {
                console.log(user.name)
                setUserName(user.name)
                console.log(userName)

                setName(userName);
                console.log("name is set into",setName);

                var s = 0;

                for(let i=0; i<name.length; i++){
                    if(name.charCodeAt(i)>64 && name.charCodeAt(i)<91 && s++){
                        name = name.slice(0, i)+" "+name.slice(i);
                        i++;
                    }
                }
            }else{
                console.log("No user found")
            };
            
        }
        fetchuserData();

    }, []); 
    useEffect(() =>{
        if(headerRef.current){
            setHeaderText(headerRef.current.innerText);
        }
    }, [])

    // const updateHeaderText = (newText) => {
    //     setHeaderText(newText);
    // }
    // const fetchData = async () =>{
    //     try{
    //         const response =  await axios.get('http://localhost:5000/timetable/SavitaSahu/Monday');
    //         return response.data;
    //     }catch(error){
    //         console.error('Error fetcxhing the data', error);
    //         return [];
    //     }
    // };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dayName = new Intl.DateTimeFormat('en-US', {weekday: 'long'}).format(date);
                const user = JSON.parse(localStorage.getItem('user'));
                const username = user.name
                const response = await axios.get(`https://gcnexus.onrender.com/api/timetable/${username}/${dayName}`);
                console.log('responce url is', response);
                console.log('Fetched data:', response.data);
    
                // Transform the object into an array of objects
                const transformedData = Object.entries(response.data).map(([time, activity]) => ({
                    time,
                    activity,
                }));
    
                console.log('Transformed data:', transformedData);
                setTimetableData(transformedData); // Update state with transformed data
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

       fetchData()
    }, [date,userName]); // Runs only once, when the component mounts
    


    useEffect(() => {
        console.log('Timetable data updated:', timetableData);
    }, [timetableData]);

    const handleDateChange = (newDate) => {
        setDate(newDate)
    };

    const handleUsernameChange = (event) => {
        setUserName(event.target.value);
    };

    // useEffect(() =>{
    //     fetch('http://localhost:5000/api/cs').then(response => response.json()).then(data => setStudents(data)).catch(error => console.error('Error fetching details:', error));
    // }, [])

    const handlePresentChange = (index, isChecked) => {
        const updatedStudents = [...students];
        updatedStudents[index].isPresent = isChecked;

        setStudents(updatedStudents);

        const total = updatedStudents.filter(student => student.isPresent === true).length;  
        setTotalPresent(total);

        const totalAbsent = updatedStudents.length - total;  
        setTotalAbsent(totalAbsent);
    }

    const selectAll = () =>{
        const updatedStudents = students.map(students => ({
            ...students,
            isPresent: true
        }));

        setStudents(updatedStudents);
        setTotalPresent(updatedStudents.length);
        setTotalAbsent(0);
    }

    
    

    const prevButton = () => {
        const prevMonth = currMonth - 1;
        if (prevMonth < 0) {
            setCurrMonth(11);
            setCurrYear(currYear - 1);
        } else {
            setCurrMonth(prevMonth);
        }
        setDate(new Date(currYear, currMonth, date.getDate()));
    };

    const nextButton = () => {
        const nextMonth = currMonth + 1;
        if (nextMonth > 11) {
            setCurrMonth(0);
            setCurrYear(currYear + 1);
        } else {
            setCurrMonth(nextMonth);
        }
        setDate(new Date(currYear, currMonth, date.getDate()));
    };
    // const validTable = (DOW)=>{
        
    //     if(DOW==6){

    //          = 
    //     }
    // }
    const previousButton = () => {
        var today = document.querySelector(".active");
        if(today.innerHTML<date.getDate()){
            today.classList.remove("active");
            today = today.nextEleemtsSibling;
            today.className = "active";

            var updateDate = today.innerHTML;
            var updateMonth = currMonth + 1;
            var updateYear = currYear;
            document.querySelector(".schedule-header-date").innerHTML = ('0' + updateDate).slice(-2) + "-" + ('0'+ updateMonth).slice(-2) + "-" + updateYear;
            
            var thatDayofWeek = new Date(currYear, currMonth, updateDate).getDate();
            document.querySelector(".day").innerHTML = weeks[thatDayofWeek]

            // validTable(thatDayofWeek)
        }
    }
    const toggleSidebar = () => {
        setIsSidebarVisible(prevState => !prevState);
        console.log("Sidebar visibility toggled:", !isSidebarVisible);
    };

    const toggleAttendanceBar = () => setIsAttendanceBarVisible(!isAttendanceBarVisible);


    const fetchStudents = async (deptname) => {
        setLoading(true);
        try {
            const response = await fetch(`https://gcnexus.onrender.com/api/${deptname}`);
            const data = await response.json();
            setStudents(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching students:', err);
            setError('Failed to fetch students');
            setLoading(false);
        }
    }

    const afterSelect = (activity) => {
        const attendanceBar = document.getElementById("attendance-bar");
        console.log("I am working");

        if (attendanceBar) {
            attendanceBar.style.display = "block";
            attendanceBar.style.top = "0px";
            console.log("If loop is working");

            // Fetch students based on the activity
            if (activity && activity.includes('CSE')) {
                console.log("Fetching cs students list")
                fetchStudents('cs');
            } else if (activity && activity.includes('IT')) {
                console.log("Fetching the data")
                fetchStudents('it');
            } else if(activity && activity.includes('CSIT')) {
                console.log("Fetching the list of CS&IT");
                fetchStudents('both');
            }
        } else {
            console.log("Attendance bar is not defined");
        }
    };

    const afterformSelect = () =>{
        const attendanceBar = document.getElementById("attendance-bar");
        console.log("I am working");

        if (attendanceBar) {
            attendanceBar.style.display = "block";
            attendanceBar.style.top = "0px";
            console.log("If loop is working");

            // Fetch students based on the activity
            const year = document.getElementById("yearentry").value;
            const branch = document.getElementById("branchentry").value;

            // Fetch students based on the selected branch
            console.log(`Fetching students for ${branch} in semester ${year}`);
            fetchStudents(branch);
        } else {
            console.log("Attendance bar is not defined");
        }
    }

    const afterUpdate = async () => {

        try{
            console.log("Inside the ty of fetching the dates");
            const url = `https://gcnexus.onrender.com/api/attendance/dates/${userName}`;
            console.log(url);
            const response = await axios.get(`https://gcnexus.onrender.com/api/attendance/dates/${userName}`)
            console.log(response.data);
            setUpdateDates(response.data)
        }catch(error){
            console.error('Error fetching the data', error);
        }
        const updateSheet = document.getElementById("update-sheet");

        if (updateSheet) {
            updateSheet.style.display = "block";
            updateSheet.style.height = "auto";
            updateSheet.style.width ="100%"
        }
    };

    
    const afterConfirm = async () => {
        const todaySheet = document.getElementById("today-sheet");
        const otherSheet = document.getElementById("other-sheet");
        

        if (todaySheet) {
            todaySheet.style.display = "block";
            todaySheet.style.height = "auto";
            todaySheet.style.width ="100%"
        }

        if (otherSheet) {
            otherSheet.style.display = "none";
            otherSheet.style.height = "auto";
            otherSheet.style.width = "100%"
        }

        console.log('Presence confirmed:', students);

        try{
            await axios.post(`https://gcnexus.onrender.com/api/attendance/submit/${userName}`, {
                date: setselectedattDate,
                attendance: students.map(student => ({
                  name: student.name,
                  isPresent: student.isPresent
                }))
            })
            alert('Data confirmed and processed!')
        }catch(error){
            console.error('Error coinfrming the data', error);
        }
        
    };

    // const fetchDates = async () => {
        
    // };

    const fetchDocuments = async (date) => {
        try{
            const response = await axios.get(`https://gcnexus.onrender.com/api/attendance/documents/${userName}/${date}`);
            console.log(response)
            console.log(response.data)
            setDocuments(response.data)
        }catch(error){
            console.error('Error fetching the documents', error);
        }
    }

    // Handle attendance update 
    const handleUpdate = async ()=>{
        try{
            await axios.put(`https://gcnexus.onrender.com/api/attendance/update/${userName}/${selectedDocument}`, {
                students: students.map(student => ({
                    name :student.name,
                    isPresent: student.isPresent
                }))
            });
            alert('Attendance updated!!');
        }catch(error){
            console.error('Error updating the attendance', error);
        }
    };

    // useEffect(() => {
    //     if(userName){
    //         fetchDates();
    //     }else{
    //         console.log("Fetch Dates didn't get username")
    //     }
    // }, []);

    const handleDownload = async () => {
        try{
            const response = await axios.get(`https://gcnexus.onrender.com/api/attendance/download/${userName}`, {
                response:'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'attendencesheet.csv');
            document.body.appendChild(link);
            link.click();
        }catch(error){
            console.error('Error downloading the file', error);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    }

    const handleUpload = async => {
        if (!file){
            alert('Please select a file first');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try{
            axios.post(`https://gcnexus.onrender.com/api/attendance/upload/${userName}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('File uploaded succesfully');
        }catch(error) {
            console.error('Error uploading', error)
        }
    }
    const beforeSelect = () => {
        const attendanceBar = document.getElementById("attendance-bar");
        if (attendanceBar) {
            attendanceBar.style.display = "none";
            attendanceBar.style.top = "100px";
        }
    };

    return (
        <div className='bodymain'>
            <div className="header">
                <div className="clock-section">
                    <Clock />
                    <div className="current-activities">
                        <h2>Current Activity</h2>
                    </div>
                </div>
                <div id="id" onClick={toggleSidebar}>
                    <div className="idlogo">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                        </svg>
                    </div>
                    <div className="idname">
                        <h3 className="name" value={userName} onChange={handleUsernameChange}>{userName}</h3>
                        <p className="para">EmpID{userId}</p>
                    </div>
                </div>
            </div>

            <div className="all">
                <div id="wrapper" onClick={toggleAttendanceBar}>
                    <CalendarWrapper />
                    <Calendar />
                </div>

                <div className="table-schedule-teachers">
                    <div className="main-table">
                        <header className="schedule-header-date" date={date} value={date.toISOString().substring(0, 10)} onChange={handleDateChange}>{`${('0' + date.getDate()).slice(-2)}-${('0' + (date.getMonth() + 1)).slice(-2)}-${date.getFullYear()}`}</header>
                        <div className="table">
                            {loading ? (
                                <p>Loading....</p>
                            ):error ? (
                                <p>No schedule for today</p>
                            ):(
                                <table className='main-schedule-table'>
                                    <thead>
                                        <tr>
                                            <th className='time'>Time-Slot</th>
                                            <th className='day'>{new Date(date).toLocaleDateString('en-US', { weekday: 'long' })}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {timetableData && timetableData.length > 0 ? (
                                            timetableData.map((slot, index) => (
                                                <tr key={index}>
                                                    <td className='time'>{slot.time}</td>
                                                    {/* Conditionally check if activity is 3rd sem CS, IT, or both */}
                                                    {slot.activity && (slot.activity.includes('3rd sem CSE') || slot.activity.includes('3rd sem IT')) || slot.activity.includes('3rd sem CSIT') ? (
                                                        <td onClick={() => afterSelect(slot.activity)} style={{ cursor: 'pointer' }}>
                                                        {slot.activity}
                                                        </td>
                                                    ):(
                                                        <td>{slot.activity || 'No activity specified'}</td>
                                                    )}                                                    
                                                </tr>
                                            ))
                                        ):(
                                            <tr>
                                                <td colSpan="2"> No schedule for day</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                            
                        </div>
                    </div>
                </div>
            </div>

            <div className="form-teach-attendance">
                <div className="main-form">
                    <div className="manual">
                        <h2 className="manual-heading">Select manually</h2>
                    </div>
                    <div className="fm">
                        <div className="extra">
                            <label htmlFor="year" className='semesterlabel'>Semester</label>
                            <select name="year" id="yearentry">
                                {/* <option value="1">1</option>
                                <option value="2">2</option> */}
                                <option value="3">3</option>
                                {/* <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option> */}
                            </select>

                            <label htmlFor="branch" className='semesterlabel'>Branch</label>
                            <select className="branch" id="branchentry">
                                <option value="it">IT</option>
                                <option value="cs">CSE</option>
                                <option value="both">CSE&IT</option>
                                {/* <option value="Mech">Mechanical</option>
                                <option value="Mining">Mining</option>
                                <option value="Metallurgy">Electrical</option>
                                <option value="ET&T">ET&t</option>
                                <option value="Civil">Civil</option> */}
                            </select>
                                    
                            <button id="submit" onClick={afterformSelect}>Select</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="buttons">
                <div className="prevbut" onClick={previousButton}>
                    <FontAwesomeIcon icon={faChevronLeft} size="2x" />
                </div>
                <div className="downloadbut" onClick={handleDownload}><h1>Download</h1></div>
                <div className="nextbut" onClick={nextButton}>
                    <FontAwesomeIcon icon={faChevronRight} size="2x" />
                </div>
            </div>

            {isSidebarVisible && (
                <div id="sidebar" style={{ position: 'fixed', top: 0, right:'-500 px', height: '100vh', backgroundColor: '#f0f0f0', zIndex: 1000,margin:0, right: isSidebarVisible ? '0' : '-500px', transition: 'right 0.5s ease', fontfamily:"serif", display:'flex', flexDirection:'column', boxShadow:'-8px -2px 4px rgba(0,0,0,0.12)', overflow: 'auto'}}>
                    <div className="header2" style={{position:'relative'}}>
                        
                        <div className="heading">
                            <button className='faltu' onClick={toggleSidebar}>
                                <FontAwesomeIcon className="back" icon={faTimes} />
                            </button>
                            <h1>Teacher's Profile</h1>
                        </div>
                    </div>
                    <div className="mainteach">
                        <div className="profile-icon">
                            <div className="pi">
                                <div className="icon">
                                    {<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                    <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                                    </svg>}
                                </div>
                            </div>
                        </div>
                        <div className="info">
                            <div className="name">
                                <h2 className="nametext">{userName}</h2>
                            </div>
                            <div className="others">
                                {/* <h2 className="id">ID: {userId}</h2>
                                <h2 className="fo">Faculty of CSE department</h2>
                                <h3 className="other">Some other information</h3> */}
                            </div>
                        </div>
                    </div>
                    <div className="footer">
                        <div className="security">
                            <div className="security-h">
                                <h2 className="s-heading">Security Options</h2>
                            </div>
                            <div className="passwords">
                                <div className="forgot password">
                                    <p className="fp">Forgot Password</p>
                                </div>
                                <div className="change password">
                                    <p className="cp">Change Password</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isAttendanceBarVisible && (
                <div id="attendance-bar" style={{ position: 'fixed', top: '100px', backgroundColor: '#f0f0f0', zIndex: 1000, overflowY:"auto", maxHeight:'100vh' }}>
                    <div className="header2">
                        <div className="heading">
                            <h1>Attendance </h1>
                        </div>
                        <div className="back2" onClick={beforeSelect}>
                            <h1>x</h1>
                        </div>
                    </div>
                    <div className="requests">
                        <div className="request-header">
                            <h2>Select the date of which attendance is to be recorded.</h2>
                            <input type='date' value={setselectedattDate} onChange={(e) => setselectedattDate(e.target.value)} />
                            <h2>Select their name to mark their presence</h2>
                        </div>
                        <div className="request-list">
                            <div className="table-div">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th id="h-roll">S.no.</th>
                                            <th id="h-stu-name">Name</th>
                                            <th id="h-Present">Present</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map((student, index) => (
                                            <tr key={student._id}>
                                                <td className='roll'>{index +1}</td>
                                                <td className='stu-name'>{student.name}</td>
                                                <td className='request'>
                                                    <div>
                                                        <div className="inputatt-div">
                                                            <input type='checkbox' className='inputatt' name='attendance' checked={student.isPresent || false} onChange={(e) => handlePresentChange(index, e.target.checked)} />

                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>

                                </table>
                            </div>
                        </div>
                        <div className="request-total">
                            <div className="total-accept">
                                <div className = "present-absent">
                                    <p>Total present: {totalPresent}</p>
                                    <p>Total absent: {totalAbsent}</p>
                                </div>
                                <button onClick={selectAll}>Select All</button>
                            </div>

                            
                            <div className="confirm-update">
                                <div className="updatebut">
                                    <div className="confirm">
                                        <button onClick={afterConfirm}>Confirm</button>
                                    </div>
                                    <h5>or</h5>
                                    <div className="update">
                                        <button onClick={afterUpdate}>Update</button>
                                    </div>
                                </div>
                                
                            </div>
                            
                            
                        </div>
                    </div>
                    
                    <div id="update-sheet">
                        <div className="update-header">
                            <h2>Update Attendance</h2>
                        </div>
                        <div className="u-sheets">
                            {/* <button className="fecthdatesbut" onClick={fetchDates}>Fetch Dates</button> */}
                            <select className="u-select" onChange={(e) => {
                                const selectedDate = e.target.value;
                                setSelectedDate(selectedDate);
                                fetchDocuments(selectedDate);
                            }}>
                                <option value="">Select Date</option>
                                {updatedate.map((date, index) => (
                                    <option key={index} value={date}>{date}</option>
                                ))}
                            </select>

                            <select className="u-select" onChange={(e) => setSelectedDocument(e.target.value)}>
                                <option value="">Selected Document</option>
                                {documents.map((doc, index) => (
                                    <option key={index} value={doc._id}>{doc.date}-{doc.name}</option>
                                ))}
                            </select>

                            <button id="updatebut" onClick={handleUpdate}>Update</button>
                        </div>
                    </div>
                    <div id="today-sheet">
                        <div className="today-header">
                            <h2>Today's Attendance is recorded</h2>
                        </div>
                        <div className="t-sheets">
                            {/* <button className="edit-sheet">Edit sheet</button> */}
                            <button className="download-sheet" onClick={handleDownload}>Download</button>
                            <h5>or if you want to update the attendance by uploading excel document, then</h5>
                            <div className="upload-div">
                                <input type="file" onChange={handleFileChange} />
                                <button onClick={handleUpload}>Upload</button>
                            </div>
                        </div>
                    </div>
                    <div id="other-sheet">
                        <div className="other-header">
                            <h2>Other Sheets</h2>
                        </div>
                        <div className="o-sheets">
                            <ul className="all-sheets">
                                <li>Your Subject Sheet<button className="download-subject-sheet">Download</button></li>
                                <li>Main sheet<button className="download-main-sheet">Download</button></li>
                            </ul>
                        </div>
                    </div>

                    
                </div>
            )}
            <footer className="footer-dashboard">
                <div className="footerdiv">
                    <p className="footerpara">&copy; belongs to Gauranga.</p>
                </div>
            </footer>
        </div>
    );
};

export default Teachers;