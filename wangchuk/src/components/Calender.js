import React, { useState, useEffect, useRef } from 'react';
import './teachers.css'; // Include your CSS here
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const Calendar = ({ onDateClick }) => {
  const [date, setDate] = useState(new Date());
  const [currYear, setCurrYear] = useState(date.getFullYear());
  const [currMonth, setCurrMonth] = useState(date.getMonth());
  const calendarRef = useRef(null);

  const months = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];
  const weeks = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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
    const renderCalendar = () => {
      const firstDayofMonth = new Date(currYear, currMonth, 1).getDay();
      const lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate();
      const lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay();
      const lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();
      const today = new Date();
      const currentDay = today.getDate();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      let liTag = "";

      // Dates from the previous month
      for (let i = firstDayofMonth; i > 0; i--) {
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
      }

      // Dates of the current month
      for (let i = 1; i <= lastDateofMonth; i++) {
        let isToday = i === date.getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear() ? "active" : "";
        let isClickable = !(currYear === currentYear && currMonth === currentMonth && i > currentDay) ? "" : "disabled";
        liTag += `<li class="${isToday} ${isClickable}" data-date="${i}" data-month="${currMonth}" data-year="${currYear}">${i}</li>`;
      }

      // Dates from the next month
      for (let i = lastDayofMonth; i < 6; i++) {
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
      }

      if (calendarRef.current) {
        calendarRef.current.querySelector('.days').innerHTML = liTag;
        calendarRef.current.querySelector('.current-date').innerText = `${months[currMonth]} ${currYear}`;
      }
    };

    renderCalendar();
  }, [currMonth, currYear, date]);

  const changeMonth = (direction) => {
    setCurrMonth(prevMonth => {
      const newMonth = prevMonth + direction;
      if (newMonth < 0 || newMonth > 11) {
        setDate(prevDate => new Date(currYear, newMonth, prevDate.getDate()));
        setCurrYear(prevYear => prevYear + (newMonth < 0 ? -1 : 1));
        return newMonth < 0 ? 11 : 0;
      }
      return newMonth;
    });
  };

  const handleDateClick = (e) => {
    const day = e.target.getAttribute('data-date');
    const month = parseInt(e.target.getAttribute('data-month'));
    const year = parseInt(e.target.getAttribute('data-year'));

    if (day && !(year > new Date().getFullYear() || (year === new Date().getFullYear() && month > new Date().getMonth()) || (year === new Date().getFullYear() && month === new Date().getMonth() && parseInt(day) > new Date().getDate()))) {
      const selectedDate = new Date(year, month, day);
      setDate(selectedDate);
      const updatedDate = (`0${day}`).slice(-2);
      const updatedMonth = (`0${month + 1}`).slice(-2);
      const updatedYear = year;
      const scheduleHeaderDate = document.querySelector(".schedule-header-date");
      if (scheduleHeaderDate) {
        scheduleHeaderDate.innerHTML = `${updatedDate}-${updatedMonth}-${updatedYear}`;
      }

      const thatDayofWeek = selectedDate.getDay();
      const dayElement = document.querySelector(".day");
      if (dayElement) {
        dayElement.innerHTML = weeks[thatDayofWeek];
      }

      validTable(thatDayofWeek);

      // Update the calendar to reflect the active state
      const days = calendarRef.current?.querySelectorAll('.days li');
      if (days) {
        days.forEach(d => d.classList.remove('active'));
        e.target.classList.add('active');
      }

      if (onDateClick) {
        onDateClick(selectedDate);
      }
    }
  };

  const validTable = (DOW) => {
    const sat = document.querySelector("tbody .sat");
    const notsat = document.querySelector("tbody .notsat");
    if (DOW === 6) {
      if (sat) sat.style.display = "table-row";
      if (notsat) notsat.style.display = "none";
    } else {
      if (sat) sat.style.display = "none";
      if (notsat) notsat.style.display = "table-row";
    }
  };

  useEffect(() => {
    const days = calendarRef.current?.querySelectorAll('.days li');
    if (days) {
      days.forEach(day => {
        day.addEventListener('click', handleDateClick);
      });
    }

    return () => {
      if (days) {
        days.forEach(day => {
          day.removeEventListener('click', handleDateClick);
        });
      }
    };
  }, [currMonth, currYear, date]);

  return (
    <div ref={calendarRef} className="calendar">
      <div className="current-date"></div>
      <div className="icons">
        <span id="prev" onClick={() => changeMonth(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </span>
        <span id="next" onClick={() => changeMonth(1)}>
          <FontAwesomeIcon icon={faArrowRight} />
        </span>
      </div>
      <ul className="days"></ul>
    </div>
  );
};

export default Calendar;
