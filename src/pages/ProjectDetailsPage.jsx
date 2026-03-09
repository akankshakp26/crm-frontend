import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import jsPDF from "jspdf";
import { useParams, useNavigate } from "react-router-dom";
const ProjectDetailsPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  useEffect(() => {
    fetchProject();
  }, []);

  const fetchProject = async () => {
    const res = await axiosInstance.get(`/projects/${projectId}`);
    setProject(res.data);
  };

  const markInstallmentPaid = async (index) => {
  try {
    await axiosInstance.put(
      `/projects/${projectId}/installment/${index}`
    );

    fetchProject(); // refresh project
  } catch (error) {
    console.error("Payment update failed:", error);
  }
};

  if (!project) return <div className="p-10">Loading...</div>;

  // 🔹 Calculate totals
  const paidTotal =
    project.installments
      ?.filter((i) => i.paid)
      .reduce((sum, i) => sum + i.amount, 0) || 0;

  const remaining = project.totalPayment - paidTotal;

  const progress =
    project.totalPayment > 0
      ? (paidTotal / project.totalPayment) * 100
      : 0;

const undoInstallment = async (index) => {
  if (!window.confirm("Are you sure you want to undo this payment?"))
    return;

  try {
    await axiosInstance.put("/projects/installment/undo", {
      projectId,
      installmentIndex: index
    });

    fetchProject();
  } catch (error) {
    console.error("Undo payment failed:", error);
  }
};

      const downloadInvoice = () => {
  const doc = new jsPDF();

  doc.text(`Project: ${project.name}`, 10, 10);
  doc.text(`Client Payment Summary`, 10, 20);

  doc.text(`Total: ₹${project.totalPayment}`, 10, 40);
  doc.text(`Paid: ₹${paidTotal}`, 10, 50);
  doc.text(`Remaining: ₹${remaining}`, 10, 60);

  doc.save(`${project.name}-invoice.pdf`);
};
  return (
    <div className="p-10 bg-slate-50 min-h-screen">
<div className="mb-6">
  <button
    onClick={() => navigate(-1)}
    className="text-sm font-bold text-blue-600 hover:underline"
  >
    ← Back
  </button>
</div>
      {/* HEADER */}
      <div className="mb-10">
        <button
  onClick={downloadInvoice}
  className="bg-slate-900 text-white px-4 py-2 rounded-xl mt-6"
>
  Download Invoice
</button>
        <h1 className="text-4xl font-black text-slate-900">
          {project.name}
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Handled by {project.handledBy}
        </p>
      </div>

      {/* PAYMENT SUMMARY CARD */}
      <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-100 mb-10">

        <div className="flex justify-between mb-6">
          <div>
            <p className="text-sm text-slate-400">Total Payment</p>
            <p className="text-2xl font-black text-slate-900">
              ₹{project.totalPayment}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-400">Paid</p>
            <p className="text-2xl font-black text-emerald-600">
              ₹{paidTotal}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-400">Remaining</p>
            <p className="text-2xl font-black text-red-600">
              ₹{remaining}
            </p>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-emerald-500 h-3 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-xs text-slate-400 mt-2">
          {progress.toFixed(0)}% Completed
        </p>
      </div>

      {/* INSTALLMENTS */}
      <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-100">

        <h2 className="text-xl font-black mb-6 text-slate-900">
          Installments
        </h2>
<h3 className="text-lg font-bold mt-8 mb-3">
Payment History
</h3>

{project.installments
  ?.filter(i => i.paid)
  .map((inst, index) => (
    <div
      key={index}
      className="border-l-4 border-green-500 pl-3 py-2 mb-2"
    >
      <p className="font-bold">{inst.phase}</p>
      <p className="text-xs text-slate-500">
        ₹{inst.amount} paid on{" "}
        {new Date(inst.paidAt).toDateString()}
      </p>
    </div>
))}
        {project.installments?.map((inst, index) => (
          <div
            key={index}
            className="flex justify-between items-center border-b py-4"
          >
            <div>
              <p className="font-bold text-slate-800">
                {inst.phase}
              </p>
              <p className="text-xs text-slate-400">
                {inst.percentage}% of total
              </p>
            </div>

            <div className="text-right">
              <p className="font-bold text-slate-900">
                ₹{inst.amount}
              </p>
                {inst.paid ? (
  <button
    onClick={() => undoInstallment(index)}
    className="text-xs bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded font-bold"
  >
    Undo Payment
  </button>
) : (
                <button
                  onClick={() => markInstallmentPaid(index)}
                  className="text-xs bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded font-bold"
                >
                  Mark as Paid
                </button>
              )}
            </div>
          </div>
        ))}

        <div className="mt-6 text-xs text-slate-400">
          Deadline:{" "}
          {project.deadline
            ? new Date(project.deadline).toDateString()
            : "Not Set"}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;