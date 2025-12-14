import { useState, useEffect } from 'react';

function Clock() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const now = new Date();
    const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

    const timeout = setTimeout(() => {
      setCurrentTime(new Date());

      const interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 60000);

      return () => clearInterval(interval);
    }, msUntilNextMinute);

    return () => clearTimeout(timeout);
  }, []);

  const hours = String(currentTime.getHours()).padStart(2, '0');
  const minutes = String(currentTime.getMinutes()).padStart(2, '0');

  return (<p>{hours}:{minutes}</p>);
}

export default Clock;