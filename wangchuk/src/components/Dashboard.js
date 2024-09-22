import React, { useEffect, useState } from 'react';
import Clock from './Clock';
import Chart from './Chart';
import RecentActivities from './RecentActivities';
import './student.css';

const Dashboard = () => {
  const [totalClasses, setTotalClasses] = useState(100);
  const [attendedClasses, setAttendedClasses] = useState(50);

  useEffect(() => {
    // Set the clock and charts when the component mounts
    const intervalId = setInterval(() => {
      // This will be managed by the Clock component
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <div className="header">
        <div className="clock-section">
          <Clock />
          <div className="current-activities">
            <h2>Current Activities</h2>
          </div>
        </div>
        <div id="id">
          <div className="idlogo">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
              <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
            </svg>
          </div>
          <div className="idname">
            <h3 className="name">Divyanshu Anand</h3>
            <p className="para">IT22033414</p>
          </div>
        </div>
      </div>

      <div className="total-section">
        <div className="total">
          <div className="text">
            <h2>Total No of classes</h2>
          </div>
          <div className="totalnumber">
            <h2 id="totalclass">{totalClasses}</h2>
          </div>
        </div>
        <div className="total-attended">
          <div className="text">
            <h2>Classes Attended</h2>
          </div>
          <div className="totalnumber">
            <h2 id="attended">{attendedClasses}</h2>
          </div>
        </div>
      </div>

      <div className="chartss">
        <Chart totalClasses={totalClasses} attendedClasses={attendedClasses} />
      </div>

      <RecentActivities />

      <footer className="footer-dashboard">
        <div className="footerdiv">
          <p className="footerpara">&copy; belongs to Gauranga.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
