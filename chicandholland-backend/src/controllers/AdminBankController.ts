import { Request, Response, Router } from "express";
import asyncHandler from "../middleware/AsyncHandler";
import AdminBank from "../models/AdminBank"; // Assuming you'll create this model
import CONFIG from "../config";
import { MoreThan } from "typeorm";
import db from "../db";
const router = Router();
//
// Create new admin bank details
router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { bankName, accountNumber, accountHolder, ifscCode, address } =
      req.body;

    const bank = new AdminBank();
    bank.decryptedBankName = bankName;
    bank.decryptedAccountNumber = accountNumber;
    bank.decryptedAccountHolder = accountHolder;
    bank.decryptedIfscCode = ifscCode;
    bank.address = address;
    await bank.save();

    res.json({
      success: true,
      msg: "Admin Bank Details Added Successfully",
    });
  })
);

router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    let bankDetails = await AdminBank.find({
      order: {
        id: "DESC",
      },
    });

    if (!bankDetails) {
      res.json({
        success: true,
        data: [],
      });
      // throw new Error("No admin bank details found");
      return;
    }

    const data = bankDetails.map((item) => {
      return {
        id: item.id,
        bankName: item.decryptedBankName,
        accountHolder: item.decryptedAccountHolder,
        accountNumber: item.decryptedAccountNumber,
        ifscCode: item.decryptedIfscCode,
        isActive: item.is_active,
        address: item.address,
      };
    });
    res.json({
      success: true,
      msg: "Bank details retrieved successfully",
      data: data,
    });
  })
);

router.get(
  "/retailer",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    let bankDetails = await AdminBank.find({
      where: {
        is_active: 1,
      },
    });

    if (!bankDetails) {
      res.json({
        success: true,
        data: {},
      });
      // throw new Error("No admin bank details found");
      return;
    }

    const bank = bankDetails.map((item) => {
      return {
        id: item.id,
        bankName: item.decryptedBankName,
        accountHolder: item.decryptedAccountHolder,
        accountNumber: item.decryptedAccountNumber,
        ifscCode: item.decryptedIfscCode,
        isActive: item.is_active,
        address: item.address,
      };
    });

    res.json({
      success: true,
      msg: "Bank details retrieved successfully",
      data: bank,
    });
  })
);

// Update admin bank details
router.patch(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { bankName, accountNumber, accountHolder, ifscCode, address } =
      req.body;
    const { id } = req.params;
    let bank = await AdminBank.findOne({
      where: {
        id: Number(id),
      },
    });

    if (!bank) {
      throw new Error("No admin bank details found to update");
    }

    bank.decryptedBankName = bankName || bank.decryptedBankName;
    bank.decryptedAccountNumber = accountNumber || bank.decryptedAccountNumber;
    bank.decryptedAccountHolder = accountHolder || bank.decryptedAccountHolder;
    bank.decryptedIfscCode = ifscCode || bank.decryptedIfscCode;
    bank.address = address || bank.address;

    await bank.save();

    res.json({
      success: true,
      msg: "Admin Bank Details Updated Successfully",
    });
  })
);

router.patch(
  "/active/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    let bank = await AdminBank.findOne({
      where: {
        id: Number(id),
      },
    });

    if (!bank) {
      throw new Error("No admin bank details found to update");
    }

    if (bank.is_active == 1) {
      return res.json({
        success: true,
        msg: "Admin Bank Details Updated Successfully",
      });
    }

    bank.is_active = 1;

    await bank.save();

    res.json({
      success: true,
      msg: "Admin Bank Details Updated Successfully",
    });
  })
);

router.patch(
  "/deactive/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    let bank = await AdminBank.findOne({
      where: {
        id: Number(id),
      },
    });

    if (!bank) {
      throw new Error("No admin bank details found to update");
    }

    bank.is_active = 0;

    await bank.save();

    res.json({
      success: true,
      msg: "Admin Bank Details Updated Successfully",
    });
  })
);

router.delete(
  "/delete/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    let bank = await AdminBank.delete(id);

    res.json({
      success: true,
      msg: "Admin Bank Details Deleted Successfully",
    });
  })
);

export default router;
