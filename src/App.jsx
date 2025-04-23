import React, { useState, useEffect } from "react";
import { format } from "date-fns-tz";
import { saveAs } from "file-saver";

const timezones = {
  seoul: "Asia/Seoul",
  almaty: "Asia/Almaty",
  la: "America/Los_Angeles",
  hanoi: "Asia/Bangkok"
};

const labels = {
  seoul: "대한민국 서울",
  almaty: "카자흐스탄 알마티",
  la: "미국 로스엔젤레스",
  hanoi: "베트남 하노이"
};

function App() {
  const [currentTimes, setCurrentTimes] = useState({});
  const [future, setFuture] = useState({
    year: "2025",
    month: "04",
    day: "23",
    hour: "11",
    minute: "00",
    base: "seoul"
  });

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      const times = {};
      for (const key in timezones) {
        times[key] = format(now, "yyyy-MM-dd HH:mm:ss", { timeZone: timezones[key] });
      }
      setCurrentTimes(times);
    };
    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  const futureDate = new Date(`${future.year}-${future.month}-${future.day}T${future.hour}:${future.minute}:00`);
  const baseOffset = new Date().toLocaleString("en-US", { timeZone: timezones[future.base] });
  const baseDate = new Date(baseOffset);
  const diff = futureDate.getTime() - baseDate.getTime();

  const futureTimes = {};
  for (const key in timezones) {
    const localTime = new Date(new Date().toLocaleString("en-US", { timeZone: timezones[key] }));
    futureTimes[key] = format(new Date(localTime.getTime() + diff), "yyyy-MM-dd HH:mm", { timeZone: timezones[key] });
  }

  const downloadData = () => {
    const data = {
      기준시간: `${future.year}-${future.month}-${future.day} ${future.hour}:${future.minute}`,
      기준국가: labels[future.base],
      예측시간: futureTimes
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    saveAs(blob, "world_times_prediction.json");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-8 font-sans">
      <h1 className="text-4xl font-bold text-center mb-10 text-blue-800">🌐 실시간 세계 시간</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.keys(timezones).map((key) => (
          <div key={key} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
            <div className="text-xl font-semibold mb-2 text-gray-800">{labels[key]}</div>
            <div className="text-2xl text-blue-600 font-mono">{currentTimes[key]}</div>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">🕒 미래 시간 예측</h2>
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <select value={future.base} onChange={e => setFuture({ ...future, base: e.target.value })} className="p-2 rounded border">
            <option value="seoul">서울 기준</option>
            <option value="almaty">알마티 기준</option>
            <option value="la">로스엔젤레스 기준</option>
            <option value="hanoi">하노이 기준</option>
          </select>
          <input type="number" value={future.year} onChange={e => setFuture({ ...future, year: e.target.value })} className="p-2 rounded border w-24" />년
          <input type="number" value={future.month} onChange={e => setFuture({ ...future, month: e.target.value })} className="p-2 rounded border w-16" />월
          <input type="number" value={future.day} onChange={e => setFuture({ ...future, day: e.target.value })} className="p-2 rounded border w-16" />일
          <input type="number" value={future.hour} onChange={e => setFuture({ ...future, hour: e.target.value })} className="p-2 rounded border w-16" />시
          <input type="number" value={future.minute} onChange={e => setFuture({ ...future, minute: e.target.value })} className="p-2 rounded border w-16" />분
          <button onClick={downloadData} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">결과 다운로드</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.keys(timezones).map((key) => (
            <div key={key} className="bg-white p-6 rounded-2xl shadow">
              <div className="text-lg font-semibold mb-1 text-gray-700">{labels[key]}</div>
              <div className="text-xl text-gray-900 font-mono">{futureTimes[key]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;