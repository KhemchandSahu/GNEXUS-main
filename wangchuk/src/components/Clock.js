import React, { useEffect, useRef } from 'react';
import './student.css';

const Clock = () => {
  const hourHand = useRef(null);
  const minuteHand = useRef(null);
  const secondHand = useRef(null);

  useEffect(() => {
    const setDate = () => {
      const now = new Date();
      const seconds = now.getSeconds();
      const hour = now.getHours();
      const minutes = now.getMinutes();

      const secondsDegrees = ((seconds / 60) * 360) + 90;
      const hoursDegrees = (((hour / 12) + (minutes / 720)) * 360) + 90;
      const minutesDegrees = ((minutes / 60) * 360) + 90;

      if (hourHand.current) hourHand.current.style.transform = `rotate(${hoursDegrees}deg)`;
      if (minuteHand.current) minuteHand.current.style.transform = `rotate(${minutesDegrees}deg)`;
      if (secondHand.current) secondHand.current.style.transform = `rotate(${secondsDegrees}deg)`;
    };

    const intervalId = setInterval(setDate, 1000);
    setDate(); // Set the initial date

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="clockbox">
      <div className="clock">
        <div className="faceclock">
          <div className="number number1">1</div>
          <div className="number number2">2</div>
          <div className="number number3">3</div>
          <div className="number number4">4</div>
          <div className="number number5">5</div>
          <div className="number number6">6</div>
          <div className="number number7">7</div>
          <div className="number number8">8</div>
          <div className="number number9">9</div>
          <div className="number number10">10</div>
          <div className="number number11">11</div>
          <div className="number number12">12</div>
          <div className="hand bighand" ref={hourHand}></div>
          <div className="hand smallhand" ref={minuteHand}></div>
          <div className="hand movinghand" ref={secondHand}></div>
        </div>
      </div>
    </div>
  );
};

export default Clock;
