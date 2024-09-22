import React from 'react';
import './student.css';
const RecentActivities = () => {
  return (
    <section className="recsec">
      <div className="recdiv">
        <h1 className="rechead">Recent Activities</h1>
        <div className="mainrec">
          <div className="sheet1 common-sheet">
            <div className="left">
              <div className="left-content-para">
                <h1 className="lefth1">Attendance sheet 2023-24</h1>
              </div>
            </div>
            <div className="right">
              <div className="right-content-para">
                <div className="button">
                  <button className="download"><a href="index.html">Downloads</a></button>
                </div>
              </div>
            </div>
          </div>
          <div className="sheet2 common-sheet">
            <div className="left">
              <div className="left-content-para">
                <h1 className="lefth1">Semester Exam Sheet 2023-24</h1>
              </div>
            </div>
            <div className="right">
              <div className="right-content-para">
                <div className="button">
                  <button className="download"><a href="index.html">Downloads</a></button>
                </div>
              </div>
            </div>
          </div>
          <div className="sheet3 common-sheet">
            <div className="left">
              <div className="left-content-para">
                <h1 className="lefth1">Internal Assessment Sheet 2023-24</h1>
              </div>
            </div>
            <div className="right">
              <div className="right-content-para">
                <div className="button">
                  <button className="download"><a href="index.html">Downloads</a></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecentActivities;
