import React, { useState, useEffect } from "react";
import { format } from "date-fns";

const timezones = {
  seoul: "Asia/Seoul",
  almaty: "Asia/Almaty",
  la: "America/Los_Angeles",
  hanoi: "Asia/Bangkok"
};

const labels = {
  seoul: "HQ (Seoul, Korea)",
  almaty: "OHKZ (Almaty, Kazakhstan)",
  la: "OHUS (LA, USA)",
  hanoi: "OHVN (Hanoi, Vietnam)"
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

  const getFutureDate = () => {
    try {
      return new Date(future.year + "-" + future.month + "-" + future.day + "T" + future.hour + ":" + future.minute + ":00");
    } catch {
      return new Date();
    }
  };

  const futureDate = getFutureDate();
  const baseDate = new Date(new Date().toLocaleString("en-US", { timeZone: timezones[future.base] }));
  const diff = futureDate.getTime() - baseDate.getTime();

  const futureTimes = {};
  for (const key in timezones) {
    const local = new Date(new Date().toLocaleString("en-US", { timeZone: timezones[key] }));
    futureTimes[key] = format(new Date(local.getTime() + diff), "yyyy-MM-dd HH:mm");
  }

  const handleChange = (field, value) => {
    setFuture(prev => ({ ...prev, [field]: value }));
  };

  const genRange = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => String(i + start).padStart(2, "0"));

  return (
    <div className="bg-black text-orange-400 min-h-screen flex flex-col items-center justify-center font-digital p-8">
      <img src="/logo.png" alt="Open Healthcare" className="h-16 mb-4" />
      <h1 className="text-4xl lg:text-5xl font-bold mb-12 text-center">World Clock Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-center mb-16">
        {Object.keys(timezones).map((key) => (
          <div key={key}>
            <div className="text-xl mb-2">{labels[key]}</div>
            <div className="text-5xl md:text-6xl font-mono">{getFormattedTime(timezones[key])}</div>
          </div>
        ))}
      </div>

      <div className="text-2xl mb-4">Global Time Checker</div>
      <div className="flex flex-wrap gap-2 justify-center items-center mb-8">
        <select className="bg-black border border-orange-400 p-2 text-orange-400" value={future.base} onChange={e => handleChange("base", e.target.value)}>
          {Object.keys(labels).map(key => (
            <option key={key} value={key}>{labels[key]}</option>
          ))}
        </select>
        <select className="bg-black border border-orange-400 p-2 text-orange-400" value={future.year} onChange={e => handleChange("year", e.target.value)}>
          {genRange(2023, 2030).map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <select className="bg-black border border-orange-400 p-2 text-orange-400" value={future.month} onChange={e => handleChange("month", e.target.value)}>
          {genRange(1, 12).map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <select className="bg-black border border-orange-400 p-2 text-orange-400" value={future.day} onChange={e => handleChange("day", e.target.value)}>
          {genRange(1, 31).map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select className="bg-black border border-orange-400 p-2 text-orange-400" value={future.hour} onChange={e => handleChange("hour", e.target.value)}>
          {genRange(0, 23).map((h) => <option key={h} value={h}>{h}</option>)}
        </select>
        <select className="bg-black border border-orange-400 p-2 text-orange-400" value={future.minute} onChange={e => handleChange("minute", e.target.value)}>
          {genRange(0, 59).map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center text-xl">
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