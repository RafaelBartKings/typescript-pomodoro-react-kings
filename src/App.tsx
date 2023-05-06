import React from 'react';
import { PomodoroTimer } from './components/pomodoro-timer';

function App(): JSX.Element {
  return (
    <div className="container">
      <PomodoroTimer 
         pomodoroTime={1500} // 25min 
         shortRestTime={300} // 5 min for each pomodoro shortRestTime
         longRestTime={900} // 15 min
         cycles={4} // For each end of cycle one longRestTime
      />
    </div>
  );
}

export default App;
