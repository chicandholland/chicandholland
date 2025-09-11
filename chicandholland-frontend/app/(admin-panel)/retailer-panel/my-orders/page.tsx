import { ContentLayout } from "@/components/custom/admin-panel/contentLayout";
import CustomSearchBar from "@/components/custom/admin-panel/customSearchBar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAcceptedRetailersOrders, getRetailersOrders } from "@/lib/data";
import { cookies } from "next/headers";
import Details from "./Details";
import RejectedOrders from "./RejectedOrders";
import DeliveredOrders from "./DeliveredOrders";
import CustomPagination from "@/components/custom/admin-panel/customPagination";
import Preview from "../../admin-panel/order-list/Preview";
import DetailOrder from "./DetailOrder";
import { fresh } from "@/lib/utils";
import dayjs from "dayjs";
const page = async (props: {
  searchParams: Promise<Record<string, string>>;
}) => {
  const searchParams = await props.searchParams;
  const retailerId = (await cookies()).get("retailerId")?.value;
  const currentPage = searchParams["cPage"] ? Number(searchParams["cPage"]) : 1;
  const query = searchParams["q"] ? searchParams["q"] : "";
  const acceptedOrders = await getAcceptedRetailersOrders({
    retailerId: Number(retailerId),
    page: currentPage,
    query,
    id: 0,
  });

  const deliverOrders = await getAcceptedRetailersOrders({
    retailerId: Number(retailerId),
    page: currentPage,
    query,
    id: 1,
  });

  const myOrders = await getRetailersOrders({
    retailerId: Number(retailerId),
    page: currentPage,
    isApproved: 3,
  });

  return (
    <ContentLayout title="Order List">
      <div className="mb-2">
        <CustomSearchBar query={query} />
      </div>
      <Tabs defaultValue="accepted" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        <TabsContent value="accepted">
          <Table>
            <TableHeader>
              <TableRow className="text-center">
                <TableHead className="">Date</TableHead>
                <TableHead className="text-nowrap">Order Id</TableHead>
                <TableHead className="text-nowrap">Order Type</TableHead>
                <TableHead className="text-nowrap">Status</TableHead>
                <TableHead className="text-nowrap">Tracking ID</TableHead>
                <TableHead className="text-nowrap">Order Date</TableHead>
                <TableHead className="text-nowrap">Paid</TableHead>
                <TableHead className="text-nowrap">Balance</TableHead>
                <TableHead>Payment Details</TableHead>
                <TableHead>Order Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {acceptedOrders &&
                acceptedOrders.retailerOrders?.map((item: any) => {
                  return (
                    <TableRow className="text-nowrap">
                      <TableCell className="font-medium">
                        {dayjs(item.formatted_date).format("DD-MM-YYYY")}
                      </TableCell>
                      <TableCell>{item.order_id}</TableCell>
                      <TableCell>
                        {item.type == "Fresh" ? fresh : item.type}
                      </TableCell>
                      <TableCell>{item.orderStatus}</TableCell>
                      <TableCell>{item.trackingNo}</TableCell>
                      <TableCell>
                        {dayjs(item.orderReceivedDate).format("DD-MM-YYYY")}
                      </TableCell>
                      <TableCell>
                        {item.currencySymbol
                          ? `${item.currencySymbol} ${parseFloat(item.paid_amount).toFixed(0)}`
                          : `€ ${parseFloat(item.paid_amount).toFixed(0)}`}
                      </TableCell>
                      <TableCell>
                        {item.currencySymbol
                          ? `${item.currencySymbol} ${parseFloat(item.balance).toFixed(0)}`
                          : `€ ${parseFloat(item.balance).toFixed(0)}`}
                      </TableCell>
                      <TableCell>
                        <Details
                          id={
                            item.stockOrderId
                              ? item.stockOrderId
                              : item.favouriteOrderId
                          }
                          retailerId={Number(retailerId)}
                          type={item.type}
                          paymentId={item.payment_id}
                          orderId={item.order_id}
                        />
                      </TableCell>
                      <TableCell>
                        <Preview
                          order={item}
                          type={item.type}
                          id={item.favouriteOrderId || item.stockOrderId}
                        />
                        {/* <DetailOrder
                          retailerId={retailerId}
                          id={item.childId}
                          type={item.type}
                        /> */}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
          <CustomPagination
            currentPage={currentPage}
            totalLength={acceptedOrders?.totalCount}
          />
        </TabsContent>
        <TabsContent value="delivered">
          <DeliveredOrders
            data={deliverOrders.retailerOrders}
            id={Number(retailerId) || 0}
          />
          <CustomPagination
            currentPage={currentPage}
            totalLength={deliverOrders?.totalCount}
          />
        </TabsContent>
        <TabsContent value="rejected">
          <RejectedOrders
            data={myOrders.orders}
            retailerId={Number(retailerId)}
          />
        </TabsContent>
      </Tabs>
    </ContentLayout>
  );
};

export default page;
