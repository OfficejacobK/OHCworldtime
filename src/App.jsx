import React, { useState, useEffect } from "react";
import { format } from "date-fns";

function App() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = format(now, "a hh:mm:ss");
  const formattedDate = format(now, "yyyy년 MM월 dd일 EEEE");

  return (
    <div className="min-h-screen bg-black text-orange-400 flex flex-col justify-center items-center font-digital">
      <div className="text-2xl mb-2">현재 시간</div>
      <div className="text-8xl">{formattedTime}</div>
      <div className="mt-6 text-2xl">{formattedDate}</div>
    </div>
  );
}

export default App;