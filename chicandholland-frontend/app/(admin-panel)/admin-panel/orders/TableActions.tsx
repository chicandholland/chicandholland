"use client";

import { Button } from "@/components/custom/button";
import { File, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useHttp from "@/lib/hooks/usePost";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import OrderCustomerPdf from "@/app/(admin-panel)/admin-panel/orders/OrderCustomerPdf";
import { API_URL } from "@/lib/constants";
import {
  getProductColorsCheck,
  getProductColours,
  getRetailerAdminFreshOrderDetails,
  getRetailerAdminStockOrderDetails,
} from "@/lib/data";
import { convertWebPToJPG } from "../request/StockAcceptedForm";
import StockOrdersPdf from "../request/StockOrdersPdf";
import FreshOrderPdf from "../request/FreshOrderPdf";
import { Reject } from "../order-list/Reject";

const TableActions = ({ data }: { data: any }) => {
  // console.log("data based on selecting ,", data);

  const [open, setOpen] = useState(false);

  const [previewData, setData] = useState<any>(null);

  const {
    error,
    executeAsync: Stock,
    loading,
  } = useHttp("/api/stock-email", "POST", false, true);

  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [normalOrder, setNormalOrder] = useState<any>(null);

  //store and online
  const fetchData = () => {
    fetch(API_URL + `orders/orderDetails?orderId=${data.id}`).then(
      async (res) => {
        const colours = await getProductColours({});
        const data = await res.json();

        const dataOrder = data.orders[0];

        let colors = colours.productColours;
        const getColorName = (hexcode: string) =>
          hexcode !== "SAS"
            ? colors.find((colour: any) => colour.hexcode === hexcode)?.name ||
              hexcode
            : "SAS";

        const loop = dataOrder.styles.reduce((acc: any[], currentItem: any) => {
          // Create the basic return value structure for the current item

          const currentReturnValue = {
            quantity:
              currentItem.customSizesQuantity.length < 1
                ? currentItem.quantity
                : currentItem.customSizesQuantity.reduce(
                    (sum: any, item: any) => sum + Number(item.quantity),
                    0,
                  ),
            size:
              currentItem.customSizesQuantity.length < 1
                ? `${currentItem.size}/${currentItem.quantity}`
                : currentItem.customSizesQuantity
                    .map((item: any) => `${item.size}/${item.quantity}`)
                    .join(", "),
            styleNo: currentItem.styleNo,
            size_country: currentItem.sizeCountry,
            comments: currentItem.comments.join(", "),
            color: currentItem.colorType,
            image: currentItem.convertedFirstProductImage,
            meshColor:
              currentItem.mesh_color == "SAS"
                ? "SAS "
                : getColorName(currentItem.mesh_color),
            beadingColor:
              currentItem.beading_color == "SAS"
                ? "SAS "
                : getColorName(currentItem.beading_color),
            lining: currentItem.lining,
            liningColor:
              currentItem.lining_color == "SAS"
                ? "SAS "
                : getColorName(currentItem.lining_color),
            refImg: currentItem.photoUrls,
          };

          // Check if there's an existing item with the same styleNo and matching properties
          const existingItemIndex = acc.findIndex(
            (item) =>
              item.styleNo === currentReturnValue.styleNo &&
              item.meshColor === currentReturnValue.meshColor &&
              item.beadingColor === currentReturnValue.beadingColor &&
              item.lining === currentReturnValue.lining &&
              item.liningColor === currentReturnValue.liningColor &&
              item.color === currentReturnValue.color &&
              item.comments === currentReturnValue.comments &&
              JSON.stringify(item.refImg) ===
                JSON.stringify(currentReturnValue.refImg),
          );

          if (existingItemIndex >= 0) {
            // Merge with existing item
            acc[existingItemIndex].quantity += currentReturnValue.quantity;
            acc[existingItemIndex].size =
              `${acc[existingItemIndex].size}, ${currentReturnValue.size}`;
          } else {
            // Add new item
            acc.push(currentReturnValue);
          }

          return acc;
        }, []);

        const preData = {
          customerId: dataOrder.customer.id,
          manufacturingEmailAddress: dataOrder.manufacturingEmailAddress,
          orderCancellationDate: dataOrder.orderCancellationDate,
          orderReceivedDate: dataOrder.orderReceivedDate,
          orderType: dataOrder.orderType,
          purchaseOrderNo: dataOrder.purchaeOrderNo,
          details: loop,
          // Note: total_state wasn't in your original code, adding it assuming it exists in your context
        };

        setNormalOrder(preData);
        // console.log("store", preData);
        // console.log("online", preData);
        // console.log("retailersss", preData);
        setOrderDetails(data);
      },
    );
  };

  //stock and fresh mails
  const fetchDetails = async () => {
    const colours = await getProductColours({});

    let colors = colours.productColours;
    const getColorName = (hexcode: string) =>
      hexcode !== "SAS"
        ? colors.find((colour: any) => colour.hexcode === hexcode)?.name ||
          hexcode
        : "SAS";

    const productColorSAS = async (id: number) => {
      const res = await getProductColorsCheck(id);
      return res.data; // Returns the standard colors for a specific product ID
    };
    try {
      if (data.orderType == "Fresh") {
        const fresh = await getRetailerAdminFreshOrderDetails(
          data.favouriteOrder.id,
          1,
        );

        const details = await Promise.all(
          fresh.data.map(async (i: any) => {
            // Pre-process reference images if they exist
            const refImgPromises = i.reference_image
              ? JSON.parse(i.reference_image).map((item: any) =>
                  convertWebPToJPG(item),
                )
              : [];
            const standardColors = await productColorSAS(i.product_id);

            // Check if colors match standard colors
            const isMeshColorSAS =
              i.mesh_color === standardColors.mesh_color
                ? `SAS( ${getColorName(standardColors.mesh_color)} )`
                : getColorName(i.mesh_color);
            const isBeadingColorSAS =
              i.beading_color === standardColors.beading_color
                ? `SAS( ${getColorName(standardColors.beading_color)} )`
                : getColorName(i.beading_color);
            const isLiningTypeSAS =
              i.lining === standardColors.lining
                ? `SAS(${standardColors.lining})`
                : i.lining;
            const isLiningColorSAS =
              i.lining_color === standardColors.lining_color
                ? `SAS( ${getColorName(standardColors.lining_color)} )`
                : getColorName(i.lining_color);

            return {
              quantity: i.quantity,
              size: `${i.size}/${i.quantity}`,
              styleNo: i.productCode,
              comments: i.comments,
              color: i.color,
              size_country: i.size_country,
              image: await convertWebPToJPG(i.image),
              refImg: await Promise.all(refImgPromises),
              meshColor: isMeshColorSAS,
              beadingColor: isBeadingColorSAS,
              lining: isLiningTypeSAS,
              liningColor: isLiningColorSAS,
            };
          }),
        );

        // Combine similar items
        const combinedDetails = (details as any[]).reduce(
          (acc: any[], current: any) => {
            const comparisonKey = `${current.styleNo}-${current.meshColor}-${current.beadingColor}-${current.lining}-${current.liningColor}-${current.color}-${current.comments}`;

            const existingItemIndex = acc.findIndex((item: any) => {
              const itemKey = `${item.styleNo}-${item.meshColor}-${item.beadingColor}-${item.lining}-${item.liningColor}-${item.color}-${item.comments}`;
              return itemKey === comparisonKey;
            });

            if (existingItemIndex !== -1) {
              const existingItem = acc[existingItemIndex];

              const totalQuantity =
                Number(existingItem.quantity) + Number(current.quantity);
              existingItem.quantity = totalQuantity;
              existingItem.size = `${existingItem.size}, ${current.size}`;
              existingItem.refImg = [
                ...new Set([...existingItem.refImg, ...current.refImg]),
              ];
              existingItem.image = current.image;
            } else {
              acc.push(current);
            }

            return acc;
          },
          [],
        );

        const preData: any = {
          manufacturingEmailAddress: data.manufacturingEmailAddress,
          orderCancellationDate: data.orderCancellationDate,
          orderReceivedDate: data.orderReceivedDate,
          purchaseOrderNo: data.purchaeOrderNo,
          name: data.retailer_name,
          email: data.retailer_email,
          details: combinedDetails,
          orderType: "Fresh",
          styleNo: fresh.data[0]?.productCode || "",
        };

        setData(preData);

        // console.log("freshOrder???????????", preData);
      } else {
        const stock: any = await getRetailerAdminStockOrderDetails(
          data.Stock_order.id,
          1,
        );

        let productColorSASCheck = await productColorSAS(
          Number(stock.details[0].product_id),
        );

        const isMeshColorSAS =
          stock.details[0].mesh_color === productColorSASCheck.mesh_color
            ? `SAS( ${getColorName(productColorSASCheck.mesh_color)} )`
            : getColorName(stock.details[0].mesh_color);
        const isBeadingColorSAS =
          stock.details[0].beading_color === productColorSASCheck.beading_color
            ? `SAS( ${getColorName(productColorSASCheck.beading_color)} )`
            : getColorName(stock.details[0].beading_color);
        const isLiningTypeSAS =
          stock.details[0].lining === productColorSASCheck.lining
            ? `SAS(${productColorSASCheck.lining})`
            : stock.details[0].lining;
        const isLiningColorSAS =
          stock.details[0].lining_color === productColorSASCheck.lining_color
            ? `SAS( ${getColorName(productColorSASCheck.lining_color)} )`
            : getColorName(stock.details[0].lining_color);

        const preData: any = {
          // customerId: data.customerId,
          // manufacturingEmailAddress: data.retailer_email,
          manufacturingEmailAddress: data.manufacturingEmailAddress,
          orderCancellationDate: data.orderCancellationDate,
          orderReceivedDate: data.received_date,
          orderType: "Stock",
          purchaseOrderNo: data.purchaeOrderNo,
          details: [
            {
              quantity: stock.details[0].quantity,
              size: `${stock.details[0].size}/${stock.details[0].quantity}`,
              styleNo: stock.details[0].productCode,
              color: "Stock",
              size_country: stock.details[0].size_country,
              image: await convertWebPToJPG(stock.details[0]?.image),
              meshColor: isMeshColorSAS,
              beadingColor: isBeadingColorSAS,
              lining: isLiningTypeSAS,
              liningColor: isLiningColorSAS,
            },
          ],
        };

        setData(preData);

        // console.log("stock order||||||||-----------", preData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sent = async () => {
    let res = await Stock({ orderData: previewData });

    if (res.success) {
      toast.success("Email sent successfully");
    } else {
      toast.error("Something went wrong");
    }
    // JSON.stringify
  };

  // console.log(
  //   "stock preview data orderData that is stock-email >>>>>>>>>>>",
  //   previewData,
  // );

  useEffect(() => {
    if (!open) return;
  }, [open]);

  return (
    <div className="my-2 flex gap-4">
      {/*<OrderDetailsSheet orderDetails={data} />*/}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          {data.orderSource == "regular" ? (
            <Button
              variant={"default"}
              className="col-span-2"
              onClick={fetchData}
            >
              Preview PDF <File className="ml-2" />
            </Button>
          ) : (
            <Button
              variant={"default"}
              className="col-span-2"
              onClick={fetchDetails}
            >
              Preview PDF <File className="ml-2" />
            </Button>
          )}
        </SheetTrigger>
        <SheetContent className="min-w-[100%] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Order details PDF Preview</SheetTitle>
            <SheetDescription>
              Preview the Order details PDF that will be sent to the customer
              through mail.
            </SheetDescription>
          </SheetHeader>

          {data.orderSource == "regular" && (
            <>
              {orderDetails === null && <p>Loading...</p>}

              {orderDetails && orderDetails?.success && (
                <>
                  <Button
                    className="mt-8 w-full"
                    onClick={async () => {
                      try {
                        const res = await Stock({
                          orderData: normalOrder,
                        });
                        if (res?.success) {
                          toast("Order details sent successfully", {
                            description:
                              "The order details has been successfully sent to the customer",
                          });
                        } else {
                          toast.error("Something went wrong", {
                            description: "Please try again later",
                          });
                        }
                      } catch (err) {
                        toast.error(
                          "Something went wrong, please try again later",
                          {
                            className: "bg-destructive",
                          },
                        );
                      }
                    }}
                    loading={loading}
                  >
                    {/* store mail */}
                    {/* retailer order mail both this one only */}
                    Send Mail <Mail className="ml-2" />
                  </Button>
                  <div className="flex justify-end py-3">
                    <PDFDownloadLink
                      document={<FreshOrderPdf orderData={normalOrder} />}
                      fileName={`${normalOrder.purchaseOrderNo}.pdf`}
                    >
                      {/* Static content */}
                      <button className="rounded bg-blue-600 px-4 py-2 text-white shadow">
                        Download PDF
                      </button>
                    </PDFDownloadLink>
                  </div>
                  <PDFViewer
                    className={"mt-2 h-full w-full"}
                    showToolbar={false}
                  >
                    <FreshOrderPdf orderData={normalOrder} />
                  </PDFViewer>
                </>
              )}
            </>
          )}

          {data.orderSource == "retailer" && (
            <>
              {previewData && data.orderType !== "Fresh" && (
                <>
                  <Button
                    className="mt-4 w-full"
                    onClick={sent}
                    loading={loading}
                  >
                    {/* Stock Mail */}
                    Mail
                  </Button>
                  <div className="flex justify-end py-3">
                    <PDFDownloadLink
                      document={<FreshOrderPdf orderData={previewData} />}
                      fileName={`${previewData ? previewData.purchaseOrderNo : "as"}.pdf`}
                    >
                      {/* Static content */}
                      <button className="rounded bg-blue-600 px-4 py-2 text-white shadow">
                        Download PDF
                      </button>
                    </PDFDownloadLink>
                  </div>
                  <PDFViewer
                    className={"mt-2 h-full w-full"}
                    showToolbar={false}
                  >
                    <FreshOrderPdf orderData={previewData} />
                  </PDFViewer>
                </>
              )}

              {data && data.orderType == "Fresh" && (
                <>
                  <Button className="w-full" onClick={sent} loading={loading}>
                    {/* Fresh Mail */}
                    Mail
                  </Button>
                  <div className="flex justify-end py-3">
                    <PDFDownloadLink
                      document={<FreshOrderPdf orderData={previewData} />}
                      fileName={`${previewData ? previewData.purchaseOrderNo : "as"}.pdf`}
                    >
                      {/* Static content */}
                      <button className="rounded bg-blue-600 px-4 py-2 text-white shadow">
                        Download PDF
                      </button>
                    </PDFDownloadLink>
                  </div>
                  <PDFViewer
                    className={"mt-2 h-full w-full"}
                    showToolbar={false}
                  >
                    <FreshOrderPdf orderData={previewData} />
                  </PDFViewer>
                </>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
      {/* <Reject
        id={data.id}
        type={data.orderType == "Store" ? "Store" : "retailer"}
      /> */}
    </div>
  );
};

export default TableActions;
