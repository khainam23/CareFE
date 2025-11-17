import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = ({ behavior = 'smooth' }) => {
  const { pathname, key } = useLocation();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior,
      });
    }
  }, [pathname, key, behavior]);

  return null;
};

export default ScrollToTop;

