import { CalendarOutlined } from "@ant-design/icons";
import {
  Card,
  Divider,
  GlobalToken,
  List,
  Statistic,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { motion, Variants } from "framer-motion";

const { Text } = Typography;

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

interface HOLIDAY_PROPS {
  nextHoliday: PUBLIC_HOLIDAY_PROPS;
  holiday: PUBLIC_HOLIDAY_PROPS[];
  daysLeft: number;
  token: GlobalToken;
}

const CountryHolidays = ({
  nextHoliday,
  holiday,
  daysLeft,
  token,
}: HOLIDAY_PROPS) => {
  return (
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
            <CalendarOutlined style={{ marginRight: 8, color: "#4caf50" }} />
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
            Tarih:{" "}
            {dayjs(nextHoliday?.date).format("DD.MM.YYYY") || "-"}
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
  );
};

export default CountryHolidays;
