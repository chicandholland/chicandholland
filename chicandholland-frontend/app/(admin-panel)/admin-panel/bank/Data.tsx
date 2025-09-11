// components/admin/bank-details-form.tsx
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
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import useHttp from "@/lib/hooks/usePost";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  bankName: z.string().min(2, "Bank name must be at least 2 characters"),
  accountNumber: z
    .string()
    .min(8, "Account number must be at least 8 characters"),
  accountHolder: z
    .string()
    .min(2, "Account holder name must be at least 2 characters"),
  ifscCode: z
    .string()
    .regex(
      /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
      "Invalid SWIFT code format",
    ),
  address: z.string().min(5, "Bank address must be at least 5 characters"),
});

export const BankDetailsForm = ({
  bank,
  isEdit,
}: {
  bank?: any;
  isEdit: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bankName: "",
      accountNumber: "",
      accountHolder: "",
      ifscCode: "",
      address: "",
    },
  });

  const {
    executeAsync: addBank,
    loading: removeLoading,
    error: postError,
  } = useHttp(`admin-bank`, "POST");

  const { executeAsync: editBank } = useHttp(`admin-bank/${bank?.id}`, "PATCH");
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isEdit) {
        await editBank(values);
        toast.success("Bank Details updated");
      } else {
        await addBank(values);
        toast.success("Bank Details Added");
      }
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("something Went Wrong");
    }
  };

  const dataFill = () => {
    form.setValue("accountHolder", bank.accountHolder);
    form.setValue("accountNumber", bank.accountNumber);
    form.setValue("bankName", bank.bankName);
    form.setValue("ifscCode", bank.ifscCode);
    form.setValue("address", bank.address);
  };
  useEffect(() => {
    if (isEdit && bank) {
      dataFill();
    } else {
      form.reset();
    }
  }, [isEdit, bank, open]);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          {isEdit ? (
            <>
              <Edit /> Edit Bank Details
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" /> Add Bank Details
            </>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {bank ? "Edit Bank Details" : "Add Bank Details"}
          </SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="bankName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter bank name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountHolder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Holder</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter account holder name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter account number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ifscCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Swift Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Swift code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter bank address"
                        {...field}
                        rows={4} // Adjust the number of rows as needed
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                {bank ? "Update" : "Add"} Bank Details
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export const Active = ({ id }: { id: any }) => {
  const {
    executeAsync,
    loading: removeLoading,
    error: postError,
  } = useHttp(`admin-bank/active/${id}`, "PATCH");

  const router = useRouter();
  return (
    <>
      <Button
        variant={"default"}
        onClick={() => {
          executeAsync();
          router.refresh();
        }}
        disabled={removeLoading}
      >
        Make Active
      </Button>
    </>
  );
};

export const DeActive = ({ id }: { id: any }) => {
  const {
    executeAsync,
    loading: removeLoading,
    error: postError,
  } = useHttp(`admin-bank/deactive/${id}`, "PATCH");

  const router = useRouter();
  return (
    <>
      <Button
        variant={"destructive"}
        onClick={() => {
          executeAsync();
          router.refresh();
        }}
        disabled={removeLoading}
      >
        Deactivate
      </Button>
    </>
  );
};

export const DeleteBank = ({ id }: { id: any }) => {
  const {
    executeAsync,
    loading: removeLoading,
    error: postError,
  } = useHttp(`admin-bank/delete/${id}`, "DELETE");

  const router = useRouter();
  const [open, setOpen] = useState(false);

  const submit = () => {
    try {
      executeAsync();
      router.refresh();
      setOpen(false);
      toast.success("Bank Deleted ");
    } catch (error) {}
  };
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive">Delete</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Bank</DialogTitle>
            <DialogDescription>Are you sure you want delete</DialogDescription>
          </DialogHeader>
          <Button
            variant={"destructive"}
            onClick={() => {
              submit();
            }}
            disabled={removeLoading}
          >
            Delete
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};
