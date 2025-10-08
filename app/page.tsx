"use client";

import { Card, Col, Divider, List, Row, Spin, Typography } from "antd";
import { motion } from "framer-motion";
import { useCurrencyData } from "./hooks/useCurrency";
import { usePublicHolidayData } from "./hooks/usePublicHoliday";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;

const Home = () => {
  const [loading, setLoading] = useState(true);

  const { currency: USD, getCurrencyData: getUSD } =
    useCurrencyData<CURRENCY_RATES_PROPS>({ queryType: "USD" });
  const { currency: EUR, getCurrencyData: getEUR } =
    useCurrencyData<CURRENCY_RATES_PROPS>({ queryType: "EUR" });

  const { holiday, getHolidayData, getNextHoliday } =
    usePublicHolidayData<PUBLIC_HOLIDAY_PROPS>();

  useEffect(() => {
    const fetchAll = async () => {
      await Promise.all([getUSD(), getEUR(), getHolidayData()]);
      setLoading(false);
    };
    fetchAll();
  }, [getUSD, getEUR, getHolidayData]);

  const nextHolidayResult = getNextHoliday(holiday);
  const nextHoliday = nextHolidayResult?.nextHoliday;
  const daysLeft = nextHolidayResult?.daysLeft;

  if (loading) {
    return (
      <Spin size="large" style={{ display: "block", margin: "100px auto" }} />
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <Title level={2}>Önemli Tarihler & Kurlar</Title>
      <Divider />

      <Row gutter={[24, 24]}>
        {/* Resmi Tatiller */}
        <Col xs={24} md={12} lg={12}>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Card title="Türkiye Resmi Tatilleri" variant="outlined" hoverable>
              <Text>
                En yakın tatil: <strong>{nextHoliday?.title}</strong>
              </Text>
              <br />
              <Text>
                Tarih: <strong>{nextHoliday?.localeDateString}</strong>
              </Text>
              <br />
              <Text>
                Kalan gün: <strong>{daysLeft}</strong>
              </Text>
              <List
                style={{ marginTop: "1rem" }}
                dataSource={holiday
                  .filter((h) => h.date > Date.now())
                  .sort((a, b) => a.date - b.date)
                  .slice(0, 10)}
                renderItem={(item: PUBLIC_HOLIDAY_PROPS) => (
                  <List.Item>
                    <Text strong>{item.localeDateString}</Text> - {item.title}
                  </List.Item>
                )}
              />
            </Card>
          </motion.div>
        </Col>
        {/* Dolar ve Euro Kuru */}
        <Col xs={24} md={12} lg={12}>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Card title="Dolar & Euro Kuru" variant="outlined" hoverable>
              <List
                dataSource={[...USD, ...EUR]}
                renderItem={(item: CURRENCY_RATES_PROPS) => (
                  <List.Item>
                    <Text strong>{item.name}</Text> - Alış: {item.buying} |
                    Satış: {item.selling}
                  </List.Item>
                )}
              />
            </Card>
          </motion.div>
        </Col>

        {/* Okullar & Sınav Tarihleri */}
        {/* <Col xs={24} md={12} lg={12}>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Card
              title="Okullar ve Sınav Tarihleri"
              variant="outlined"
              hoverable
            >
              <List
                dataSource={exams}
                renderItem={(item) => (
                  <List.Item>
                    <Text strong>{item.date}</Text> - {item.name}
                  </List.Item>
                )}
              />
            </Card>
          </motion.div>
        </Col> */}

        {/* Ekstra Önemli Tarihler */}
        {/* <Col xs={24} md={12} lg={12}>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Card title="Ekstra Önemli Tarihler" variant="outlined" hoverable>
              <List
                dataSource={extraEvents}
                renderItem={(item) => (
                  <List.Item>
                    <Text strong>{item.date}</Text> - {item.name}
                  </List.Item>
                )}
              />
            </Card>
          </motion.div>
        </Col> */}
      </Row>
    </div>
  );
};

export default Home;
