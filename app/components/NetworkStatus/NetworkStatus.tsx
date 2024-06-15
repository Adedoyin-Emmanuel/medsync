"use client";
import React, { useEffect, useState } from "react";
import { ImConnection } from "react-icons/im";

interface NetworkStatusProps {
  className?: string;
}

const NetworkStatus = ({ className, ...others }: NetworkStatusProps) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className={`${className}`} {...others}>
      {isOnline ? (
        <ImConnection className="h-5 w-5 text-green-400" />
      ) : (
        <ImConnection className="h-5 w-5 text-red-500" />
      )}
    </div>
  );
};

export default NetworkStatus;
