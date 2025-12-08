"use client"

import React, { useState, useRef } from "react";
import { MapPin, Calendar, Users, Filter, Loader2, ChevronRight, Check, AlertCircle, ArrowLeft, Download } from "lucide-react";


interface Activity {
  time: string;
  activity: string;
  details: string;
  transport: string;
}

interface PlanResponse {
  success: boolean;
  plan: {
    itinerary: {
      dayWise: Record<string, Activity[]>;
      travelTips: string[];
      estimatedBudget: {
        low: string;
        medium: string;
        high: string;
      };
    };
  };
}

interface FormErrors {
  [key: string]: string;
}

const DISTRICTS = ["East Sikkim", "West Sikkim", "North Sikkim", "South Sikkim"];
const DAYS_OPTIONS = [2, 3, 4, 5, 6, 7, 8];
const TRAVELER_TYPES = ["Solo", "Couple", "Family", "Group"];
const AVAILABLE_FILTERS = [
  { id: "budget", label: "Budget Travel" },
  { id: "luxury", label: "Luxury Experience" },
  { id: "adventure", label: "Adventure Activities" },
  { id: "cultural", label: "Cultural Immersion" },
  { id: "nature", label: "Nature & Hiking" },
  { id: "photography", label: "Photography Spots" },
];

export default function TripPlannerPage() {
  const [step, setStep] = useState<"input" | "result">("input");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState({
    district: "",
    days: 2,
    travellerType: "solo",
    startingPoint: "Gangtok",
    language: "en",
    customNotes: "",
    filters: [] as string[],
  });

  const [response, setResponse] = useState<PlanResponse | null>(null);

  const validateForm = () => {
    const errors: FormErrors = {};
    if (!formData.district.trim()) errors.district = "Please select a district";
    if (formData.days < 2) errors.days = "Minimum 2 days required";
    if (!formData.travellerType) errors.travellerType = "Please select traveler type";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFilterToggle = (filterId: string) => {
    setFormData((prev) => ({
      ...prev,
      filters: prev.filters.includes(filterId)
        ? prev.filters.filter((f) => f !== filterId)
        : [...prev.filters, filterId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error("Failed to generate trip plan");

      setResponse(data);
      setStep("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create trip plan");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep("input");
    setResponse(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {step === "input" ? (
        <div className="min-h-screen">
          <div className="border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
              <h1 className="text-3xl font-bold text-gray-900">Plan Your Trip</h1>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
            <div className="space-y-8">
              <div>
                <label className="block text-base font-semibold text-gray-900 mb-4">
                  Where do you want to explore?
                </label>
                <input
                  type="text"
                  list="districts"
                  placeholder="Select a district"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full md:w-96 px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
                <datalist id="districts">
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d} />
                  ))}
                </datalist>
                {formErrors.district && (
                  <p className="text-red-600 text-sm mt-2">{formErrors.district}</p>
                )}
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-900 mb-4">
                  How many days?
                </label>
                <div className="flex gap-3 flex-wrap">
                  {DAYS_OPTIONS.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setFormData({ ...formData, days: day })}
                      className={`px-4 py-3 rounded-lg font-semibold transition ${
                        formData.days === day
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-900 mb-4">
                  Who are you traveling with?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {TRAVELER_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          travellerType: type.toLowerCase(),
                        })
                      }
                      className={`px-4 py-3 rounded-lg font-semibold transition ${
                        formData.travellerType === type.toLowerCase()
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-900 mb-4">
                  What interests you?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {AVAILABLE_FILTERS.map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => handleFilterToggle(filter.id)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                        formData.filters.includes(filter.id)
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300"
                      }`}
                    >
                      {formData.filters.includes(filter.id) && (
                        <Check className="w-4 h-4" />
                      )}
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-900 mb-4">
                  Any special requests?
                </label>
                <textarea
                  placeholder="Tell us about your preferences..."
                  value={formData.customNotes}
                  onChange={(e) =>
                    setFormData({ ...formData, customNotes: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none h-24"
                />
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-900 mb-4">
                  Preferred Language
                </label>
                <select
                  value={formData.language}
                  onChange={(e) =>
                    setFormData({ ...formData, language: e.target.value })
                  }
                  className="w-full md:w-96 px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="bn">Bengali</option>
                </select>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-black hover:bg-gray-900 disabled:bg-gray-500 text-white font-bold py-4 px-8 rounded-lg transition flex items-center justify-center gap-3 w-full md:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Planning...
                  </>
                ) : (
                  <>
                    Plan My Trip
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        response && <TripResultView response={response} formData={formData} onReset={handleReset} />
      )}
    </div>
  );
}

interface TripResultViewProps {
  response: PlanResponse;
  formData: {
    district: string;
    days: number;
    travellerType: string;
    startingPoint: string;
    filters: string[];
    language: string;
    customNotes: string;
  };
  onReset: () => void;
}

function TripResultView({ response, formData, onReset }: TripResultViewProps) {
  const [activeDay, setActiveDay] = useState("Day 1");
  const [activeTab, setActiveTab] = useState("itinerary");
  const [downloading, setDownloading] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  if (!response) return null;

  const dayWise = response.plan.itinerary.dayWise;
  const currentDay = dayWise[activeDay] || [];
  const travelTips = response.plan.itinerary.travelTips;
  const budget = response.plan.itinerary.estimatedBudget;
  const dayKeys = Object.keys(dayWise);

  const generatePDF = () => {
    setDownloading(true);

    setTimeout(() => {
      try {
        // Create a new window for printing
        const printWindow = window.open('', '', 'width=800,height=600');
        if (!printWindow || !pdfRef.current) return;
        const htmlContent = pdfRef.current.innerHTML;

        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>${formData.district} Trip Plan</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; background: white; }
              .header { background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); color: white; padding: 40px; margin-bottom: 30px; }
              .header h1 { font-size: 32px; margin-bottom: 10px; }
              .header p { font-size: 16px; opacity: 0.9; }
              .section { margin-bottom: 40px; padding: 0 40px; }
              .section h2 { font-size: 24px; font-weight: bold; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
              .timeline { display: flex; justify-content: space-between; margin: 30px 0; position: relative; padding: 0 40px; }
              .timeline-item { flex: 1; text-align: center; }
              .timeline-dot { width: 30px; height: 30px; background: black; border-radius: 50%; margin: 0 auto 10px; }
              .timeline-label { font-size: 12px; font-weight: 600; color: #666; }
              .activity { background: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin-bottom: 15px; }
              .activity-time { font-size: 12px; font-weight: 600; color: #666; }
              .activity-title { font-size: 18px; font-weight: bold; margin: 8px 0; }
              .activity-details { font-size: 14px; color: #666; margin: 8px 0; line-height: 1.5; }
              .activity-transport { font-size: 12px; color: #666; margin-top: 8px; }
              .tips-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
              .tip-box { background: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 8px; padding: 15px; font-size: 13px; line-height: 1.6; }
              .budget-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
              .budget-card { background: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; text-align: center; }
              .budget-label { font-size: 14px; font-weight: 600; color: #666; margin-bottom: 10px; }
              .budget-value { font-size: 24px; font-weight: bold; color: black; }
              .page-break { page-break-after: always; }
              @media print { body { margin: 0; padding: 0; } }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${formData.days}-Day ${formData.district} Journey</h1>
              <p>${formData.travellerType.charAt(0).toUpperCase() + formData.travellerType.slice(1)} • Starting from ${formData.startingPoint}</p>
            </div>

            <div class="section">
              <h2>Your Itinerary</h2>
              ${Object.entries(dayWise).map(([day, activities], idx) => `
                <div style="margin-bottom: 30px;">
                  <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 15px;">${day}</h3>
                  ${activities.map(activity => `
                    <div class="activity">
                      <div class="activity-time">${activity.time}</div>
                      <div class="activity-title">${activity.activity}</div>
                      <div class="activity-details">${activity.details}</div>
                      <div class="activity-transport">📍 ${activity.transport}</div>
                    </div>
                  `).join('')}
                </div>
              `).join('')}
            </div>

            <div class="page-break"></div>

            <div class="section">
              <h2>Travel Tips</h2>
              <div class="tips-grid">
                ${travelTips.map(tip => `
                  <div class="tip-box">${tip}</div>
                `).join('')}
              </div>
            </div>

            <div class="section">
              <h2>Estimated Budget</h2>
              <div class="budget-grid">
                <div class="budget-card">
                  <div class="budget-label">Budget</div>
                  <div class="budget-value">${budget.low}</div>
                </div>
                <div class="budget-card">
                  <div class="budget-label">Comfort</div>
                  <div class="budget-value">${budget.medium}</div>
                </div>
                <div class="budget-card">
                  <div class="budget-label">Premium</div>
                  <div class="budget-value">${budget.high}</div>
                </div>
              </div>
            </div>
          </body>
          </html>
        `);

        printWindow.document.close();
        printWindow.print();

      } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Error generating PDF. Please try again.");
      } finally {
        setDownloading(false);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <button
            onClick={onReset}
            className="text-gray-600 hover:text-black flex items-center gap-2 mb-6 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-4xl font-bold text-gray-900">
            Your {formData.days}-Day {formData.district} Journey
          </h1>
          <p className="text-gray-600 mt-2">
            {formData.travellerType.charAt(0).toUpperCase() + formData.travellerType.slice(1)} • {formData.startingPoint}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex gap-8 mb-12 border-b border-gray-200">
          {["itinerary", "tips", "budget"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 font-semibold transition ${
                activeTab === tab
                  ? "text-black border-b-2 border-black"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div ref={pdfRef} className="bg-white pb-12 print-content">
          {activeTab === "itinerary" && (
            <div className="space-y-8">
              <div className="mb-12">
                <div className="flex items-center gap-0 relative">
                  <div className="absolute top-5 left-0 right-0 h-1 bg-gray-300 -z-10" />
                  {dayKeys.map((day, idx) => (
                    <div key={day} className="flex-1 flex flex-col items-center">
                      <button
                        onClick={() => setActiveDay(day)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition mb-2 ${
                          activeDay === day
                            ? "bg-black text-white"
                            : "bg-white border-2 border-gray-300 text-gray-600 hover:border-black"
                        }`}
                      >
                        {idx + 1}
                      </button>
                      <span className="text-xs text-gray-600 font-medium">{day}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">{activeDay}</h2>
                {currentDay.map((activity, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                          <Clock className="w-6 h-6 text-gray-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-600">{activity.time}</p>
                        <h3 className="text-lg font-bold text-gray-900 mt-1">{activity.activity}</h3>
                        <p className="text-gray-600 text-sm mt-2">{activity.details}</p>
                        <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
                          <MapPin className="w-4 h-4" />
                          {activity.transport}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "tips" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Travel Tips</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {travelTips.map((tip, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <p className="text-gray-700 text-sm leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "budget" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Estimated Budget</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Budget", value: budget.low },
                  { label: "Comfort", value: budget.medium },
                  { label: "Premium", value: budget.high },
                ].map((tier, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-8 text-center hover:shadow-md transition">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">{tier.label}</h3>
                    <p className="text-3xl font-bold text-black">{tier.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Download Section */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Save Your Plan</h3>
              <p className="text-gray-600 text-sm mt-1">Download your complete trip plan as a PDF</p>
            </div>
            <button
              onClick={generatePDF}
              disabled={downloading}
              className="flex items-center gap-2 bg-black hover:bg-gray-900 disabled:bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Clock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}