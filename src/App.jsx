import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export default function InstantMedicalReportGenerator() {
  const [form, setForm] = useState({
    hospital: "Greenfield General Hospital (SAMPLE)",
    address: "123 Clinic Road, Dhaka (SAMPLE)",
    phone: "+880-1XX-XXXXXXX (SAMPLE)",
    patientName: "Mohammad Rahim (SAMPLE)",
    patientId: "SAMP-000123",
    dob: "1990-05-12",
    sex: "Male",
    reportDate: new Date().toISOString().slice(0, 10),
    referring: "Dr. Ayesha Khan (SAMPLE)",
    chief: "Fever and sore throat for 3 days. Mild productive cough.",
    history:
      "Patient reports onset of fever (max 38.7°C) three days prior, with sore throat, nasal congestion, and intermittent dry cough.",
    pmh: "Hypertension — diagnosed 2018 (on medication).",
    meds: "Amlodipine 5 mg once daily (SAMPLE).",
    exam: "Temp 38.2°C; Pulse 88 bpm; Respiratory 18/min; BP 128/78 mmHg.",
    investigations:
      "CBC: WBC 9.8 x10⁹/L; CRP 12 mg/L; Chest X-ray: No focal consolidation (SAMPLE).",
    impression: "Acute pharyngitis, likely viral.",
    plan: "Symptomatic care, paracetamol 500 mg prn; follow up in 3–5 days.",
    disclaimer:
      "SAMPLE — NOT A REAL MEDICAL REPORT — FOR TRAINING / DEMO PURPOSES ONLY",
  });

  const previewRef = useRef(null);
  const [loadingPdf, setLoadingPdf] = useState(false);

  function updateField(key, value) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  function autoFillAndGenerate(autoDownload = false) {
    setForm((s) => ({ ...s }));
    if (autoDownload) {
      setTimeout(() => downloadPDF(), 400);
    }
  }

  // -----------------------------
  // Mobile-friendly PDF download
  // -----------------------------
  async function downloadPDF() {
    if (!previewRef.current) return;
    setLoadingPdf(true);
    try {
      const node = previewRef.current;

      // increase scale for better resolution
      const canvas = await html2canvas(node, {
        scale: 3,
        useCORS: true,
        scrollY: -window.scrollY,
        width: node.scrollWidth,
        height: node.scrollHeight,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");

      // PDF size matches canvas
      const pdf = new jsPDF({
        unit: "pt",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`medical_report_${form.patientId || "sample"}.pdf`);
    } catch (err) {
      console.error("PDF export failed", err);
      alert("Could not export PDF. Open console for details.");
    } finally {
      setLoadingPdf(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col gap-6">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: form */}
        <div className="col-span-1 bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-3">
            Instant Report Generator
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Fill fields, preview on right, then download PDF.
          </p>

          <div className="space-y-3 max-h-[70vh] overflow-auto pr-2">
            <Input
              label="Hospital / Clinic"
              value={form.hospital}
              onChange={(v) => updateField("hospital", v)}
            />
            <Input
              label="Address"
              value={form.address}
              onChange={(v) => updateField("address", v)}
            />
            <Input
              label="Phone"
              value={form.phone}
              onChange={(v) => updateField("phone", v)}
            />
            <Input
              label="Patient name"
              value={form.patientName}
              onChange={(v) => updateField("patientName", v)}
            />
            <Input
              label="Patient ID"
              value={form.patientId}
              onChange={(v) => updateField("patientId", v)}
            />
            <Input
              label="Date of birth"
              type="date"
              value={form.dob}
              onChange={(v) => updateField("dob", v)}
            />
            <Input
              label="Sex"
              value={form.sex}
              onChange={(v) => updateField("sex", v)}
            />
            <Input
              label="Report date"
              type="date"
              value={form.reportDate}
              onChange={(v) => updateField("reportDate", v)}
            />
            <Input
              label="Referring physician"
              value={form.referring}
              onChange={(v) => updateField("referring", v)}
            />

            <Textarea
              label="Chief complaint"
              value={form.chief}
              onChange={(v) => updateField("chief", v)}
            />
            <Textarea
              label="History of present illness"
              value={form.history}
              onChange={(v) => updateField("history", v)}
            />
            <Textarea
              label="Past medical history"
              value={form.pmh}
              onChange={(v) => updateField("pmh", v)}
            />
            <Textarea
              label="Medications"
              value={form.meds}
              onChange={(v) => updateField("meds", v)}
            />
            <Textarea
              label="Examination"
              value={form.exam}
              onChange={(v) => updateField("exam", v)}
            />
            <Textarea
              label="Investigations"
              value={form.investigations}
              onChange={(v) => updateField("investigations", v)}
            />
            <Textarea
              label="Assessment / Impression"
              value={form.impression}
              onChange={(v) => updateField("impression", v)}
            />
            <Textarea
              label="Plan / Treatment"
              value={form.plan}
              onChange={(v) => updateField("plan", v)}
            />

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => autoFillAndGenerate(false)}
                className="px-3 py-2 bg-indigo-600 text-white rounded-lg shadow-sm text-sm"
              >
                Auto-fill sample
              </button>
              <button
                onClick={() => autoFillAndGenerate(true)}
                className="px-3 py-2 bg-emerald-600 text-white rounded-lg shadow-sm text-sm"
              >
                Auto-fill & Download PDF
              </button>
              <button
                onClick={() => downloadPDF()}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg shadow-sm ml-auto text-sm"
              >
                {loadingPdf ? "Preparing PDF..." : "Download PDF"}
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Output will contain the word "SAMPLE". Do not use for
              official/medical/legal purposes.
            </p>
          </div>
        </div>

        {/* Right: preview */}
        <div className="col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-medium">Report Preview</h3>
              <div className="text-sm text-gray-500">
                Paper A4 preview — use Download PDF to export
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-full bg-gray-100 p-4 rounded-lg">
                {/* The printable area */}
                <div
                  ref={previewRef}
                  className="relative bg-white mx-auto shadow-sm p-8 text-sm"
                  style={{ width: "794px", minHeight: "1123px" }}
                >
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10">
                    <div className="text-6xl font-extrabold tracking-wider transform -rotate-12">
                      SAMPLE
                    </div>
                  </div>

                  <div className="relative z-10">
                    {/* Report content */}
                    {/* ... (অন্য অংশ অপরিবর্তিত) */}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500">
              Tip: For higher-fidelity printing you can increase the page scale
              in the PDF export code or use server-side HTML-to-PDF tools.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <div className="text-xs font-medium text-gray-600 mb-1">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-200"
      />
    </label>
  );
}

function Textarea({ label, value, onChange }) {
  return (
    <label className="block">
      <div className="text-xs font-medium text-gray-600 mb-1">{label}</div>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-200"
      />
    </label>
  );
}