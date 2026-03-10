import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const [email, setEmail] = useState("");
  // 🔹 Form states
  const [company, setCompany] = useState("");
  const [AmountPaid, setAmountPaid] = useState("");
  const [remaining, setRemaining] = useState("");
  const [stage, setStage] = useState("Discovery");

const user = JSON.parse(localStorage.getItem("user") || "{}");
  // 🔹 Fetch leads
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await axiosInstance.get("/leads");
        setLeads(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch leads");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  // 🔹 Create lead
const createLead = async (e) => {
  e.preventDefault();

  try { 
    const res = await axiosInstance.post("/leads", {
      name: company,
      email: email,
      status: stage,
        AmountPaid: Number(AmountPaid),
      remaining: Number(remaining)                                        
    });

    setLeads([...leads, res.data]);

    setCompany("");
    setEmail("");
    setAmountPaid("");
    setRemaining("");
    setStage("New");

  } catch (err) {
    console.error("Create Lead Error:", err.response?.data);
  }
};

  // 🔹 Delete lead
  const deleteLead = async (id) => {
    try {
      await axiosInstance.delete(`/leads/${id}`);
      setLeads(leads.filter((lead) => lead._id !== id));
    } catch (err) {
      console.error("Delete Error:", err.response?.data);
    }
  };

  if (loading) return <p>Loading leads...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add New Lead</h2>

      {/* 🔹 FORM */}
    <form onSubmit={createLead} style={{ marginBottom: "20px" }}>

  <input
    type="text"
    placeholder="Company Name"
    value={company}
    onChange={(e) => setCompany(e.target.value)}
    required
  />

  <input
    type="email"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
  />

  <input
    type="number"
    placeholder="Amount Paid"
    value={AmountPaid}
    onChange={(e) => setAmountPaid(e.target.value)}
    required
  />

  <input
    type="number"
    placeholder="Remaining"
    value={remaining}
    onChange={(e) => setRemaining(e.target.value)}
    required
  />

  <select
    value={stage}
    onChange={(e) => setStage(e.target.value)}
  >
    <option value="New">New</option>
    <option value="Qualified">Qualified</option>
    <option value="Proposal">Proposal</option>
    <option value="Closed Won">Closed Won</option>
  </select>

  <button type="submit">Add Lead</button>

</form>

      <h2>Leads List</h2>

      {leads.length === 0 ? (
        <p>No leads found</p>
      ) : (
        leads.map((lead) => (
          <div
            key={lead._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <strong>{lead.company}</strong>
            <p>Stage: {lead.stage}</p>
            <p>Amount Paid: ₹{lead.AmountPaid}</p>
            <p>Remaining: ₹{lead.remaining}</p>

            {user?.role === "admin" && (
              <button
                onClick={() => deleteLead(lead._id)}
                style={{ background: "red", color: "white" }}
              >
                Delete
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default LeadsPage;