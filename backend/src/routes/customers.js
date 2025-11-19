import express from "express";
import auth from "../middleware/auth.js";
import requireAdmin from "../middleware/requireAdmin.js";
import {
  createCustomer,
  getCustomer,
  listCustomers,
  updateCustomer,
  deleteCustomer,
  exportCSV,
} from "../controllers/customerController.js";

const router = express.Router();

router.get("/export", auth, exportCSV);
router.get("/", auth, listCustomers);
router.post("/", auth, createCustomer);
router.get("/:id", auth, getCustomer);
router.put("/:id", auth, updateCustomer);
router.delete("/:id", auth, requireAdmin, deleteCustomer);

export default router;
