import React, { useState, useEffect } from "react";
import { format } from "date-fns";

const timezones = {
  seoul: "Asia/Seoul",
  almaty: "Asia/Almaty",
  la: "America/Los_Angeles",
  hanoi: "Asia/Bangkok"
};

const labels = {
  seoul: "서울",
  almaty: "알마티",
  la: "로스엔젤레스",
  hanoi: "하노이"
};

function App() {
  const [now, setNow] = useState(new Date());
  const [future, setFuture] = useState({
    year: "2025",
    month: "04",
    day: "23",
    hour: "11",
    minute: "00",
    base: "seoul"
  });

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getFormattedTime = (tz) => {
    const local = new Date(now.toLocaleString("en-US", { timeZone: tz }));
    return format(local, "HH:mm:ss");
  };

  const futureDate = new Date(
    future.year + "-" +
    future.month + "-" +
    future.day + "T" +
    future.hour + ":" +
    future.minute + ":00"
  );

  const baseDate = new Date(new Date().toLocaleString("en-US", { timeZone: timezones[future.base] }));
  const diff = futureDate.getTime() - baseDate.getTime();

  const futureTimes = {};
  for (const key in timezones) {
    const local = new Date(new Date().toLocaleString("en-US", { timeZone: timezones[key] }));
    futureTimes[key] = format(new Date(local.getTime() + diff), "yyyy-MM-dd HH:mm");
  }

  const handleChange = (field, value) => setFuture(prev => ({ ...prev, [field]: value }));

  return (
    <div className="bg-black text-orange-400 min-h-screen flex flex-col items-center justify-center font-digital p-8">
      <h1 className="text-4xl mb-12">OPEN Healthcare 국가별 시간 현황</h1>

      <div className="grid grid-cols-2 gap-10 mb-16">
        {Object.keys(timezones).map((key) => (
          <div key={key} className="text-center">
            <div className="text-xl mb-2">{labels[key]}</div>
            <div className="text-5xl">{getFormattedTime(timezones[key])}</div>
          </div>
        ))}
      </div>

      <div className="text-2xl mb-4">미래 시간 예측</div>
      <div className="flex flex-wrap gap-2 justify-center items-center mb-6">
        <select className="bg-black border border-orange-400 p-2 text-orange-400" value={future.base} onChange={e => handleChange("base", e.target.value)}>
          <option value="seoul">서울 기준</option>
          <option value="almaty">알마티 기준</option>
          <option value="la">로스엔젤레스 기준</option>
          <option value="hanoi">하노이 기준</option>
        </select>
        <input className="bg-black border border-orange-400 p-2 w-20 text-center text-orange-400" value={future.year} onChange={e => handleChange("year", e.target.value)} />
        <input className="bg-black border border-orange-400 p-2 w-12 text-center text-orange-400" value={future.month} onChange={e => handleChange("month", e.target.value)} />
        <input className="bg-black border border-orange-400 p-2 w-12 text-center text-orange-400" value={future.day} onChange={e => handleChange("day", e.target.value)} />
        <input className="bg-black border border-orange-400 p-2 w-12 text-center text-orange-400" value={future.hour} onChange={e => handleChange("hour", e.target.value)} />
        <input className="bg-black border border-orange-400 p-2 w-12 text-center text-orange-400" value={future.minute} onChange={e => handleChange("minute", e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-10 text-xl text-center">
        {Object.keys(futureTimes).map((key) => (
          <div key={key}>
            <div>{labels[key]}</div>
            <div>{futureTimes[key]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;