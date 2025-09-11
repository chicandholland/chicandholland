import { Request, Response, Router } from "express";
import db from "../db";
import asyncHandler from "../middleware/AsyncHandler";

const router = Router(); // create a new router

router.delete(
  "/:id",
  asyncHandler(async (req:Request, res:Response) => {
    const { id } = req.params;
    const sql = `DELETE FROM new_user_roles WHERE id = ?`;
    await db.transaction(async (manager) => {
      await manager.query(sql, [id]);
    });
    res.json({ msg: "User role deleted successfully", success: true });
  })
);

export default router;