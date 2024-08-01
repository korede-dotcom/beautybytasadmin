"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const withAuth = <P extends object>(Component: React.ComponentType<P>, logoutTime = 1800000) => {
  const WrappedComponent: React.FC<P> = (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.replace('/login');
        return;
      }

      setIsAuthenticated(true);

      const handleLogout = () => {
        localStorage.removeItem('token');
        router.replace('/login');
      };

      const resetTimer = () => {
        clearTimeout(timer);
        timer = setTimeout(handleLogout, logoutTime);
      };

      let timer = setTimeout(handleLogout, logoutTime);
      window.addEventListener('mousemove', resetTimer);
      window.addEventListener('keypress', resetTimer);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('mousemove', resetTimer);
        window.removeEventListener('keypress', resetTimer);
      };
    }, [router, logoutTime]);

    if (!isAuthenticated) {
      return <div>Loading...</div>;
    }

    return <Component {...props} />;
  };

  WrappedComponent.displayName = `withAuth(${Component.displayName || Component.name || 'Component'})`;

  return WrappedComponent;
};

export default withAuth;
