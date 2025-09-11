import { ContentLayout } from "@/components/custom/admin-panel/contentLayout";
import { cookies } from "next/headers";
import { getRetailerDashboardData } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDown, ArrowUp, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const RetailerDashboard = async () => {
  const retailer = (await cookies()).get("retailerId")?.value;

  const dashboardData = await getRetailerDashboardData(Number(retailer));

  // Get currency info from the data
  const currencySymbol =
    dashboardData?.data?.[0]?.currencySymbol ||
    dashboardData?.total?.[0]?.currencySymbol ||
    "€";

  // Format currency with dynamic symbol
  const formatCurrency = (value: any) => {
    return `${currencySymbol} ${Number(value).toLocaleString("en-EU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (!dashboardData || !dashboardData.data) {
    return (
      <p className="py-4 text-center text-gray-500">
        No financial data available
      </p>
    );
  }
  return (
    <ContentLayout title="Dashboard">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <span>Year</span>
                </div>
              </TableHead>
              <TableHead className="text-nowrap font-semibold">
                <div className="flex items-center gap-2">
                  <span>Total Orders</span>
                </div>
              </TableHead>
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <span>Total Bill</span>
                </div>
              </TableHead>
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <span>Paid</span>
                </div>
              </TableHead>
              <TableHead className="text-end font-semibold">
                <div className="flex items-center justify-end gap-2">
                  <span>Balance</span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {dashboardData.data.map((invoice: any) => {
              const balance = Number(invoice.price) - Number(invoice.paid);
              const isPaid = balance <= 0;

              return (
                <TableRow
                  key={invoice.created_year}
                  className="font-medium hover:bg-gray-50"
                >
                  <TableCell>{invoice.created_year}</TableCell>
                  <TableCell>{invoice.orders}</TableCell>
                  <TableCell>{formatCurrency(invoice.price)}</TableCell>
                  <TableCell>{formatCurrency(invoice.paid)}</TableCell>
                  <TableCell className="text-end">
                    <div className="flex items-center justify-end gap-1">
                      <span
                        className={isPaid ? "text-green-600" : "text-red-600"}
                      >
                        {formatCurrency(balance)}
                      </span>
                      {isPaid ? (
                        <ArrowDown className="h-3 w-3 text-green-600" />
                      ) : (
                        <ArrowUp className="h-3 w-3 text-red-600" />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell
                colSpan={5}
                className="bg-gray-50 text-end font-semibold"
              >
                <div className="flex items-center justify-end gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span>Total Balance: </span>
                  <Badge variant="outline" className="text-base font-bold">
                    {dashboardData && formatCurrency(dashboardData.total[0].vv)}
                  </Badge>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </ContentLayout>
  );
};

export default RetailerDashboard;
