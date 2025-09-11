"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  getProductColorsCheck,
  getProductColours,
  getRetailerAdminFreshOrderDetails,
  getRetailerAdminStockOrderDetails,
} from "@/lib/data";
import { convertWebPToJPG } from "../request/StockAcceptedForm";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import StockOrdersPdf from "../request/StockOrdersPdf";
import FreshOrderPdf from "../request/FreshOrderPdf";
import useHttp from "@/lib/hooks/usePost";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

const Preview = ({
  id,
  type,
  order,
}: {
  id: number;
  type: string;
  order: any;
}) => {
  const [data, setData] = useState<any>(null);

  const pathname = usePathname();
  const { loading, error, executeAsync } = useHttp(
    "/api/stock-email",
    "POST",
    false,
    true,
  );

  const { executeAsync: frechAsync } = useHttp(
    "/api/fresh-email",
    "POST",
    false,
    true,
  );

  // console.log("orders data", order);

  const productColorSAS = async (id: number) => {
    const res = await getProductColorsCheck(id);
    return res.data; // Returns the standard colors for a specific product ID
  };

  const fetchDetails = async () => {
    try {
      const colours = await getProductColours({});

      let colors = colours.productColours;
      const getColorName = (hexcode: string) =>
        colors.find((colour: any) => colour.hexcode === hexcode)?.name;

      if (type == "Fresh") {
        const fresh = await getRetailerAdminFreshOrderDetails(id, 1);
        const details = await Promise.all(
          fresh.data.map(async (i: any) => {
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
            // Pre-process reference images if they exist
            const refImgPromises = i.reference_image
              ? JSON.parse(i.reference_image).map((item: any) =>
                  convertWebPToJPG(item),
                )
              : [];

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
          // manufacturingEmailAddress: order.manufacturingEmailAddress,
          manufacturingEmailAddress: order.email,
          orderCancellationDate: pathname?.includes("/admin-panel/order-list")
            ? order.orderCancellationDate
            : "",
          orderReceivedDate: order.orderReceivedDate,
          purchaseOrderNo: order.order_id,
          name: order.retailer_name,
          size_country: fresh.data[0]?.size_country,
          orderType: "Fresh",
          email: order.retailer_email,
          details: combinedDetails,
          styleNo: fresh.data[0]?.productCode || "",
        };

        // console.log("fresh order_list mail", preData);
        setData(preData);
      } else {
        const stock: any = await getRetailerAdminStockOrderDetails(id, 1);

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
          // manufacturingEmailAddress: order.retailer_email,
          manufacturingEmailAddress: order.email,
          orderCancellationDate: pathname?.includes("/admin-panel/order-list")
            ? order.orderCancellationDate
            : "",
          orderReceivedDate: order.received_date,
          orderType: "Stock",
          purchaseOrderNo: order.order_id,
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

        // console.log("stock order_list mail", preData);

        setData(preData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const StockEmail = async () => {
    let res = await executeAsync({ orderData: data });

    if (res.success) {
      toast.success("Email sent successfully");
    } else {
      toast.error("Something went wrong");
    }
  };

  const FreshEmail = async () => {
    let res = await frechAsync({ orderData: data });
    if (res.success) {
      toast.success("Email sent successfully");
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button onClick={fetchDetails}>Preview</Button>
        </SheetTrigger>
        <SheetContent className="!min-w-[90%] !max-w-[90%] overflow-y-auto">
          <SheetHeader></SheetHeader>

          {!data && <p className="text-lg">Loading...</p>}
          {data && type !== "Fresh" && (
            <>
              {pathname?.includes("/admin-panel/order-list") && (
                <Button className="mt-4 w-full" onClick={StockEmail}>
                  {/* stock mail */}
                  Mail
                </Button>
              )}
              <div className="flex justify-end py-3">
                <PDFDownloadLink
                  document={<FreshOrderPdf orderData={data} />}
                  fileName={`${data.purchaseOrderNo}.pdf`}
                >
                  {/* Static content */}
                  <button className="rounded bg-blue-600 px-4 py-2 text-white shadow">
                    Download PDF
                  </button>
                </PDFDownloadLink>
              </div>
              <PDFViewer className={"mt-2 h-full w-full"} showToolbar={false}>
                <FreshOrderPdf orderData={data} />
              </PDFViewer>
            </>
          )}

          {data && type == "Fresh" && (
            <>
              {pathname?.includes("/admin-panel/order-list") && (
                <Button className="w-full" onClick={FreshEmail}>
                  {/* fresh mail */}
                  Mail
                </Button>
              )}
              <div className="flex justify-end py-3">
                <PDFDownloadLink
                  document={<FreshOrderPdf orderData={data} />}
                  fileName={`${data.purchaseOrderNo}.pdf`}
                >
                  {/* Static content */}
                  <button className="rounded bg-blue-600 px-4 py-2 text-white shadow">
                    Download PDF
                  </button>
                </PDFDownloadLink>
              </div>
              <PDFViewer className={"mt-2 h-full w-full"} showToolbar={false}>
                <FreshOrderPdf orderData={data} />
              </PDFViewer>
            </>
          )}
          <SheetFooter>
            <SheetClose asChild></SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Preview;
