import { DollarOutlined } from "@ant-design/icons";
import { Card, List, Tag, Typography } from "antd";
import { motion, Variants } from "framer-motion";

const { Text } = Typography;

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

interface CURRENCY_PROPS {
  USD: CURRENCY_RATES_PROPS[];
  EUR: CURRENCY_RATES_PROPS[];
}

const Currency = ({ USD, EUR }: CURRENCY_PROPS) => {
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
            <DollarOutlined style={{ marginRight: 8, color: "#4caf50" }} />
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
  );
};

export default Currency;
