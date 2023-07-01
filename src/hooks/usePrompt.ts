/**
 * Code adapted from this repository:
 * https://github.com/Bilal-Bangash/detecting-route-change-react-route-dom-v6
 * 
 * Due to React Router v6 removing the useBlocker and usePrompt hooks, this 
 * is a replacement to these hooks.
 */

/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useBlocker } from './useBlocker';

/**
 * This hook handles a popup to show and hide and update location based
 * on specific conditions.
 * @param when A boolean/function indicating when to trigger this usePrompt hook.
 * @returns An array containing showPrompt, a boolean indicating whether the prompt is shown;
 *          confirmNavigation, a function that handles what happens when navigation is confirmed;
 *          and cancelNavigation, a function that handles what happens when navigation is cancelled.
 */
export function usePrompt(when: boolean): (boolean | (() => void))[] {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPrompt, setShowPrompt] = useState(false);
  const [lastLocation, setLastLocation] = useState<any>(null);
  const [confirmedNavigation, setConfirmedNavigation] = useState(false);

  const cancelNavigation = useCallback(() => {
    setShowPrompt(false);
    setLastLocation(null);
  }, [])

  // handle blocking when user click on another route prompt will be shown
  const handleBlockedNavigation = useCallback(
    (nextLocation : any) => {
      // check if next location and current location are equal
      if (
        !confirmedNavigation &&
        nextLocation.location.pathname !== location.pathname
      ) {
        setShowPrompt(true);
        setLastLocation(nextLocation);
        return false;
      }
      return true;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [confirmedNavigation, location]
  );

  const confirmNavigation = useCallback(() => {
    setShowPrompt(false);
    setConfirmedNavigation(true);
  }, [])

  useEffect(() => {
    if (confirmedNavigation && lastLocation) {
      navigate(lastLocation.location?.pathname)

      // Clean-up state on confirmed navigation
      setConfirmedNavigation(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmedNavigation, lastLocation]);

  useBlocker(handleBlockedNavigation, when);

  return [showPrompt, confirmNavigation, cancelNavigation];
}