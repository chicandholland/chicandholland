"use server";

import {
  eternalSunshine,
  paparazzi,
  videos,
} from "@/app/(website)/collections/[[...slug]]/videos";
import { API_URL } from "./constants";
import { cookies } from "next/headers";
import { unstable_cache } from "next/cache";

export const fetchWrapper = async (
  endpoint: string,
  options: RequestInit = {},
) => {
  const token = (await cookies()).get("token")?.value;


  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return response.json();
};

 


export const getCategories = async () => {
  const response = await fetch(`${API_URL}categories`);

  return await response.json();
};

export const getProducts = async ({
  categoryId,
  subCategoryId,
  currencyId,
}: {
  categoryId: number;
  subCategoryId: number;
  currencyId?: number;
}) => {
  const response = await fetch(
    `${API_URL}products/filter?categoryId=${categoryId}&subCategoryId=${subCategoryId}${currencyId ? `&currencyId=${currencyId}` : ''}`,
  );
  const productsData = await response.json();

  console.log(productsData)

  const categoryDetails = await getSubCategoryDetails(subCategoryId);

  let videosForThisPage = videos.slice();

  if (categoryId == 74 && subCategoryId == 59) {
    videosForThisPage = [
      {
        url: "https://ymts.blr1.cdn.digitaloceanspaces.com/chicandholland/optimized-videos/Video12-05-22.mp4",
        year: "2022",
      },
    ].concat(videosForThisPage);
  }

  if (categoryId == 71 && subCategoryId == 44) {
    videosForThisPage = videosForThisPage.filter(
      (v: any) =>
        v.url !==
        "https://ymts.blr1.cdn.digitaloceanspaces.com/chicandholland/optimized-videos/Video2022five.mp4",
    );
  }
  
  // Helper function to enrich hardcoded products with API data
  const enrichProductsWithApiData = (hardcodedProducts: any[], apiProducts: any[]) => {
    return hardcodedProducts.map(hardcodedProduct => {
      const fullProductData = apiProducts.find(
        apiProduct => apiProduct.productCode === hardcodedProduct.productCode
      );
      
      if (fullProductData) {
        // Merge hardcoded data with full API data, preferring API data for overlapping fields
        return {
          ...fullProductData,
          // Keep any hardcoded fields that might be specific to the video grouping
          ...hardcodedProduct
        };
      }
      
      // If no match found in API data, return the hardcoded product as-is
      console.warn(`Product ${hardcodedProduct.productCode} not found in API response`);
      return hardcodedProduct;
    });
  };

  let products = [];
  let productsWithoutVideo = [];

  const doesSubCategoryExist = videosForThisPage.find(
    (video: any) => video.subCategoryId == subCategoryId,
  );

  let tempVidieos: { video: string | null; products: any[] }[] = [];

  if (subCategoryId != 56 && subCategoryId != 50) {
    let actualVidieos: { url: string; year: string }[] =
      videosForThisPage.filter((video: any) => {
        if (video.subCategoryId) {
          return video.subCategoryId == subCategoryId;
        } else {
          if (!doesSubCategoryExist) {
            return (
              video.year ===
              categoryDetails.name.split(" ")[
                categoryDetails.name.split(" ").length - 1
              ]
            );
          }
        }
      });

    if (categoryId == 71 && subCategoryId == 44) {
      let initial = 0;
      let final = 4;
      let loopValue = Math.trunc(productsData.length / 4);

      for (let i = 0; i < loopValue; i++) {
        let obj = {
          video: i == 0 ? actualVidieos[0]?.url : null,
          products: productsData.slice(initial, final),
        };
        tempVidieos.push(obj);
        initial = final;
        final = final + 4;
      }

      products = tempVidieos;

      const indexToInsert = loopValue * 4;
      const remainingProducts = productsData.slice(indexToInsert);
      productsWithoutVideo = remainingProducts;
    } else {
      let initial = 0;
      let final = 4;
      let loopValue = Math.trunc(productsData.length / 4);

      if (loopValue != 0) {
        for (let i = 0; i < loopValue; i++) {
          let obj = {
            video: actualVidieos[i]?.url,
            products: productsData.slice(initial, final),
          };
          tempVidieos.push(obj);
          initial = final;
          final = final + 4;
        }
        products = tempVidieos;
        const indexToInsert = loopValue * 4;
        const remainingProducts = productsData.slice(indexToInsert);
        productsWithoutVideo = remainingProducts;
      } else {
        productsWithoutVideo = productsData;
      }
    }
  } else {
    // Handle special subcategories with hardcoded data
    let hardcodedGroups = [];
    
    if (subCategoryId == 50) {
      hardcodedGroups = paparazzi;
    } else {
      hardcodedGroups = eternalSunshine;
    }

    // Enrich each group's products with full API data
    const enrichedGroups = hardcodedGroups.map(group => ({
      ...group,
      products: enrichProductsWithApiData(group.products, productsData)
    }));

    tempVidieos.push(...enrichedGroups);

    const allImages = productsData;

    const hfImages = allImages.filter((img: any) =>
      img.productCode.includes(subCategoryId == 50 ? "AF" : "HF"),
    );

    // Get all product codes that are already used in the enriched groups
    const alreadyUsedProductCodes = enrichedGroups.flatMap(group =>
      group.products.map(product => product.productCode)
    );

    const hfImagesWhichAreNotAlreadyUsed = hfImages.filter(
      (hfImage: any) => !alreadyUsedProductCodes.includes(hfImage.productCode),
    );

    productsWithoutVideo = hfImagesWhichAreNotAlreadyUsed;
  }

  products = tempVidieos;

  return {
    products,
    productsWithoutVideo,
    categoryDetails,
  };
};

export const getSubCategoryDetails = async (id: number) => {
  const response = await fetch(`${API_URL}subcategories/${id}`);
  return response.json();
};

export const getProductDetails = async (id: number, currencyId?: number) => {
  const response = await fetch(
    `${API_URL}products/${id}${currencyId ? `?currencyId=${currencyId}` : ''}`
  );

  return response.json();
};

export const getProductDetailsByProductCode = async (productCode: string) => {
  const response = await fetch(
    `${API_URL}products/product-code/${productCode}`,
  );

  return response.json();
};

export const getCustomers = async ({
  page,
  query,
}: {
  page?: number;
  query?: string;
}) => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  if (!page) {
    const response = await fetch(`${API_URL}customers`, {
      headers,
    });

    return response.json();
  }

  const response = await fetch(
    `${API_URL}customers?page=${page}&query=${query}`,
    {
      headers,
    },
  );

  return response.json();
};

export const getStock = async ({
  page,
  query,
  currencyId,
}: {
  page?: number;
  query?: string;
  currencyId?: number;
}) => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  const queryParams = new URLSearchParams();
  if (page) queryParams.append('page', page.toString());
  if (query) queryParams.append('query', query);
  if (currencyId) queryParams.append('currencyId', currencyId.toString());

  const response = await fetch(`${API_URL}stock?${queryParams.toString()}`, {
    headers,
  });

  return response.json();
};

export const getProductsCodes = async (data: string) => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  const response = await fetch(`${API_URL}products/styleNo/${data}`, {
    headers,
  });

  return response.json();
};

export const getProductsPrice = async (data: string) => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  const response = await fetch(`${API_URL}products/price/${data}`, {
    headers,
  });

  return response.json();
};

export const getImageByStockId = async (stockId: string) => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  const response = await fetch(`${API_URL}stock/${stockId}/image`, {
    headers,
    // cache: "force-cache",
  });

  return response.json();
};

// export const getCachedImageByStockId = unstable_cache(getImageByStockId, ["stock-id-images"], {
//   revalidate: 60 * 60, // revalidate every hour0
//   tags: ["stock-id-images"]
// });

export const getOrders = async ({
  page,
  query,
  orderType,
}: {
  page?: number;
  query?: string;
  orderType?: string;
}) => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  const response = await fetch(
    `${API_URL}orders?page=${page}&query=${query}&orderType=${orderType}`,
    {
      headers,
    },
  );

  return response.json();
};

export const getExpenses = async ({
  page,
  query,
  expenseName,
  expenseType,
  isPaid,
  fromDate,
  toDate,
}: {
  page?: number;
  query?: string;
  expenseName?: string;
  expenseType?: string;
  isPaid?: string;
  fromDate?: string;
  toDate?: string;
}) => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  const response = await fetch(
    // `${API_URL}expenses?page=${page}&query=${query}&expenseName=${expenseName}`,
    // encodeURIComponent(expenseName)
    `${API_URL}expenses?page=${page}&query=${query}&expenseName=${encodeURIComponent(expenseName as string)}&expenseType=${expenseType}&isPaid=${isPaid}&fromDate=${fromDate}&toDate=${toDate}`,
    {
      headers,
    },
  );

  return response.json();
};

export const getExpensesDownload = async ({
  query,
  expenseName,
  expenseType,
  isPaid,
  fromDate,
  toDate,
}: {
  query?: string;
  expenseName?: string;
  expenseType?: string;
  isPaid?: string;
  fromDate?: string;
  toDate?: string;
}) => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  const response = await fetch(
    // `${API_URL}expenses?page=${page}&query=${query}&expenseName=${expenseName}`,
    // encodeURIComponent(expenseName)
    `${API_URL}expenses?query=${query}&expenseName=${encodeURIComponent(expenseName as string)}&expenseType=${expenseType}&isPaid=${isPaid}&fromDate=${fromDate}&toDate=${toDate}`,
    {
      headers,
    },
  );

  return response.json();
};

export const getFavourites = async (customerId: number) => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  const response = await fetch(`${API_URL}favourites/customer/${customerId}`, {
    headers,
  });

  const responseJson = await response.json();
   console.log(responseJson)

  if (!responseJson.success) {
    throw Error("Something went wrong, please try again later");
  }

  return responseJson;
};

export const getRetailersOrders = async ({
  retailerId,
  page,
  query,
  isApproved,
}: {
  retailerId?: number;
  page?: number;
  query?: string;
  isApproved: number;
}) => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  if (!page) {
    const response = await fetch(
      `${API_URL}retailers/orders/${isApproved}?retailerId=${retailerId ?? "all"}`,
      {
        headers,
      },
    );

    return response.json();
  }

  const response = await fetch(
    `${API_URL}retailers/orders/${isApproved}?retailerId=${retailerId ?? "all"}&page=${page}&query=${query}`,
    {
      headers,
    },
  );

  return response.json();
};

export const getAcceptedRetailersOrders = async ({
  retailerId,
  page,
  query,
  id,
}: {
  retailerId?: number;
  page?: number;
  query?: string;
  id: number;
}) => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  if (!page) {
    const response = await fetch(
      `${API_URL}retailer-orders/orders/accepted/customer/${id}?retailerId=${retailerId ?? "all"}`,
      {
        headers,
      },
    );

    return response.json();
  }

  const response = await fetch(
    `${API_URL}retailer-orders/orders/accepted/customer/${id}?retailerId=${retailerId ?? "all"}&page=${page}&query=${encodeURIComponent(query as string)}`,
    {
      headers,
    },
  );

  return response.json();
};

export const getAdminRetailersStockOrders = async ({
  retailerId,
  page,
  query,
}: {
  retailerId?: number;
  page?: number;
  query?: string;
}) => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  if (!page) {
    const response = await fetch(
      `${API_URL}retailer-orders/admin/stock-orders?retailerId=${retailerId ?? "all"}`,
      {
        headers,
      },
    );

    return response.json();
  }

  const response = await fetch(
    `${API_URL}retailer-orders/admin/stock-orders?retailerId=${retailerId ?? "all"}&page=${page}&query=${encodeURIComponent(query as string)}`,
    {
      headers,
    },
  );

  return response.json();
};
export const getAdminRetailersFreshOrders = async ({
  retailerId,
  page,
  query,
}: {
  retailerId?: number;
  page?: number;
  query?: string;
}) => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  if (!page) {
    const response = await fetch(
      `${API_URL}retailer-orders/admin/favorites-orders?retailerId=${retailerId ?? "all"}`,
      {
        headers,
      },
    );

    return response.json();
  }

  const response = await fetch(
    `${API_URL}retailer-orders/admin/favorites-orders?retailerId${retailerId ?? "all"}&page=${page}&query=${encodeURIComponent(query as string)}`,
    {
      headers,
    },
  );

  return response.json();
};

export const getRetailerAdminStockOrderDetails = async (
  id: number,
  status: number,
) => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  const response = await fetch(
    `${API_URL}retailer-orders/admin/stock-order/form/${id}/${status}`,
    {
      headers,
    },
  );

  const responseJson = await response.json();

  if (!responseJson.success) {
    throw Error("Something went wrong, please try again later");
  }

  return responseJson;
};

export const getRetailerAdminFreshOrderDetails = async (
  id: number,
  status: number,
) => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  const response = await fetch(
    `${API_URL}retailer-orders/admin/favorites-order/details/${id}/${status}`,
    {
      headers,
    },
  );

  const responseJson = await response.json();

  if (!responseJson.status) {
    throw Error("Something went wrong, please try again later");
  }

  return responseJson;
};

export const getRetailerOrderDetails = async (
  id: number,
  retailerOrderID: number,
) => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  const response = await fetch(
    `${API_URL}retailer-orders/customer/${id}/${retailerOrderID}`,
    {
      headers,
    },
  );

  const responseJson = await response.json();

  if (!responseJson.success) {
    throw Error("Something went wrong, please try again later");
  }

  return responseJson;
};

export const getRetailerStockOrderDetails = async (
  id: number,
  retailerOrderID: number,
) => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  const response = await fetch(
    `${API_URL}retailer-orders/customer-stock/${id}/${retailerOrderID}`,
    {
      headers,
    },
  );

  const responseJson = await response.json();

  if (!responseJson.success) {
    throw Error("Something went wrong, please try again later");
  }

  return responseJson;
};

export const getProductCategories = async ({
  page,
  query,
}: {
  page?: number;
  query?: string;
}) => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  if (!page) {
    const response = await fetch(`${API_URL}categories/new?`, {
      headers,
    });

    return response.json();
  }

  const response = await fetch(
    `${API_URL}categories/new?page=${page}&query=${query}`,
    {
      headers,
    },
  );

  return response.json();
};

export const getProductCollection = async ({
  page,
  query,
}: {
  page?: number;
  query?: string;
}) => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  if (!page) {
    const response = await fetch(`${API_URL}subcategories/new?`, {
      headers,
    });

    return response.json();
  }

  const response = await fetch(
    `${API_URL}subcategories/new?page=${page}&query=${query}`,
    {
      headers,
    },
  );

  return response.json();
};

export const getProductsNew = async ({
  page,
  query,
}: {
  page?: number;
  query?: string;
}) => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  if (!page) {
    const response = await fetch(`${API_URL}products/new?`, {
      headers,
    });

    return response.json();
  }

  const response = await fetch(
    `${API_URL}products/new?page=${page}&query=${query}`,
    {
      headers,
    },
  );

  return response.json();
};

export const getClients = async ({
  page,
  query,
}: {
  page?: number;
  query?: string;
}) => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  if (!page) {
    const response = await fetch(`${API_URL}clients/new`, {
      headers,
    });

    return response.json();
  }

  const response = await fetch(
    `${API_URL}clients/new?page=${page}&query=${query}`,
    {
      headers,
    },
  );

  return response.json();
};

export const getUserRoles = async ({
  page,
  query,
}: {
  page?: number;
  query?: string;
}) => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  if (!page) {
    const response = await fetch(`${API_URL}users/user-roles`, {
      headers,
    });

    return response.json();
  }

  const response = await fetch(
    `${API_URL}users/user-roles?page=${page}&query=${query}`,
    {
      headers,
    },
  );

  return response.json();
};

export const getUsers = async ({
  page,
  query,
}: {
  page?: number;
  query?: string;
}) => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  if (!page) {
    const response = await fetch(`${API_URL}users`, {
      headers,
    });

    return response.json();
  }

  const response = await fetch(`${API_URL}users?page=${page}&query=${query}`, {
    headers,
  });

  return response.json();
};

export const searchStyleNumbers = async (query: string) => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  const response = await fetch(
    `${API_URL}products/searchStyleNo?query=${query}`,
    {
      headers,
    },
  );

  return response.json();
};

export const getDashboardData = async (startDate: string, endDate: string) => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  const response = await fetch(
    `${API_URL}analytics/dashboard?startDate=${startDate}&endDate=${endDate}`,
    {
      headers,
    },
  );

  return response.json();
};

export const getQuickbookRedirectUrl = async () => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  const response = await fetch(`${API_URL}quickbook/redirect-url`, {
    headers,
  });

  return response.json();
};

export const getQuickbookAccessToken = async ({
  searchParams,
}: {
  searchParams: Record<any, any>;
}) => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  const searchParamsString = new URLSearchParams(searchParams).toString();

  const response = await fetch(
    `${API_URL}quickbook/access-token?${searchParamsString}`,
    {
      headers,
    },
  );

  return response.json();
};

export const getQuickbookStatus = async () => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  const response = await fetch(`${API_URL}quickbook/connection-status`, {
    headers,
  });

  return response.json();
};

export const getProductColours = async ({
  page,
  query,
}: {
  page?: number;
  query?: string;
}) => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  if (!page) {
    const response = await fetch(`${API_URL}product-colours`, {
      headers,
    });

    return response.json();
  }

  const response = await fetch(
    `${API_URL}product-colours?page=${page}&query=${query}`,
    {
      headers,
    },
  );

  return response.json();
};

export const getStockByProductId = async (productId: number) => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

 

  const response = await fetch(
    `${API_URL}stock/stock-by-productid/${productId}`,
    {
      headers,
    },
  );

  return response.json();
};

export const getRetailerDetails = async (retailerId: number) => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  const response = await fetch(`${API_URL}retailers/${retailerId}`, {
    headers,
  });

  return response.json();
};

export const getRetailerDashboardData = async (retailerId: number) => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  const response = await fetch(
    `${API_URL}retailers/dashboard-data?retailerId=${retailerId}`,
    {
      headers,
    },
  );

  return response.json();
};

export const getSponsors = async ({
  page,
  query,
}: {
  page?: number;
  query?: string;
}) => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  if (!page) {
    const response = await fetch(`${API_URL}sponsors`, {
      headers,
    });

    return response.json();
  } else {
    const response = await fetch(
      `${API_URL}sponsors?page=${page}&query=${query}`,
      {
        headers,
      },
    );

    return response.json();
  }
};

export const getRetailerAcceptedFreshOrderDetails = async (
  retailerId: number,
  stockId: number,
  paymentId: number,
) => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  const response = await fetch(
    `${API_URL}retailer-orders/customer/accepted/fresh/${retailerId}/${stockId}/${paymentId}`,
    {
      headers,
    },
  );

  const responseJson = await response.json();

  if (!responseJson.success) {
    throw Error("Something went wrong, please try again later");
  }

  return responseJson;
};

export const getRetailerAcceptedStockOrderDetails = async (
  retailerId: number,
  stockId: number,
  paymentId: number,
) => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  const response = await fetch(
    `${API_URL}retailer-orders/customer-stock/accepted/${retailerId}/${stockId}/${paymentId}`,
    {
      headers,
    },
  );

  const responseJson = await response.json();

  if (!responseJson.success) {
    throw Error("Something went wrong, please try again later");
  }

  return responseJson;
};

export const getRetailerAcceptedAdminFreshOrderDetails = async ({
  retailerId,
  page,
  query,
  id,
}: {
  retailerId?: number;
  page?: number;
  query?: string;
  id: number;
}) => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  if (!page) {
    const response = await fetch(
      `${API_URL}retailer-orders/admin/orders/accepted/${id}`,
      {
        headers,
      },
    );

    return response.json();
  }

  const response = await fetch(
    `${API_URL}retailer-orders/admin/orders/accepted/${id}?page=${page}&query=${encodeURIComponent(query as string)}`,
    {
      headers,
    },
  );

  return response.json();
};

export const getBankDetails = async (id: number) => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  const response = await fetch(`${API_URL}retailer-bank/${id}`, {
    headers,
  });

  const responseJson = await response.json();

  // if (!responseJson.success) {
  //   throw Error("Something went wrong, please try again later");
  // }

  return responseJson;
};

export const getAdminBankDetails = async () => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  const response = await fetch(`${API_URL}admin-bank`, {
    headers,
  });

  const responseJson = await response.json();

  if (!responseJson.success) {
    throw Error("Something went wrong, please try again later");
  }

  return responseJson;
};

export const getAdminBankRetailerDetails = async () => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  const response = await fetch(`${API_URL}admin-bank/retailer`, {
    headers,
  });

  const responseJson = await response.json();

  if (!responseJson.success) {
    throw Error("Something went wrong, please try again later");
  }

  return responseJson;
};

export const getCustomizationDetails = async (id: number) => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  const response = await fetch(
    `${API_URL}retailer-orders/customization/${id}`,
    {
      headers,
    },
  );

  const responseJson = await response.json();

  if (!responseJson.success) {
    throw Error("Something went wrong, please try again later");
  }

  return responseJson;
};

export const getOrderStatusDatesDetails = async (id: number) => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  const response = await fetch(
    `${API_URL}retailer-orders/orderStatusDates/${id}`,
    {
      headers,
    },
  );

  const responseJson = await response.json();

  if (!responseJson.success) {
    throw Error("Something went wrong, please try again later");
  }

  return responseJson;
};

export const getOrderStatusDatesStockDetails = async (id: number) => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  const response = await fetch(
    `${API_URL}retailer-orders/orderStatusDates/stock/${id}`,
    {
      headers,
    },
  );

  const responseJson = await response.json();

  if (!responseJson.success) {
    throw Error("Something went wrong, please try again later");
  }

  return responseJson;
};

export const getDates = async (id: number) => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  const response = await fetch(`${API_URL}orders/retailer-order/status/${id}`, {
    headers,
  });

  const responseJson = await response.json();

  if (!responseJson.success) {
    throw Error("Something went wrong, please try again later");
  }

  return responseJson;
};

export const getOrderDates = async (id: number) => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  const response = await fetch(`${API_URL}orders/order/status/${id}`, {
    headers,
  });

  const responseJson = await response.json();

  if (!responseJson.success) {
    throw Error("Something went wrong, please try again later");
  }

  return responseJson;
};

export const getLatestRegularOrder = async () => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  const response = await fetch(`${API_URL}orders/latest-regular-order`, {
    headers,
  });

  const responseJson = await response.json();

  return responseJson;
};

export const getLatestRetailerOrder = async () => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  const response = await fetch(`${API_URL}orders/latest-retailer-order`, {
    headers,
  });

  // console.log(response)

  // const text = await response.text();

  // console.log(text);

  const responseJson = await response.json();

  return responseJson;
};

export const getProductColorsCheck = async (id: number) => {
  const headers = {
    Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
  };

  const response = await fetch(`${API_URL}products/product-color/${id}`, {
    headers,
  });

  const responseJson = await response.json();

  if (!responseJson.status) {
    throw Error("Something went wrong, please try again later");
  }

  return responseJson;
};

export const getCountries = async () => {
  return fetchWrapper("countries");
};

export const getCurrencies = async () => {
  return fetchWrapper("currencies");
};