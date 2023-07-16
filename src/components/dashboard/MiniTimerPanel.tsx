import React, { useEffect, useState } from 'react';
import { FullWorkRestCycle, TimerSettings, WorkRestCycle, fetchTimerSettings, fetchTimerTemplateFromId, getCycleFromTemplate, isValidPattern } from '../../utils/timerUtils';
import TimerView from '../timer/TimerView';
import SelectTemplateDialog from '../timer/dialogs/SelectTemplateDialog';

export default function MiniTimerPanel() {

  const POMODORO = { timer_template_id: 1, title: "Pomodoro", description: "A timer using the Pomodoro technique for 4 cycles.", user_id: "", work: 1500000, rest: 300000, cycles: 4 };
  const [ timerSettings, setTimerSettings ] = useState<TimerSettings>({ user_id: "", use_milliseconds: false, low_time_warning: true, timer_template_id: 0});
  const [ pattern, setPattern ] = useState<FullWorkRestCycle>(POMODORO);
  const [ timerTemplateSelectOpen, setTimerTemplateSelectOpen ] = useState(false);

  useEffect(() => {
    fetchTimerSettings(setTimerSettings);
    fetchTimerTemplateFromId(timerSettings.timer_template_id, setPattern);
  }, [timerSettings]);

  return (
    <>
      <TimerView showConfigButton={false} pattern={ isValidPattern(pattern) ? getCycleFromTemplate(pattern) : getCycleFromTemplate(POMODORO) } showMs={ false } onChange={() => fetchTimerSettings(setTimerSettings)} />
      <SelectTemplateDialog open={timerTemplateSelectOpen} handleClose={() => { setTimerTemplateSelectOpen(false) }} onChange={ () => fetchTimerSettings(setTimerSettings) } />
    </>            

  )
}