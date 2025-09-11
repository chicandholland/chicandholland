"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  Delete,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { memo, useEffect, useRef, useState } from "react";
import { Control, useFieldArray, useForm } from "react-hook-form";
import useHttp from "@/lib/hooks/usePost";
import {
  CreateFreshOrderForm,
  CreateOrderForm,
  createFreshOrderFormSchema,
} from "@/lib/formSchemas";
import { ColorType, OrderType, SizeCountry, sizes } from "@/lib/formSchemas";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Option } from "@/components/custom/multi-selector";
import {
  getLatestRegularOrder,
  getLatestRetailerOrder,
  getProductColorsCheck,
  getProductColours,
  getRetailerAdminFreshOrderDetails,
} from "@/lib/data";
import OrderCustomerPdf from "@/app/(admin-panel)/admin-panel/orders/OrderCustomerPdf";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import FreshOrderPdf from "./FreshOrderPdf";
import { convertWebPToJPG } from "./StockAcceptedForm";
const FreshOrdersAcceptedForm = ({
  customers,
  id,
}: {
  customers: any[];
  id: number;
}) => {
  const [details, setDetails] = useState<any[]>([]);
  const [currencyInfo, setCurrencyInfo] = useState<{
    symbol: string;
    name: string;
  } | null>(null);

  const [open, setOpen] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [total_state, setTotalState] = useState(0);

  const { executeAsync: mailex } = useHttp(
    "/api/manufacturer",
    "POST",
    false,
    true,
  );

  const { loading, error, executeAsync } = useHttp(
    "retailer-orders/admin/accepted/favorites-order",
    "POST",
  );

  const router = useRouter();

  const form = useForm<CreateFreshOrderForm>({
    resolver: zodResolver(createFreshOrderFormSchema),
    defaultValues: {
      // purchaseOrderNo: `CH#${String.fromCharCode(65 + (ordersTotalCount % 26))}${ordersTotalCount + 1}`,
      purchaseOrderNo: `PO#3`,
      manufacturingEmailAddress: "",
      orderReceivedDate: undefined,
      orderCancellationDate: undefined,
      address: "",
      customerId: "",
      advance: 0,
      customization: 0,
      product_amount: 0,
      shipping: 0,
      total_amount: 0,
      estimate: "",
      invoice: "",
      styles: [
        {
          styleNo: "",
          customColor: "",
          size: "",
          quantity: "",
          comments: "",
          customization_p: 0,
          meshColor: "",
          beadingColor: "",
          lining: "",
          liningColor: "",
        },
      ],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "styles",
  });

  const watch = form.watch();

  const fetchData = async () => {
    try {
      const res = await getRetailerAdminFreshOrderDetails(id, 0);
      let data = res.data;

      const latestRegularOrder = await getLatestRegularOrder();
      const latestRetailerOrder = await getLatestRetailerOrder();

      const regularOrderNo = latestRegularOrder.purchaeOrderNo
        ? latestRegularOrder.purchaeOrderNo.split(" ").pop()
        : 0;
      const retailerOrderNo = latestRetailerOrder.purchaeOrderNo
        ? latestRetailerOrder.purchaeOrderNo.split(" ").pop()
        : 0;

      const colours = await getProductColours({});

      let colors = colours.productColours;

      const newPurchaseOrderNo = `PO#${data[0].customer_name.split(" ")[0]} ${Math.max(regularOrderNo, retailerOrderNo) + 1}`;

      const invoice = `INVOICE_${data[0].customer_name.split(" ")[0].slice(0, 2)}${uuidv4().replace(/-/g, "").substring(0, 4)}`;
      const estimate = `EB_${data[0].product_id}${uuidv4().replace(/-/g, "").substring(0, 4)}`;

      form.setValue("purchaseOrderNo", newPurchaseOrderNo);
      form.setValue("customerId", data[0].customer_name);
      form.setValue("manufacturingEmailAddress", "rubyinc@hotmail.com");
      form.setValue("orderReceivedDate", new Date(data[0].orderReceivedDate));
      form.setValue("address", data[0].address);

      const arrayData = data.map((it: any) => {
        let returnValue = {
          styleNo: it.productCode,
          customColor: it.color,
          size: `${it.size} (${it.size_country})`,
          quantity: it.quantity,
          comments: it.comments,
          amount: Number(it.price),
          fav_id: it.fav_id,
          customization_p: 0,
          meshColor:
            it.mesh_color !== "SAS"
              ? colors.find((colour: any) => colour.hexcode === it.mesh_color)
                  ?.name
              : "SAS",
          beadingColor:
            it.beading_color !== "SAS"
              ? colors.find(
                  (colour: any) => colour.hexcode === it.beading_color,
                )?.name
              : "SAS",
          lining: it.lining,
          liningColor:
            it.lining_color !== "SAS"
              ? colors.find((colour: any) => colour.hexcode === it.lining_color)
                  ?.name
              : "SAS",
        };
        return returnValue;
      });

      form.setValue("styles", arrayData);

      let total = 0;
      for (let index = 0; index < data.length; index++) {
        total = Number(total) + Number(data[index]?.total_amount);
      }
      form.setValue("product_amount", total);
      form.setValue("total_amount", total);
      form.setValue("estimate", estimate);
      form.setValue("invoice", invoice);
      setTotalState(total);

      // Set currency information from the first item (all items should have same currency)
      if (data.length > 0 && data[0].currencySymbol) {
        setCurrencyInfo({
          symbol: data[0].currencySymbol,
          name: data[0].currencyName,
        });
      }

      setDetails(data);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmitFun = async (data: CreateFreshOrderForm) => {
    // convert this formData

    let finalData = details[0] as any;

    const dataSend = {
      id: finalData.id,
      retailerId: finalData.retailerId,
      address: data.address,
      purchaseOrderNo: data.purchaseOrderNo,
      hasId: data.styles.map((i: any) => i.colorType).join(","),
      manufacturingEmailAddress: data.manufacturingEmailAddress,
      orderCancellationDate: data.orderCancellationDate,
      orderReceivedDate: data.orderReceivedDate,
      Size: data.styles.map((i: any) => i.size).join(","),
      size_country: details.map((i) => i.size_country).join(","),
      StyleNo: data.styles.map((i) => i.styleNo).join(","),
      quantity: data.styles.map((i) => i.quantity).join(","),
      total_amount: form.getValues("total_amount"),
      advance: data.advance,
      styles: data.styles,
      shipping: data.shipping,
      estimate: data.estimate,
      invoice: data.invoice,
    };
    try {
      const response = await executeAsync({
        orderData: dataSend,
      });

      if (response.success) {
        const combinedStyles = await Promise.all(
          data.styles.map(async (current, index) => {
            // First get the standard colors for this specific style
            const colours = await getProductColours({});

            let colors = colours.productColours;
            const styleNo = parseInt(details[index].product_id);
            const standardColors = await productColorSAS(styleNo);

            // Clean up size string
            const cleanSize = current.size
              .split("")
              .map((item) => (item.trim() ? item : ""))
              .join("");

            // Compare each color with standard and mark as SAS if matching
            const meshColorDisplay =
              current.meshColor ===
              colors.find(
                (colour: any) => colour.hexcode == standardColors.mesh_color,
              )?.name
                ? `SAS( ${current.meshColor} )`
                : current.meshColor;

            const beadingColorDisplay =
              current.beadingColor ===
              colors.find(
                (colour: any) => colour.hexcode == standardColors.beading_color,
              )?.name
                ? `SAS( ${current.beadingColor} )`
                : current.beadingColor;

            const liningDisplay =
              current.lining === standardColors.lining
                ? `SAS( ${current.lining} )`
                : current.lining;

            const liningColorDisplay =
              current.liningColor ==
              colors.find(
                (colour: any) => colour.hexcode == standardColors.lining_color,
              )?.name
                ? ` SAS( ${current.liningColor} )`
                : current.liningColor;

            // Get current reference images
            const currentRefImages = details[index].reference_image
              ? JSON.parse(details[index].reference_image).map((item: any) =>
                  convertWebPToJPG(item),
                )
              : [];

            // Create comparison key including all properties that should match
            const comparisonKey = `${current.styleNo}-${current.meshColor}-${current.beadingColor}-${current.lining}-${current.liningColor}-${current.customColor}-${current.comments}`;

            // Return the item with necessary properties
            let str = cleanSize;
            let regex = /\((.*?)\)/;
            let match: any = regex.exec(str);
            let valueInBraces = match ? match[1] : "";

            return {
              key: comparisonKey,
              quantity: current.quantity,
              size: `${cleanSize.split("(")[0]}/${current.quantity}`,
              size_country: valueInBraces,
              styleNo: current.styleNo,
              comments: current.comments || "", // Ensure comments is always defined
              price: details[index].total_amount,
              color: current.customColor,
              image: await convertWebPToJPG(details[index].image),
              refImg: currentRefImages,
              meshColor: meshColorDisplay,
              beadingColor: beadingColorDisplay,
              lining: liningDisplay,
              liningColor: liningColorDisplay,
            };
          }),
        );

        // Now perform the combination logic on processed items
        const reduced = combinedStyles.reduce((acc: any[], item) => {
          // Find existing item with same properties
          const existingItemIndex = acc.findIndex(
            (existing) => existing.key === item.key,
          );

          if (existingItemIndex !== -1) {
            // Update existing item
            const existingItem = acc[existingItemIndex];
            const totalQuantity =
              Number(existingItem.quantity) + Number(item.quantity);

            existingItem.quantity = totalQuantity;
            existingItem.size = `${existingItem.size}, ${item.size}`;
            existingItem.price =
              Number(existingItem.price) + Number(item.price);

            // Combine reference images (removing duplicates if desired)
            existingItem.refImg = [
              ...new Set([...existingItem.refImg, ...item.refImg]),
            ];

            // Keep the latest image
            existingItem.image = item.image;
          } else {
            // Add new item
            acc.push(item);
          }

          return acc;
        }, []);

        // Remove temporary key and prepare final data
        const finalStyles = reduced.map(({ key, ...rest }) => rest);

        const preData = {
          customerId: data.customerId,
          manufacturingEmailAddress: data.manufacturingEmailAddress,
          orderCancellationDate: data.orderCancellationDate,
          orderReceivedDate: data.orderReceivedDate,
          orderType: "Fresh",
          purchaseOrderNo: data.purchaseOrderNo,
          details: finalStyles,
          total: total_state,
        };

        FreshEmail(preData);
      } else {
        return toast.error("Failed to add order");
      }
      // await mailex({ orderData: previewData });
      form.reset();
      setOpen(false);
      toast.success(response.message ?? "Order added successfully");
      setPreviewData(null);
      router.refresh();
    } catch (err) {
      toast.error("Failed to add order", {
        description: error?.message ?? "Something went wrong",
      });
    }
  };

  const productColorSAS = async (id: number) => {
    const res = await getProductColorsCheck(id);
    return res.data; // Returns the standard colors for a specific product ID
  };

  const onPreviewSubmit = async (data: CreateFreshOrderForm) => {
    const combinedStyles = await Promise.all(
      data.styles.map(async (current, index) => {
        // First get the standard colors for this specific style
        const colours = await getProductColours({});

        let colors = colours.productColours;
        const styleNo = parseInt(details[index].product_id);
        const standardColors = await productColorSAS(styleNo);

        // Clean up size string
        const cleanSize = current.size
          .split("")
          .map((item) => (item.trim() ? item : ""))
          .join("");

        // Compare each color with standard and mark as SAS if matching
        const meshColorDisplay =
          current.meshColor ===
          colors.find(
            (colour: any) => colour.hexcode == standardColors.mesh_color,
          )?.name
            ? `SAS( ${current.meshColor} )`
            : current.meshColor;

        const beadingColorDisplay =
          current.beadingColor ===
          colors.find(
            (colour: any) => colour.hexcode == standardColors.beading_color,
          )?.name
            ? `SAS( ${current.beadingColor} )`
            : current.beadingColor;

        const liningDisplay =
          current.lining === standardColors.lining
            ? `SAS( ${current.lining} )`
            : current.lining;

        const liningColorDisplay =
          current.liningColor ==
          colors.find(
            (colour: any) => colour.hexcode == standardColors.lining_color,
          )?.name
            ? ` SAS( ${current.liningColor} )`
            : current.liningColor;

        // Get current reference images
        const currentRefImages = details[index].reference_image
          ? JSON.parse(details[index].reference_image).map((item: any) =>
              convertWebPToJPG(item),
            )
          : [];

        // Create comparison key including all properties that should match
        const comparisonKey = `${current.styleNo}-${current.meshColor}-${current.beadingColor}-${current.lining}-${current.liningColor}-${current.customColor}-${current.comments}`;

        // Return the item with necessary properties
        let str = cleanSize;
        let regex = /\((.*?)\)/;
        let match: any = regex.exec(str);
        let valueInBraces = match ? match[1] : "";

        return {
          key: comparisonKey,
          quantity: current.quantity,
          size: `${cleanSize.split("(")[0]}/${current.quantity}`,
          size_country: valueInBraces,
          styleNo: current.styleNo,
          comments: current.comments || "", // Ensure comments is always defined
          price: details[index].total_amount,
          color: current.customColor,
          image: convertWebPToJPG(details[index].image),
          refImg: currentRefImages,
          meshColor: meshColorDisplay,
          beadingColor: beadingColorDisplay,
          lining: liningDisplay,
          liningColor: liningColorDisplay,
        };
      }),
    );

    // Now perform the combination logic on processed items
    const reduced = combinedStyles.reduce((acc: any[], item) => {
      // Find existing item with same properties
      const existingItemIndex = acc.findIndex(
        (existing) => existing.key === item.key,
      );

      if (existingItemIndex !== -1) {
        // Update existing item
        const existingItem = acc[existingItemIndex];
        const totalQuantity =
          Number(existingItem.quantity) + Number(item.quantity);

        existingItem.quantity = totalQuantity;
        existingItem.size = `${existingItem.size}, ${item.size}`;
        existingItem.price = Number(existingItem.price) + Number(item.price);

        // Combine reference images (removing duplicates if desired)
        existingItem.refImg = [
          ...new Set([...existingItem.refImg, ...item.refImg]),
        ];

        // Keep the latest image
        existingItem.image = item.image;
      } else {
        // Add new item
        acc.push(item);
      }

      return acc;
    }, []);

    // Remove temporary key and prepare final data
    const finalStyles = reduced.map(({ key, ...rest }) => rest);

    const preData = {
      customerId: data.customerId,
      manufacturingEmailAddress: data.manufacturingEmailAddress,
      orderCancellationDate: data.orderCancellationDate,
      orderReceivedDate: data.orderReceivedDate,
      orderType: "Fresh",
      purchaseOrderNo: data.purchaseOrderNo,
      details: finalStyles,
      total: total_state,
    };

    setPreviewData(preData);
  };

  const onErrors = (errors: any) => {
    toast.error("Failed to add order", {
      description: "Make sure all fields are filled correctly",
    });
  };
  const formChange = () => {
    setTimeout(() => {
      let product_total = 0;
      let customization_total = 0;

      if (!watch.styles || !Array.isArray(watch.styles)) {
        console.error("watch.styles is not defined or not an array");
        return;
      }

      for (let index = 0; index < watch.styles.length; index++) {
        const amount = Number(watch.styles[index]?.amount) || 0;
        const customization = Number(watch.styles[index]?.customization_p) || 0;
        const quantity = Number(watch.styles[index]?.quantity) || 0;

        product_total += amount * quantity; // Multiply by quantity
        customization_total += customization * quantity;
      }

      const shipping = Number(form.getValues("shipping")) || 0;

      let wholeTotal = customization_total + product_total + shipping;

      form.setValue("total_amount", wholeTotal);
      form.setValue("customization", customization_total);
      form.setValue("product_amount", product_total);
    }, 200);
  };

  const FreshEmail = async (preData: any) => {
    let res = await mailex({ orderData: preData });
    if (res.success) {
      toast.success("Email sent successfully");
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button onClick={fetchData}>Accept</Button>
        </SheetTrigger>
        <SheetContent className="min-w-[100%] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add New Order</SheetTitle>
            <SheetDescription>
              Fill in the form below to add order
            </SheetDescription>
          </SheetHeader>

          <Form {...form}>
            <form
              className="mt-8 grid grid-cols-1 gap-2 md:grid-cols-3"
              onSubmit={form.handleSubmit(onSubmitFun, onErrors)}
            >
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>

                    {/* @ts-ignore */}
                    <Input placeholder="PO#VICTORIA" {...field} readOnly />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="purchaseOrderNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Order No</FormLabel>
                    <FormControl>
                      <Input placeholder="PO#VICTORIA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estimate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimate No</FormLabel>
                    <FormControl>
                      <Input placeholder="PO#VICTORIA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="invoice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice No</FormLabel>
                    <FormControl>
                      <Input placeholder="PO#VICTORIA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="manufacturingEmailAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manufacturing Email</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="orderReceivedDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2.5">
                    <FormLabel>Order Received Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              dayjs(field.value).format("DD MMMM YYYY")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          disabled
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="orderCancellationDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2.5">
                    <FormLabel>Order Shipping Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              dayjs(field.value).format("DD MMMM YYYY")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="product_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0"
                        {...field}
                        type="number"
                        readOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shipping"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipping Cost</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0"
                        {...field}
                        type="number"
                        onChange={(e: any) => {
                          field.onChange(e);
                          formChange();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Customization</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0"
                        {...field}
                        type="number"
                        readOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="total_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Amount</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0"
                        {...field}
                        type="number"
                        readOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="advance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Advance</FormLabel>
                    <FormControl>
                      <Input placeholder="0" {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className={"md:col-span-3"}>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Amsterdam" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="!mt-4 space-y-2 md:col-span-3">
                <div className="flex items-center justify-between">
                  <Label>Styles</Label>
                </div>
                {fields.map((field, index) => {
                  const watchColorType = form.watch(
                    `styles[${index}].colorType` as any,
                  ) as any;

                  const watchSize = form.watch(
                    `styles[${index}].size` as any,
                  ) as any;

                  const fileRef = form.register(
                    `styles[${index}].modifiedPhotoImage` as any,
                  );

                  return (
                    <Collapsible key={field.id} className="space-y-2">
                      <div className="flex items-center gap-4">
                        <CollapsibleTrigger asChild>
                          <div className="flex w-full flex-1 cursor-pointer justify-between border-2 border-primary p-2">
                            <p>
                              {index + 1}. Style ({currencyInfo?.symbol || "€"}
                              {(Number(watch.styles[index].amount) +
                                Number(watch.styles[index].customization_p)) *
                                Number(watch.styles[index].quantity)}
                              )
                            </p>

                            <ChevronDown />
                          </div>
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent asChild>
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                          <FormField
                            control={form.control}
                            name={`styles[${index}].styleNo` as any}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Style No{" "}
                                  <Link
                                    href={`/products/${details[index].product_id}`}
                                    target="_blank"
                                    className="font-bold text-blue-700"
                                  >
                                    ({details[index].productCode})
                                  </Link>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="PO#VICTORIA"
                                    {...field}
                                    readOnly
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`styles[${index}].customColor` as any}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  <div className="flex items-center gap-1">
                                    <p>Color </p>{" "}
                                  </div>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="PO#VICTORIA"
                                    {...field}
                                    readOnly
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`styles[${index}].meshColor` as any}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  <div className="flex items-center gap-1">
                                    <p>Mesh Color</p>{" "}
                                  </div>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="PO#VICTORIA"
                                    {...field}
                                    readOnly
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`styles[${index}].beadingColor` as any}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  <div className="flex items-center gap-1">
                                    <p>Beading Color </p>{" "}
                                  </div>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="PO#VICTORIA"
                                    {...field}
                                    readOnly
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`styles[${index}].lining` as any}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  <div className="flex items-center gap-1">
                                    <p>Lining </p>{" "}
                                  </div>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="PO#VICTORIA"
                                    {...field}
                                    readOnly
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`styles[${index}].liningColor` as any}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  <div className="flex items-center gap-1">
                                    <p>Lining Color </p>{" "}
                                  </div>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="PO#VICTORIA"
                                    {...field}
                                    readOnly
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`styles[${index}].size` as any}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Size</FormLabel>

                                <FormControl>
                                  <Input placeholder="5" {...field} readOnly />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`styles[${index}].quantity` as any}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Quantity</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="100"
                                    {...field}
                                    readOnly
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`styles[${index}].customization_p` as any}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Customization</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="100"
                                    {...field}
                                    type="number"
                                    defaultValue={0}
                                    onChange={(e: any) => {
                                      const value = e.target.value
                                        ? Number(e.target.value)
                                        : 0;
                                      field.onChange(value);
                                      formChange();
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`styles[${index}].amount` as any}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Amount</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="100"
                                    {...field}
                                    type="number"
                                    onChange={(e: any) => {
                                      field.onChange(e);
                                      formChange();
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`styles.${index}.comments`}
                            render={({ field }) => (
                              <FormItem className={"md:col-span-3"}>
                                <FormLabel>Comments</FormLabel>
                                <FormControl>
                                  <Textarea
                                    readOnly
                                    placeholder="Amsterdam"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
              </div>

              <div className={"mt-4 flex items-center gap-2 md:col-span-3"}>
                <Button
                  type={"button"}
                  className={"flex-1"}
                  variant={"outline"}
                  onClick={form.handleSubmit(onPreviewSubmit)}
                >
                  {" "}
                  Preview Order{" "}
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={loading}
                  onClick={FreshEmail}
                >
                  {loading ? "Loading..." : "Create Order"}
                </Button>
              </div>
            </form>
          </Form>

          {previewData && (
            <>
              <div className="flex justify-end py-3">
                <PDFDownloadLink
                  document={<FreshOrderPdf orderData={previewData} />}
                  fileName={`${previewData.purchaseOrderNo}.pdf`}
                >
                  {/* Static content */}
                  <button className="rounded bg-blue-600 px-4 py-2 text-white shadow">
                    Download PDF
                  </button>
                </PDFDownloadLink>
              </div>
              <PDFViewer className={"mt-2 h-full w-full"} showToolbar={false}>
                <FreshOrderPdf orderData={previewData} />
              </PDFViewer>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default memo(FreshOrdersAcceptedForm);
