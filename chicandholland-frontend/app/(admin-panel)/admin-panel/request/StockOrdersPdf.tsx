import React from "react";
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import dayjs from "dayjs";

const StockOrdersPdf = ({ orderData }: { orderData: any }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape" wrap>
        <View style={styles.topBanner}>
          <Text style={styles.bannerText}>Product Code :{orderData.styleNo}</Text>

          <Text style={styles.bannerText}>
            {" "}
            ID: {orderData.purchaeOrderNo || orderData.purchaseOrderNo}
          </Text>
          <View>
            <Text style={styles.bannerText}>
              Order Received date:{" "}
              {dayjs(orderData.orderReceivedDate).format("DD MMM YYYY")}
            </Text>
            <Text style={styles.bannerText}>
              Order Shipping date:{" "}
              {dayjs(orderData.orderCancellationDate).format("DD MMM YYYY")}
            </Text>
          </View>
        </View>
        <View style={styles.styleDetails}>
          <View
            style={{
              flexDirection: "column",
              width: orderData.image ? "70%" : "100%",
            }}
          >
            <View style={{ flexDirection: "column" }}>
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    width: "20%",
                    backgroundColor: "#FF5698",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "4px",
                  }}
                >
                  <Text>Color</Text>
                </View>
                <View
                  style={{
                    width: "25%",
                    backgroundColor: "#FF5698",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "4px",
                  }}
                >
                  <Text>Size ({orderData.size})</Text>
                </View>
                <View
                  style={{
                    width: "55%",
                    backgroundColor: "#FF5698",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "4px",
                  }}
                >
                  <Text>Quantity {orderData.quantity}</Text>
                </View>
              </View>
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    width: "20%",
                    backgroundColor: "pink",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "4px",
                  }}
                >
                  <Text style={{ textAlign: "center" }}>{orderData.color}</Text>
                </View>
                <View
                  style={{
                    width: "25%",
                    backgroundColor: "pink",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "4px",
                  }}
                >
                  <Text>{orderData.size}</Text>
                </View>
                <View
                  style={{
                    width: "55%",
                    backgroundColor: "pink",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "4px",
                  }}
                >
                  <Text>{orderData.quantity}</Text>
                </View>
              </View>
            </View>
          </View>

          {orderData.image && (
            <View style={{ width: "30%" }}>
              <Image
                src={orderData.image}
                style={{
                  width: "100%",
                  height: "360px",
                }}
              />
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default StockOrdersPdf;

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  topBanner: {
    backgroundColor: "#FF5698",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  bannerText: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
  styleDetails: {
    flexDirection: "row",
    marginTop: 20,
  },
});
