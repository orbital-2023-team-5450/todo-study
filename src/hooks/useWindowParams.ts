import { useState, useEffect } from 'react';

/**
 * A custom React hook that returns the window width through the window.innerWidth method
 * that changes on resize.
 * @returns The window width using the window.innerWidth method (as measured on resize).
 */
export const useWindowParams = (getWidth : boolean = true, getHeight : boolean = false) => {
  
  const minimumDesktopWidth = 600;
  const [ windowWidth, setWindowWidth ] = useState(window.innerWidth);
  const [ windowHeight, setWindowHeight ] = useState(window.innerHeight);

  useEffect(() => {

    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    }
  });
  
  if (getWidth && getHeight) {
    return [ windowWidth, minimumDesktopWidth, windowHeight ];
  } else if (getWidth) {
    return [ windowWidth, minimumDesktopWidth ];
  } else if (getHeight) {
    return [ windowHeight ];
  } else {
    return [];
  }
}