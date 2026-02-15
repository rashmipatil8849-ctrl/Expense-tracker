import { useState, useEffect } from "react";
import API from "../../api";

const TransactionModal = ({ isOpen, onClose, onSave, editData }) => {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food",
    date: "",
    notes: ""
  });

  useEffect(() => {
    if (editData) {
      setForm({
        title: editData.title,
        amount: editData.amount,
        category: editData.category,
        date: editData.date?.split("T")[0],
        notes: editData.notes || ""
      });
    }
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editData) {
      await API.put(`/transactions/${editData._id}`, form);
    } else {
      await API.post("/transactions", form);
    }

    onSave();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={overlay}>
      <div style={modal}>
        <h2 style={{ marginBottom: "20px" }}>
          {editData ? "Edit Transaction" : "Add Transaction"}
        </h2>

        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            style={input}
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            required
          />

          <input
            style={input}
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) =>
              setForm({ ...form, amount: e.target.value })
            }
            required
          />

          <select
            style={input}
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          >
            <option value="Food">Food</option>
            <option value="Rent">Rent</option>
            <option value="Transport">Transport</option>
            <option value="Shopping">Shopping</option>
          </select>

          <input
            style={input}
            type="date"
            value={form.date}
            onChange={(e) =>
              setForm({ ...form, date: e.target.value })
            }
            required
          />

          <textarea
            style={{ ...input, height: "80px" }}
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={(e) =>
              setForm({ ...form, notes: e.target.value })
            }
          />

          <div style={buttonContainer}>
            <button type="submit" style={primaryBtn}>
              {editData ? "Update" : "Add"}
            </button>

            <button
              type="button"
              style={secondaryBtn}
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* -------------------- STYLES -------------------- */

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
};

const modal = {
  background: "#ffffff",
  padding: "30px",
  borderRadius: "12px",
  width: "400px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  animation: "fadeIn 0.2s ease-in-out"
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px"
};

const input = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ddd",
  fontSize: "14px",
  outline: "none"
};

const buttonContainer = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "10px"
};

const primaryBtn = {
  padding: "8px 16px",
  background: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "500"
};

const secondaryBtn = {
  padding: "8px 16px",
  background: "#e5e7eb",
  color: "#111",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

export default TransactionModal;
