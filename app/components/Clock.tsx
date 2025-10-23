"use client";

import { Divider, Space, Typography } from "antd";
import { useEffect, useState } from "react";

const { Text } = Typography;

const Clock = () => {
  const monthList = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ];
  const dayList = [
    "Pazar",
    "Pazartesi",
    "Salı",
    "Çarşamba",
    "Perşembe",
    "Cuma",
    "Cumartesi",
  ];

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const day = dayList[time.getDay()];
  const month = monthList[time.getMonth()];
  const date = time.getDate();
  const year = time.getFullYear();

  const session = hours < 12 ? "ÖÖ" : "ÖS";
  const formattedHours = (hours % 12 || 12).toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  return (
    <div className="flex flex-col items-center justify-center text-[#212121] font-mono">
      <div className="text-5xl sm:text-6xl font-bold tracking-widest text-[#212121]">
        <span>{formattedHours}</span>
        <span className="text-[#ff9800]">:</span>
        <span>{formattedMinutes}</span>
        <span className="text-[#ff9800]">:</span>
        <span>{formattedSeconds}</span>
        <span className="ml-2 text-[#4caf50] text-2xl">{session}</span>
      </div>

      <Divider style={{ borderColor: "rgba(0,0,0,0.1)" }} />

      <div className="flex flex-col items-center mt-4">
        <Space direction="vertical" align="center" size={6}>
          {/* Tarih bilgisi */}
          <Text
            style={{
              color: "#37474F",
              fontSize: "18px",
              fontWeight: 500,
              letterSpacing: "0.3px",
            }}
          >
            {day}, {date} {month} {year}
          </Text>
        </Space>
      </div>
    </div>
  );
};

export default Clock;
