"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/custom/button";
import { Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  UpdateOrderStatusForm,
  updateOrderStatusFormSchema,
} from "@/lib/formSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderStatus } from "@/lib/formSchemas";
import useHttp from "@/lib/hooks/usePost";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { getOrderStatusDatesDetails } from "@/lib/data";
import dayjs from "dayjs";
const updateFormSchema = z.object({
  status: z.string().min(1, { message: "Status is required" }),
});

interface dateTypes {
  pattern: string | null;
  beading: string | null;
  stitching: string | null;
  balance_pending: string | null;
  ready_to_delivery: string | null;
  shippingStatus: string | null;
}
const UpdateRetailerOrderStatus = ({ orderData }: { orderData: any }) => {
  const [datesOfStatus, setDateOfStatus] = useState<dateTypes>({
    pattern: "",
    beading: "",
    stitching: "",
    balance_pending: "",
    ready_to_delivery: "",
    shippingStatus: "",
  });

  const [open, setOpen] = useState(false);
  const updateForm = useForm<z.infer<typeof updateFormSchema>>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      status: "", // Ensure it's at least an empty string
    },
  });

  const router = useRouter();
  const { executeAsync: statusChange, loading } = useHttp(
    `retailer-orders/admin/status-update/${orderData.id}`,
    "POST",
  );
  const statusUpdate = async (data: any) => {
    console.log("hello");

    try {
      const tem = ["Shipped"];

      const restrictedStatuses = ["Ready To Delivery"];

      if (restrictedStatuses.includes(data.status)) {
        toast.error("This status cannot be selected.");
        return;
      }

      if (tem.includes(data.status) && orderData.balancePayment !== 0) {
        toast.error("Payment is not paid yet");
        return;
      }

      if (data.status == "Delivered" && data.id == "") {
        return toast.error("Tracking Id is Required");
      }
      const res = await statusChange({
        status: data.status,
      });

      toast.success("Order Status Updated");

      router.refresh();
      setOpen(false);
    } catch (error) {
      toast.error("Error at Order Status Payment");
    }
  };

  const orderStatusArray = Object.entries(OrderStatus).map(
    ([key, value], index: number) => {
      const firstKey =
        (datesOfStatus && Object.keys(datesOfStatus)[index]) || " ";
      return {
        value: key,
        label: value,
        date: (datesOfStatus as Record<string, any>)[firstKey] || null,
      };
    },
  ) as { value: keyof typeof OrderStatus; label: string }[];

  const orderDates = async () => {
    const res = await getOrderStatusDatesDetails(orderData.id);
    setDateOfStatus(res.data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex w-full justify-between gap-2" onClick={orderDates}>
          <div>{orderData.orderStatus}</div>
          {/* <Edit /> */}
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
          <DialogDescription>
            Update Order Status for order: {orderData.purchaeOrderNo}
          </DialogDescription>
        </DialogHeader>

        <Form {...updateForm}>
          <form onSubmit={updateForm.handleSubmit(statusUpdate)}>
            <FormField
              control={updateForm.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the type of this order" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {orderStatusArray.map((status: any) => {
                        return (
                          <SelectItem value={status.label} key={status.value}>
                            <div className="flex w-[350px] justify-between">
                              {status.label}{" "}
                              {status.date && (
                                <span className="text-nowrap text-end">
                                  {dayjs(status.date).format("DD MMM YYYY")}
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className={"mt-4 w-full"} loading={loading}>
              Update
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateRetailerOrderStatus;
