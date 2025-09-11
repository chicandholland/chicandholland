"use client";

import { Button } from "@/components/ui/button";
import { IdCard } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ApplyRoleToUserForm,
  applyRoleToUserFormSchema,
} from "@/lib/formSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import useHttp from "@/lib/hooks/usePost";
import { useRouter } from "next/navigation";
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

const ApplyToUser = ({ userRoleData }: { userRoleData: any }) => {
  const [open, setOpen] = useState(false);
  const form = useForm<ApplyRoleToUserForm>({
    resolver: zodResolver(applyRoleToUserFormSchema),
    defaultValues: {
      userId: undefined,
      roleId: userRoleData.userRole.id,
    },
  });


  const { loading, executeAsync } = useHttp("users/user-roles/apply", "PUT");

  const router = useRouter();


  const onSubmit = async (data: ApplyRoleToUserForm) => {
    try {

      const response = await executeAsync(data, {}, (error) => {
        console.error(error);
        // toast.error("Failed to apply role to user", {
        //   description: "Something went wrong! please try again later",
        // });
        return;
      });

      if (response) {
        form.reset();
        setOpen(false);
        toast.success(response.message ?? "Role applied to user successfully");
        router.refresh();
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to apply role to user", {
        description: "Something went wrong! please try again later",
      });
    }
  };

  const onErrors = (errors: any) => {
    toast.error("Failed to apply role", {
      description: "Make sure all fields are filled correctly",
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
          <Button size={"icon"}>
            <IdCard />
          </Button>
      </SheetTrigger>
      <SheetContent className="min-w-[100%] overflow-y-auto md:min-w-[50%] lg:min-w-[35%]">
        <SheetHeader>
          <SheetTitle>
            Apply <b>{userRoleData.userRole.roleName}</b> Role to User
          </SheetTitle>
          <SheetDescription>
            Fill in the form below to apply the{" "}
            <b>{userRoleData.userRole.roleName}</b> role to a user
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            className="mt-8 space-y-2"
            onSubmit={form.handleSubmit(onSubmit, onErrors)}
          >
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the user" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {userRoleData?.users?.users?.map((user: any) => {
                        return (
                          <SelectItem value={user.id.toString()} key={user.id}>
                            {user.username}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Button type="submit" className="mt-4 w-full" disabled={loading}>
                {loading ? "Loading..." : "Create Credentials"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default ApplyToUser;
