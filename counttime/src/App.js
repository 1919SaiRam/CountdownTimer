import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [targetDate, setTargetDate] = useState('');
  const [remainingTime, setRemainingTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerOver, setTimerOver] = useState(false);
  const [timeExceeds100Days, setTimeExceeds100Days] = useState(false);

  const handleToggleTimer = () => {
    if (timerActive) {
      setRemainingTime(0);
      setTimerActive(false);
    } else {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      setRemainingTime(target - now);
      setTimerActive(true);
    }
  };

  useEffect(() => {
    let timer;
    if (timerActive && remainingTime > 0) {
      timer = setTimeout(() => {
        setRemainingTime(remainingTime - 1000);
      }, 1000);
    } else if (remainingTime <= 0 && timerActive) {
      setTimerActive(false);
      setTimerOver(true);
    }
    return () => clearTimeout(timer);
  }, [timerActive, remainingTime]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === 'targetDate') {
      // Apply maximum cutoff date
      const maxCutoffDate = new Date();
      maxCutoffDate.setDate(maxCutoffDate.getDate() + 99);
      const maxDate = maxCutoffDate.toISOString().slice(0, 16);
      if (value > maxDate) {
        newValue = maxDate;
        setTimeExceeds100Days(true);
      } else {
        setTimeExceeds100Days(false);
      }
    } else {
      // Apply maximum values for hours, minutes, and seconds
      const maxValue = name === 'hours' ? 23 : name === 'minutes' || name === 'seconds' ? 59 : null;
      if (parseInt(value, 10) > maxValue) {
        newValue = String(maxValue).padStart(2, '0');
      }
    }
    setTargetDate(newValue);
  };

  const formatTime = (time) => {
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
  };

  return (
    <div className="container">
      <h1 className="title">Countdown Timer</h1>
      <div className="input-container">
        <input type="datetime-local" id="targetDate" className="input" value={targetDate} onChange={handleInputChange} name="targetDate" max="9999-12-31T23:59" />
        <button onClick={handleToggleTimer} className={`button ${timerActive ? "active" : ""}`}>{timerActive ? "Stop Timer" : "Start Timer"}</button>
      </div>
      <div className="timer-container">
        {timeExceeds100Days ? (
          <div style={{ color: 'red', fontSize: '1rem' }}>
            Selected time is more than 100 days
          </div>
        ) : (
          <>
            {timerOver && (
              <div style={{ color: 'pink', fontSize: '1rem' }}>
                The Countdown is over! What's next on your adventure? 🎉
              </div>
            )}
            {!timerOver && (
              <>
                <div className="timer">
                  <div className="timer-number">{formatTime(remainingTime).days}</div>
                  <div className="timer-text">days</div>
                </div>
                <div className="timer">
                  <div className="timer-number">{formatTime(remainingTime).hours}</div>
                  <div className="timer-text">hours</div>
                </div>
                <div className="timer">
                  <div className="timer-number">{formatTime(remainingTime).minutes}</div>
                  <div className="timer-text">minutes</div>
                </div>
                <div className="timer">
                  <div className="timer-number">{formatTime(remainingTime).seconds}</div>
                  <div className="timer-text">seconds</div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
