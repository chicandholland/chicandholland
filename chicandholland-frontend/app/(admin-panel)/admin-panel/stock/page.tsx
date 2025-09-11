import { ContentLayout } from "@/components/custom/admin-panel/contentLayout";
import AddStockForm from "./AddStockForm";
import {
  getProductColours,
  getProductsCodes,
  getStock,
  getCurrencies,
} from "@/lib/data";
import CustomSearchBar from "@/components/custom/admin-panel/customSearchBar";
import CustomPagination from "@/components/custom/admin-panel/customPagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableActions from "./TableActions";
import StyleNoImage from "@/app/(admin-panel)/admin-panel/stock/StyleNoImage";
import { Euro } from "lucide-react";
import ExpandStockDetails from "./ExpandStockDetails";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Stock = async (props: {
  searchParams: Promise<Record<string, string>>;
}) => {
  const searchParams = await props.searchParams;
  const currentPage = searchParams["cPage"] ? Number(searchParams["cPage"]) : 1;
  const query = searchParams["q"] ? searchParams["q"] : "";

  const stock = await getStock({
    page: currentPage,
    query,
  });
  const colours = await getProductColours({});
  const currencies = await getCurrencies();

  const getColourBasedOnhex = (id: string) => {
    return colours.productColours.find((colour: any) => colour.hexcode === id)
      ?.name;
  };

  return (
    <ContentLayout title="Stock">
      <div className="flex flex-col gap-8">
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-xl md:text-2xl">Stock data</h1>
          {/* <AddCustomerForm /> */}

          <AddStockForm
            colours={colours.productColours}
            currencies={currencies.currencies}
          />
        </div>

        <div className="space-y-2">
          <CustomSearchBar query={query} />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 4xl:grid-cols-7">
            {stock.stock?.map((item: any) => {
              if (!item.product) return null;
              return (
                <div
                  key={item.id}
                  className="flex flex-col rounded-lg border shadow-md transition-shadow hover:shadow-lg"
                >
                  {/* <div className="h-[50%]">
                    <StyleNoImage details={item} />
                  </div> */}

                  <div className="aspect-[5/8] w-full overflow-hidden">
                    <StyleNoImage details={item} />
                  </div>

                  {/* <div className="aspect-[4/6] w-full overflow-hidden">
                    <StyleNoImage details={item} />
                  </div> */}

                  {/* Improved Details Section */}
                  <div className="flex flex-1 flex-col p-3">
                    {/* Price and Quantity Row */}

                    {/* old */}
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
                          €{item.price}
                        </span>
                        {item.price !== item.discountedPrice && (
                          <span className="font-semibold text-green-600">
                            €{item.discountedPrice}
                            <span className="ml-1 text-xs">
                              (-{item.discount}%)
                            </span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-1 flex-1 border-t pt-2 text-gray-700">
                      {/* show all dailog box */}
                      {/* <Dialog>
                        <DialogTrigger>
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-3 w-full"
                          >
                            Show All
                          </Button>
                        </DialogTrigger>

                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Stock Details</DialogTitle>
                          </DialogHeader>

                          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="flex justify-center">
                              <img
                                className="aspect-square rounded-lg object-cover shadow-md"
                                src={item.images.name}
                                alt="Product Preview"
                                width={250}
                              />
                            </div>

                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-medium">
                                    Qty
                                  </TableCell>
                                  <TableCell>{item.quantity}</TableCell>
                                </TableRow>

                                <TableRow>
                                  <TableCell className="font-medium">
                                    Price
                                  </TableCell>
                                  <TableCell>
                                    <span
                                      className={`text-sm ${
                                        item.price !== item.discountedPrice &&
                                        "text-gray-400 line-through"
                                      }`}
                                    >
                                      €{item.price}
                                    </span>
                                    {item.price !== item.discountedPrice && (
                                      <span className="ml-2 font-semibold text-green-600">
                                        €{item.discountedPrice}{" "}
                                        <span className="text-xs">
                                          (-{item.discount}%)
                                        </span>
                                      </span>
                                    )}
                                  </TableCell>
                                </TableRow>

                                <TableRow>
                                  <TableCell className="font-medium">
                                    Size
                                  </TableCell>
                                  <TableCell>
                                    {item.size} ({item.size_country})
                                  </TableCell>
                                </TableRow>

                                <TableRow>
                                  <TableCell className="font-medium">
                                    Mesh Color
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <div
                                        className="h-5 w-5 rounded-full"
                                        style={{
                                          backgroundColor: item.mesh_color,
                                        }}
                                      />
                                      <span>
                                        {item.mesh_color ===
                                        item.product?.mesh_color
                                          ? `SAS(${getColourBasedOnhex(item.product?.mesh_color)})`
                                          : getColourBasedOnhex(
                                              item.mesh_color,
                                            )}
                                      </span>
                                    </div>
                                  </TableCell>
                                </TableRow>

                              
                                <TableRow>
                                  <TableCell className="font-medium">
                                    Beading Color
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <div
                                        className="h-5 w-5 rounded-full"
                                        style={{
                                          backgroundColor: item.beading_color,
                                        }}
                                      />
                                      <span>
                                        {item.beading_color ===
                                        item.product.beading_color
                                          ? `SAS(${getColourBasedOnhex(item.beading_color)})`
                                          : getColourBasedOnhex(
                                              item.beading_color,
                                            )}
                                      </span>
                                    </div>
                                  </TableCell>
                                </TableRow>

                               
                                <TableRow>
                                  <TableCell className="font-medium">
                                    Lining Color
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <div
                                        className="h-5 w-5 rounded-full"
                                        style={{
                                          backgroundColor: item.lining_color,
                                        }}
                                      />
                                      <span>
                                        {item.lining_color ===
                                        item.product.lining_color
                                          ? `SAS(${getColourBasedOnhex(item.lining_color)})`
                                          : getColourBasedOnhex(
                                              item.lining_color,
                                            )}
                                      </span>
                                    </div>
                                  </TableCell>
                                </TableRow>

                                <TableRow>
                                  <TableCell className="font-medium">
                                    Lining
                                  </TableCell>
                                  <TableCell>
                                    {item.product.lining === item.lining
                                      ? `SAS(${item.lining})`
                                      : item.lining}
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        </DialogContent>
                      </Dialog> */}

                      {/* old */}
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Size</TableCell>
                            <TableCell>
                              {item.size} ({item.size_country})
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">
                              Mesh Color
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <p
                                  className="h-5 w-5 rounded-full"
                                  style={{
                                    backgroundColor: item.mesh_color,
                                  }}
                                ></p>
                                {item.mesh_color == item.product?.mesh_color
                                  ? `SAS( ${getColourBasedOnhex(item.product?.mesh_color)} )`
                                  : getColourBasedOnhex(item.mesh_color)}
                              </div>
                            </TableCell>
                          </TableRow>

                          <ExpandStockDetails
                            item={item}
                            beadingColourName={getColourBasedOnhex(
                              item.beading_color,
                            )}
                            liningColourName={getColourBasedOnhex(
                              item.lining_color,
                            )}
                          />
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <TableActions
                    data={item}
                    colours={colours.productColours}
                    currencies={currencies.currencies}
                    edit={true}
                    placeOrder={false}
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
      </div>
    </ContentLayout>
  );
};

export default Stock;
