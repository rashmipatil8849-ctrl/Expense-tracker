const ViewDetailsModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  return (
    <div style={overlay}>
      <div style={modal}>
        <h2 style={{ marginBottom: "20px" }}>
          Transaction Details
        </h2>

        <div style={detailRow}>
          <strong>Title:</strong>
          <span>{data.title}</span>
        </div>

        <div style={detailRow}>
          <strong>Category:</strong>
          <span>{data.category}</span>
        </div>

        <div style={detailRow}>
          <strong>Amount:</strong>
          <span>₹{data.amount}</span>
        </div>

        <div style={detailRow}>
          <strong>Date:</strong>
          <span>{new Date(data.date).toLocaleDateString()}</span>
        </div>

        <div style={detailRow}>
          <strong>Notes:</strong>
          <span>{data.notes || "No notes added"}</span>
        </div>

        <div style={{ textAlign: "right", marginTop: "20px" }}>
          <button style={closeBtn} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* STYLES */

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
  boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
};

const detailRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "12px"
};

const closeBtn = {
  padding: "8px 16px",
  background: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

export default ViewDetailsModal;
