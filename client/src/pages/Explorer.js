import { useEffect, useState } from "react";
import API from "../api";

const Explorer = () => {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
  search: "",
  category: "All",
  minAmount: "",
  maxAmount: "",
  startDate: "",
  endDate: "",
  sort: "newest"
});

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Restore filters & page from sessionStorage
  useEffect(() => {
    const savedState = sessionStorage.getItem("explorerState");
    if (savedState) {
      const parsed = JSON.parse(savedState);
      setFilters(parsed.filters);
      setPage(parsed.page);
    }
  }, []);

  // Save filters & page
  useEffect(() => {
    sessionStorage.setItem(
      "explorerState",
      JSON.stringify({ filters, page })
    );
  }, [filters, page]);

  // Restore scroll position
  useEffect(() => {
    const savedScroll = sessionStorage.getItem("scrollPosition");
    if (savedScroll) {
      window.scrollTo(0, Number(savedScroll));
    }
  }, []);

  // Save scroll position
  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem("scrollPosition", window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch transactions
  
  


  const fetchTransactions = async () => {
    const res = await API.get("/transactions", {
      params: {
        ...filters,
        page,
        limit: 5
      }
    });


    const newData = res.data.transactions || [];

    if (page === 1) {
      setTransactions(newData);
    } else {
      setTransactions(prev => [...prev, ...newData]);
    }

    setHasMore(page < res.data.totalPages);
  };

  const handleChange = (e) => {
    setPage(1);
    setTransactions([]);
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
  const resetFilters = () => {
  setFilters({
    search: "",
    category: "All",
    minAmount: "",
    maxAmount: "",
    startDate: "",
    endDate: "",
    sort: "newest"
  });

  setPage(1);   // reset pagination
};
useEffect(() => {
  fetchTransactions();
}, );

  return (
    <div style={container}>
  <h2 style={titleStyle}>Transaction Explorer</h2>

  <div style={filterBox}>
    <input
      style={inputStyle}
      name="search"
      placeholder="Search..."
      value={filters.search}
      onChange={handleChange}
    />

    <select
      style={selectStyle}
      name="category"
      value={filters.category}
      onChange={handleChange}
    >
      <option value="All">All</option>
      <option value="Food">Food</option>
      <option value="Rent">Rent</option>
      <option value="Transport">Transport</option>
      <option value="Shopping">Shopping</option>
    </select>

    <input
      style={inputStyle}
      type="number"
      name="minAmount"
      placeholder="Min Amount"
      value={filters.minAmount}
      onChange={handleChange}
    />

    <input
      style={inputStyle}
      type="number"
      name="maxAmount"
      placeholder="Max Amount"
      value={filters.maxAmount}
      onChange={handleChange}
    />

    <input
      style={inputStyle}
      type="date"
      name="startDate"
      value={filters.startDate}
      onChange={handleChange}
    />

    <input
      style={inputStyle}
      type="date"
      name="endDate"
      value={filters.endDate}
      onChange={handleChange}
    />

    <select
      style={selectStyle}
      name="sort"
      value={filters.sort}
      onChange={handleChange}
    >
      <option value="newest">Newest First</option>
      <option value="oldest">Oldest First</option>
      <option value="amountHigh">Amount High → Low</option>
      <option value="amountLow">Amount Low → High</option>
    </select>
  </div>

  <button style={resetBtn} onClick={resetFilters}>
    Reset Filters
  </button>

  {transactions.length === 0 && (
    <p style={{ marginTop: "20px", color: "#6b7280" }}>
      No transactions found.
    </p>
  )}

  {transactions.map((t) => (
    <div key={t._id} style={card}>
      <div style={cardLeft}>
        <div style={cardTitle}>{t.title}</div>
        <div style={cardCategory}>{t.category}</div>
      </div>

      <div style={cardRight}>
        <div style={amountStyle}>₹{t.amount}</div>
        <div style={dateStyle}>
          {new Date(t.date).toLocaleDateString()}
        </div>
      </div>
    </div>
  ))}

  {hasMore && (
    <div style={{ textAlign: "center" }}>
      <button
        style={loadMoreBtn}
        onClick={() => setPage(prev => prev + 1)}
      >
        Load More
      </button>
    </div>
  )}
</div>

  );
};

const container = {
  maxWidth: "1100px",
  margin: "auto",
  padding: "40px 20px"
};

const titleStyle = {
  fontSize: "26px",
  fontWeight: "600",
  marginBottom: "30px"
};

const filterBox = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "15px",
  marginBottom: "20px",
  background: "#f9fafb",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
};

const inputStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
  fontSize: "14px",
  outline: "none"
};

const selectStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
  fontSize: "14px",
  background: "white",
  cursor: "pointer"
};

const resetBtn = {
  padding: "8px 16px",
  background: "#ef4444",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "500",
  marginTop: "10px"
};

const card = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px",
  background: "white",
  marginBottom: "15px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  transition: "0.2s"
};

const cardLeft = {
  display: "flex",
  flexDirection: "column"
};

const cardTitle = {
  fontSize: "16px",
  fontWeight: "600",
  marginBottom: "5px"
};

const cardCategory = {
  color: "#6b7280",
  fontSize: "14px"
};

const cardRight = {
  textAlign: "right"
};

const amountStyle = {
  fontSize: "16px",
  fontWeight: "600"
};

const dateStyle = {
  fontSize: "13px",
  color: "#6b7280",
  marginTop: "5px"
};

const loadMoreBtn = {
  padding: "10px 20px",
  background: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "500",
  marginTop: "20px"
};

export default Explorer;
