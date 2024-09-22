import React, { useEffect, useRef } from 'react';
import './student.css';

const Chart = ({ totalClasses, attendedClasses }) => {
  const pieChartRef = useRef(null);
  const barContainerRef = useRef(null);

  useEffect(() => {
    const ctx = pieChartRef.current.getContext('2d');
    const totalClassesFloat = parseFloat(totalClasses);
    const attendedClassesFloat = parseFloat(attendedClasses);
    const missedClasses = totalClassesFloat - attendedClassesFloat;

    const drawPieChart = () => {
      const data = [attendedClassesFloat, missedClasses];
      const colors = ['#FF0000', '#FFFFFF'];

      let total = data.reduce((acc, val) => acc + val, 0);
      let startAngle = 0;

      data.forEach((value, index) => {
        let sliceAngle = (value / total) * 2 * Math.PI;
        ctx.beginPath();
        ctx.moveTo(200, 200);
        ctx.arc(200, 200, 200, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = colors[index];
        ctx.fill();
        startAngle += sliceAngle;
      });
    };

    drawPieChart();
  }, [totalClasses, attendedClasses]);

  useEffect(() => {
    const bars = barContainerRef.current.querySelectorAll('.bar');
    bars.forEach(bar => {
      const height = bar.getAttribute('data-height');
      bar.style.height = `${height}%`;
      bar.innerText = `${height}%`;
    });
  }, []);

  return (
    <div>
      <div className="container">
        <canvas id="piechart" width="400" height="400" ref={pieChartRef}></canvas>
      </div>
      <div className="barcontainer" ref={barContainerRef}>
        <div className="bar" id="bar1" data-height="30"></div>
        <div className="bar" id="bar2" data-height="60"></div>
        <div className="bar" id="bar3" data-height="90"></div>
        <div className="bar" id="bar4" data-height="30"></div>
        <div className="bar" id="bar5" data-height="60"></div>
      </div>
    </div>
  );
};

export default Chart;
