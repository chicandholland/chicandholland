"use client";

import React, { useState } from "react";
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
import { getOrderStatusDatesStockDetails } from "@/lib/data";
import dayjs from "dayjs";
interface dateTypes {
  pattern: string | null;
  beading: string | null;
  stitching: string | null;
  ready_to_delivery: string | null;
}
const UpdateOrderStatus = ({ orderData }: { orderData: any }) => {
  const [open, setOpen] = useState(false);
  const [datesOfStatus, setDateOfStatus] = useState<dateTypes>({
    pattern: "",
    beading: "",
    stitching: "",
    ready_to_delivery: "",
  });

  const form = useForm<UpdateOrderStatusForm>({
    resolver: zodResolver(updateOrderStatusFormSchema),
    defaultValues: {
      status: orderData.orderStatus,
    },
  });

  const { loading, error, executeAsync } = useHttp("orders/orderStatus", "PUT");

  const router = useRouter();

  const onSubmit = async (values: UpdateOrderStatusForm) => {
    try {
      const restrictedStatuses = ["Ready To Delivery"];

      if (restrictedStatuses.includes(values.status)) {
        toast.error("This status cannot be selected.");
        return;
      }

      const response = await executeAsync(
        {
          orderId: orderData.id,
          status: values.status,
        },
        {},
        (error) => {
          return toast.error("Failed to update order status", {
            description: error?.message ?? "Something went wrong",
          });
        },
      );

      if (!response.success) {
        return toast.error("Failed to update order status");
      }

      form.reset();
      form.setValue("status", "");
      setOpen(false);
      toast.success(response.message ?? "Order status updated successfully");
      router.refresh();
    } catch (err) {
      toast.error("Failed to update order status", {
        description: error?.message ?? "Something went wrong",
      });
    }
  };

  const orderStatusArray = Object.entries(OrderStatus).map(
    ([key, value], index: number) => {
      const firstKey = Object.keys(datesOfStatus || {})[index];
      return {
        value: key,
        label: value,
        date: (datesOfStatus as Record<string, any>)[firstKey] || null,
      };
    },
  ) as { value: keyof typeof OrderStatus; label: string }[];

  const orderDates = async () => {
    const res = await getOrderStatusDatesStockDetails(orderData.id);
    setDateOfStatus(res.data);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>{orderData.orderStatus}</div>
        {/* <Button variant={"outline"} size={"icon"} onClick={orderDates}> */}
        {/* <Edit /> */}
        {/* </Button> */}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
          <DialogDescription>
            Update Order Status for order: {orderData.purchaeOrderNo}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
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

export default UpdateOrderStatus;
