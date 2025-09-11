import { ContentLayout } from "@/components/custom/admin-panel/contentLayout";
import { getProductColours, getStock } from "@/lib/data";
import CustomSearchBar from "@/components/custom/admin-panel/customSearchBar";
import CustomPagination from "@/components/custom/admin-panel/customPagination";
import { cookies } from "next/headers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StyleNoImage from "@/app/(admin-panel)/admin-panel/stock/StyleNoImage";
import PlaceOrder from "@/components/custom/retailer-panel/PlaceOrder";
import TableActions from "../../admin-panel/stock/TableActions";

const Inventory = async (props: {
  searchParams: Promise<Record<string, string>>;
}) => {
  const searchParams = await props.searchParams;
  const currentPage = searchParams["cPage"] ? Number(searchParams["cPage"]) : 1;
  const query = searchParams["q"] ? searchParams["q"] : "";

  // Get retailer's currency from cookies
  const currencyId = (await cookies()).get("currencyId")?.value;

  const stock = await getStock({
    page: currentPage,
    query,
    currencyId: currencyId ? Number(currencyId) : undefined,
  });
  const colours = await getProductColours({});

  const getColourBasedOnhex = (id: string) => {
    return colours.productColours.find((colour: any) => colour.hexcode === id)
      ?.name;
  };

  return (
    <ContentLayout title="Inventory">
      <div className="space-y-2">
        <CustomSearchBar query={query} />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 2xl:grid-cols-6">
          {stock.stock?.map((item: any) => {
            if (item.quantity < 1) {
              return;
            }

            if (!item.product) {
              return;
            }

            return (
              <div
                key={item.id}
                className="flex flex-col rounded-lg border shadow-md transition-shadow hover:shadow-lg"
              >
                {/* <div className="h-[60%]">
                    <StyleNoImage details={item} />
                  </div> */}

                <div className="aspect-[5/8] w-full overflow-hidden">
                  <StyleNoImage details={item} />
                </div>

                {/* <StyleNoImage details={item} /> */}

                {/* Improved Details Section */}
                <div className="flex flex-1 flex-col p-3">
                  {/* Price and Quantity Row */}
                  <div className="mb-2 flex items-center justify-between">
                    <span className="max-w-[45%] truncate rounded-md bg-gray-100 px-2 py-1 text-sm font-medium">
                      Qty: {item.quantity}
                    </span>
                    <div className="flex flex-shrink-0 items-baseline gap-1.5">
                      <span
                        className={`text-sm ${
                          item.price !== item.discountedPrice &&
                          "text-gray-400 line-through"
                        }`}
                      >
                        {item.currencySymbol || "€"}
                        {item.price}
                      </span>
                      {item.price !== item.discountedPrice && (
                        <span className="font-semibold text-green-600">
                          {item.currencySymbol || "€"}
                          {item.discountedPrice}
                          <span className="ml-1 text-xs">
                            (-{item.discount}%)
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product Details Table */}
                  <div className="mt-1 flex-1 border-t pt-2 text-gray-700">
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Size</TableCell>
                          <TableCell>
                            {item.size} ({item.size_country})
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Color</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <p
                                className="h-5 w-5 rounded-full"
                                style={{
                                  backgroundColor: item.mesh_color,
                                }}
                              ></p>
                              {item.mesh_color == item.product.mesh_color
                                ? `SAS( ${getColourBasedOnhex(item.product.mesh_color)} )`
                                : getColourBasedOnhex(item.mesh_color)}
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <TableActions
                  data={item}
                  colours={colours.productColours}
                  edit={false}
                  placeOrder={true}
                />
              </div>
            );
          })}
        </div>
        <CustomPagination
          currentPage={currentPage}
          totalLength={stock?.totalCount}
        />
      </div>
    </ContentLayout>
  );
};

export default Inventory;
