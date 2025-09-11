import { Router, Request, Response, raw } from "express";
import asyncHandler from "../middleware/AsyncHandler";
import Favourites from "../models/Favourites";
import RetailerFavouritesOrders from "../models/ReailerFavouritesOrder";
import Retailer from "../models/Retailer";
import Stock from "../models/Stock";
import { RetailerOrder } from "../models/RetailerOrder";
import RetailerStockOrders from "../models/RetailerStockOrders";
import db from "../db";
import RetailerOrdersPayment from "../models/RetailerPaymentModal";
import { getRepository, In, MoreThan } from "typeorm";
import Order from "../models/Order";

const router = Router();

router.post(
  "/favourites/:retailerId",
  asyncHandler(async (req: Request, res: Response) => {
    const { favourateData } = req.body;
    const { retailerId } = req.params;

    if (favourateData && favourateData.length > 0) {
      for (let index = 0; index < favourateData.length; index++) {
        const favorite = await Favourites.findOne({
          where: {
            id: favourateData[index].id,
          },
        });
        if (favorite) {
          favorite.is_order_placed = 1;
          favorite.customization = favourateData[index].customization;
          await favorite.save();
        }
      }
    } else {
      const favorite = await Favourites.findOne({
        where: {
          id: favourateData.id,
        },
      });
      if (favorite) {
        favorite.is_order_placed = 1;
        favorite.customization = favourateData.customization;
        await favorite.save();
      }
    }

    const favOrders = new RetailerFavouritesOrders();

    const retailer = await Retailer.findOne({
      where: {
        id: Number(retailerId),
      },
    });
    if (favourateData && favourateData.length > 0) {
      favOrders.favourite_ids = favourateData
        .map((item: any) => item.id)
        .join(",");
    } else {
      favOrders.favourite_ids = favourateData.id;
    }
    if (retailer) {
      favOrders.retailer = retailer;
    }

    await favOrders.save();
    res.json({
      success: true,
      message: "Add to orders",
    });
  })
);

router.post(
  "/stock/:retailerId/:stockId/:quantity",
  asyncHandler(async (req: Request, res: Response) => {
    const { retailerId, stockId, quantity } = req.params;
    const { currencyId } = req.body;

    const retailer = await Retailer.findOne({
      where: {
        id: Number(retailerId),
      },
      relations: ["customer", "customer.currency"],
    });

    const stock = await Stock.findOne({
      where: {
        id: Number(stockId),
      },
      relations: ["currencyPricing", "currencyPricing.currency"],
    });

    if (!stock || !retailer) {
      res.json({
        success: false,
        message: "Fail to orders",
      });
      return;
    }
    const stock_orders = new RetailerStockOrders();

    stock_orders.retailer = retailer;
    stock_orders.quantity = Number(quantity);
    stock_orders.stock = stock;
    stock_orders.mesh_color = stock.mesh_color;
    stock_orders.beading_color = stock.beading_color;
    stock_orders.lining = stock.lining;
    stock_orders.lining_color = stock.lining_color;

    // Store retailer's currency for order processing
    let retailerCurrency: any;
    if (retailer.customer && retailer.customer.currency) {
      retailerCurrency = retailer.customer.currency;
    }

    if (retailerCurrency) {
      stock_orders.currency = retailerCurrency;
      stock_orders.currencyId = retailerCurrency.id;
    }

    await stock_orders.save();
    res.json({
      success: true,
      message: "Add to orders",
    });
  })
);

router.get(
  "/customer/:id/:retailerOrderID",
  asyncHandler(async (req: Request, res: Response) => {
    const { id, retailerOrderID } = req.params;

    const retailer = await Retailer.findOneOrFail({
      where: {
        id: Number(id),
      },
    });

    const retailerOrder = await RetailerFavouritesOrders.findOneOrFail({
      where: {
        id: Number(retailerOrderID),
      },
    });

    const approvedData = await RetailerOrder.findOne({
      where: {
        favourite_order: {
          id: Number(retailerOrderID) || 0,
        },
      },
    });

    let splitValue = retailerOrder.favourite_ids.split(",");

    const fav: any = [];

    for (let index = 0; index < splitValue.length; index++) {
      const favourites = await Favourites.findOne({
        where: {
          retailer: {
            id: retailer.id,
          },
          id: Number(splitValue[index]),
          is_order_placed: 1,
        },
        relations: [
          "product",
          "product.images",
          "product.currencyPricing",
          "product.currencyPricing.currency",
          "currency",
        ],
      });

      if (favourites) {
        // Calculate currency-specific price
        let displayPrice = favourites.product.price; // Default Euro price

        if (favourites.currency) {
          // Find product price in favourite's stored currency
          const currencyPricing = favourites.product.currencyPricing.find(
            (pricing) => pricing.currency.id === favourites.currency.id
          );

          if (currencyPricing) {
            displayPrice = currencyPricing.price;
          }
        }

        // Apply size-based tiered markup
        const size = Number(favourites.product_size);
        if (size >= 48) {
          const tier = Math.floor((size - 48) / 4);
          const markup = 1 + (tier + 1) * 0.2;
          displayPrice = displayPrice * markup;
        }

        // Add currency information for frontend display
        const enhancedFavourite = {
          ...favourites,
          displayPrice: Math.round(displayPrice * favourites.quantity),
          unitPrice: displayPrice,
          currencyName: favourites.currency?.name || null,
          currencySymbol: favourites.currency?.symbol || null,
          regionPrice: displayPrice * favourites.quantity,
        };

        fav.push(enhancedFavourite);
      }
    }

    res.json({
      success: true,
      favourites: fav,
      // rr: favourites,
    });
  })
);

router.get(
  "/customer-stock/:id/:stockId",
  asyncHandler(async (req: Request, res: Response) => {
    const { id, stockId } = req.params;

    // Raw SQL Query with positional parameters
    const query = `
      SELECT 
          rf.id,
          rf.createdAt,
          rf.quantity as buy_quantity,
          s.*,
          CASE 
            WHEN s.size >= 60 THEN COALESCE(scp.discountedPrice, s.discountedPrice) * 1.60
            WHEN s.size >= 56 THEN COALESCE(scp.discountedPrice, s.discountedPrice) * 1.40
            WHEN s.size >= 52 THEN COALESCE(scp.discountedPrice, s.discountedPrice) * 1.40
            WHEN s.size >= 48 THEN COALESCE(scp.discountedPrice, s.discountedPrice) * 1.20
            ELSE COALESCE(scp.discountedPrice, s.discountedPrice)
          END AS unitPrice,
          p.id AS product_id,
          p.createdAt AS product_createdAt,
          p.quantity AS product_quantity,
          p.productCode,
          p.description,
          p.minSaleQuantity,
          p.hasReturnPolicy,
          p.hasDiscount,
          p.stockAlert,
          pm.id AS image_id,
          pm.createdAt AS image_createdAt,
          pm.name AS image_name,
          pm.isMain AS image_isMain,
          c.id AS color_id,
          c.createdAt AS color_createdAt,
          c.name AS color_name,
          c.hexcode AS color_hexcode,
          COALESCE(curr.symbol, '€') as currencySymbol,
          COALESCE(curr.name, 'Euro') as currencyName,
          COALESCE(curr.id, 1) as currencyId
      FROM retailer_stock_orders AS rf
      INNER JOIN stock AS s ON s.id = rf.stockId
      INNER JOIN products AS p ON p.id = s.styleNo
      INNER JOIN productimages AS pm ON pm.productId = p.id
      LEFT JOIN product_colours AS c ON c.id = s.colors
      LEFT JOIN currencies curr ON curr.id = rf.currencyId
      LEFT JOIN stock_currency_pricing scp ON scp.stockId = s.id AND scp.currencyId = rf.currencyId
      WHERE rf.id = ? AND rf.retailerId = ?
      group by rf.id
    `;

    // Execute the raw SQL query using positional parameters
    const result = await db.query(query, [stockId, id]);

    if (result.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Stock not found" });
    }
    // Transform the first row into the desired format
    // const firstRow = result[0];

    res.json({
      success: true,
      favourites: result,
    });
  })
);
router.get(
  "/admin/stock-orders",
  asyncHandler(async (req: Request, res: Response) => {
    const { retailerId, page, query } = req.query as {
      retailerId?: string;
      page?: string;
      query?: string;
    };

    const skip = (page ? Number(page) - 1 : 0) * 10;
    const take = 10;
    const params: any[] = [];
    const whereClauses: string[] = [];

    // Base SQL query
    let dataSql = `
      SELECT 
      DATE_FORMAT(rf.createdAt, '%Y-%m-%d') AS formatted_date,
        rf.id as id,
        s.id as stock_id,
        c.name,
        p.productCode,
        p.id as product_id,
        rf.quantity,
        s.size as size,
        s.size_country,
        CASE 
          WHEN s.size >= 60 THEN COALESCE(scp.discountedPrice, s.discountedPrice) * 1.60 * rf.quantity
          WHEN s.size >= 56 THEN COALESCE(scp.discountedPrice, s.discountedPrice) * 1.40 * rf.quantity
          WHEN s.size >= 52 THEN COALESCE(scp.discountedPrice, s.discountedPrice) * 1.40 * rf.quantity
          WHEN s.size >= 48 THEN COALESCE(scp.discountedPrice, s.discountedPrice) * 1.20 * rf.quantity
          ELSE COALESCE(scp.discountedPrice, s.discountedPrice) * rf.quantity
        END AS total_price,
        COALESCE(curr.symbol, '€') as currencySymbol,
        COALESCE(curr.name, 'Euro') as currencyName
      FROM retailer_stock_orders rf
      INNER JOIN stock s ON s.id = rf.stockId
      INNER JOIN products p ON p.id = s.styleNo
      INNER JOIN retailers r ON r.id = rf.retailerId
      INNER JOIN customers as c on c.id = r.customerId
      LEFT JOIN currencies curr ON curr.id = rf.currencyId
      LEFT JOIN stock_currency_pricing scp ON scp.stockId = s.id AND scp.currencyId = rf.currencyId
    `;

    // Handle retailerId condition
    if (retailerId !== "all") {
      whereClauses.push("rf.retailerId = ?");
      params.push(Number(retailerId));
    }

    // Add is_approved condition
    whereClauses.push("rf.is_approved = 0");

    // Handle search query
    if (query) {
      const likeQuery = `%${query.toLowerCase()}%`;
      whereClauses.push(
        "(LOWER(p.productCode) LIKE ? OR LOWER(r.name) LIKE ?)"
      );
      params.push(likeQuery, likeQuery);
    }

    // Add WHERE clauses
    dataSql += " WHERE " + whereClauses.join(" AND ");

    // Add ordering and pagination
    dataSql += `
      ORDER BY rf.createdAt DESC
      LIMIT ? OFFSET ?
    `;
    params.push(take, skip);

    // Total count query
    const countSql = `
      SELECT COUNT(*) AS total
      FROM retailer_stock_orders rf
      INNER JOIN stock s ON s.id = rf.stockId
      INNER JOIN products p ON p.id = s.styleNo
      INNER JOIN customers r ON r.id = rf.retailerId
      WHERE ${whereClauses.join(" AND ")}
    `;

    const stockOrders = await db.query(dataSql, params);
    const totalResult = await db.query(countSql, params.slice(0, -2)); // Remove limit/offset params

    return res.json({
      success: true,
      stockOrders: stockOrders,
      totalCount: totalResult?.[0]?.total,
    });
  })
);

router.get(
  "/admin/favorites-orders",
  asyncHandler(async (req: Request, res: Response) => {
    const { retailerId, page, query } = req.query as {
      retailerId?: string;
      page?: string;
      query?: string;
    };

    const skip = (page ? Number(page) - 1 : 0) * 100;
    const take = 100;
    const params: any[] = [];
    const whereClauses: string[] = [];

    // Base SQL query with grouping
    let dataSql = `
      SELECT 
        rf.id as id,
DATE_FORMAT(rf.createdAt, '%Y-%m-%d') AS formatted_date,
        c.name,
        SUM(f.quantity) as total_quantity,
        f.id as fav_id,
        SUM(CASE 
          WHEN f.product_size >= 60 THEN COALESCE(pcp.price, p.price) * 1.60 * f.quantity
          WHEN f.product_size >= 56 THEN COALESCE(pcp.price, p.price) * 1.40 * f.quantity
          WHEN f.product_size >= 52 THEN COALESCE(pcp.price, p.price) * 1.40 * f.quantity
          WHEN f.product_size >= 48 THEN COALESCE(pcp.price, p.price) * 1.20 * f.quantity
          ELSE COALESCE(pcp.price, p.price) * f.quantity 
        END) AS total_amount,
        GROUP_CONCAT(f.product_size) as sizes,
        rf.retailerId as retailerId , 
        f.size_country,
        f.customization as customization,
        MAX(curr.symbol) as currencySymbol,
        MAX(curr.name) as currencyName
      FROM retailer_favourites_orders rf
      INNER JOIN favourites f ON FIND_IN_SET(f.id, rf.favourite_ids) > 0
      LEFT JOIN retailers r on r.id = rf.retailerId
      LEFT JOIN customers c ON c.id = r.customerId 
      LEFT JOIN currencies curr ON curr.id = f.currencyId
      LEFT JOIN product_currency_pricing pcp ON pcp.productId = f.productId AND pcp.currencyId = f.currencyId
      INNER JOIN products p ON p.id = f.productId
    `;

    // Handle retailerId condition
    if (retailerId) {
      whereClauses.push("rf.retailerId = ?");
      params.push(Number(retailerId));
    }

    // Add is_approved condition if needed
    whereClauses.push("rf.is_approved = 0");

    // Handle search query
    if (query) {
      const likeQuery = `%${query.toLowerCase()}%`;
      whereClauses.push(
        "(LOWER(c.name) LIKE ? OR LOWER(p.productCode) LIKE ?)"
      );
      params.push(likeQuery, likeQuery);
    }

    // Add WHERE clauses if any
    if (whereClauses.length > 0) {
      dataSql += " WHERE " + whereClauses.join(" AND ");
    }

    // Add grouping
    dataSql += `
      GROUP BY rf.id
      ORDER BY rf.createdAt DESC
      LIMIT ? OFFSET ?
    `;
    params.push(take, skip);

    // Total count query
    const countSql = `
      SELECT COUNT(DISTINCT rf.id) AS total
      FROM retailer_favourites_orders rf
      INNER JOIN favourites f ON FIND_IN_SET(f.id, rf.favourite_ids) > 0
      INNER JOIN customers c ON c.id = rf.retailerId
      INNER JOIN products p ON p.id = f.productId
      ${whereClauses.length > 0 ? "WHERE " + whereClauses.join(" AND ") : ""}
    `;

    // Execute queries
    const favoritesOrders = await db.query(dataSql, params);
    const totalResult = await db.query(countSql, params.slice(0, -2)); // Remove limit/offset params

    return res.json({
      success: true,
      favoritesOrders: favoritesOrders,
      totalCount: totalResult?.[0]?.total,
    });
  })
);

router.get(
  "/admin/stock-order/form/:id/:status",
  asyncHandler(async (req: Request, res: Response) => {
    const { id, status } = req.params;

    console.log(id, status);

    let query = ` SELECT 
      DATE_FORMAT(rf.createdAt, '%Y-%m-%d') AS received,
        rf.id as id,
        s.id as stock_id,
        r.name,
        r.email as email,
        p.productCode,
        rf.quantity,
        s.size as size,
        rf.retailerId as retailer_id,
        COALESCE(scp.discountedPrice, s.discountedPrice) * rf.quantity as total_price,
	    r.storeAddress,
        r.email,
     s.size_country,
        pm.name as image ,
        rf.mesh_color,
        rf.beading_color,
        rf.lining,
        rf.lining_color,
        COALESCE(curr.symbol, '€') as currencySymbol,
        COALESCE(curr.name, 'Euro') as currencyName,
            s.styleNo as product_id
      FROM retailer_stock_orders rf
      INNER JOIN stock s ON s.id = rf.stockId
      INNER JOIN products p ON p.id = s.styleNo
      INNER JOIN retailers ret ON ret.id = rf.retailerId
      INNER JOIN customers r ON r.id = ret.customerId
      INNER JOIN productimages as pm on pm.productId = s.styleNo
      LEFT JOIN currencies curr ON curr.id = rf.currencyId
      LEFT JOIN stock_currency_pricing scp ON scp.stockId = s.id AND scp.currencyId = rf.currencyId
      where rf.id = ? and rf.is_approved = ?
      group by rf.id
      `;

    const dd = await db.query(query, [id, status]);

    res.json({
      success: true,
      details: dd,
    });
  })
);

router.get(
  "/admin/favorites-order/details/:id/:status",
  asyncHandler(async (req: Request, res: Response) => {
    const { id, status } = req.params;
    const sql = `
    SELECT 
        f.id AS fav_id, 
        f.quantity AS quantity, 
        rf.id AS id, 
        p.id AS product_id, 
        MIN(pm.name) AS image, 
         f.retailerId as retailerId,
        f.product_size AS size,
        c.name AS customer_name, 
        c.email AS manufacturingEmailAddress,
        p.productCode as styleNo,
        DATE_FORMAT(rf.createdAt, '%Y-%m-%d') AS orderReceivedDate,
        c.storeAddress as address,
     f.color as color, 
     f.mesh_color as mesh_color,
     f.beading_color as beading_color,
     f.add_lining as add_lining,
     f.lining as lining,
     f.lining_color as lining_color,
     f.reference_image ,
        f.customization AS comments,
               p.productCode as productCode,
               f.size_country,
        CASE 
            WHEN f.product_size >= 60 THEN COALESCE(pcp.price, p.price) * 1.60 * f.quantity
            WHEN f.product_size >= 56 THEN COALESCE(pcp.price, p.price) * 1.40 * f.quantity
            WHEN f.product_size >= 52 THEN COALESCE(pcp.price, p.price) * 1.40 * f.quantity
            WHEN f.product_size >= 48 THEN COALESCE(pcp.price, p.price) * 1.20 * f.quantity
            ELSE COALESCE(pcp.price, p.price) * f.quantity 
        END AS total_amount,
         CASE 
            WHEN f.product_size >= 60 THEN COALESCE(pcp.price, p.price) * 1.60
            WHEN f.product_size >= 56 THEN COALESCE(pcp.price, p.price) * 1.40
            WHEN f.product_size >= 52 THEN COALESCE(pcp.price, p.price) * 1.40
            WHEN f.product_size >= 48 THEN COALESCE(pcp.price, p.price) * 1.20
            ELSE COALESCE(pcp.price, p.price) 
        END AS price,
        curr.symbol as currencySymbol,
        curr.name as currencyName
    FROM retailer_favourites_orders rf
    INNER JOIN favourites f ON FIND_IN_SET(f.id, rf.favourite_ids) > 0
    INNER JOIN products p ON p.id = f.productId
    INNER JOIN productimages pm ON pm.productId = p.id
    INNER JOIN retailers r ON r.id = f.retailerId
    INNER JOIN customers c ON c.id = r.customerId
    LEFT JOIN currencies curr ON curr.id = f.currencyId
    LEFT JOIN product_currency_pricing pcp ON pcp.productId = p.id AND pcp.currencyId = f.currencyId
    WHERE rf.id = ? and  rf.is_approved = ?
    GROUP BY f.id, rf.id, p.id, f.product_size, c.name, c.email;
  `;
    const data = await db.query(sql, [id, status]);

    res.json({
      status: true,
      data: data,
    });
  })
);

router.post(
  "/admin/accepted/stock-order",
  asyncHandler(async (req: Request, res: Response) => {
    const { data } = req.body;

    const stock = await Stock.findOne({
      where: {
        id: data.stock_id,
      },
    });

    if (!stock) {
      return res.json({
        success: false,
      });
    }

    console.log(stock, stock.quantity, data.quantity);

    if (stock && stock.quantity < data.quantity) {
      return res.json({
        success: false,
        message: "No Stock Available",
      });
    }

    const retailer = await Retailer.findOne({
      where: {
        id: data.retailerId,
      },
      relations: ["customer"],
    });

    if (!retailer) {
      return res.json({
        success: false,
      });
    }

    const order = new RetailerOrder();
    const stock_retailer = await RetailerStockOrders.findOne({
      where: {
        id: data.id,
      },
    });

    if (!stock_retailer) {
      return res.json({
        success: false,
      });
    }

    order.address = data.address;
    order.purchaeOrderNo = data.purchaseOrderNo;
    order.hasId = data.color;
    order.purchaseAmount = data.total_amount;
    order.is_stock_order = true;
    order.manufacturingEmailAddress = data.email || retailer.customer.email;
    order.orderCancellationDate = new Date(data.orderCancellationDate);
    order.orderReceivedDate = new Date(data.received_date);

    order.Stock_order = stock_retailer;

    order.retailer = retailer;

    order.Size = data.size;
    order.StyleNo = data.styleNo;
    order.size_country = data.size_country;
    order.quantity = data.quantity;
    order.invoiceNo = data.invoice;
    order.estimateNo = data.estimate;
    order.shippingAmount = data.shipping;
    stock_retailer.is_approved = 1;

    stock.quantity = stock.quantity - data.quantity;

    await order.save();
    const payment = new RetailerOrdersPayment();
    payment.amount = Number(data.advance) || 0;
    payment.order = order;

    await stock_retailer?.save();

    await stock?.save();
    await payment.save();
    res.json({
      success: true,
    });
  })
);

router.post(
  "/admin/accepted/favorites-order",
  asyncHandler(async (req: Request, res: Response) => {
    const { orderData } = req.body;

    const favOrders = await RetailerFavouritesOrders.findOne({
      where: {
        id: orderData.id,
      },
    });

    const payment = new RetailerOrdersPayment();
    const retailer = await Retailer.findOne({
      where: {
        id: orderData.retailerId,
      },
    });

    const order = new RetailerOrder();

    order.address = orderData.address;
    order.purchaeOrderNo = orderData.purchaseOrderNo;
    order.hasId = orderData.color;
    order.purchaseAmount = orderData.total_amount;
    order.is_stock_order = false;
    order.manufacturingEmailAddress = orderData.email;
    order.orderCancellationDate = new Date(orderData.orderCancellationDate);
    order.orderReceivedDate = new Date(orderData.orderReceivedDate);

    if (retailer) {
      order.retailer = retailer;
    }
    order.Size = orderData.size;
    order.StyleNo = orderData.styleNo;
    order.size_country = orderData.size_country;
    order.quantity = orderData.quantity;
    order.shippingAmount = orderData.shipping;
    order.estimateNo = orderData.estimate;
    order.invoiceNo = orderData.invoice;

    for (let index = 0; index < orderData.styles.length; index++) {
      const fav = await Favourites.findOne({
        where: {
          id: orderData.styles[index].fav_id,
        },
      });

      if (fav) {
        fav.product_price = orderData.styles[index].amount;
        // fav.
        if (orderData.styles[index].customization_p) {
          fav.customization_price = orderData.styles[index].customization_p;
        }
        await fav.save();
      }
    }
    if (favOrders) {
      favOrders.is_approved = 1;
      order.favourite_order = favOrders;
    }

    await order.save();
    await favOrders?.save();

    payment.amount = orderData.advance;
    payment.order = order;
    await payment.save();

    res.json({
      success: true,
      msg: "Order Accepted",
    });
  })
);

router.patch(
  "/admin/stock-order/reject",
  asyncHandler(async (req: Request, res: Response) => {
    const { comment, id } = req.body;
    const retailerStock = await RetailerStockOrders.findOne({
      where: {
        id: Number(id),
      },
    });

    if (retailerStock) {
      retailerStock.rejected_comments = comment;
      retailerStock.is_approved = 3;
      await retailerStock.save();
    }

    res.json({
      success: true,
      msg: "Rejected Successfully",
    });
  })
);

router.patch(
  "/admin/fresh-order/reject",
  asyncHandler(async (req: Request, res: Response) => {
    const { comment, id } = req.body;
    const retailerStock = await RetailerFavouritesOrders.findOne({
      where: {
        id: Number(id),
      },
    });

    if (retailerStock) {
      retailerStock.rejected_comments = comment;
      retailerStock.is_approved = 3;
      await retailerStock.save();
    }

    res.json({
      success: true,
      msg: "Rejected Successfully",
    });
  })
);

router.get(
  "/orders/accepted/customer/:isApprovedStatus",
  asyncHandler(async (req: Request, res: Response) => {
    const { isApprovedStatus } = req.params;
    const { retailerId, page, query } = req.query as {
      retailerId?: string;
      page?: string;
      query?: string;
    };

    // Validate isApprovedStatus
    const isApproved = Number(isApprovedStatus);
    if (isNaN(isApproved) || ![0, 1].includes(isApproved)) {
      return res.status(400).json({
        success: false,
        message: "Invalid isApproved value. Must be 0 or 1",
      });
    }

    // Pagination setup
    const skip = (page ? Number(page) - 1 : 0) * 10;
    const take = 10;
    const params: any[] = [];
    const whereClauses: string[] = [];

    // Main query with LEFT JOIN optimization
    let dataSql = `
      SELECT 
      DATE_FORMAT(ro.createdAt, '%Y-%m-%d') AS formatted_date,
        ro.purchaeOrderNo as order_id,
        ro.id,
        ro.trackingNo,
        CASE 
          WHEN ro.is_stock_order = 1 THEN 'Stock' 
          ELSE 'Fresh' 
        END AS type,
       COALESCE(ro.stockOrderId , ro.favouriteOrderId) as childId,
         payments.orderId as payment_id,
        ro.purchaseAmount AS total,
        DATE_FORMAT(ro.orderReceivedDate,'%Y-%m-%d')  AS orderReceivedDate,
        DATE_FORMAT(ro.orderCancellationDate,'%Y-%m-%d')  AS orderCancellationDate,
        ro.manufacturingEmailAddress as email,
        ro.orderStatus,
          ro.favouriteOrderId,
        ro.stockOrderId,
        IFNULL(payments.paid_amount, 0) AS paid_amount,
        (ro.purchaseAmount - IFNULL(payments.paid_amount, 0)) AS balance,
        curr.symbol as currencySymbol,
        curr.name as currencyName
      FROM retailer_orders AS ro
      LEFT JOIN (
        SELECT orderId, SUM(amount) AS paid_amount 
        FROM retailer_order_payments 
        GROUP BY orderId
      ) AS payments ON payments.orderId = ro.id
      LEFT JOIN retailers r ON r.id = ro.retailerId
      LEFT JOIN customers c ON c.id = r.customerId
      LEFT JOIN currencies curr ON curr.id = c.currencyId
    `;

    // Build WHERE clauses
    if (retailerId) {
      whereClauses.push("ro.retailerId = ?");
      params.push(Number(retailerId));
    }

    whereClauses.push("ro.status_id = ?");
    whereClauses.push("ro.status = 0 ");

    params.push(isApproved);

    if (query) {
      const likeQuery = `%${query.toLowerCase()}%`;
      whereClauses.push("LOWER(ro.purchaeOrderNo) LIKE ?");
      params.push(likeQuery);
    }

    // Add WHERE conditions
    if (whereClauses.length > 0) {
      dataSql += " WHERE " + whereClauses.join(" AND ");
    }

    // Add pagination
    dataSql += " ORDER BY ro.createdAt DESC LIMIT ? OFFSET ?";
    params.push(take, skip);

    // Count query (EXCLUDE limit/offset params)
    const countSql = `
      SELECT COUNT(*) AS total
      FROM retailer_orders AS ro
     ${
       whereClauses.length > 0
         ? "WHERE " + "ro.status = 0 AND" + " " + whereClauses.join(" AND ")
         : " WHERE ro.status = 0 "
     }
    `;

    // Execute queries
    const [retailerOrders, totalResult] = await Promise.all([
      db.query(dataSql, params),
      db.query(countSql, params.slice(0, -2)), // Correct parameter slicing
    ]);

    return res.json({
      success: true,
      retailerOrders,
      totalCount: totalResult?.[0]?.total || 0,
    });
  })
);

// admin after accepted the order
router.get(
  "/customer/accepted/fresh/:id/:retailerOrderID/:paymentId",
  asyncHandler(async (req: Request, res: Response) => {
    const { id, retailerOrderID, paymentId } = req.params;

    const retailerOrder = await RetailerOrder.findOne({
      where: {
        id: Number(paymentId),
      },
    });
    if (!retailerOrder) {
      return res.json({
        success: false,
      });
    }

    const paymentHis = await RetailerOrdersPayment.find({
      where: {
        order: {
          id: retailerOrder.id,
        },
        amount: MoreThan(0),
      },
      order: { id: "DESC" },
    });

    const paidAmount = paymentHis.reduce(
      (sum, payment) => sum + (payment.amount || 0),
      0
    );

    const retailerFreshOrder = await RetailerFavouritesOrders.findOneOrFail({
      where: {
        id: Number(retailerOrderID),
      },
    });

    let splitValue = retailerFreshOrder.favourite_ids.split(",");
    const fav: any = [];

    for (let index = 0; index < splitValue.length; index++) {
      const favourites = await Favourites.findOne({
        where: {
          retailer: {
            id: Number(id),
          },
          id: Number(splitValue[index]),
          // is_order_placed: 1,
        },
        relations: [
          "product",
          "product.images",
          "product.currencyPricing",
          "product.currencyPricing.currency",
          "currency",
        ],
      });

      fav.push(favourites);
    }

    // Get currency information from the first favourite (all should have same currency)
    let currencyInfo = null;
    if (fav.length > 0 && fav[0]?.currency) {
      currencyInfo = {
        symbol: fav[0].currency.symbol,
        name: fav[0].currency.name,
        id: fav[0].currency.id,
      };
    }

    res.json({
      success: true,
      favourites: fav,
      payment: paymentHis,
      bill_amount: retailerOrder.purchaseAmount,
      paidAmount: paidAmount,
      retailerOrder: retailerOrder,
      currency: currencyInfo,
    });
  })
);

// accepted stock details
router.get(
  "/customer-stock/accepted/:id/:stockId/:paymentId",
  asyncHandler(async (req: Request, res: Response) => {
    const { id, stockId, paymentId } = req.params;

    // Raw SQL Query with positional parameters
    const query = `
      SELECT 
          rf.id,
          rf.createdAt,
          rf.quantity,
          rf.quantity * COALESCE(scp.price, s.price) as product_price,
          s.size as size,
          COALESCE(scp.discountedPrice, s.discountedPrice) as price,
          p.id AS product_id,
          p.createdAt AS product_createdAt,
          p.quantity AS product_quantity,
          p.productCode,
          p.description,
          p.minSaleQuantity,
          p.hasReturnPolicy,
          p.hasDiscount,
          p.stockAlert,
          pm.id AS image_id,
          pm.createdAt AS image_createdAt,
          pm.name AS image_name,
          pm.isMain AS image_isMain,
          c.id AS color_id,
          c.createdAt AS color_createdAt,
          c.name AS color_name,
          c.hexcode AS color_hexcode,
          COALESCE(curr.symbol, '€') as currencySymbol,
          COALESCE(curr.name, 'Euro') as currencyName,
          COALESCE(curr.id, 1) as currencyId
      FROM retailer_stock_orders AS rf
      INNER JOIN stock AS s ON s.id = rf.stockId
      INNER JOIN products AS p ON p.id = s.styleNo
      INNER JOIN productimages AS pm ON pm.productId = p.id
      LEFT JOIN product_colours AS c ON c.id = s.colors
      LEFT JOIN currencies curr ON curr.id = rf.currencyId
      LEFT JOIN stock_currency_pricing scp ON scp.stockId = s.id AND scp.currencyId = rf.currencyId
      WHERE rf.id = ? AND rf.retailerId = ?
    `;

    // Execute the raw SQL query using positional parameters
    const result = await db.query(query, [stockId, id]);

    const retailerOrder = await RetailerOrder.findOne({
      where: {
        id: Number(paymentId),
      },
    });
    if (!retailerOrder) {
      return res.json({
        success: false,
      });
    }
    const paymentHis = await RetailerOrdersPayment.find({
      where: {
        order: {
          id: retailerOrder.id,
        },
        amount: MoreThan(0),
      },
      order: { id: "DESC" },
    });

    const paidAmount = paymentHis.reduce(
      (sum, payment) => sum + (payment.amount || 0),
      0
    );

    if (result.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Stock not found" });
    }

    // Transform the first row into the desired format
    const firstRow = result[0];

    const transformedData = {
      id: firstRow.id,
      createdAt: firstRow.createdAt,
      product_size: firstRow.size,
      quantity: firstRow.quantity,
      customization: firstRow.customization,
      is_order_placed: firstRow.is_order_placed,
      product_price: firstRow.price,
      product: {
        id: firstRow.product_id,
        createdAt: firstRow.product_createdAt,
        quantity: firstRow.product_quantity,
        productCode: firstRow.productCode,
        price: firstRow.price,
        description: firstRow.description,
        minSaleQuantity: firstRow.minSaleQuantity,
        hasReturnPolicy: firstRow.hasReturnPolicy,
        hasDiscount: firstRow.hasDiscount,
        stockAlert: firstRow.stockAlert,
        images: result.map((row: any) => ({
          id: row.image_id,
          createdAt: row.image_createdAt,
          name: row.image_name,
          isMain: row.image_isMain,
        })),
      },
      color: firstRow.color_id
        ? {
            id: firstRow.color_id,
            createdAt: firstRow.color_createdAt,
            name: firstRow.color_name,
            hexcode: firstRow.color_hexcode,
          }
        : null,
    };

    res.json({
      success: true,
      favourites: [transformedData],
      payment: paymentHis,
      bill_amount: retailerOrder.purchaseAmount,
      paidAmount: paidAmount,
      retailerOrder: retailerOrder,
      currency: {
        symbol: firstRow.currencySymbol,
        name: firstRow.currencyName,
        id: firstRow.currencyId,
      },
    });
  })
);

//acceptedOrders.retailerOrders

router.get(
  "/admin/orders/accepted/:isApprovedStatus", // Admin route
  asyncHandler(async (req: Request, res: Response) => {
    const { isApprovedStatus } = req.params;
    const { page, query } = req.query as {
      page?: string;
      query?: string;
    };

    // Validate isApprovedStatus
    const isApproved = Number(isApprovedStatus);

    // Pagination setup
    const skip = (page ? Number(page) - 1 : 0) * 100;
    const take = 100;
    const params: any[] = [];
    const whereClauses: string[] = [];

    // Main query with LEFT JOIN optimization
    let dataSql = `
      SELECT 
        DATE_FORMAT(ro.createdAt, '%Y-%m-%d') AS formatted_date,
        ro.purchaeOrderNo as order_id,
        CASE 
          WHEN ro.is_stock_order = 1 THEN 'Stock' 
          ELSE 'Fresh' 
        END AS type,
        payments.orderId as payment_id,
        ro.purchaseAmount AS total,
        DATE_FORMAT(ro.orderReceivedDate,'%Y-%m-%d')  AS received_date,
        ro.manufacturingEmailAddress as email,
        ro.orderStatus,
        ro.favouriteOrderId,
        ro.stockOrderId,
        ro.id as id,
        ro.retailerId as retailer_id,
        ro.invoiceNo,
        ro.estimateNo,
        ro.orderCancellationDate as orderCancellationDate,
        IFNULL(payments.paid_amount, 0) AS paid_amount,
        (ro.purchaseAmount - IFNULL(payments.paid_amount, 0)) AS balance,
        c.name as retailer_name,  
        c.email as retailer_email,
        curr.symbol as currencySymbol,
        curr.name as currencyName
      FROM retailer_orders AS ro
      LEFT JOIN (
        SELECT orderId, SUM(amount) AS paid_amount 
        FROM retailer_order_payments 
        GROUP BY orderId
      ) AS payments ON payments.orderId = ro.id
      left join retailers r on r.id = ro.retailerId
      LEFT JOIN customers c ON c.id = r.customerId 
      LEFT JOIN currencies curr ON curr.id = c.currencyId
    `;

    // Add isApproved condition
    whereClauses.push("ro.status_id = ?");
    params.push(isApproved);

    // Handle search query
    if (query) {
      const likeQuery = `%${query.toLowerCase()}%`;
      whereClauses.push(
        "(LOWER(ro.purchaeOrderNo) LIKE ? OR LOWER(c.name) LIKE ? OR LOWER(ro.orderStatus) LIKE ?)"
      );
      params.push(likeQuery, likeQuery, likeQuery);

      if (query.toLowerCase() === "stock") {
        whereClauses.push("ro.is_stock_order = 1");
      } else if (query.toLowerCase() === "fresh") {
        whereClauses.push("ro.is_stock_order = 0");
      }
    }

    // Add WHERE conditions if any
    if (whereClauses.length > 0) {
      dataSql +=
        " WHERE " + "ro.status = 0 AND" + " " + whereClauses.join(" AND ");
    } else {
      dataSql += " WHERE ro.status = 0 ";
    }

    // Add pagination
    dataSql += " ORDER BY ro.createdAt DESC LIMIT ? OFFSET ?";
    params.push(take, skip);

    // Count query (EXCLUDE limit/offset params)
    const countSql = `
      SELECT COUNT(*) AS total
      FROM retailer_orders AS ro
      LEFT JOIN customers c ON c.id = ro.retailerId
      ${
        whereClauses.length > 0
          ? "WHERE " + "ro.status = 0 AND" + " " + whereClauses.join(" AND ")
          : " WHERE ro.status = 0 "
      }
    `;

    // Execute queries
    const [retailerOrders, totalResult] = await Promise.all([
      db.query(dataSql, params),
      db.query(countSql, params.slice(0, -2)), // Correct parameter slicing
    ]);

    return res.json({
      success: true,
      retailerOrders,
      totalCount: totalResult?.[0]?.total || 0,
    });
  })
);

// payment Update
router.post(
  "/admin/payment-update/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const { amount, payment_type } = req.body;

    const order = await RetailerOrder.findOne({
      where: {
        id: Number(id),
      },
    });

    if (!order) {
      return res.json({
        success: false,
        msg: "Error",
      });
    }

    const paymentHis = await RetailerOrdersPayment.find({
      where: {
        order: {
          id: Number(id),
        },
      },
    });

    const totalAmount =
      paymentHis.reduce((sum, payment) => sum + (payment.amount || 0), 0) +
      amount;

    if (totalAmount > order.purchaseAmount) {
      return res.json({
        success: false,
        msg: "Payment is Fully Paid",
      });
    }

    const payment = new RetailerOrdersPayment();

    payment.amount = amount;
    payment.paymentMethod = payment_type;

    if (order) {
      payment.order = order;
      await payment.save();
    }

    res.json({
      success: true,
      msg: "Payment Updated",
    });
  })
);

// status Update
router.post(
  "/admin/status-update/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const { status, track_id, shipping } = req.body;

    const order = await RetailerOrder.findOne({
      where: {
        id: Number(id),
      },
    });

    if (!order) {
      return res.json({
        success: false,
        msg: "Error",
      });
    }

    order.orderStatus = status || order.orderStatus;
    order.trackingNo = track_id ?? order.trackingNo;
    let oldSipping =
      Number(order.purchaseAmount) - Number(order.shippingAmount);
    if (shipping > 0) {
      order.purchaseAmount = oldSipping + shipping || order.shippingAmount;
      order.shippingAmount = shipping || order.shippingAmount;
    }
    // order.shippingStatus = shippingStatus || order.shippingStatus;

    // if (status == "Delivered") {
    //   order.status_id = 1;
    // }

    if (status == "Delivered" || status == "Shipped") {
      order.status_id = 1;
    }

    await order.save();
    res.json({
      success: true,
      msg: "Status Updated",
    });
  })
);

router.patch(
  "/admin/editPayment/:id/:amount",
  asyncHandler(async (req: Request, res: Response) => {
    const { id, amount } = req.params;

    const payment = await RetailerOrdersPayment.findOne({
      where: {
        id: Number(id),
      },
    });

    if (!payment) {
      return res.json({
        success: false,
      });
    }

    payment.amount = Number(amount);

    await payment.save();
    return res.json({
      success: true,
    });
  })
);

router.delete(
  "/admin/deletePayment/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const payment = await RetailerOrdersPayment.findOne({
      where: {
        id: Number(id),
      },
    });

    if (!payment) {
      return res.json({
        success: false,
      });
    }

    payment.remove();

    await payment.save();
    return res.json({
      success: true,
    });
  })
);

router.get(
  "/orderStatusDates/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const qa = `select pattern , beading , stitching , ready_to_delivery from retailer_orders as r where r.id = ? `;

    const [result] = await db.query(qa, [id]);

    res.json({
      success: true,
      data: result,
    });
  })
);

router.get(
  "/orderStatusDates/stock/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const qa = `select pattern , beading , stitching , ready_to_delivery from orders as r where r.id = ? `;

    const [result] = await db.query(qa, [id]);

    res.json({
      success: true,
      data: result,
    });
  })
);
router.get(
  "/customization/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const retailerOrder = await RetailerOrder.createQueryBuilder(
      "retailerOrder"
    )
      .leftJoinAndSelect("retailerOrder.favourite_order", "favourite_order")
      .select(["retailerOrder.id", "favourite_order.favourite_ids"]) // Specify only needed fields
      .where("retailerOrder.id = :id", { id: Number(id) })
      .getOne();

    if (!retailerOrder) {
      res.json({
        success: false,
      });
      return;
    }

    let ids = retailerOrder.favourite_order.favourite_ids
      .split(",")
      .map((item) => Number(item));

    const favorites = await Favourites.createQueryBuilder("favourites")
      .leftJoinAndSelect("favourites.product", "product") // Join the product relation
      .select([
        "favourites.id",
        "favourites.product_size",
        "favourites.quantity",
        "favourites.customization",
        "favourites.size_country",
        "favourites.customization_price",
        "favourites.color",
        "favourites.mesh_color",
        "favourites.beading_color",
        "favourites.lining",
        "favourites.lining_color",
        "product.productCode",
      ]) // Select specific fields
      .where("favourites.id IN (:...ids)", { ids })
      .getMany();

    res.json({
      success: true,
      data: favorites,
    });
  })
);

router.patch(
  "/customization/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { data } = req.body;

    const { id } = req.params;

    const orders = await RetailerOrder.findOne({
      where: {
        id: Number(id),
      },
    });

    if (!orders) {
      return;
    }

    let oldPrice = 0;
    let newPrice = 0;

    for (let index = 0; index < data.length; index++) {
      const fav = await Favourites.findOne({
        where: {
          id: Number(data[index].id),
        },
      });
      if (!fav) {
        return;
      }
      const multiplyOld =
        Number(fav.customization_price) * Number(fav.quantity);
      oldPrice = oldPrice + Number(multiplyOld);

      fav.customization_price = data[index].customization_price;
      await fav.save();

      const multiplyNew =
        Number(data[index].customization_price) * Number(data[index].quantity);
      newPrice = newPrice + multiplyNew;
    }
    const minus = orders.purchaseAmount - oldPrice;
    orders.purchaseAmount = minus + newPrice;

    await orders.save();

    res.json({
      success: true,
      message: "Customization Edited successfully",
    });
  })
);

router.patch(
  "/admin/order/reject",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.body;
    const stock = await RetailerOrder.findOne({
      where: {
        id: Number(id),
      },
    });

    if (stock) {
      stock.status = 1;
      await stock.save();
    }

    res.json({
      success: true,
      msg: "Order Deleted",
    });
  })
);

router.patch(
  "/admin/order/store/reject",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.body;
    const stock = await Order.findOne({
      where: {
        id: Number(id),
      },
    });

    if (stock) {
      stock.status = 1;
      await stock.save();
    }

    res.json({
      success: true,
      msg: "Order Deleted",
    });
  })
);

router.patch(
  "/admin/bulkOrder/reject",
  asyncHandler(async (req: Request, res: Response) => {
    const { bulk } = req.body;

    let freshBulk: any = [];
    let storeBulk: any = [];

    bulk.forEach((i: any) => {
      if (i.orderType == "Fresh" || i.orderType == "Stock") {
        freshBulk = [...freshBulk, i];
      } else {
        storeBulk = [...storeBulk, i];
      }
    });

    if (freshBulk.length > 0) {
      for (let index = 0; index < freshBulk.length; index++) {
        const stocks = await RetailerOrder.findOne({
          where: {
            id: freshBulk[index].id,
          },
        });
        if (stocks) {
          stocks.status = 1;
          await stocks.save();
        }
      }
    }

    if (storeBulk.length > 0) {
      for (let index = 0; index < storeBulk.length; index++) {
        const stocks = await Order.findOne({
          where: {
            id: storeBulk[index].id,
          },
        });
        if (stocks) {
          stocks.status = 1;
          await stocks.save();
        }
      }
    }

    res.json({
      success: true,
      msg: "Order Deleted",
    });
  })
);

//soft delete in reject
router.patch(
  "/admin/bulkOrder/delete",
  asyncHandler(async (req: Request, res: Response) => {
    const { bulk } = req.body;

    let freshBulk: any = [];
    let storeBulk: any = [];

    bulk.forEach((i: any) => {
      if (i.orderType == "Fresh") {
        freshBulk = [...freshBulk, i];
      } else {
        storeBulk = [...storeBulk, i];
      }
    });

    if (freshBulk.length > 0) {
      for (let index = 0; index < freshBulk.length; index++) {
        const stocks = await RetailerFavouritesOrders.findOne({
          where: {
            id: freshBulk[index].id,
          },
        });
        if (stocks) {
          stocks.isDeleted = true;
          await stocks.save();
        }
      }
    }

    if (storeBulk.length > 0) {
      for (let index = 0; index < storeBulk.length; index++) {
        const stocks = await RetailerStockOrders.findOne({
          where: {
            id: storeBulk[index].id,
          },
        });
        if (stocks) {
          stocks.isDeleted = true;
          await stocks.save();
        }
      }
    }

    res.json({
      success: true,
      msg: "Rejected Order Deleted",
    });
  })
);

export default router;
