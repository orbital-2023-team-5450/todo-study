import React, { useEffect, useState } from 'react';
import { FullWorkRestCycle, TimerSettings, WorkRestCycle, fetchTimerSettings, fetchTimerTemplateFromId, getCycleFromTemplate, isValidPattern } from '../../utils/timerUtils';
import TimerView from '../timer/TimerView';
import SelectTemplateDialog from '../timer/dialogs/SelectTemplateDialog';
import { Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import DashboardTimerWarningDialog from './timer/DashboardTimerWarningDialog';

export default function MiniTimerPanel({ open, onOpen } : { open : boolean, onOpen : () => void }) {

  const POMODORO = { timer_template_id: 1, title: "Pomodoro", description: "A timer using the Pomodoro technique for 4 cycles.", user_id: "", work: 1500000, rest: 300000, cycles: 4 };
  const [ timerSettings, setTimerSettings ] = useState<TimerSettings>({ user_id: "", use_milliseconds: false, low_time_warning: true, timer_template_id: 0});
  const [ pattern, setPattern ] = useState<FullWorkRestCycle>(POMODORO);
  const [ timerTemplateSelectOpen, setTimerTemplateSelectOpen ] = useState(false);
  const [ warningOpen, setWarningOpen ] = useState(false);
  const [ running, setRunning ] = useState(false);

  useEffect(() => {
    fetchTimerSettings(setTimerSettings);
    fetchTimerTemplateFromId(timerSettings.timer_template_id, setPattern);
  }, [timerSettings]);

  useEffect(() => {
    if (open) {
      if (running) {
        setWarningOpen(true);
      } else {
        setTimerTemplateSelectOpen(true);
      }
      onOpen();
    }
  }, [open]);

  return (
    <Stack gap={3}>
      <TimerView
        showConfigButton={false}
        pattern={ isValidPattern(pattern) ? getCycleFromTemplate(pattern) : getCycleFromTemplate(POMODORO) }
        showMs={ false }
        onChange={() => fetchTimerSettings(setTimerSettings)}
        textVariant='h2'
        onRun={() => setRunning(true)}
        onReset={() => setRunning(false)} />
      <Typography>
        For more customisation options, such as creating new timer templates, go to the <Link component={RouterLink} to="/timer">full timer app</Link>.
      </Typography>
      <SelectTemplateDialog open={timerTemplateSelectOpen} handleClose={() => { setTimerTemplateSelectOpen(false) }} onChange={ () => fetchTimerSettings(setTimerSettings) } />
      <DashboardTimerWarningDialog open={warningOpen} onClose={() => { setWarningOpen(false) }} />
    </Stack>            
  )
}