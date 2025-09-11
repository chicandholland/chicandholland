import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Package, Users, ShoppingCart } from "lucide-react";

export const StatsDisplay = ({ data }: { data: any }) => {
  return (
    <div className="space-y-6 p-4">
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-50 to-white transition-shadow duration-300 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-blue-700">
              Total Orders
            </CardTitle>
            <ShoppingCart className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-blue-900">
              {data.total?.orders?.toLocaleString() || 0}
            </div>
            <p className="mt-1 text-xs text-blue-600">All Time</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-white transition-shadow duration-300 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-green-700">
              Total Quantity
            </CardTitle>
            <Package className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-green-900">
              {data.total?.total_quantity?.toLocaleString() || 0}
            </div>
            <p className="mt-1 text-xs text-green-600">Units Sold</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-white transition-shadow duration-300 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-purple-700">
              Total Customers
            </CardTitle>
            <Users className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-purple-900">
              {data.total?.customers?.toLocaleString() || 0}
            </div>
            <p className="mt-1 text-xs text-purple-600">Unique Buyers</p>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card className="border-none shadow-xl">
        <CardHeader className="rounded-t-lg bg-gray-50">
          <CardTitle className="text-xl font-bold text-gray-800">
            Top 20 Products
          </CardTitle>
          <p className="text-sm text-gray-500">
            Best performing products by quantity
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 transition-colors hover:bg-gray-200">
                <TableHead className="w-[200px] font-semibold text-gray-700">
                  Style No
                </TableHead>
                <TableHead className="text-right font-semibold text-gray-700">
                  Total Qty
                </TableHead>
                <TableHead className="text-right font-semibold text-gray-700">
                  Sizes
                </TableHead>
                <TableHead className="text-right font-semibold text-gray-700">
                  Country
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.productData?.map((product: any, index: number) => (
                <TableRow
                  key={product.product_id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <TableCell className="font-medium text-gray-900">
                    <Badge variant="outline" className="mr-2">
                      #{index + 1}
                    </Badge>
                    {product.product_id}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-gray-800">
                    {product.total_quantity?.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-gray-600">
                      {product.combined_sizes}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary">
                      {product.combined_country}
                    </Badge>
                  </TableCell>
                </TableRow>
              )) || (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-4 text-center text-gray-500"
                  >
                    No product data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
