import React, { useRef, useEffect, useState } from 'react';
import Calendar from './Calender';
import './teachers.css'
const CalendarWrapper = () => {
  const [visible, setVisible] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div>
      <button onClick={() => setVisible(!visible)}></button>
      {visible && <div ref={wrapperRef}><Calendar /></div>}
    </div>
  );
};

export default CalendarWrapper;
