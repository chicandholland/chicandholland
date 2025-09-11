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
  ShippingStatus,
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
import { Input } from "@/components/ui/input";
const updateFormSchema = z.object({
  shippingStatus: z.string().optional(),
});
const UpdatingRetailerShippingStatus = ({ orderData }: { orderData: any }) => {
  const [open, setOpen] = useState(false);
  const updateForm = useForm<z.infer<typeof updateFormSchema>>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      shippingStatus: "", // Ensure it's at least an empty string
    },
  });

  const router = useRouter();
  const { executeAsync: statusChange, loading } = useHttp(
    `retailer-orders/admin/status-update/${orderData.id}`,
    "POST",
  );
  const statusUpdate = async (data: any) => {
    try {
      // if (
      //   orderData.orderStatus !== "Ready To Delivery" &&
      //   data.shippingStatus == "Shipped"
      // ) {
      //   toast.error("Change status to move to delivery");
      //   router.refresh();

      //   return;
      // }

      await statusChange({
        shippingStatus: data.shippingStatus,
      });
      toast.success("Order Status Updated");

      router.refresh();
      setOpen(false);
    } catch (error) {
      toast.error("Error at Order Status Payment");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex w-full justify-between gap-2">
          {orderData.shippingStatus} <br></br>
          {orderData.formattedshippingDate &&
            `(${orderData.formattedshippingDate})`}
          {/* <Edit className="!h-[35px] !w-[35px] bg-white p-1" /> */}
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
              name="shippingStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping Status</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ShippingStatus).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
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

export default UpdatingRetailerShippingStatus;
