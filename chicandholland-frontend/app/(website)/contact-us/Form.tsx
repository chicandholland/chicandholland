"use client";

import { ContactUsForm, contactUsFormSchema } from "@/lib/formSchemas";
import useHttp from "@/lib/hooks/usePost";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { PhoneInput } from "@/components/custom/phone-input";

const ContactForm = () => {
  const form = useForm<ContactUsForm>({
    resolver: zodResolver(contactUsFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      subject: "",
      // location: "",
      message: "",
      country: "",
      state: "",
    },
  });

  const { executeAsync, loading } = useHttp(`contactus`);

  const onSubmit = async (data: ContactUsForm) => {
    try {
      const response = await executeAsync(data, {}, (error) => {
        return toast.error("Failed to submit form, please try again");
      });

      form.reset();
      toast.success(response.message ?? "Form submitted successfully", {
        description:
          "We have received your message and will get back to you ASAP",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit form, please try again");
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
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
                <Input placeholder="johndoe@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel className="text-left">Phone Number</FormLabel>
              <FormControl className="w-full">
                <PhoneInput
                  placeholder="Enter a phone number"
                  {...field}
                  defaultCountry="NL"
                />
              </FormControl>
              <FormDescription className="text-left">
                Enter a phone numbers
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input placeholder="Subject" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input placeholder="Country" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <FormControl>
                <Input placeholder="State" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/*<FormField*/}
        {/*  control={form.control}*/}
        {/*  name="location"*/}
        {/*  render={({ field }) => (*/}
        {/*    <FormItem>*/}
        {/*      <FormLabel>Location</FormLabel>*/}
        {/*      <FormControl>*/}
        {/*        <Input placeholder="Location" {...field} />*/}
        {/*      </FormControl>*/}
        {/*      <FormMessage />*/}
        {/*    </FormItem>*/}
        {/*  )}*/}
        {/*/>*/}

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea placeholder="Message" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-12">
          <Button type="submit" className="mt-4 w-full" disabled={loading}>
            {loading ? "Loading..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ContactForm;
