const Transaction = require("../models/Transaction");

// ==============================
// CREATE TRANSACTION
// ==============================
exports.createTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.create({
      ...req.body,
      userId: req.user._id,   // ✅ correct user reference
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  console.log("AUTH HEADER:", req.headers.authorization);
console.log("USER OBJECT:", req.user);

};

// ==============================
// GET TRANSACTIONS (With Filters)
// ==============================
exports.getTransactions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 5,
      search,
      category,
      minAmount,
      maxAmount,
      startDate,
      endDate,
      sort,
    } = req.query;

    // ✅ Correct user filtering
    const query = { userId: req.user._id };

    // Search (case-insensitive)
    if (search && search.trim() !== "") {
      query.title = { $regex: search, $options: "i" };
    }

    // Category filter
    if (category && category !== "All") {
      query.category = { $regex: `^${category}$`, $options: "i" };
    }

    // Amount filter
    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = Number(minAmount);
      if (maxAmount) query.amount.$lte = Number(maxAmount);
    }

    // Date filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate)
        query.date.$gte = new Date(`${startDate}T00:00:00`);
      if (endDate)
        query.date.$lte = new Date(`${endDate}T23:59:59`);
    }

    // Sorting
    let sortOption = { date: -1 }; // default newest

    if (sort === "oldest") sortOption = { date: 1 };
    if (sort === "amountHigh") sortOption = { amount: -1 };
    if (sort === "amountLow") sortOption = { amount: 1 };

    const total = await Transaction.countDocuments(query);

    const transactions = await Transaction.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      transactions,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==============================
// UPDATE TRANSACTION (Secure)
// ==============================
exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );

    if (!transaction) {
      return res
        .status(404)
        .json({ message: "Transaction not found" });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==============================
// DELETE TRANSACTION (Secure)
// ==============================
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!transaction) {
      return res
        .status(404)
        .json({ message: "Transaction not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
