import { ContentLayout } from "@/components/custom/admin-panel/contentLayout";
import AddCategoryForm from "./AddCollection";
import { getProductCategories, getProductCollection } from "@/lib/data";
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

const Categories = async (props: {
  searchParams: Promise<Record<string, string>>;
}) => {
  const searchParams = await props.searchParams;
  const currentPage = searchParams["cPage"] ? Number(searchParams["cPage"]) : 1;
  const query = searchParams["q"] ? searchParams["q"] : "";

  const productCategories = await getProductCategories({});

  const collection = await getProductCollection({
    page: currentPage,
    query,
  });

  const groupByCollection = collection?.subCategories?.reduce(
    (acc: any, item: any) => {
      const key = item.category?.id;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    },
    {},
  );

  // console.log("groupByCollection", groupByCollection);

  return (
    <ContentLayout title="Product Collections">
      <div className="flex flex-col gap-8">
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-xl md:text-2xl">Product Collections</h1>
          <AddCategoryForm categories={productCategories.categories} />
        </div>

        <div className="space-y-2">
          <CustomSearchBar query={query} />

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colletion Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* {collection?.subCategories
                ?.sort((a: any, b: any) => {
                  console.log(a, b);
                  return a.category.priority - b.category.priority;
                })
                .sort((a: any, b: any) => a.priority - b.priority)
                .map((collection: any) => {
                  return (
                    <TableRow key={collection.id}>
                      <TableCell>{collection.name}</TableCell>
                      <TableCell>{collection.category?.name}</TableCell>
                      <TableCell>{collection.priority}</TableCell>
                      <TableActions
                        data={collection}
                        categories={productCategories.categories}
                      />
                    </TableRow>
                  );
                })} */}
              {Object.keys(groupByCollection)
                .sort((a, b) => {
                  return (
                    productCategories.categories.find(
                      (cat) => cat.id === Number(a),
                    )?.priority -
                    productCategories.categories.find(
                      (cat) => cat.id === Number(b),
                    )?.priority
                  );
                })
                .map((key) => {
                  const collections = groupByCollection[key];

                  // console.log(collections);

                  return collections
                    .sort((a: any, b: any) => a.priority - b.priority)
                    .map((collection: any) => {
                      return (
                        <TableRow key={collection.id}>
                          <TableCell>{collection.name}</TableCell>
                          <TableCell>{collection.category?.name}</TableCell>
                          <TableCell>{collection.priority}</TableCell>
                          <TableActions
                            data={collection}
                            categories={productCategories.categories}
                          />
                        </TableRow>
                      );
                    });
                })}
            </TableBody>
          </Table>

          <CustomPagination
            currentPage={currentPage}
            totalLength={collection?.totalCount}
          />
        </div>
      </div>
    </ContentLayout>
  );
};

export default Categories;
