"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

const OrderDetailsSheet = ({ orderDetails }: { orderDetails: any }) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant={"secondary"}>View More Details</Button>
      </SheetTrigger>
      <SheetContent className="min-w-[100%] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Order Details</SheetTitle>
          <SheetDescription>Order details are shown here.</SheetDescription>
        </SheetHeader>

        <div className={"mt-8 flex flex-col gap-2"}>
          <div className={"flex flex-col gap-0.5"}>
            <h3 className={"text-lg font-semibold"}>Customer Name:</h3>
            <p>{orderDetails.customer?.name}</p>
          </div>
          <div className={"flex flex-col gap-0.5"}>
            <h3 className={"text-lg font-semibold"}>Purchase Order No:</h3>
            <p>{orderDetails.purchaeOrderNo}</p>
          </div>
          <div className={"flex flex-col gap-0.5"}>
            <h3 className={"text-lg font-semibold"}>Manufacturing Email:</h3>
            <p>{orderDetails.manufacturingEmailAddress}</p>
          </div>
          <div className={"flex flex-col gap-0.5"}>
            <h3 className={"text-lg font-semibold"}>Order Type:</h3>
            <p>{orderDetails.orderType}</p>
          </div>
          <div className={"flex flex-col gap-0.5"}>
            <h3 className={"text-lg font-semibold"}>Order Received date:</h3>
            <p>
              {dayjs(orderDetails.orderReceivedDate).format("MMMM D, YYYY")}
            </p>
          </div>
          <div className={"flex flex-col gap-0.5"}>
            <h3 className={"text-lg font-semibold"}>Order Shipping date:</h3>
            <p>
              {dayjs(orderDetails.orderCancellationDate).format("MMMM D, YYYY")}
            </p>
          </div>
          <div className={"flex flex-col gap-0.5"}>
            <h3 className={"text-lg font-semibold"}>Address:</h3>
            <p>{orderDetails.address}</p>
          </div>
          <div className={"flex flex-col gap-0.5"}>
            <h3 className={"text-lg font-semibold"}>Styles:</h3>
            <div className={"space-y-2 p-3"}>
              {orderDetails.styles.map((style: any) => (
                <div
                  key={style.id}
                  className={"flex flex-col gap-1 border border-primary p-2"}
                >
                  <div className={"flex flex-col gap-0.5"}>
                    <h3 className={"text-lg font-semibold"}>Style No:</h3>
                    <Link
                      href={`/product/${style.product?.id}`}
                      className={"text-blue-500"}
                      target={"_blank"}
                    >
                      {style.styleNo}
                    </Link>
                  </div>
                  <div className={"flex flex-col gap-0.5"}>
                    <h3 className={"text-lg font-semibold"}>Color:</h3>
                    <p>
                      {style.colorType == "Custom"
                        ? style.customColor.join(", ")
                        : style.colorType}
                    </p>
                  </div>
                  <div className={"flex flex-col gap-0.5"}>
                    <h3 className={"text-lg font-semibold"}>
                      Size ({style.sizeCountry}):
                    </h3>
                    <p>
                      {style.size == "Custom"
                        ? style.customSize.join(", ")
                        : style.size}
                    </p>
                  </div>
                  <div className={"flex flex-col gap-0.5"}>
                    <h3 className={"text-lg font-semibold"}>Quantity:</h3>
                    <p>{style.quantity}</p>
                  </div>
                  {style.comments && (
                    <div className={"flex flex-col gap-0.5"}>
                      <h3 className={"text-lg font-semibold"}>Comments:</h3>
                      {/*<p>{style.quantity}</p>*/}
                      {style.comments.map((comment: any, i: number) => (
                        <p key={i}>{comment}</p>
                      ))}
                    </div>
                  )}
                  {style.photoUrl && (
                    <div className={"flex flex-col gap-0.5"}>
                      <h3 className={"text-lg font-semibold"}>
                        Custom Lining Photo:
                      </h3>
                      <Image
                        src={style.photoUrl}
                        alt={style.styleNo}
                        width={128}
                        height={128}
                        className={"h-32 w-32"}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default OrderDetailsSheet;
