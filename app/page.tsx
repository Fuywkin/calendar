"use client";

import { Col, Divider, Row, Spin, theme } from "antd";
import { useEffect, useState } from "react";
import GitHubButton from "react-github-btn";
import Clock from "./components/Clock";
import CountryHolidays from "./components/CountryHolidays";
import Currency from "./components/Currency";
import SchoolHolidays from "./components/SchoolHolidays";
import { useCurrencyData } from "./hooks/useCurrency";
import { usePublicHolidayData } from "./hooks/usePublicHoliday";
import { useSchoolDates } from "./hooks/useSchoolDates";

const { useToken } = theme;

const Home = () => {
  const { token } = useToken();
  const [loading, setLoading] = useState(true);

  const { currency: USD, getCurrencyData: getUSD } =
    useCurrencyData<CURRENCY_RATES_PROPS>({ queryType: "USD" });
  const { currency: EUR, getCurrencyData: getEUR } =
    useCurrencyData<CURRENCY_RATES_PROPS>({ queryType: "EUR" });

  const { holiday, getHolidayData, getNextHoliday } =
    usePublicHolidayData<PUBLIC_HOLIDAY_PROPS>();

  const { schoolDate, getSchoolDateData, getNextSchoolDate } = useSchoolDates();

  useEffect(() => {
    const fetchAll = async () => {
      await Promise.all([
        getUSD(),
        getEUR(),
        getHolidayData(),
        getSchoolDateData(),
      ]);
      setLoading(false);
    };
    fetchAll();
  }, [getUSD, getEUR, getHolidayData, getSchoolDateData]);

  const nextHolidayResult = getNextHoliday(holiday);
  const nextHoliday = nextHolidayResult?.nextHoliday;
  const daysLeft = nextHolidayResult?.daysLeft;

  const nextSchoolDateResult = getNextSchoolDate(schoolDate);
  const nextSchoolDate = nextSchoolDateResult?.nextSchoolDate;
  const daysLeftSchoolDate = nextSchoolDateResult?.daysLeft;

  if (loading) {
    return (
      <Spin
        size="large"
        style={{ display: "block", margin: "120px auto" }}
        fullscreen
        tip="Veriler yükleniyor..."
      />
    );
  }

  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "#f9fafc",
        minHeight: "100vh",
      }}
    >
      <div className="absolute top-0 left-0">
        <GitHubButton
          href="https://github.com/Fuywkin/time-tracker"
          data-color-scheme="no-preference: light; light: light; dark: dark;"
          data-size="small"
          aria-label="Use this GitHub Action Fuywkin/time-tracker on GitHub"
        >
          View on GitHub
        </GitHubButton>
      </div>

      <Divider />

      <Row gutter={[24, 24]} justify="start">
        <Col xs={24} md={12} lg={8}>
          <CountryHolidays
            nextHoliday={nextHoliday!}
            holiday={holiday}
            daysLeft={daysLeft!}
            token={token}
          />
        </Col>

        <Col xs={24} md={12} lg={8}>
          <SchoolHolidays
            nextHoliday={nextSchoolDate!}
            holiday={schoolDate}
            daysLeft={daysLeftSchoolDate!}
            token={token}
          />
        </Col>

        <Col xs={24} md={12} lg={8}>
          <Currency USD={USD} EUR={EUR} />

          <Clock />
        </Col>
      </Row>
    </div>
  );
};

export default Home;
