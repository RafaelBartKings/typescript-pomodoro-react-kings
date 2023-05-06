import { useEffect, useState, useCallback } from "react";
import { useInterval } from "../hooks/use-interval";
import { Button } from "./button";
import { Timer } from "./timer";
import { secondsToTime } from "../utils/seconds-to-time";

const bellStart = require("../sounds/bell-start.mp3");
const bellFinish = require("../sounds/bell-finish.mp3");

const audioStartWorking = new Audio(bellStart);
const audioStopWorking = new Audio(bellFinish);

interface Props {
   pomodoroTime: number;
   shortRestTime: number;
   longRestTime: number;
   cycles: number;
}

export function PomodoroTimer(props: Props): JSX.Element {
   const [mainTime, setMainTime] = useState(props.pomodoroTime);
   const [timeCounting, setTimeCounting] = useState(false);
   const [working, setWorking] = useState(false);
   const [resting, setResting] = useState(false);
   const [cyclesQtdManager, setCyclesQtdManager] = useState(
      new Array(props.cycles - 1).fill(true)
   );

   const [completedCycles, setCompletedCycles] = useState(0);
   const [fullWorkingTime, setFullWorkingTime] = useState(0);
   const [numberOfPomodoros, setNumberOfPomodoros] = useState(0);

   useInterval(
      () => {
         setMainTime(mainTime - 1);
         if (working) setFullWorkingTime(fullWorkingTime + 1);
      },
      timeCounting ? 1000 : null
   );

   const configWork = useCallback(() => {
      setTimeCounting(true);
      setWorking(true);
      setResting(false);
      setMainTime(props.pomodoroTime);
      audioStartWorking.play();
   }, [
      setTimeCounting,
      setWorking,
      setResting,
      setMainTime,
      props.pomodoroTime,
   ]);

   const configRest = useCallback(
      (long: boolean) => {
         setTimeCounting(true);
         setWorking(false);
         setResting(true);

         if (long) {
            setMainTime(props.longRestTime);
         } else {
            setMainTime(props.shortRestTime);
         }

         audioStopWorking.play();
      },
      [
         setTimeCounting,
         setWorking,
         setResting,
         props.longRestTime,
         props.shortRestTime,
      ]
   );

   useEffect(() => {
      if (working) document.body.classList.add("working");
      if (resting) document.body.classList.remove("working");

      if (mainTime > 0) return;

      if (working && cyclesQtdManager.length > 0) {
         configRest(false);
         cyclesQtdManager.pop();
      } else if (working && cyclesQtdManager.length <= 0) {
         configRest(true);
         setCyclesQtdManager(new Array(props.cycles - 1).fill(true));
         setCompletedCycles(completedCycles + 1);
      }

      if (working) setNumberOfPomodoros(numberOfPomodoros + 1);
      if (resting) configWork();
   }, [
      working,
      resting,
      mainTime,
      configRest,
      setCyclesQtdManager,
      cyclesQtdManager,
      numberOfPomodoros,
      configWork,
      props.cycles,
      completedCycles,
   ]);

   return (
      <div className="pomodoro">
         <h2>You are → {working ? "WORKING" : "RESTING"}</h2>
         <Timer mainTime={mainTime} />

         <div className="controls">
            <Button text="Work" onClick={() => configWork()}></Button>
            <Button text="Resting" onClick={() => configRest(false)}></Button>
            <Button
               className={!working && !resting ? "hidden" : ""}
               text={timeCounting ? "Pause" : "Play"}
               onClick={() => setTimeCounting(!timeCounting)}
            ></Button>
         </div>

         <div className="details">
            <p>Ciclos concluídos: {completedCycles}</p>
            <p>Horas trabalhadas: {secondsToTime(fullWorkingTime)}</p>
            <p>Pomodoros concluídos: {numberOfPomodoros}</p>
         </div>
      </div>
   );
}
