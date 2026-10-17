import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Line,
  Svg,
  Image,
} from "@react-pdf/renderer";
import { utcToLocal } from "helper/timezone.helper";
import { refundDetailsType } from "../types/purchaseHistory.type";
const MediaComponent = () => (
  <View style={styles.footer} fixed>
    <View style={[styles.block, { backgroundColor: "#486A1D" }]}>
      <View style={styles.webInfo}>
        <Text style={styles.webInfoLabel}>info@sns.com</Text>
        <Text style={styles.webInfoLabel}>www.sns.com</Text>
      </View>
    </View>
  </View>
);
const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  webInfo: {
    paddingHorizontal: 35,
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginTop: 18,
  },
  header: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: 30,
  },
  sitelogo: {
    fontSize: 38,
    textAlign: "left",
  },
  invoice: {
    fontSize: 38,
    textAlign: "right",
    fontWeight: 900,
    color: "#111",
  },
  colf: {
    width: "50%",
  },
  orderDetails: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: 40,
    marginTop: 25,
  },
  billToSection: {
    color: "#111",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: 700,
    lineHeight: "normal",
    width: "80%",
    textAlign: "left",
  },
  billToAddress: {
    width: "50%",
    fontWeight: 300,
    fontSize: 12,
    marginTop: "10px",
    wordWrap: "break-word",
  },
  orderStats: {
    width: "20%",
    display: "flex",
    gap: 20,
    textAlign: "right",
  },
  orderIdentity: {
    display: "flex",
    gap: 5,
  },
  orderIdentityHeader: {
    color: "#111",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: 800,
    lineHeight: "normal",
  },
  orderCard: {
    marginTop: 10,
    fontSize: 10,
  },
  orderIdentityText: {
    color: "#111",
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: 300,
    lineHeight: "normal",
  },
  orderDateHeader: {
    color: "#111",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: 800,
    lineHeight: "normal",
  },
  orderDateText: {
    color: "#111",
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: 300,
    lineHeight: "normal",
  },
  table: {
    width: "100%",
    marginTop: 25,
    textAlign: "left",
    marginLeft: 20,
    marginBottom: 25,
  },
  tableRow: {
    marginTop: 10,
    flexDirection: "row",
    textAlign: "left",
    width: "100%",
  },
  tableHeaderRow: {
    flexDirection: "row",
    marginBottom: 10,
    width: "100%",
  },
  tableCol: {
    width: "100%",
    maxWidth: 500,
  },
  tableColAdditional: {
    display: "flex",
    flexDirection: "row",
    gap: 4,
  },
  tableHeaderCell: {
    fontSize: 18,
    color: "#111",
    fontStyle: "normal",
    fontWeight: 700,
    lineHeight: "normal",
  },
  tableCell: {
    marginTop: 5,
    fontSize: 12,
    textAlign: "left",
  },
  additional: {
    fontSize: 8,
    fontWeight: 200,
    marginTop: 8,
  },
  orderAmountStats: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 20,
  },
  paymentTitle: {
    textAlign: "left",
    width: "60%",
  },
  AmountDetails: {
    display: "flex",
    flexDirection: "column",
    gap: 7,
    width: "40%",
  },
  AmountDetailsHeader: {
    width: "100%",
    marginBottom: 10,
    display: "flex",
    flexDirection: "row",
    gap: 25,
    textAlign: "right",
    justifyContent: "space-between",
  },
  amounts: {
    textAlign: "right",
    fontSize: 13,
  },
  finalAmount: {
    textAlign: "right",
    fontSize: 18,
  },
  qrcode: {
    height: 70,
    width: 70,
    marginTop: 10,
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
  footer: {
    marginTop: 140,
    color: "#ffff",
  },
  block: {
    height: 60,
    width: "100%",
    backgroundColor: "red",
  },
  webInfoLabel: {
    color: "#ffff",
    fontSize: 15,
  },
});

const RefundOrderPdfView = ({
  refundOrderData,
}: {
  refundOrderData: refundDetailsType;
}) => {
  return (
    <Document>
      <Page size="A4">
        <View style={styles.body}>
          <View style={styles.header}>
            <View style={styles.colf}>
              <Text style={styles.sitelogo}>S&S</Text>
            </View>
            <View style={styles.colf}>
              <Text style={styles.invoice}>Re-INVOICE</Text>
            </View>
          </View>
          <View style={styles.orderDetails}>
            <View style={styles.billToSection}>
              <Text style={styles.billToSection}>Bill To</Text>
              <View style={styles.billToAddress}>
                <Text>
                  {refundOrderData?.OrderDetails.address.address},{" "}
                  {refundOrderData.OrderDetails.address.city},{" "}
                  {refundOrderData.OrderDetails.address.state},{" "}
                  {refundOrderData.OrderDetails.address.country},{" "}
                  {refundOrderData.OrderDetails.address.postal_code}
                </Text>
              </View>
            </View>
            <View style={styles.orderStats}>
              <View style={styles.orderIdentity}>
                <Text style={styles.orderIdentityHeader}>Order Id</Text>
                <Text style={styles.orderIdentityText}>
                  #{refundOrderData.OrderDetails.uuid.slice(0, 8)}
                </Text>
              </View>
              <View style={styles.orderIdentity}>
                <Text style={styles.orderIdentityHeader}>Re-Order Id</Text>
                <Text style={styles.orderIdentityText}>
                  #{refundOrderData.RefundOrderDetails?.uuid.slice(0, 8)}
                </Text>
              </View>
              <View>
                <Text style={styles.orderDateHeader}>Order Date</Text>
                <Text style={styles.orderDateText}>
                  {utcToLocal(refundOrderData.OrderDetails.created_at)}
                </Text>
              </View>
            </View>
          </View>
          <View>
            <Text>Products Refunded</Text>
          </View>
          <Svg height="10" width="540">
            <Line
              x1="0"
              y1="5"
              x2="525"
              y2="5"
              strokeWidth={2}
              stroke="rgb(0,76,0)"
            />
          </Svg>

          <View style={styles.table}>
            <View style={styles.tableHeaderRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableHeaderCell}>Description</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableHeaderCell}>Qty</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableHeaderCell}>Price</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableHeaderCell}>Total</Text>
              </View>
            </View>
            <View>
              {refundOrderData.RefundProductDetails.map((item, index) => {
                return (
                  <View key={index} style={styles.tableRow}>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {item?.supplierProductQuotes?.ProductPurchaseRequests
                          ?.products?.name_en
                          ? item?.supplierProductQuotes?.ProductPurchaseRequests
                              ?.products?.name_en
                          : item?.product?.name_en}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <View style={styles.tableColAdditional}>
                        <Text style={styles.tableCell}>{item.quantity}</Text>
                      </View>
                    </View>
                    <View style={styles.tableCol}>
                      <View style={styles.tableColAdditional}>
                        <Text style={styles.tableCell}>{item.price}</Text>
                        <Text style={styles.additional}>SAR</Text>
                      </View>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {item.quantity * Number(item.price)}{" "}
                        <Text style={styles.additional}>SAR</Text>
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
          <Svg height="10" width="540">
            <Line
              x1="0"
              y1="5"
              x2="525"
              y2="5"
              strokeWidth={2}
              stroke="rgb(0,76,0)"
            />
          </Svg>
          <View style={styles.orderAmountStats}>
            <View style={styles.paymentTitle}>
              <Text style={styles.orderIdentityHeader}>Payment Method</Text>
              <Text style={styles.orderCard}>By MasterCard 2023</Text>
              <Text style={styles.orderCard}>
                Scan QR-CODE for more detials
              </Text>
              <View style={styles.qrcode}>
                <Image src={refundOrderData.src} />
              </View>
            </View>
            <View style={styles.AmountDetails}>
              <View style={styles.AmountDetailsHeader}>
                <Text style={styles.amounts}>Amount Refunded</Text>
                <Text style={styles.amounts}>
                  {refundOrderData.RefundOrderDetails?.refundable_amount?.toFixed(
                    2
                  )}
                  <Text style={styles.additional}> SAR</Text>
                </Text>
              </View>
              <View style={styles.AmountDetailsHeader}>
                <Text style={styles.amounts}>VAT Tax</Text>
                <Text style={styles.amounts}>
                  {/* {(totalAmount - orderData.amount).toFixed(2)}{" "} */}
                  {refundOrderData.OrderDetails?.vat_percentage}
                  <Text style={styles.additional}> %</Text>
                </Text>
              </View>
              <View style={styles.AmountDetailsHeader}>
                <Text>Total</Text>
                <Text style={styles.finalAmount} break>
                  {refundOrderData.RefundOrderDetails?.order_amount_left}{" "}
                  <Text style={styles.additional}> SAR</Text>{" "}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <MediaComponent />
      </Page>
    </Document>
  );
};

export default RefundOrderPdfView;
