import { useState, useEffect } from 'react';

/**
 * A custom React hook that returns the window width through the window.innerWidth method
 * that changes on resize.
 * @returns The window width using the window.innerWidth method (as measured on resize).
 */
export const useWindowWidth = () => {
  
  const minimumDesktopWidth = 600;
  const [ windowWidth, setWindowWidth ] = useState(window.innerWidth);

  useEffect(() => {

    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    }
  });

  return [ windowWidth, minimumDesktopWidth ];
}