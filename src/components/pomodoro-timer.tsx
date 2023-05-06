import React, { useEffect } from "react";
import { useInterval } from "../hooks/use-interval";
import { Button } from "./button";
import { Timer } from "./timer";

const bellStart = require('../sounds/bell-start.mp3');
const bellFinish = require('../sounds/bell-finish.mp3');

const audioStartWorking = new Audio(bellStart);
const audioStopWorking = new Audio(bellFinish);

interface Props {
   pomodoroTime: number;
   shortRestTime: number;
   longRestTime: number;
   cycles: number;
}

export function PomodoroTimer(props: Props): JSX.Element {
   const [ mainTime, setMainTime ] = React.useState(props.pomodoroTime);
   const [timeCounting, setTimeCounting] = React.useState(false);
   const [working, setWorking] = React.useState(false);
   const [resting, setResting] = React.useState(false);

   useEffect(() => {
      if(working) document.body.classList.add('working')
      if(resting) document.body.classList.remove('working')
   }, [working]);

   useInterval(() => {
      setMainTime(mainTime - 1)
   }, timeCounting ? 1000 : null);

   const configWork = () => {
      setTimeCounting(true);
      setWorking(true);
      setResting(false);
      setMainTime(props.pomodoroTime);
      audioStartWorking.play()      
   };

   const configRest = (long: boolean) => {
      setTimeCounting(true);
      setWorking(false);
      setResting(true);

      if (long) {
         setMainTime(props.longRestTime)
      } else {
         setMainTime(props.shortRestTime)
      }

      audioStopWorking.play();
   };

   return (
      <div className="pomodoro">
         <h2>You are → working</h2>
         <Timer mainTime={mainTime} />

         <div className="controls">
            <Button text="Work" onClick={() => configWork()}></Button>
            <Button text="Resting" onClick={() => configRest(false)}></Button>
            <Button 
               className={!working && !resting ? 'hidden' : ''}
               text={timeCounting ? 'Pause' : 'Play'} 
               onClick={() => setTimeCounting(!timeCounting)}
            ></Button>
         </div>

         <div className="details">
            <p>Testando: bbla bla bla</p>
            <p>Testando: bbla bla bla</p>
            <p>Testando: bbla bla bla</p>
            <p>Testando: bbla bla bla</p>
         </div>

      </div>
   );
}