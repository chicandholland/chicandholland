"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  AddProductColourForm,
  addProductColourFormSchema
} from "@/lib/formSchemas";
import useHttp from "@/lib/hooks/usePost";

const AddProductColoursForm = () => {
  const [open, setOpen] = useState(false);

  const form = useForm<AddProductColourForm>({
    resolver: zodResolver(addProductColourFormSchema),
    defaultValues: {
      colours: [{ name: "", hexcode: "#000000" }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    name: "colours",
    control: form.control
  });

  const { loading, error, executeAsync } = useHttp("product-colours");

  const router = useRouter();

  const onSubmit = async (data: AddProductColourForm) => {
    try {
      const response = await executeAsync(data, {}, (error) => {
        return toast.error("Failed to add colours" , {
          description: error?.message
        });
      });

      form.reset();
      setOpen(false);
      toast.success(response.message ?? "Colours added successfully");
      router.refresh();
    } catch (err) {
      // toast.error("Failed to add colours", {
      //   description: error?.message
      // });
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          Add New Colours <Plus />
        </Button>
      </SheetTrigger>
      <SheetContent className="min-w-[100%] overflow-y-auto md:min-w-[50%] lg:min-w-[35%]">
        <SheetHeader>
          <SheetTitle>Add New Colours</SheetTitle>
          <SheetDescription>
            Fill in the form below to add colours
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            className="mt-8 space-y-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {fields.map((item, index) => (
              <div key={item.id} className="space-y-2">
                <FormField
                  control={form.control}
                  name={`colours.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Colour Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Red" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`colours.${index}.hexcode`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Colour Hex Code</FormLabel>
                      <FormControl>
                        <Input
                          type="color"
                          {...field}
                          value={field.value || "#000000"}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {index > 0 && (
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    className="mt-2"
                    variant="destructive"
                  >
                    Remove Colour
                  </Button>
                )}
              </div>
            ))}

            <div>
              <Button
                type="button"
                onClick={() => append({ name: "", hexcode: "#000000" })}
                className="mt-4 w-full"
                variant={"outline"}
              >
                Add Another Colour
              </Button>
            </div>

            <div>
              <Button type="submit" className="mt-2 w-full" disabled={loading}>
                {loading ? "Loading..." : "Add Colours"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default AddProductColoursForm;
