import { useEffect, useState } from "react";
import API from "../api";
import TransactionModal from "../components/common/TransactionModal";
import ViewDetailsModal from "../components/common/ViewDetailsModal";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // =============================
  // FETCH DATA (SAFE)
  // =============================
  const fetchData = async () => {
    try {
      const res = await API.get("/transactions");
      setTransactions(res.data.transactions || []);
    } catch (error) {
      console.error("Dashboard fetch error:", error.response?.data || error.message);
    }
  };

  // =============================
  // LOAD ONLY IF TOKEN EXISTS
  // =============================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetchData();
  }, []);

  // =============================
  // DELETE HANDLING
  // =============================
  const handleDeleteClick = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/transactions/${deleteId}`);
      setDeleteId(null);
      fetchData();
    } catch (error) {
      console.error("Delete error:", error.response?.data || error.message);
    }
  };

  // =============================
  // SUMMARY CALCULATIONS
  // =============================
  const total = transactions.reduce((acc, t) => acc + t.amount, 0);

  const categoryData = Object.values(
    transactions.reduce((acc, t) => {
      if (!acc[t.category]) {
        acc[t.category] = { name: t.category, value: 0 };
      }
      acc[t.category].value += t.amount;
      return acc;
    }, {})
  );

  // =============================
  // MONTHLY SUMMARY
  // =============================
  const getMonthlySummary = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let thisMonthTotal = 0;
    let lastMonthTotal = 0;

    transactions.forEach((t) => {
      const date = new Date(t.date);

      if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        thisMonthTotal += t.amount;
      }

      const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
      if (
        date.getMonth() === lastMonthDate.getMonth() &&
        date.getFullYear() === lastMonthDate.getFullYear()
      ) {
        lastMonthTotal += t.amount;
      }
    });

    return { thisMonthTotal, lastMonthTotal };
  };

  const { thisMonthTotal, lastMonthTotal } = getMonthlySummary();
  const difference = thisMonthTotal - lastMonthTotal;

  return (
    <div style={container}>
      <h2>Dashboard Overview</h2>

      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <button
          onClick={() => {
            setEditData(null);
            setIsOpen(true);
          }}
          style={addBtn}
        >
          + Add Transaction
        </button>
      </div>

      {/* Summary Cards */}
      <div style={cardContainer}>
        <div style={card}>
          <h4>Total Expenses</h4>
          <h2>₹{total}</h2>
        </div>

        <div style={card}>
          <h4>Total Transactions</h4>
          <h2>{transactions.length}</h2>
        </div>
      </div>

      {/* Monthly Summary */}
      <div style={monthlyContainer}>
        <div style={monthlyCard}>
          <h4>This Month</h4>
          <h2>₹{thisMonthTotal}</h2>
        </div>

        <div style={monthlyCard}>
          <h4>Last Month</h4>
          <h2>₹{lastMonthTotal}</h2>
        </div>

        <div style={monthlyCard}>
          <h4>Change</h4>
          <h2 style={{ color: difference >= 0 ? "green" : "red" }}>
            {difference >= 0 ? "↑" : "↓"} ₹{Math.abs(difference)}
          </h2>
        </div>
      </div>

      {/* Pie Chart */}
      <div style={chartContainer}>
        <h3>Category Breakdown</h3>

        {categoryData.length === 0 ? (
          <p>No data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Recent Transactions */}
      <div style={{ marginTop: "30px" }}>
        <h3>Recent Transactions</h3>

        {transactions.slice(0, 5).map((t) => (
          <div key={t._id} style={transactionCard}>
            <div>
              <strong>{t.title}</strong>
              <p>{t.category}</p>
            </div>

            <div style={{ textAlign: "right" }}>
              <strong>₹{t.amount}</strong>
              <p>{new Date(t.date).toLocaleDateString()}</p>

              <div style={{ marginTop: "8px" }}>
                <button
                  style={viewBtn}
                  onClick={() => {
                    setViewData(t);
                    setViewOpen(true);
                  }}
                >
                  View
                </button>

                <button
                  style={editBtn}
                  onClick={() => {
                    setEditData(t);
                    setIsOpen(true);
                  }}
                >
                  Edit
                </button>

                <button
                  style={deleteBtn}
                  onClick={() => handleDeleteClick(t._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Modal */}
      {deleteId && (
        <div style={overlay} onClick={() => setDeleteId(null)}>
          <div style={deleteModal} onClick={(e) => e.stopPropagation()}>
            <h3>Delete Transaction?</h3>
            <div style={buttonRow}>
              <button style={cancelBtn} onClick={() => setDeleteId(null)}>
                Cancel
              </button>
              <button style={confirmBtn} onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <TransactionModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={fetchData}
        editData={editData}
      />

      <ViewDetailsModal
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        data={viewData}
      />
    </div>
  );
};

// ===================
// STYLES
// ===================

const container = { padding: "30px", maxWidth: "1100px", margin: "auto" };
const cardContainer = { display: "flex", gap: "20px", marginBottom: "30px" };
const card = { flex: 1, background: "#f3f4f6", padding: "20px", borderRadius: "10px", textAlign: "center" };
const chartContainer = { background: "#f9fafb", padding: "20px", borderRadius: "10px" };
const transactionCard = { display: "flex", justifyContent: "space-between", padding: "12px", background: "#f3f4f6", marginBottom: "10px", borderRadius: "6px" };
const addBtn = { padding: "10px 16px", background: "#3b82f6", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" };
const editBtn = { marginRight: "8px", padding: "4px 10px", background: "#10b981", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" };
const deleteBtn = { padding: "4px 10px", background: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" };
const viewBtn = { marginRight: "8px", padding: "4px 10px", background: "#6366f1", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" };
const overlay = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 };
const deleteModal = { background: "#fff", padding: "30px", borderRadius: "14px", width: "350px" };
const buttonRow = { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" };
const cancelBtn = { padding: "8px 14px", background: "#e5e7eb", border: "none", borderRadius: "6px", cursor: "pointer" };
const confirmBtn = { padding: "8px 16px", background: "#ef4444", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" };
const monthlyContainer = { display: "flex", gap: "20px", marginBottom: "30px" };
const monthlyCard = { flex: 1, background: "#ffffff", padding: "20px", borderRadius: "12px", boxShadow: "0 5px 15px rgba(0,0,0,0.08)", textAlign: "center" };

export default Dashboard;
