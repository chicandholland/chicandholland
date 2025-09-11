// app/admin/bank-details/page.tsx
import { ContentLayout } from "@/components/custom/admin-panel/contentLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { AlertCircle, Building, Plus } from "lucide-react";
import { Active, BankDetailsForm, DeActive, DeleteBank } from "./Data";
import { getAdminBankDetails } from "@/lib/data";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Item } from "@radix-ui/react-navigation-menu";
// Mock data - in real app, this would come from a database

interface BankDetail {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  ifscCode: string;
}

export default async function page() {
  const banks = await getAdminBankDetails();

  return (
    <ContentLayout title="Bank Details">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">Bank Account</h2>
          </div>

          <BankDetailsForm isEdit={false} />
        </div>

        {/* Bank Details Card */}
        <div className="grid gap-4 md:grid-cols-2">
          {!banks.data ? (
            <Alert variant="default" className="col-span-full bg-gray-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-muted-foreground">
                No bank details added yet. Please add your bank account
                information.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {banks.data.map((item: any) => {
                return (
                  <Card key={item.id} className="shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Building className="h-5 w-5 text-primary" />
                        {item.bankName}
                        {item.isActive == 1 && (
                          <p className="h-6 w-6 rounded-full bg-green-500"></p>
                        )}
                      </CardTitle>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 items-center gap-2">
                          <span className="font-medium text-gray-500">
                            Account Holder:
                          </span>
                          <span className="font-semibold">
                            {item.accountHolder}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 items-center gap-2">
                          <span className="font-medium text-gray-500">
                            Account Number:
                          </span>
                          <span className="font-semibold">
                            {item.accountNumber}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 items-center gap-2">
                          <span className="font-medium text-gray-500">
                            Swift Code:
                          </span>
                          <span className="font-semibold">{item.ifscCode}</span>
                        </div>
                        <div className="grid grid-cols-2 items-center gap-2">
                          <span className="font-medium text-gray-500">
                            Address:
                          </span>
                          <span className="font-semibold">{item.address}</span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="border-t pt-4">
                      <div className="flex w-full justify-between">
                        <BankDetailsForm bank={item} isEdit={true} />
                        {item.isActive == 0 ? (
                          <Active id={item.id} />
                        ) : (
                          <DeActive id={item.id} />
                        )}
                        <DeleteBank id={item.id} />
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </>
          )}
        </div>
      </div>
    </ContentLayout>
  );
}
