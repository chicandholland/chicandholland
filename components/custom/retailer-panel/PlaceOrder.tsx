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
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { getProductColours, getStockByProductId } from "@/lib/data";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Input } from "@/components/ui/input";
import useHttp from "@/lib/hooks/usePost";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const placeOrderFormSchema = z.object({
  quantity: z.string(),
});
export type PlaceOrderForm = z.infer<typeof placeOrderFormSchema>;

const retailerIdCookie = document.cookie
  .split(";")
  .find((c) => c.trim().startsWith("retailerId="));
const retailerId = retailerIdCookie?.split("=")[1];

const currencyIdCookie = document.cookie
  .split(";")
  .find((c) => c.trim().startsWith("currencyId="));
const currencyId = currencyIdCookie?.split("=")[1];

const PlaceOrder = ({
  stockId,
  quantity,
}: {
  stockId: number;
  quantity: number;
}) => {
  const [open, setOpen] = useState(false);
  const [stockDetails, setStockDetails] = useState([]);
  const [availableQuantity, setAvailableQuantity] = useState<number | null>(
    quantity,
  );

  const form = useForm<PlaceOrderForm>({
    resolver: zodResolver(placeOrderFormSchema),
    defaultValues: {
      quantity: "",
    },
  });

  const { handleSubmit, control, reset, getValues } = form;

  const { loading, executeAsync } = useHttp(
    `retailer-orders/stock/${retailerId}/${stockId}/${getValues("quantity")}`,
    "POST",
  );

  const router = useRouter();

  const onSubmit = async (data: PlaceOrderForm) => {
    try {
      if (Number(getValues("quantity")) > quantity) {
        return;
      }
      const response = await executeAsync({
        currencyId: currencyId ? Number(currencyId) : null,
      });

      if (response.success) {
        reset();
        setOpen(false);
        toast.success(response.message ?? "Order placed successfully");
        router.push("/retailer-panel/pending-orders");
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button className="w-full">
            <ShoppingBag className={"mr-2"} />
            Place Order
          </Button>
        </SheetTrigger>
        <SheetContent className="min-w-[100%] overflow-y-auto md:min-w-[50%] lg:min-w-[35%]">
          <SheetHeader>
            <SheetTitle>
              {stockDetails.length
                ? "Purchase From Stock"
                : "Place Fresh Order"}
            </SheetTitle>
            <SheetDescription>
              Fill in the form below to{" "}
              {stockDetails.length
                ? "purchase from stock"
                : "place a fresh order"}
              .
            </SheetDescription>
          </SheetHeader>

          <Form {...form}>
            <form
              className="mt-8 space-y-2"
              onSubmit={handleSubmit(onSubmit, (errors) => {
                console.log(errors);
              })}
            >
              <FormField
                control={control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={Number(quantity)}
                        placeholder="1"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Maximum quantity available: {quantity || 0}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <Button
                  type="submit"
                  className="mt-4 w-full"
                  disabled={loading || !availableQuantity}
                >
                  {/*{loading ? "Placing order..." : "Place Order"}*/}
                  {availableQuantity
                    ? loading
                      ? "Placing order..."
                      : "Place Order"
                    : "No stock available"}
                </Button>
              </div>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default PlaceOrder;
