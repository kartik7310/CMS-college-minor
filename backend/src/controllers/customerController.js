import Customer from "../models/customer.js"

// CREATE CUSTOMER
export const createCustomer = async (req, res) => {
  try {
    const data = req.body;

    if (!data.firstName)
      return res.status(400).json({ error: "firstName is required" });

    // attach creator
    data.createdBy = req.user._id;

    const customer = await Customer.create(data);
    res.status(201).json(customer);
  } catch (err) {
    console.log("Create error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET SINGLE CUSTOMER
export const getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) return res.status(404).json({ error: "Customer not found" });

    res.json(customer);
  } catch (err) {
    console.log("Get error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// LIST WITH SEARCH + FILTER + PAGINATION
export const listCustomers = async (req, res) => {
  try {
    const user = req.user;
    const { page = 1, limit = 10, search = "", status = "" } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { firstName: new RegExp(search, "i") },
        { lastName: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { phone: new RegExp(search, "i") },
      ];
    }

    if (status) query.status = status;

    const total = await Customer.countDocuments(query);

    const customers = await Customer.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      data: customers,
      total,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (err) {
    console.log("List error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// UPDATE CUSTOMER (OWNER ONLY)
export const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) return res.status(404).json({ error: "Customer not found" });

    // Check if user is the owner
    if (customer.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized to update this customer" });
    }

    const updated = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.log("Update error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE CUSTOMER (OWNER ONLY)
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) return res.status(404).json({ error: "Customer not found" });

    // Check if user is the owner
    if (customer.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized to delete this customer" });
    }

    await Customer.findByIdAndDelete(req.params.id);

    res.json({ ok: true });
  } catch (err) {
    console.log("Delete error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// EXPORT CSV
export const exportCSV = async (req, res) => {
  try {
    const { search = "", status = "" } = req.query;

    const q = {};

    if (search) {
      q.$or = [
        { firstName: new RegExp(search, "i") },
        { lastName: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { phone: new RegExp(search, "i") },
      ];
    }

    if (status) q.status = status;

    const rows = await Customer.find(q);

    const header = "FirstName,LastName,Email,Phone,Status,Address,CreatedAt\n";

    const lines = rows
      .map((c) =>
        [
          c.firstName || "",
          c.lastName || "",
          c.email || "",
          c.phone || "",
          c.status || "",
          c.address || "",
          c.createdAt.toISOString(),
        ].join(",")
      )
      .join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=customers.csv"
    );

    res.send(header + lines);
  } catch (err) {
    console.log("CSV error:", err);
    res.status(500).json({ error: "Server error" });
  }
};