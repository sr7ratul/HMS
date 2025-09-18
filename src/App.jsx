import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import "./ReportStyles.css";

export default function InstantMedicalReportGenerator() {
  const [form, setForm] = useState({
    hospital: "Northern Modern Hospital",
    address: "111/2 Kawlar Jame Mosjid Road, Ashkona, (Near Hajj Camp) Dakshinkhan, Dhaka-1230",
    phone: "+880-1762057707",
    patientName: "",
    patientId: "NGH-00",
    dob: "",
    sex: "",
    reportDate: new Date().toISOString().slice(0, 10),
    referring: "Dr. SAKIB AL HASAN",
    ccProblem: "",
    ccDuration: "",
    hpiOnset: "",
    hpiSeverity: "",
    hpiExtraSymptoms: "",
    pastChronic: [],
    pastAllergies: "",
    medications: "",
    examVitals: "",
    examGeneral: "",
    investigationTest: "",
    investigationResult: "",
    impression: "",
    planPrescription: "",
    planFollowUp: "",
  });

  const previewRef = useRef(null);
  const [loadingPdf, setLoadingPdf] = useState(false);

  function updateField(key, value) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setForm((s) => ({
      ...s,
      pastChronic: checked
        ? [...s.pastChronic, value]
        : s.pastChronic.filter((item) => item !== value),
    }));
  };

  async function downloadPDF() {
    if (!form.patientName || !form.patientId) {
      alert("Please enter the patient's name and ID before downloading.");
      return;
    }

    if (!previewRef.current) {
      console.error("Preview element not found.");
      return;
    }

    setLoadingPdf(true);
    try {
      const node = previewRef.current;
      const scale = 2;
      const canvas = await html2canvas(node, {
        scale: scale,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        unit: "pt",
        format: "a4",
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`medical_report_${form.patientId || "sample"}.pdf`);
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("Could not export PDF. Please check the console for details.");
    } finally {
      setLoadingPdf(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col gap-6">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: form */}
        <div className="col-span-1 bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-3">Instant Report Generator</h2>
          <p className="text-sm text-gray-500 mb-4">Fill fields, preview on right, then download PDF.</p>
          <div className="space-y-4 max-h-[70vh] overflow-auto pr-2">
            {/* Patient Information */}
            <h3 className="text-lg font-semibold">Patient Information</h3>
            <Input label="Patient name" value={form.patientName} onChange={(v) => updateField("patientName", v)} />
            <Input label="Patient ID" value={form.patientId} onChange={(v) => updateField("patientId", v)} />
            <Input label="Date of birth" type="date" value={form.dob} onChange={(v) => updateField("dob", v)} />
            <Select label="Sex" value={form.sex} onChange={(v) => updateField("sex", v)} options={["Male", "Female", "Other"]} />

            {/* 1. Chief Complaint */}
            <h3 className="text-lg font-semibold">1. Chief Complaint</h3>
            <Select
              label="Problem"
              value={form.ccProblem}
              onChange={(v) => updateField("ccProblem", v)}
              options={["Fever", "Cough", "Chest Pain", "Headache", "Abdominal Pain"]}
            />
            <Input label="Duration" value={form.ccDuration} onChange={(v) => updateField("ccDuration", v)} />

            {/* 2. Present Illness History */}
            <h3 className="text-lg font-semibold">2. Present Illness History</h3>
            <Select label="Onset" value={form.hpiOnset} onChange={(v) => updateField("hpiOnset", v)} options={["Sudden", "Gradual"]} />
            <Select label="Severity" value={form.hpiSeverity} onChange={(v) => updateField("hpiSeverity", v)} options={["Mild", "Moderate", "Severe"]} />
            <Textarea label="Extra Symptoms" value={form.hpiExtraSymptoms} onChange={(v) => updateField("hpiExtraSymptoms", v)} />

            {/* 3. Past History */}
            <h3 className="text-lg font-semibold">3. Past History</h3>
            <div>
              <div className="text-xs font-medium text-gray-600 mb-1">Chronic Illness</div>
              <div className="flex flex-wrap gap-2">
                {["Diabetes", "Hypertension", "Asthma"].map(illness => (
                  <label key={illness} className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      value={illness}
                      checked={form.pastChronic.includes(illness)}
                      onChange={handleCheckboxChange}
                      className="mr-1"
                    />
                    {illness}
                  </label>
                ))}
              </div>
            </div>
            <Textarea label="Allergies" value={form.pastAllergies} onChange={(v) => updateField("pastAllergies", v)} />

            {/* 4. Current Medications */}
            <h3 className="text-lg font-semibold">4. Current Medications</h3>
            <Textarea label="Medicine Name & Dose" value={form.medications} onChange={(v) => updateField("medications", v)} />

            {/* 5. Examination */}
            <h3 className="text-lg font-semibold">5. Examination</h3>
            <Textarea label="Vitals (e.g., BP, Pulse, Temp, SpO₂)" value={form.examVitals} onChange={(v) => updateField("examVitals", v)} />
            <Select label="General Findings" value={form.examGeneral} onChange={(v) => updateField("examGeneral", v)} options={["Normal", "Abnormal"]} />

            {/* 6. Investigations */}
            <h3 className="text-lg font-semibold">6. Investigations</h3>
            <Select label="Test Name" value={form.investigationTest} onChange={(v) => updateField("investigationTest", v)} options={["CBC", "X-Ray", "ECG", "MRI", "Blood Test"]} />
            <Input label="Result" value={form.investigationResult} onChange={(v) => updateField("investigationResult", v)} />

            {/* 7. Assessment / Impression */}
            <h3 className="text-lg font-semibold">7. Assessment / Impression</h3>
            <Textarea label="Provisional Diagnosis" value={form.impression} onChange={(v) => updateField("impression", v)} />

            {/* 8. Plan / Treatment */}
            <h3 className="text-lg font-semibold">8. Plan / Treatment</h3>
            <Textarea label="Prescription / Advice" value={form.planPrescription} onChange={(v) => updateField("planPrescription", v)} />
            <Input label="Follow-up Date" type="date" value={form.planFollowUp} onChange={(v) => updateField("planFollowUp", v)} />

            <div className="flex gap-2 mt-4">
              <button
                onClick={downloadPDF}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg shadow-sm w-full text-sm"
              >
                {loadingPdf ? "Preparing PDF..." : "Download PDF"}
              </button>
            </div>
          </div>
        </div>

        {/* Right: preview */}
        <div className="col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-medium">Report Preview</h3>
              <div className="text-sm text-gray-500">Paper A4 preview — use Download PDF to export</div>
            </div>
            <div className="flex gap-4">
              <div className="w-full bg-gray-100 p-4 rounded-lg">
                <div
                  ref={previewRef}
                  className="report-container relative mx-auto shadow-sm p-8 text-sm leading-relaxed"
                  style={{ width: "794px", minHeight: "1123px" }}
                >
                  <div className="relative z-10">
                    <header className="report-header">
                      <div className="hospital-info">
                        <h1>{form.hospital}</h1>
                        <p>{form.address}</p>
                        <p>{form.phone}</p>
                      </div>
                      <div className="patient-info text-right">
                        <p>Report date: {form.reportDate}</p>
                        <p>Ref: {form.referring}</p>
                      </div>
                    </header>
                    <hr className="my-3" />
                    <section className="mb-3">
                      <div className="flex justify-between">
                        <div>
                          <div><strong>Patient:</strong> {form.patientName}</div>
                          <div><strong>ID:</strong> {form.patientId}</div>
                        </div>
                        <div className="text-right">
                          <div><strong>DOB:</strong> {form.dob}</div>
                          <div><strong>Sex:</strong> {form.sex}</div>
                        </div>
                      </div>
                    </section>
                    
                    {/* 1. Chief Complaint */}
                    <section className="report-section">
                      <h4>1. Chief Complaint</h4>
                      <p><strong>Problem:</strong> {form.ccProblem}</p>
                      <p><strong>Duration:</strong> {form.ccDuration}</p>
                    </section>

                    {/* 2. Present Illness History */}
                    <section className="report-section">
                      <h4>2. Present Illness History</h4>
                      <p><strong>Onset:</strong> {form.hpiOnset}</p>
                      <p><strong>Severity:</strong> {form.hpiSeverity}</p>
                      <p><strong>Extra Symptoms:</strong> {form.hpiExtraSymptoms}</p>
                    </section>

                    {/* 3. Past History */}
                    <section className="report-section">
                      <h4>3. Past History</h4>
                      <p><strong>Chronic Illness:</strong> {form.pastChronic.join(", ") || "None"}</p>
                      <p><strong>Allergies:</strong> {form.pastAllergies || "None"}</p>
                    </section>
                    
                    {/* 4. Current Medications */}
                    <section className="report-section">
                      <h4>4. Current Medications</h4>
                      <p>{form.medications || "N/A"}</p>
                    </section>

                    {/* 5. Examination */}
                    <section className="report-section">
                      <h4>5. Examination</h4>
                      <p><strong>Vitals:</strong> {form.examVitals || "N/A"}</p>
                      <p><strong>General Findings:</strong> {form.examGeneral}</p>
                    </section>

                    {/* 6. Investigations */}
                    <section className="report-section">
                      <h4>6. Investigations</h4>
                      <p><strong>Test Name:</strong> {form.investigationTest}</p>
                      <p><strong>Result:</strong> {form.investigationResult}</p>
                    </section>

                    {/* 7. Assessment / Impression */}
                    <section className="report-section">
                      <h4>7. Assessment / Impression</h4>
                      <p><strong>Provisional Diagnosis:</strong> {form.impression}</p>
                    </section>

                    {/* 8. Plan / Treatment */}
                    <section className="report-section">
                      <h4>8. Plan / Treatment</h4>
                      <p><strong>Prescription / Advice:</strong> {form.planPrescription}</p>
                      <p><strong>Follow-up Date:</strong> {form.planFollowUp}</p>
                    </section>

                    <footer className="report-footer">
                      <div className="doctor-info">
                        <strong>Examined by:</strong>
                        <p>{form.referring}</p>
                        <p>(Signature)</p>
                      </div>
                      <div className="hospital-info">
                        <p>Generated by Instant Medical Report Generator</p>
                      </div>
                    </footer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <label className="block mb-2">
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
    <label className="block mb-2">
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

function Select({ label, value, onChange, options }) {
  return (
    <label className="block mb-2">
      <div className="text-xs font-medium text-gray-600 mb-1">{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-200"
      >
        <option value="" disabled>Select...</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}