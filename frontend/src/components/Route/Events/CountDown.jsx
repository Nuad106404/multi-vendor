import React, { useEffect, useState } from "react";
import "./FlipTimer.css";

// FlipUnit component for each time unit
const FlipUnit = ({ label, value }) => {
  const [previousValue, setPreviousValue] = useState(value);

  useEffect(() => {
    if (previousValue !== value) {
      setPreviousValue(value);
    }
  }, [value]);

  return (
    <div className="flip-unit">
      <div className="flip-card">
        <div className="flip-card-front">
          {String(previousValue).padStart(2, "0")}
        </div>
        <div className="flip-card-back">
          {String(value).padStart(2, "0")}
        </div>
      </div>
      <span className="unit-label">{label}</span>
    </div>
  );
};

const CountDown = ({ startDate, endDate }) => {
  // Validate and parse startDate and endDate
  const parsedStartDate = startDate ? new Date(startDate) : new Date();
  const parsedEndDate = endDate ? new Date(endDate) : new Date(Date.now() + 24 * 60 * 60 * 1000); // Default to 24 hours from now if endDate is missing


  const calculateTimeLeft = () => {
    const difference = +parsedEndDate - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }


    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [parsedEndDate]);

  return (
    <div className="countdown">
      <FlipUnit label="Days" value={timeLeft.days} />
      <FlipUnit label="Hours" value={timeLeft.hours} />
      <FlipUnit label="Minutes" value={timeLeft.minutes} />
      <FlipUnit label="Seconds" value={timeLeft.seconds} />
    </div>
  );
};

export default CountDown;
