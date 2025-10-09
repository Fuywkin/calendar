"use client";

import { CalendarOutlined, DollarOutlined } from "@ant-design/icons";
import {
  Card,
  Col,
  Divider,
  List,
  Row,
  Spin,
  Statistic,
  Tag,
  theme,
  Typography,
} from "antd";
import { motion, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { useCurrencyData } from "./hooks/useCurrency";
import { usePublicHolidayData } from "./hooks/usePublicHoliday";
import { useSchoolDates } from "./hooks/useSchoolDates";
import GitHubButton from "react-github-btn";

const { Text } = Typography;
const { useToken } = theme;

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

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
        {/* Türkiye Resmi Tatilleri */}
        <Col xs={24} md={12} lg={8}>
          <motion.div
            variants={fadeIn as Variants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.003 }}
            transition={{ duration: 0.4 }}
          >
            <Card
              title={
                <span>
                  <CalendarOutlined
                    style={{ marginRight: 8, color: "#ff9800" }}
                  />
                  Türkiye Resmi Tatilleri
                </span>
              }
              hoverable
              style={{
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                height: "100%",
              }}
            >
              <Statistic
                title="En Yakın Tatil"
                value={nextHoliday?.title || "-"}
                valueStyle={{ color: token.colorPrimary }}
              />
              <div style={{ marginTop: 8 }}>
                <Tag color="orange">
                  Tarih: {nextHoliday?.localeDateString || "-"}
                </Tag>
                <Tag color="blue">Kalan gün: {daysLeft ?? "-"}</Tag>
              </div>

              <Divider />

              <List
                size="small"
                dataSource={holiday
                  .filter((h) => h.date > Date.now())
                  .sort((a, b) => a.date - b.date)
                  .slice(0, 10)}
                renderItem={(item: PUBLIC_HOLIDAY_PROPS) => {
                  const today = new Date();
                  const itemDate = new Date(item.date);
                  const isToday =
                    itemDate.getFullYear() === today.getFullYear() &&
                    itemDate.getMonth() === today.getMonth() &&
                    itemDate.getDate() === today.getDate();

                  const isNext =
                    nextHoliday &&
                    new Date(nextHoliday.date).getTime() === itemDate.getTime();

                  let textColor = undefined;
                  if (isToday) textColor = "#4caf50";
                  else if (isNext) textColor = "#ff9800";
                  else textColor = token.colorText;

                  return (
                    <List.Item>
                      <Text strong style={{ color: textColor }}>
                        {item.localeDateString}
                      </Text>{" "}
                      – <Text style={{ color: textColor }}>{item.title}</Text>
                    </List.Item>
                  );
                }}
              />
            </Card>
          </motion.div>
        </Col>

        {/* Okul Tarihleri */}
        <Col xs={24} md={12} lg={8}>
          <motion.div
            variants={fadeIn as Variants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.003 }}
            transition={{ duration: 0.4 }}
          >
            <Card
              title={
                <span>
                  <CalendarOutlined
                    style={{ marginRight: 8, color: "#ff9800" }}
                  />
                  Okul Tatilleri
                </span>
              }
              hoverable
              style={{
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                height: "100%",
              }}
            >
              <Statistic
                title="En Yakın Tatil"
                value={nextSchoolDate?.aciklama || "-"}
                valueStyle={{ color: token.colorPrimary }}
              />
              <div style={{ marginTop: 8 }}>
                <Tag color="orange">
                  Tarih: {nextSchoolDate?.baslangic || "-"}
                </Tag>
                <Tag color="blue">Kalan gün: {daysLeftSchoolDate ?? "-"}</Tag>
              </div>

              <Divider />

              <List
                size="small"
                dataSource={schoolDate}
                renderItem={(item: SCHOOL_DATES_PROPS) => {
                  const today = new Date();
                  const itemDate = new Date(item.baslangic);
                  const isToday =
                    itemDate.getFullYear() === today.getFullYear() &&
                    itemDate.getMonth() === today.getMonth() &&
                    itemDate.getDate() === today.getDate();

                  const isNext =
                    nextSchoolDate &&
                    new Date(nextSchoolDate.baslangic).getTime() ===
                      itemDate.getTime();

                  let textColor = undefined;
                  if (isToday) textColor = "#4caf50";
                  else if (isNext) textColor = "#ff9800";
                  else textColor = token.colorText;

                  return (
                    <List.Item>
                      <Text strong style={{ color: textColor }}>
                        {item.baslangic}
                      </Text>{" "}
                      –{" "}
                      <Text style={{ color: textColor }}>{item.aciklama}</Text>
                    </List.Item>
                  );
                }}
              />
            </Card>
          </motion.div>
        </Col>

        {/* Dolar & Euro Kuru */}
        <Col xs={24} md={12} lg={8}>
          <motion.div
            variants={fadeIn as Variants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.003 }}
            transition={{ duration: 0.4 }}
          >
            <Card
              title={
                <span>
                  <DollarOutlined
                    style={{ marginRight: 8, color: "#4caf50" }}
                  />
                  Dolar & Euro Kuru
                </span>
              }
              hoverable
              style={{
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                height: "100%",
              }}
            >
              <List
                size="small"
                dataSource={[...USD, ...EUR]}
                renderItem={(item: CURRENCY_RATES_PROPS) => (
                  <List.Item>
                    <Tag
                      color={
                        item.name.includes("USD")
                          ? "green"
                          : item.name.includes("EUR")
                          ? "blue"
                          : "default"
                      }
                    >
                      {item.name}
                    </Tag>
                    <Text>
                      Alış: <strong>{item.buying}</strong> | Satış:{" "}
                      <strong>{item.selling}</strong>
                    </Text>
                  </List.Item>
                )}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
