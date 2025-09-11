import { raw, Request, Response, Router } from "express";
import asyncHandler from "../middleware/AsyncHandler";
import Order, { OrderType } from "../models/Order";
import { Equal, In, Like } from "typeorm";
import Busboy from "busboy";
import sharp from "sharp";
import { storeFileInS3 } from "../lib/s3";
import Style from "../models/OrderStyle";
import Customer from "../models/Customer";
import CONFIG from "../config";
import Product from "../models/Product";
import fetch from "node-fetch";
import { imageCache, productCache } from "../lib/cache.service";
import db from "../db";
import { RetailerOrder } from "../models/RetailerOrder";

const router = Router();

// export async function convertImageToBase64Jpeg(imageUrl: string) {
//     try {
//         // Check if the image is already in JPEG format
//
//         const imageBufferFromURL = await fetch(imageUrl).then((res) => res.arrayBuffer());
//
//         if (!imageBufferFromURL) {
//             throw new Error("Error fetching image");
//         }
//
//         const isJpeg = await sharp(imageBufferFromURL).metadata().then(metadata => {
//             return metadata.format === 'jpeg';
//         }).catch(() => false); // Handle errors gracefully
//
//         console.log(isJpeg, 'isJpeg');
//
//         let imageBuffer;
//
//         if (!isJpeg) {
//             // Convert to JPEG
//             imageBuffer = await sharp(imageBufferFromURL).jpeg().toBuffer();
//         } else {
//             // If already JPEG, convert to Buffer directly
//             imageBuffer = await sharp(imageBufferFromURL).toBuffer();
//         }
//
//         // Convert Buffer to Base64
//         return `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
//     } catch (error) {
//         console.error('Error converting image to Base64:', error);
//         throw new Error('Image conversion failed');
//     }
// }

// router.get(
//   "/graph",
//   validate([
//     query("sellerId")
//       .notEmpty()
//       .withMessage("sellerId is required in query params"),
//     query("format")
//       .notEmpty()
//       .withMessage("format is required in query params"),
//   ]),
//   asyncHandler(async (req: Request, res: Response) => {
//     const sellers = await Order.query(
//       `
//       select
//       DATE_FORMAT(createdAt , ?) as createdAt,
//       COUNT(1) as orderCount
//       from orders
//       where sellerId = ?
//       group by createdAt;
//     `,
//       [req.query.format, req.query.sellerId]
//     );
//     res.json(sellers);
//   })
// );

// router.get(
//   "/graph",
//   validate([
//     query("sellerId")
//       .notEmpty()
//       .withMessage("sellerId is required in query params"),
//     query("format")
//       .notEmpty()
//       .withMessage("format is required in query params"),
//   ]),
//   asyncHandler(async (req: Request, res: Response) => {
//     const sellers = await Order.query(
//       `
//       select
//       DATE_FORMAT(createdAt , ?) as createdAt,
//       COUNT(1) as orderCount
//       from orders
//       where sellerId = ?
//       group by createdAt;
//     `,
//       [req.query.format, req.query.sellerId]
//     );
//     res.json(sellers);
//   })
// );

// router.get(
//   "/",
//   asyncHandler(async (req: Request, res: Response) => {
//     const { sellerId } = req.query as { sellerId: string };

//     const sellers = await Order.query(`
//         select
//         totalAmount,
//         invoiceNumber,
//         status,
//         DATE_FORMAT(estimatedDeliveryTime , '%D %M %Y') as estimatedDeliveryTime,
//         paymentStatus,
//         DATE_FORMAT(createdAt , '%D %M %Y') as createdAt
//         from ${TABLE_NAMES.ORDERS}
//         ${sellerId ? `where sellerId = ${sellerId}` : ""}
//     `);
//     res.json(sellers);
//   })
// );

// router.get(
//   "/filter",
//   validate(orderFilterValidator),
//   asyncHandler(
//     async (req: Request<any, any, any, { type: string }>, res: Response) => {
//       const { type } = req.query;
//       const [orders] = await db.query(
//         `CALL ${PRC_NAMES.ORDER_LIST_BY_TYPE}(?)`,
//         [type]
//       );
//       res.json(orders);
//     }
//   )
// );

// router.post(
//   "/",
//   orderFileUpload.single("file"),
//   validate(orderValidator),
//   asyncHandler(async (req: Request, res: Response) => {
//     const { sellerId } = req.body as { sellerId: number };
//     let order = {} as Order; // creating an order object
//     if (sellerId) {
//       // order is from a seller
//       const seller = await Seller.findOneBy({ id: sellerId });
//       if (!seller) {
//         throw new NotFound(`Seller with id ${sellerId} not found`);
//       }
//       order = Order.create({
//         ...req.body,
//         seller: { id: sellerId },
//       }) as Order;
//     } else {
//       // order is not from a seller
//       order = Order.create({
//         ...req.body,
//       }) as Order;
//     }

//     req.body.items = JSON.parse(req.body.items); // parsing the items from the body
//     const orderItems = req.body.items as {
//       quantity: number;
//       productId: number;
//     }[];
//     const hasVat =
//       req.body.hasVat === "true" ||
//       req.body.hasVat === true ||
//       req.body.hasVat === "1" ||
//       false;

//     if (hasVat) {
//       // there is vat applied to the order , so we need to add the vat to the total price
//       order.totalAmount += order.totalAmount * TAXES.VAT;
//     }
//     req.body.bodyDetail;
//     const detail = BodyDetail.create({
//       ...req.body.bodyDetail,
//     }) as BodyDetail; //creating a body detail

//     order.invoiceNumber = await generateInvoiceNumber(); // generating the invoice number and assigning it to the order

//     if (req.file) {
//       order.fileName = `${CONFIG.HOST}/${FOLDER_NAMES.STATIC_PATH}/${FOLDER_NAMES.ORDERS}/${req.file.filename}`;
//     }

//     await db.transaction(async (manager) => {
//       const savedOrder = await manager.save(order);
//       const itemsToSave = [] as OrderItem[]; //creating a list of order items to save
//       for (const item of orderItems) {
//         // looping over the items in the order to save
//         const newOrderItem = OrderItem.create({
//           quantity: item.quantity,
//           product: { id: item.productId },
//           order: savedOrder,
//         });
//         // adding the items to the orderitem array to bulksave them
//         itemsToSave.push(newOrderItem);
//       }

//       await manager.save(itemsToSave); // bulk saving them to the database for performance
//       detail.order = savedOrder;
//       await manager.save(detail);
//     }); // adding the order to the database along with the body details in a transaction

//     res.json({ msg: created(RES_NAME) });
//   })
// );

// router.patch(
//   "/:id",
//   validate(idValidater),
//   dbUpdate(TABLE_NAMES.ORDERS),
//   // validate(orderValidator),
//   asyncHandler(async (req: Request, res: Response) => {
//     const { id } = req.params;
//     await Order.update(id, req.body);
//     res.json({ msg: updated(RES_NAME) });
//   })
// );

// router.delete(
//   "/:id",
//   validate(idValidater),
//   dbDelete(TABLE_NAMES.ORDERS),
//   asyncHandler(async (req: Request, res: Response) => {
//     res.json({ msg: deleted(RES_NAME) });
//   })
// );

interface Field {
  [key: string]: string;
}

interface FileData {
  fieldname: string;
  filename: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
}

router.post(
  "/",
  raw({
    type: "multipart/form-data",
    limit: "100mb",
  }),
  asyncHandler(async (req: Request, res: Response) => {
    const busboy = Busboy({ headers: req.headers });
    const fields: Field = {};
    const filePromises: Promise<FileData>[] = [];

    busboy.on("field", (fieldname: string, val: string) => {
      fields[fieldname] = val;
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    busboy.on(
      "file",
      (
        fieldname: string,
        file: NodeJS.ReadableStream,
        filename: string,
        encoding: string,
        mimetype: string
      ) => {
        const buffers: Buffer[] = [];

        const filePromise = new Promise<FileData>((resolve, reject) => {
          file.on("data", (data: Buffer) => {
            buffers.push(data);
          });

          file.on("end", () => {
            const fileBuffer = Buffer.concat(buffers);
            resolve({
              fieldname,
              filename,
              encoding,
              mimetype,
              buffer: fileBuffer,
            });
          });

          file.on("error", (error: Error) => {
            reject(error);
          });
        });

        filePromises.push(filePromise);
      }
    );

    busboy.on("finish", async () => {
      try {
        const files = await Promise.all(filePromises);

        // Now you have access to fields and files
        // You can perform operations on files here

        const purchaseOrderNo = fields["purchaseOrderNo"];
        const manufacturingEmailAddress = fields["manufacturingEmailAddress"];
        const orderType = fields["orderType"];
        const orderReceivedDate = new Date(fields["orderReceivedDate"]);
        const orderCancellationDate = new Date(fields["orderCancellationDate"]);
        const address = fields["address"];
        const customerId = Number(fields["customerId"]);

        const styles: any = [];

        for (const key in fields) {
          if (key.startsWith("styles[")) {
            const matches = key.match(/\[(\d+)\]\.(.+)/);
            if (matches) {
              const index = Number(matches[1]);
              const field = matches[2];
              if (!styles[index]) {
                styles[index] = {};
              }
              styles[index][field] = fields[key];
            }
          }
        }

        // return res.json({
        //     success: false,
        //     message: "Not implemented",
        //     fields,
        //     files,
        //     styles,
        // })

        const customer = await Customer.findOneOrFail({
          where: {
            id: customerId,
          },
        });

        // Create the order object
        const order = new Order();
        order.purchaeOrderNo = purchaseOrderNo; // Fixed typo
        order.manufacturingEmailAddress = manufacturingEmailAddress;
        order.orderType = orderType as OrderType;
        order.orderReceivedDate = orderReceivedDate;
        order.orderCancellationDate = orderCancellationDate;
        order.address = address;
        order.customer = customer;

        const newStyles = [];

        // Validate all styles first
        for (const style of styles) {
          // const stock = await Stock.findOne({
          //     where: {
          //         styleNo: style.styleNo,
          //     },
          // });
          //
          // if (!stock) {
          //     return res.status(400).json({
          //         error: `No stock found with the styleNo: ${style.styleNo}`,
          //     });
          // }
          //
          // // check quantity by combining all the styles with the same styleNo and combining their quantities and checking if the stock quantity is greater than the combined quantity
          // const totalQuantity = styles
          //     .filter((s: { styleNo: any; }) => s.styleNo === style.styleNo)
          //     .reduce((acc: number, s: { quantity: any; }) => acc + Number(s.quantity), 0);
          //
          // if (stock.quantity < totalQuantity) {
          //     return res.status(400).json({
          //         error: `Stock quantity is less than the total quantity of all styles with styleNo: ${style.styleNo}`,
          //     });
          // }

          const newStyle = new Style();
          newStyle.colorType = style.colorType;
          newStyle.customColor = style.customColor;
          newStyle.sizeCountry = style.sizeCountry;
          newStyle.size = style.size;
          newStyle.customSize = style.customSize;
          newStyle.quantity = Number(style.quantity);
          newStyle.styleNo = style.styleNo;
          newStyle.comments = style.comments;
          newStyle.customSizesQuantity = style.customSizesQuantity;
          newStyle.beading_color = style.beading;
          newStyle.mesh_color = style.mesh;
          newStyle.lining = style.lining;
          newStyle.lining_color =
            style.lining === "No Lining" ? null : style.liningColor;

          newStyles.push(newStyle);
        }

        // If we've made it this far, all styles are valid. Now we can save the order and styles.
        try {
          // Save the order first
          await order.save();

          const latestOrderId = await Order.createQueryBuilder("order")
            .select("MAX(order.id)", "max")
            .getRawOne();

          const orderID = latestOrderId.max;

          // Now process and save styles
          for (let i = 0; i < newStyles.length; i++) {
            const newStyle = newStyles[i];
            newStyle.order = order;

            // const fileName = `orders/${orderID}/${Math.random()
            //     .toString(36)
            //     .substring(7)}.jpeg`;
            //
            // const file = files.find(
            //     (file) => file.fieldname === `styles[${i}].modifiedPhotoImage`
            // );
            //
            // if (file) {
            //     const compressedImage = await sharp(file.buffer)
            //         .jpeg()
            //         .toBuffer();
            //     const s3Response = await storeFileInS3(compressedImage, fileName);
            //     newStyle.photoUrl = s3Response?.fileName as string;
            // }

            // there will be multiple images for a single style
            const styleImages = files.filter(
              (file) => file.fieldname === `styles[${i}].modifiedPhotoImage`
            );

            const imageUrls = await Promise.all(
              styleImages.map(async (file) => {
                if (!file) return null;

                const fileName = `orders/${orderID}/${Math.random()
                  .toString(36)
                  .substring(7)}.jpeg`;

                const compressedImage = await sharp(file.buffer)
                  .jpeg()
                  .toBuffer();

                return await storeFileInS3(compressedImage, fileName);
              })
            );

            newStyle.photoUrls = JSON.stringify(
              imageUrls
                .filter((url) => url !== null)
                .map((url) => url?.fileName)
            );

            // decrease the stock quantity
            // const stock = await Stock.findOneOrFail({
            //     where: {
            //         styleNo: newStyle.styleNo,
            //     },
            // });
            //
            // stock.quantity -= newStyle.quantity;
            // await stock.save();
            await newStyle.save();
          }

          res.json({
            success: true,
            message: "Order created successfully",
            fields,
            files,
            styles,
          });

          // res.json({
          //     success: false,
          //     message: "Not Implemented",
          //     fields,
          //     files,
          //     styles,
          // });
        } catch (error) {
          console.error(error);
          res.status(500).json({
            error: "An error occurred while saving the order and styles",
          });
        }
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .json({ error: "An error occurred while processing the files" });
      }
    });

    busboy.end(req.body);
  })
);

// async function fetchProductsMap(styles: any[]) {
//     const styleNos = [...new Set(styles.map(style => style.styleNo))];
//     // console.log(styleNos, 'allStyleNos');
//     const products = await Product.find({
//         where: {productCode: In(styleNos)},
//         relations: ["images"],
//     });
//     // console.log(products, 'allProducts');
//     return new Map(products.map(product => [product.productCode.toLowerCase(), product]));
// }

// async function convertImageToBase64Jpeg(imageUrl: string) {
//     try {
//         if (!imageUrl) return null;
//
//         // Add timeout to fetch operation
//         const controller = new AbortController();
//         const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
//
//         try {
//             const response = await fetch(imageUrl, {signal: controller.signal});
//             clearTimeout(timeoutId);
//
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
//
//             const imageBufferFromURL = await response.arrayBuffer();
//
//             // Add size limit check (e.g., 10MB)
//             if (imageBufferFromURL.byteLength > 10 * 1024 * 1024) {
//                 throw new Error('Image size too large');
//             }
//
//             const sharpInstance = sharp(imageBufferFromURL);
//
//             // Get image metadata
//             const metadata = await sharpInstance.metadata();
//
//             // Process image with optimizations
//             const processedBuffer = await sharpInstance
//                 .jpeg({
//                     quality: 80, // Reduce quality slightly for better performance
//                     mozjpeg: true // Use mozjpeg optimization
//                 })
//                 .resize({
//                     width: 1200, // Set maximum width
//                     height: 1200, // Set maximum height
//                     fit: 'inside',
//                     withoutEnlargement: true
//                 })
//                 .toBuffer();
//
//             return `data:image/jpeg;base64,${processedBuffer.toString('base64')}`;
//         } catch (error) {
//             clearTimeout(timeoutId);
//             throw error;
//         }
//     } catch (error) {
//         console.error(`Error converting image (${imageUrl}):`, error);
//         return null; // Return null instead of throwing to prevent entire order processing from failing
//     }
// }

export async function convertImageToBase64Jpeg(
  imageUrl: string
): Promise<string | null> {
  try {
    if (!imageUrl) return null;

    const cachedImage = imageCache.get(imageUrl);
    if (cachedImage) {
      return cachedImage;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(imageUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const imageBufferFromURL = await response.arrayBuffer();

      // Increased size limit to 50MB
      if (imageBufferFromURL.byteLength > 50 * 1024 * 1024) {
        throw new Error("Image size too large (max 50MB)");
      }

      const processedBuffer = await sharp(imageBufferFromURL)
        .jpeg({
          quality: 80,
          mozjpeg: true,
        })
        .resize({
          width: 1200,
          height: 1200,
          fit: "inside",
          withoutEnlargement: true,
        })
        .toBuffer();

      const base64Image = `data:image/jpeg;base64,${processedBuffer.toString(
        "base64"
      )}`;

      imageCache.set(imageUrl, base64Image);
      return base64Image;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  } catch (error) {
    console.error(`Error converting image (${imageUrl}):`, error);
    return null;
  }
}

async function fetchProductsMap(styles: any[]) {
  const styleNos = [
    ...new Set(styles.map((style) => style.styleNo.toLowerCase())),
  ];

  // Create a map to store products we'll need to fetch
  const productsToFetch = new Set<string>();
  const productsMap = new Map();

  // Check cache first for each product
  for (const styleNo of styleNos) {
    const cachedProduct = productCache.get(styleNo);
    if (cachedProduct) {
      productsMap.set(styleNo, cachedProduct);
    } else {
      productsToFetch.add(styleNo);
    }
  }

  // If we have products to fetch, get them from database
  if (productsToFetch.size > 0) {
    const products = await Product.find({
      where: { productCode: In([...productsToFetch]) },
      relations: ["images"],
    });

    // Add fetched products to cache and map
    for (const product of products) {
      const productCode = product.productCode.toLowerCase();
      productCache.set(productCode, product);
      productsMap.set(productCode, product);
    }
  }

  return productsMap;
}

async function processOrders(orders: any[]) {
  try {
    // Extract all styles from all orders
    const allStyles = orders.flatMap((order) => order.styles);

    // Fetch all products at once
    const productsMap = await fetchProductsMap(allStyles);

    const newOrders = await Promise.all(
      orders.map(async (order) => {
        const processedStyles = await Promise.all(
          order.styles.map(
            async (style: { styleNo: string; photoUrls: any }) => {
              const product = productsMap.get(style.styleNo.toLowerCase());

              if (!product) {
                console.warn(
                  `No product found with productCode: ${style.styleNo.toLowerCase()}`
                );
                // return {
                //     ...style,
                //     product: null,
                //     convertedFirstProductImage: null,
                //     photoUrl: null,
                //     convertedPhotoUrl: null,
                // };
              }

              // Process images in parallel
              let convertFirstProductImage;
              // const [base64FirstProductImage] = await Promise.all([
              //     product.images[0] ? convertImageToBase64Jpeg(product.images[0].name) : null
              // ]);

              if (product?.images[0]) {
                convertFirstProductImage = await convertImageToBase64Jpeg(
                  product.images[0].name
                );
              }

              // const photoUrls = style.photoUrls ? style.photoUrls.map((path: string) => `https://${CONFIG.S3_BUCKET}.${CONFIG.S3_AWS_ENDPOINT}/${path}`) : null;
              const photoUrls = order.isPreview
                ? style.photoUrls
                : style.photoUrls
                ? style.photoUrls.map(
                    (path: string) =>
                      `https://${CONFIG.S3_BUCKET}.${CONFIG.S3_AWS_ENDPOINT}/${path}`
                  )
                : null;

              return {
                ...style,
                product,
                convertedFirstProductImage: convertFirstProductImage,
                // photoUrl: style.photoUrl ?
                //     `https://${CONFIG.S3_BUCKET}.${CONFIG.S3_AWS_ENDPOINT}/${style.photoUrl}` :
                //     null,
                photoUrls: photoUrls,
              };
            }
          )
        );

        return {
          ...order,
          styles: processedStyles,
        };
      })
    );

    return newOrders;
  } catch (error) {
    console.error("Error processing orders:", error);
    throw error;
  }
}

//orders.orders and default route for orders

//old
// router.get(
//   "/",
//   asyncHandler(async (req: Request, res: Response) => {
//     const {
//       page,
//       query,
//       orderType,
//     }: {
//       page?: string;
//       query?: string;
//       orderType?: string;
//     } = req.query;

//     const skip = (page ? Number(page) - 1 : 0) * 100;
//     const likeQuery = query ? `%${query.toLowerCase()}%` : undefined;
//     const pageSize = 100;

//     let unionQuery;

//     // First query for regular orders
//     const regularOrdersQuery = db
//       .createQueryBuilder()
//       .select([
//         "o.id as id",
//         "o.purchaeOrderNo as purchaeOrderNo",
//         "o.manufacturingEmailAddress as manufacturingEmailAddress",
//         "o.orderType as orderType",
//         "o.orderReceivedDate as orderReceivedDate",
//         "o.orderCancellationDate as orderCancellationDate",
//         "o.address as address",
//         "o.orderStatus as orderStatus",
//         "o.shippingStatus as shippingStatus",
//         "o.shippingDate as shippingDate",
//         "o.trackingNo as trackingNo",
//         "o.createdAt as createdAt",
//         "'regular' as orderSource",
//       ])
//       .from(Order, "o");

//     regularOrdersQuery.andWhere("o.status = 0");
//     if (likeQuery) {
//       regularOrdersQuery.andWhere(
//         "(LOWER(o.purchaeOrderNo) LIKE :likeQuery OR LOWER(o.manufacturingEmailAddress) LIKE :likeQuery)",
//         { likeQuery }
//       );
//     }

//     // Second query for retailer orders
//     const retailerOrdersQuery = db
//       .createQueryBuilder()
//       .select([
//         "ro.id as id",
//         "ro.purchaeOrderNo as purchaeOrderNo",
//         "ro.manufacturingEmailAddress as manufacturingEmailAddress",
//         "CASE WHEN ro.is_stock_order = 1 THEN 'Stock' ELSE 'Fresh' END as orderType",
//         "ro.orderReceivedDate as orderReceivedDate",
//         "ro.orderCancellationDate as orderCancellationDate",
//         "ro.address as address",
//         "ro.orderStatus as orderStatus",
//         "ro.shippingStatus as shippingStatus",
//         "ro.shippingDate as shippingDate",
//         "ro.trackingNo as trackingNo",
//         "ro.createdAt as createdAt",
//         "'retailer' as orderSource",
//       ])
//       .from(RetailerOrder, "ro");
//     retailerOrdersQuery.andWhere("ro.status = 0");

//     if (likeQuery) {
//       retailerOrdersQuery.andWhere(
//         "(LOWER(ro.purchaeOrderNo) LIKE :likeQuery OR LOWER(ro.manufacturingEmailAddress) LIKE :likeQuery)",
//         { likeQuery }
//       );
//     }

//     // Handle orderType filtering
//     if (orderType) {
//       if (orderType === "Stock") {
//         retailerOrdersQuery.andWhere("ro.is_stock_order = 1");
//         unionQuery = retailerOrdersQuery.getQuery();
//       } else if (orderType === "Fresh") {
//         retailerOrdersQuery.andWhere("ro.is_stock_order = 0");
//         unionQuery = retailerOrdersQuery.getQuery();
//       } else {
//         regularOrdersQuery.andWhere("o.orderType = :orderType", { orderType });
//         unionQuery = regularOrdersQuery.getQuery();
//       }
//     } else {
//       unionQuery = `(${regularOrdersQuery.getQuery()}) UNION ALL (${retailerOrdersQuery.getQuery()})`;
//     }

//     const finalQuery = db
//       .createQueryBuilder()
//       .select("*")
//       .from(`(${unionQuery})`, "combined_orders")
//       .orderBy("createdAt", "DESC")
//       .limit(pageSize)
//       .offset(skip);

//     const countQuery = db
//       .createQueryBuilder()
//       .select("COUNT(*) as count")
//       .from(`(${unionQuery})`, "combined_orders");

//     const mergedParams = {
//       ...regularOrdersQuery.getParameters(),
//       ...retailerOrdersQuery.getParameters(),
//     };

//     const [combinedOrders, countResult] = await Promise.all([
//       finalQuery.setParameters(mergedParams).getRawMany(),
//       countQuery.setParameters(mergedParams).getRawOne(),
//     ]);

//     // Fetch related entities
//     const regularOrderIds = combinedOrders
//       .filter((order) => order.orderSource === "regular")
//       .map((order) => order.id);

//     const retailerOrderIds = combinedOrders
//       .filter((order) => order.orderSource === "retailer")
//       .map((order) => order.id);

//     let regularOrdersWithRelations = [] as any;
//     let retailerOrdersWithRelations = [] as any;

//     if (regularOrderIds.length > 0) {
//       regularOrdersWithRelations = await db
//         .createQueryBuilder()
//         .select("order")
//         .from(Order, "order")
//         .leftJoinAndSelect("order.customer", "customer")
//         .leftJoinAndSelect("order.styles", "styles")
//         .where("order.id IN (:...ids)", { ids: regularOrderIds })
//         .getMany();
//     }

//     if (retailerOrderIds.length > 0) {
//       retailerOrdersWithRelations = await db
//         .createQueryBuilder()
//         .select("order")
//         .from(RetailerOrder, "order")
//         .leftJoinAndSelect("order.retailer", "retailer")
//         .leftJoinAndSelect("retailer.customer", "customer")
//         .leftJoinAndSelect("order.favourite_order", "favourite_order")
//         .leftJoinAndSelect("order.Stock_order", "Stock_order")
//         .where("order.id IN (:...ids)", { ids: retailerOrderIds })
//         .getMany();
//     }

//     // Format results
//     const formattedOrders = combinedOrders.map((baseOrder) => {
//       let detailedOrder;
//       if (baseOrder.orderSource === "regular") {
//         detailedOrder = regularOrdersWithRelations.find(
//           (o: any) => o.id === baseOrder.id
//         );
//       } else {
//         detailedOrder = retailerOrdersWithRelations.find(
//           (o: any) => o.id === baseOrder.id
//         );
//       }

//       const styles = detailedOrder?.styles?.map((style: any) => ({
//         ...style,
//         photoUrls: (style.photoUrls as any)?.map(
//           (url: string) =>
//             `https://${CONFIG.S3_BUCKET}.${CONFIG.S3_AWS_ENDPOINT}/${url}`
//         ),
//       }));

//       const result: any = {
//         id: baseOrder.id,
//         createdAt: baseOrder.createdAt,
//         purchaeOrderNo: baseOrder.purchaeOrderNo,
//         manufacturingEmailAddress: baseOrder.manufacturingEmailAddress,
//         orderType: baseOrder.orderType,
//         orderReceivedDate: baseOrder.orderReceivedDate,
//         orderCancellationDate: baseOrder.orderCancellationDate,
//         address: baseOrder.address,
//         orderStatus: baseOrder.orderStatus,
//         shippingStatus: baseOrder.shippingStatus,
//         shippingDate: baseOrder.shippingDate,
//         trackingNo: baseOrder.trackingNo,
//         customer:
//           baseOrder.orderSource === "regular"
//             ? detailedOrder?.customer
//               ? {
//                   id: detailedOrder.customer.id,
//                   name: detailedOrder.customer.name,
//                 }
//               : null
//             : detailedOrder?.retailer?.customer
//             ? {
//                 id: detailedOrder.retailer.customer.id,
//                 name: detailedOrder.retailer.customer.name,
//               }
//             : null,
//         styles: styles || [],
//         orderSource: baseOrder.orderSource,
//       };

//       // Add retailer-specific fields
//       if (baseOrder.orderSource === "retailer") {
//         result.retailer = detailedOrder?.retailer;

//         // For Stock orders, include stockId
//         if (baseOrder.orderType === "Stock" && detailedOrder?.Stock_order) {
//           result.stockId = detailedOrder.Stock_order.id;
//           result.Stock_order = detailedOrder.Stock_order;
//         }

//         // For Fresh orders (assuming these are favourite orders), include favourite order details
//         if (baseOrder.orderType === "Fresh" && detailedOrder?.favourite_order) {
//           result.favouriteOrder = detailedOrder.favourite_order;
//         }
//       }

//       return result;
//     });

//     res.json({
//       orders: formattedOrders,
//       totalCount: parseInt(countResult?.count || "0"),
//     });
//   })
// );

//new1
// router.get(
//   "/",
//   asyncHandler(async (req: Request, res: Response) => {
//     const {
//       page,
//       query,
//       orderType,
//     }: {
//       page?: string;
//       query?: string;
//       orderType?: string;
//     } = req.query;

//     const skip = (page ? Number(page) - 1 : 0) * 100;
//     const likeQuery = query ? `%${query.toLowerCase()}%` : undefined;
//     const pageSize = 100;

//     let unionQuery;

//     // First query for regular orders
//     const regularOrdersQuery = db
//       .createQueryBuilder()
//       .select([
//         "o.id as id",
//         "o.purchaeOrderNo as purchaeOrderNo",
//         "o.manufacturingEmailAddress as manufacturingEmailAddress",
//         "o.orderType as orderType",
//         "o.orderReceivedDate as orderReceivedDate",
//         "o.orderCancellationDate as orderCancellationDate",
//         "o.address as address",
//         "o.orderStatus as orderStatus",
//         "o.shippingStatus as shippingStatus",
//         "o.shippingDate as shippingDate",
//         "o.trackingNo as trackingNo",
//         "o.createdAt as createdAt",
//         "'regular' as orderSource",
//       ])
//       .from(Order, "o")
//       .where("o.status = 0");

//     if (likeQuery) {
//       regularOrdersQuery.andWhere(
//         "(LOWER(o.purchaeOrderNo) LIKE :likeQuery OR LOWER(o.manufacturingEmailAddress) LIKE :likeQuery)",
//         { likeQuery }
//       );
//     }

//     // console.log("this is route");
//     // Second query for retailer orders
//     const retailerOrdersQuery = db
//       .createQueryBuilder()
//       .select([
//         "ro.id as id",
//         "ro.purchaeOrderNo as purchaeOrderNo",
//         "ro.manufacturingEmailAddress as manufacturingEmailAddress",
//         "CASE WHEN ro.is_stock_order = 1 THEN 'Stock' ELSE 'Fresh' END as orderType",
//         "ro.orderReceivedDate as orderReceivedDate",
//         "ro.orderCancellationDate as orderCancellationDate",
//         "ro.address as address",
//         "ro.orderStatus as orderStatus",
//         "ro.shippingStatus as shippingStatus",
//         "ro.shippingDate as shippingDate",
//         "ro.trackingNo as trackingNo",
//         "ro.createdAt as createdAt",
//         "'retailer' as orderSource",
//       ])
//       .from(RetailerOrder, "ro")
//       // .where("ro.status_id  = 0");
//       .where("ro.status = 0");

//     if (likeQuery) {
//       retailerOrdersQuery.andWhere(
//         "(LOWER(ro.purchaeOrderNo) LIKE :likeQuery OR LOWER(ro.manufacturingEmailAddress) LIKE :likeQuery)",
//         { likeQuery }
//       );
//     }

//     if (orderType) {
//       if (orderType === "Stock") {
//         retailerOrdersQuery.andWhere("ro.is_stock_order = 1");
//         unionQuery = retailerOrdersQuery.getQuery();
//       } else if (orderType === "Fresh") {
//         retailerOrdersQuery.andWhere("ro.is_stock_order = 0");
//         unionQuery = retailerOrdersQuery.getQuery();
//       } else {
//         regularOrdersQuery.andWhere("o.orderType = :orderType", { orderType });
//         unionQuery = regularOrdersQuery.getQuery();
//       }
//     } else {
//       unionQuery = `(${regularOrdersQuery.getQuery()}) UNION ALL (${retailerOrdersQuery.getQuery()})`;
//     }

//     const finalQuery = db
//       .createQueryBuilder()
//       .select("*")
//       .from(`(${unionQuery})`, "combined_orders")
//       .orderBy("createdAt", "DESC")
//       .limit(pageSize)
//       .offset(skip);

//     const countQuery = db
//       .createQueryBuilder()
//       .select("COUNT(*) as count")
//       .from(`(${unionQuery})`, "combined_orders");

//     const mergedParams = {
//       ...regularOrdersQuery.getParameters(),
//       ...retailerOrdersQuery.getParameters(),
//     };

//     const [combinedOrders, countResult] = await Promise.all([
//       finalQuery.setParameters(mergedParams).getRawMany(),
//       countQuery.setParameters(mergedParams).getRawOne(),
//     ]);

//     const regularOrderIds = combinedOrders
//       .filter((order) => order.orderSource === "regular")
//       .map((order) => order.id);

//     const retailerOrderIds = combinedOrders
//       .filter((order) => order.orderSource === "retailer")
//       .map((order) => order.id);

//     let regularOrdersWithRelations = [] as any;
//     let retailerOrdersWithRelations = [] as any;

//     if (regularOrderIds.length > 0) {
//       regularOrdersWithRelations = await db
//         .createQueryBuilder()
//         .select("order")
//         .from(Order, "order")
//         .leftJoinAndSelect("order.customer", "customer")
//         .leftJoinAndSelect("order.styles", "styles")
//         .where("order.id IN (:...ids)", { ids: regularOrderIds })
//         .getMany();
//     }

//     if (retailerOrderIds.length > 0) {
//       retailerOrdersWithRelations = await db
//         .createQueryBuilder()
//         .select("order")
//         .from(RetailerOrder, "order")
//         .leftJoinAndSelect("order.retailer", "retailer")
//         .leftJoinAndSelect("retailer.customer", "customer")
//         .leftJoinAndSelect("order.favourite_order", "favourite_order")
//         .leftJoinAndSelect("order.Stock_order", "Stock_order")
//         .where("order.id IN (:...ids)", { ids: retailerOrderIds })
//         .getMany();
//     }

//     //Fetch and map payment data for retailer orders
//     const paymentsMap = new Map<number, number>();
//     if (retailerOrderIds.length > 0) {
//       const retailerPayments = await db
//         .createQueryBuilder()
//         .select("payment.orderId", "orderId")
//         .addSelect("SUM(payment.amount)", "paidAmount")
//         .from("retailer_order_payments", "payment")
//         .where("payment.orderId IN (:...ids)", { ids: retailerOrderIds })
//         .groupBy("payment.orderId")
//         .getRawMany();

//       retailerPayments.forEach((p) => {
//         paymentsMap.set(Number(p.orderId), Number(p.paidAmount));
//       });
//     }

//     // Final formatting
//     const formattedOrders = combinedOrders.map((baseOrder) => {
//       let detailedOrder;
//       if (baseOrder.orderSource === "regular") {
//         detailedOrder = regularOrdersWithRelations.find(
//           (o: any) => o.id === baseOrder.id
//         );
//       } else {
//         detailedOrder = retailerOrdersWithRelations.find(
//           (o: any) => o.id === baseOrder.id
//         );
//       }

//       const styles = detailedOrder?.styles?.map((style: any) => ({
//         ...style,
//         photoUrls: (style.photoUrls as any)?.map(
//           (url: string) =>
//             `https://${CONFIG.S3_BUCKET}.${CONFIG.S3_AWS_ENDPOINT}/${url}`
//         ),
//       }));

//       const result: any = {
//         id: baseOrder.id,
//         createdAt: baseOrder.createdAt,
//         purchaeOrderNo: baseOrder.purchaeOrderNo,
//         manufacturingEmailAddress: baseOrder.manufacturingEmailAddress,
//         orderType: baseOrder.orderType,
//         orderReceivedDate: baseOrder.orderReceivedDate,
//         orderCancellationDate: baseOrder.orderCancellationDate,
//         address: baseOrder.address,
//         orderStatus: baseOrder.orderStatus,
//         shippingStatus: baseOrder.shippingStatus,
//         shippingDate: baseOrder.shippingDate,
//         trackingNo: baseOrder.trackingNo,
//         customer:
//           baseOrder.orderSource === "regular"
//             ? detailedOrder?.customer
//               ? {
//                   id: detailedOrder.customer.id,
//                   name: detailedOrder.customer.name,
//                 }
//               : null
//             : detailedOrder?.retailer?.customer
//             ? {
//                 id: detailedOrder.retailer.customer.id,
//                 name: detailedOrder.retailer.customer.name,
//               }
//             : null,
//         styles: styles || [],
//         orderSource: baseOrder.orderSource,
//       };

//       if (baseOrder.orderSource === "retailer") {
//         result.retailer = detailedOrder?.retailer;

//         if (baseOrder.orderType === "Stock" && detailedOrder?.Stock_order) {
//           result.stockId = detailedOrder.Stock_order.id;
//           result.Stock_order = detailedOrder.Stock_order;
//         }

//         if (baseOrder.orderType === "Fresh" && detailedOrder?.favourite_order) {
//           result.favouriteOrder = detailedOrder.favourite_order;
//         }

//         //  payment-related info
//         const purchaseAmount = Number(detailedOrder?.purchaseAmount || 0);
//         const paidAmount = paymentsMap.get(baseOrder.id) || 0;
//         const balancePayment = purchaseAmount - paidAmount;

//         result.purchaseAmount = purchaseAmount;
//         result.paidAmount = paidAmount;
//         result.balancePayment = balancePayment;
//       }

//       return result;
//     });

//     res.json({
//       orders: formattedOrders,
//       totalCount: parseInt(countResult?.count || "0"),
//     });
//   })
// );

//new2 for default route for orders
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const {
      page,
      query,
      orderType,
    }: {
      page?: string;
      query?: string;
      orderType?: string;
    } = req.query;

    const skip = (page ? Number(page) - 1 : 0) * 100;
    const likeQuery = query ? `%${query.toLowerCase()}%` : undefined;
    const pageSize = 100;

    let unionQuery;

    // First query for regular orders
    const regularOrdersQuery = db
      .createQueryBuilder()
      .select([
        "o.id as id",
        "o.purchaeOrderNo as purchaeOrderNo",
        "o.manufacturingEmailAddress as manufacturingEmailAddress",
        "o.orderType as orderType",
        "o.orderReceivedDate as orderReceivedDate",
        "o.orderCancellationDate as orderCancellationDate",
        "o.address as address",
        "o.orderStatus as orderStatus",
        "o.shippingStatus as shippingStatus",
        "o.shippingDate as shippingDate",
        "o.trackingNo as trackingNo",
        "o.createdAt as createdAt",
        "'regular' as orderSource",
      ])
      .from(Order, "o")
      .leftJoin("o.customer", "customer") // Join the Customer table to filter by name
      .where("o.status = 0");

    if (likeQuery) {
      regularOrdersQuery.andWhere(
        "(LOWER(o.purchaeOrderNo) LIKE :likeQuery OR LOWER(customer.name) LIKE :likeQuery)", // Add filter for customer.name
        { likeQuery }
      );
    }

    // Second query for retailer orders
    const retailerOrdersQuery = db
      .createQueryBuilder()
      .select([
        "ro.id as id",
        "ro.purchaeOrderNo as purchaeOrderNo",
        "ro.manufacturingEmailAddress as manufacturingEmailAddress",
        "CASE WHEN ro.is_stock_order = 1 THEN 'Stock' ELSE 'Fresh' END as orderType",
        "ro.orderReceivedDate as orderReceivedDate",
        "ro.orderCancellationDate as orderCancellationDate",
        "ro.address as address",
        "ro.orderStatus as orderStatus",
        "ro.shippingStatus as shippingStatus",
        "ro.shippingDate as shippingDate",
        "ro.trackingNo as trackingNo",
        "ro.createdAt as createdAt",
        "'retailer' as orderSource",
      ])
      .from(RetailerOrder, "ro")
      .leftJoin("ro.retailer", "retailer") // Join the Retailer table
      .leftJoin("retailer.customer", "customer") // Join the Customer table to filter by name
      .where("ro.status = 0");

    if (likeQuery) {
      retailerOrdersQuery.andWhere(
        "(LOWER(ro.purchaeOrderNo) LIKE :likeQuery OR LOWER(customer.name) LIKE :likeQuery)", // Add filter for customer.name
        { likeQuery }
      );
    }

    if (orderType) {
      if (orderType === "Stock") {
        retailerOrdersQuery.andWhere("ro.is_stock_order = 1");
        unionQuery = retailerOrdersQuery.getQuery();
      } else if (orderType === "Fresh") {
        retailerOrdersQuery.andWhere("ro.is_stock_order = 0");
        unionQuery = retailerOrdersQuery.getQuery();
      } else {
        regularOrdersQuery.andWhere("o.orderType = :orderType", { orderType });
        unionQuery = regularOrdersQuery.getQuery();
      }
    } else {
      unionQuery = `(${regularOrdersQuery.getQuery()}) UNION ALL (${retailerOrdersQuery.getQuery()})`;
    }

    const finalQuery = db
      .createQueryBuilder()
      .select("*")
      .from(`(${unionQuery})`, "combined_orders")
      .orderBy("createdAt", "DESC")
      .limit(pageSize)
      .offset(skip);

    const countQuery = db
      .createQueryBuilder()
      .select("COUNT(*) as count")
      .from(`(${unionQuery})`, "combined_orders");

    const mergedParams = {
      ...regularOrdersQuery.getParameters(),
      ...retailerOrdersQuery.getParameters(),
    };

    const [combinedOrders, countResult] = await Promise.all([
      finalQuery.setParameters(mergedParams).getRawMany(),
      countQuery.setParameters(mergedParams).getRawOne(),
    ]);

    const regularOrderIds = combinedOrders
      .filter((order) => order.orderSource === "regular")
      .map((order) => order.id);

    const retailerOrderIds = combinedOrders
      .filter((order) => order.orderSource === "retailer")
      .map((order) => order.id);

    let regularOrdersWithRelations = [] as any;
    let retailerOrdersWithRelations = [] as any;

    if (regularOrderIds.length > 0) {
      regularOrdersWithRelations = await db
        .createQueryBuilder()
        .select("order")
        .from(Order, "order")
        .leftJoinAndSelect("order.customer", "customer")
        .leftJoinAndSelect("order.styles", "styles")
        .where("order.id IN (:...ids)", { ids: regularOrderIds })
        .getMany();
    }

    if (retailerOrderIds.length > 0) {
      retailerOrdersWithRelations = await db
        .createQueryBuilder()
        .select("order")
        .from(RetailerOrder, "order")
        .leftJoinAndSelect("order.retailer", "retailer")
        .leftJoinAndSelect("retailer.customer", "customer")
        .leftJoinAndSelect("order.favourite_order", "favourite_order")
        .leftJoinAndSelect("order.Stock_order", "Stock_order")
        .where("order.id IN (:...ids)", { ids: retailerOrderIds })
        .getMany();
    }

    // Fetch and map payment data for retailer orders
    const paymentsMap = new Map<number, number>();
    if (retailerOrderIds.length > 0) {
      const retailerPayments = await db
        .createQueryBuilder()
        .select("payment.orderId", "orderId")
        .addSelect("SUM(payment.amount)", "paidAmount")
        .from("retailer_order_payments", "payment")
        .where("payment.orderId IN (:...ids)", { ids: retailerOrderIds })
        .groupBy("payment.orderId")
        .getRawMany();

      retailerPayments.forEach((p) => {
        paymentsMap.set(Number(p.orderId), Number(p.paidAmount));
      });
    }

    // Final formatting
    const formattedOrders = combinedOrders.map((baseOrder) => {
      let detailedOrder;
      if (baseOrder.orderSource === "regular") {
        detailedOrder = regularOrdersWithRelations.find(
          (o: any) => o.id === baseOrder.id
        );
      } else {
        detailedOrder = retailerOrdersWithRelations.find(
          (o: any) => o.id === baseOrder.id
        );
      }

      const styles = detailedOrder?.styles?.map((style: any) => ({
        ...style,
        photoUrls: (style.photoUrls as any)?.map(
          (url: string) =>
            `https://${CONFIG.S3_BUCKET}.${CONFIG.S3_AWS_ENDPOINT}/${url}`
        ),
      }));

      const result: any = {
        id: baseOrder.id,
        createdAt: baseOrder.createdAt,
        purchaeOrderNo: baseOrder.purchaeOrderNo,
        manufacturingEmailAddress: baseOrder.manufacturingEmailAddress,
        orderType: baseOrder.orderType,
        orderReceivedDate: baseOrder.orderReceivedDate,
        orderCancellationDate: baseOrder.orderCancellationDate,
        address: baseOrder.address,
        orderStatus: baseOrder.orderStatus,
        shippingStatus: baseOrder.shippingStatus,
        shippingDate: baseOrder.shippingDate,
        trackingNo: baseOrder.trackingNo,
        customer:
          baseOrder.orderSource === "regular"
            ? detailedOrder?.customer
              ? {
                  id: detailedOrder.customer.id,
                  name: detailedOrder.customer.name,
                }
              : null
            : detailedOrder?.retailer?.customer
            ? {
                id: detailedOrder.retailer.customer.id,
                name: detailedOrder.retailer.customer.name,
              }
            : null,
        styles: styles || [],
        orderSource: baseOrder.orderSource,
      };

      if (baseOrder.orderSource === "retailer") {
        result.retailer = detailedOrder?.retailer;

        if (baseOrder.orderType === "Stock" && detailedOrder?.Stock_order) {
          result.stockId = detailedOrder.Stock_order.id;
          result.Stock_order = detailedOrder.Stock_order;
        }

        if (baseOrder.orderType === "Fresh" && detailedOrder?.favourite_order) {
          result.favouriteOrder = detailedOrder.favourite_order;
        }

        // payment-related info
        const purchaseAmount = Number(detailedOrder?.purchaseAmount || 0);
        const paidAmount = paymentsMap.get(baseOrder.id) || 0;
        const balancePayment = purchaseAmount - paidAmount;

        result.purchaseAmount = purchaseAmount;
        result.paidAmount = paidAmount;
        result.balancePayment = balancePayment;
      }

      return result;
    });

    res.json({
      orders: formattedOrders,
      totalCount: parseInt(countResult?.count || "0"),
    });
  })
);

router.get(
  "/orderDetails",
  asyncHandler(async (req: Request, res: Response) => {
    const { orderId } = req.query as any;

    const order = await Order.find({
      where: {
        id: Number(orderId),
      },
      relations: ["customer", "styles"],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const processedOrders = await processOrders(order);

    res.json({
      success: true,
      orders: processedOrders,
    });
  })
);

router.post(
  "/preview",
  raw({
    type: "multipart/form-data",
    limit: "100mb",
  }),
  asyncHandler(async (req: Request, res: Response) => {
    const busboy = Busboy({ headers: req.headers });
    const fields: Field = {};
    const filePromises: Promise<FileData>[] = [];

    busboy.on("field", (fieldname: string, val: string) => {
      fields[fieldname] = val;
    });

    busboy.on(
      "file",
      (
        fieldname: string,
        file: NodeJS.ReadableStream,
        filename: string,
        encoding: string,
        mimetype: string
      ) => {
        const buffers: Buffer[] = [];

        const filePromise = new Promise<FileData>((resolve, reject) => {
          file.on("data", (data: Buffer) => {
            buffers.push(data);
          });

          file.on("end", () => {
            const fileBuffer = Buffer.concat(buffers);
            resolve({
              fieldname,
              filename,
              encoding,
              mimetype,
              buffer: fileBuffer,
            });
          });

          file.on("error", (error: Error) => {
            reject(error);
          });
        });

        filePromises.push(filePromise);
      }
    );

    busboy.on("finish", async () => {
      try {
        const files = await Promise.all(filePromises);

        // Parse the fields
        const purchaseOrderNo = fields["purchaseOrderNo"];
        const manufacturingEmailAddress = fields["manufacturingEmailAddress"];
        const orderType = fields["orderType"];
        const orderReceivedDate = new Date(fields["orderReceivedDate"]);
        const orderCancellationDate = new Date(fields["orderCancellationDate"]);
        const address = fields["address"];
        const customerId = Number(fields["customerId"]);

        // Parse styles from fields
        const styles: any = [];
        for (const key in fields) {
          if (key.startsWith("styles[")) {
            const matches = key.match(/\[(\d+)\]\.(.+)/);
            if (matches) {
              const index = Number(matches[1]);
              const field = matches[2];
              if (!styles[index]) {
                styles[index] = {};
              }
              styles[index][field] = fields[key];
            }
          }
        }

        // Fetch the customer
        const customer = await Customer.findOneOrFail({
          where: {
            id: customerId,
          },
        });

        // Create a temporary order object (not saved to database)
        const orderPreview = {
          id: -1, // Temporary ID for preview
          purchaseOrderNo,
          manufacturingEmailAddress,
          orderType,
          orderReceivedDate,
          orderCancellationDate,
          address,
          customer,
          isPreview: true,
          styles: await Promise.all(
            styles.map(async (style: any, index: number) => {
              // Process style images
              const styleImages = files.filter(
                (file) =>
                  file.fieldname === `styles[${index}].modifiedPhotoImage`
              );

              const imageUrls = await Promise.all(
                styleImages.map(async (file) => {
                  if (!file) return null;

                  // Generate a temporary preview URL or base64 image
                  const compressedImage = await sharp(file.buffer)
                    .jpeg()
                    .toBuffer();

                  // Return base64 for preview
                  return {
                    fileName: `data:image/jpeg;base64,${compressedImage.toString(
                      "base64"
                    )}`,
                  };
                })
              );

              return {
                colorType: style.colorType,
                // customColor: style.customColor,
                customColor:
                  typeof style.customColor === "string"
                    ? JSON.parse(style.customColor)
                    : style.customColor,
                sizeCountry: style.sizeCountry,
                size: style.size,
                // customSize: style.customSize,
                customSize:
                  typeof style.customSize === "string"
                    ? JSON.parse(style.customSize)
                    : style.customSize,
                quantity: Number(style.quantity),
                styleNo: style.styleNo,
                // comments: style.comments,
                comments:
                  typeof style.comments === "string"
                    ? JSON.parse(style.comments)
                    : style.comments,
                // customSizesQuantity: style.customSizesQuantity,
                customSizesQuantity:
                  typeof style.customSizesQuantity === "string"
                    ? JSON.parse(style.customSizesQuantity)
                    : style.customSizesQuantity,
                photoUrls: imageUrls
                  .filter((url) => url !== null)
                  .map((url) => url?.fileName),
                mesh: style.mesh,
                beading: style.beading,
                liningColor: style.liningColor,
                lining: style.lining,
              };
            })
          ),
        };

        // Process the preview order using the existing processOrders function
        const processedOrder = await processOrders([orderPreview]);

        res.json({
          success: true,
          orders: processedOrder,
        });
      } catch (error: any) {
        console.error(error);
        res.status(500).json({
          error: "An error occurred while processing the preview",
          details: error.message,
        });
      }
    });

    busboy.end(req.body);
  })
);

router.put(
  "/orderStatus",
  asyncHandler(async (req: Request, res: Response) => {
    const { orderId, status } = req.body as { orderId: number; status: string };

    const order = await Order.findOne({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = status as any;

    await order.save();

    res.json({
      success: true,
      message: "Order status updated successfully",
    });
  })
);

router.put(
  "/orderShippingStatus",
  asyncHandler(async (req: Request, res: Response) => {
    const { orderId, status } = req.body as { orderId: number; status: string };

    const order = await Order.findOne({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.shippingStatus = status as any;

    await order.save();

    res.json({
      success: true,
      message: "Order status updated successfully",
    });
  })
);

router.put(
  "/tracking",
  asyncHandler(async (req: Request, res: Response) => {
    const { orderId, trackingNo } = req.body as {
      orderId: number;
      trackingNo: string;
    };

    const order = await Order.findOne({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.trackingNo = trackingNo;

    await order.save();

    res.json({
      success: true,
      message: "Tracking ID updated successfully",
    });
  })
);

router.get(
  "/retailer-order/status/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const order = await RetailerOrder.findOne({
      select: ["pattern", "stitching", "ready_to_delivery", "beading"],
      where: {
        id: Number(id),
      },
    });

    res.json({
      success: true,
      data: order,
    });
  })
);

router.get(
  "/order/status/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const order = await Order.findOne({
      select: ["pattern", "stitching", "ready_to_delivery", "beading"],
      where: {
        id: Number(id),
      },
    });

    res.json({
      success: true,
      data: order,
    });
  })
);

router.get(
  "/latest-regular-order",
  asyncHandler(async (req: Request, res: Response) => {
    const latestOrder = await Order.find({
      order: {
        id: "desc",
      },
      take: 1,
    });

    return res.json(latestOrder[0]);
  })
);

router.get(
  "/latest-retailer-order",
  asyncHandler(async (req: Request, res: Response) => {
    const latestOrder = await RetailerOrder.find({
      order: {
        id: "desc",
      },
      take: 1,
    });

    // console.log(latestOrder, "latestRetailerOrder");

    return res.json(latestOrder[0] || {});
  })
);

export default router;
