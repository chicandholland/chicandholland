"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  AddCustomerForm as AddCustomerFormType,
  addCustomerFormSchema,
} from "@/lib/formSchemas";
import useHttp from "@/lib/hooks/usePost";
import { AutocompleteCustom } from "@/components/custom/SearchLocations";

const EditCustomerForm = ({
  previousData,
  countries,
  currencies,
}: {
  previousData: any;
  countries: any[];
  currencies: any[];
}) => {
  const [open, setOpen] = useState(false);

  const form = useForm<AddCustomerFormType>({
    resolver: zodResolver(addCustomerFormSchema),
    defaultValues: {
      name: "",
      storeName: "",
      proximity: "",
      address: "",
      coordinates: {
        latitude: "",
        longitude: "",
      },
      website: "",
      contactPerson: "",
      email: "",
      phoneNumber: "",
      country_id: "",
      currency_id: "",
    },
  });

  const { loading, error, executeAsync } = useHttp(
    `customers/${previousData.id}`,
    "PUT",
  );

  const router = useRouter();

  const onSubmit = async (data: AddCustomerFormType) => {
    try {
      const response = await executeAsync(data);

      form.reset();
      setOpen(false);
      toast.success(response.message);
      router.refresh();
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to edit customer", {
        description: error.message || "An unexpected error occurred"
      });
    }
  };

  useEffect(() => {
    form.reset({
      name: previousData.name,
      storeName: previousData.storeName,
      proximity: previousData?.client?.proximity.toString(),
      address: previousData?.client?.address,
      coordinates: {
        latitude: previousData?.client?.latitude,
        longitude: previousData?.client?.longitude,
      },
      city_name: previousData?.client?.city_name,
      website: previousData.website,
      contactPerson: previousData.contactPerson,
      email: previousData.email,
      phoneNumber: previousData.phoneNumber,
      country_id: previousData?.countryId
        ? previousData.countryId.toString()
        : "",
      currency_id: previousData?.currencyId
        ? previousData.currencyId.toString()
        : "",
    });
  }, [previousData]);

  const onChange = async (place: google.maps.places.PlaceResult | null) => {
    if (!place) return;

    if (!place.geometry?.location || !place.formatted_address) {
      return;
    }

    form.setValue("address", place?.formatted_address);

    const latitude = place?.geometry?.location?.lat();
    const longitude = place?.geometry?.location?.lng();

    form.setValue("coordinates", {
      latitude: latitude.toString(),
      longitude: longitude.toString(),
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size={"icon"} variant={"outline"}>
          <Edit />
        </Button>
      </SheetTrigger>
      <SheetContent className="min-w-[100%] overflow-y-auto md:min-w-[50%] lg:min-w-[35%]">
        <SheetHeader>
          <SheetTitle>Edit Customer</SheetTitle>
          <SheetDescription>
            Fill in the form below to edit the customer
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            className="mt-8 space-y-2"
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.log(errors);
              toast.error("Invalid form data", {
                description: "Please fill in all the required fields",
              });
            })}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="storeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Rainbow Store" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AutocompleteCustom
              onPlaceSelect={onChange}
              placeholder={"Select Address of the Customer"}
              label={"Address of the Customer"}
              defaultValue={previousData?.client?.address}
            />

            <FormField
              control={form.control}
              name="city_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter city name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem
                          key={country.id.toString()}
                          value={country.id.toString()}
                        >
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the Country where this customer is located.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currency_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem
                          key={currency.id.toString()}
                          value={currency.id.toString()}
                        >
                          <div className="flex items-center gap-2">
                            <span>{currency.name}</span>
                            <span className="text-xs text-gray-500">
                              ({currency.code})
                            </span>
                            <span className="text-xs font-medium text-blue-600">
                              {currency.symbol}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the Currency for this customer. This will determine pricing on product pages.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="proximity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proximity (in miles)</FormLabel>
                  <FormControl>
                    <Input placeholder="5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://rainbowstore.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactPerson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person</FormLabel>
                  <FormControl>
                    <Input placeholder="Chiron" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="rainbowstore@olympians.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="971841878487" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <Button type="submit" className="mt-4 w-full" disabled={loading}>
                {loading ? "Loading..." : "Edit Customer"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default EditCustomerForm;
