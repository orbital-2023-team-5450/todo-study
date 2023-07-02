/**
 * Code adapted from this repository:
 * https://github.com/Bilal-Bangash/detecting-route-change-react-route-dom-v6
 * 
 * Due to React Router v6 removing the useBlocker and usePrompt hooks, this 
 * is a replacement to these hooks.
 * 
 * https://stackoverflow.com/questions/70288198/detecting-user-leaving-page-with-react-router-dom-v6-0-2
 */

import * as React from 'react';
import { UNSAFE_NavigationContext } from 'react-router-dom';
import type { History, Blocker, Transition } from 'history';

/**
 * Blocks users from navigating away if there are any changes made.
 * @param blocker A Blocker to handle the blocked navigation.
 * @param when A boolean indicating when to trigger the useBlocker hook.
 */
export function useBlocker(blocker: Blocker, when = true, autosave : boolean): void {
  const navigator = React.useContext(UNSAFE_NavigationContext)
    .navigator as History;

  React.useEffect(() => {
    if (!when) return;
    if (autosave) console.log(when);

    const unblock = navigator.block((tx: Transition) => {
      const autoUnblockingTx = {
        ...tx,
        retry() {
          unblock();
          tx.retry();
        },
      };

      blocker(autoUnblockingTx);
    });

    return unblock;
  }, [navigator, blocker, when]);
}