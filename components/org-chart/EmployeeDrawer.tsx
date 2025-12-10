"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { selectEmployee } from "@/lib/store/orgChartSlice";

export function EmployeeDrawer() {
  const dispatch = useDispatch();
  const { selectedId, byId } = useSelector((s: RootState) => s.orgChart);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basicDetails: true,
    history: false,
    parents: false,
    hierarchy: false,
  });

  if (!selectedId) return null;
  const emp = byId ? byId[selectedId] ?? null : null;
  if (!emp) return null;

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    // right column, aligned with header, no dark overlay
    <aside
      className="absolute right-0 top-17 h-full w-[320px] border-l border-[#E5E7EB] bg-[#F9FAFB] z-10"
      aria-label="Employee details panel"
    >
      {/* header bar (light gray, close button) */}
      <div className="absolute top-3 right-3 p-1.5 bg-white rounded transition-all z-20">
        <button
          className="inline-flex h-7 w-7 items-center justify-center bg-white text-[14px] text-[#6B7280] hover:bg-[#F3F4F6]"
          onClick={() => dispatch(selectEmployee(null))}
          aria-label="Close employee details"
        >
          ✕
        </button>
      </div>

      {/* content */}
      <div className="h-[calc(100%-3rem)] overflow-y-auto bg-white">
        {/* avatar + gradient header area */}
        <div className="relative h-24 bg-[#F3F4F6]" />

        <div className="relative px-5 -mt-10 pb-4">
          {/* avatar */}
          <div className="h-16 w-16 rounded-full border-[3px] border-white bg-gray-200 overflow-hidden shadow-md">
            {emp.picture && (
              <img
                src={emp.picture}
                alt={emp.name}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          {/* name + actions */}
          <div className="mt-3 flex items-start justify-between gap-3">
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-[#111827] leading-tight">
                {emp.name}
              </h2>
              <p className="mt-0.5 text-[11px] text-[#6B7280] leading-tight">
                {emp.title || emp.relationship || "Employee"}
              </p>
              <p className="mt-0.5 text-[11px] text-[#9CA3AF] leading-tight">
                {emp.relationship ? `Operations PH (${emp.id})` : `Employee ID ${emp.id}`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                aria-label="Edit employee"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4F46E5]"
              >
                <img src="/edit.svg" alt="edit" className="h-4 w-4" />
              </button>
              <button
                aria-label="More options"
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#F3F4F6] text-[#6B7280]"
              >
                ⋮
              </button>
            </div>
          </div>

          {/* sections */}
          <div className="mt-4 border-t border-[#E5E7EB]">
            {/* Basic Details */}
            <section>
              <button
                onClick={() => toggleSection("basicDetails")}
                className="flex w-full items-center justify-between py-3"
                aria-expanded={expandedSections.basicDetails}
              >
                <h3 className="text-[13px] font-semibold text-[#111827]">
                  Basic Details
                </h3>
                <img
                  src="/Down-arrow.svg"
                  alt="Toggle"
                  className={`h-4 w-4 transition-transform ${
                    expandedSections.basicDetails ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedSections.basicDetails && (
                <div className=" pt-3 pb-2 space-y-3">
                  {(emp as any)?.phone && (
                    <div className="flex items-center gap-3">
                      <img
                        src="/phone.svg"
                        alt="Phone"
                        className="h-4 w-4 object-contain"
                      />
                      <p className="text-[13px] font-medium text-[#111827]">
                        {(emp as any).phone}
                      </p>
                    </div>
                  )}
                  {(emp as any)?.email && (
                    <div className="flex items-center gap-3">
                      <img
                        src="/Mail.svg"
                        alt="Email"
                        className="h-4 w-4 object-contain"
                      />
                      <p className="text-[13px] font-medium text-[#111827] truncate">
                        {(emp as any).email}
                      </p>
                    </div>
                  )}
                  {(emp as any)?.location && (
                    <div className="flex items-center gap-3">
                      <img
                        src="/Location.svg"
                        alt="Location"
                        className="h-4 w-4 object-contain"
                      />
                      <p className="text-[13px] font-medium text-[#111827]">
                        {(emp as any).location}
                      </p>
                    </div>
                  )}
                  {(emp as any)?.localTime && (
                    <div className="flex items-center gap-3">
                      <img
                        src="/Time.svg"
                        alt="Local time"
                        className="h-4 w-4 object-contain"
                      />
                      <p className="text-[13px] font-medium text-[#111827]">
                        {(emp as any).localTime}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* History */}
            <section className="border-t border-[#E5E7EB]">
              <button
                onClick={() => toggleSection("history")}
                className="flex w-full items-center justify-between py-3"
                aria-expanded={expandedSections.history}
              >
                <h3 className="text-[13px] font-semibold text-[#111827]">
                  History
                </h3>
                <img
                  src="/Down-arrow.svg"
                  alt="Toggle"
                  className={`h-4 w-4 transition-transform ${
                    expandedSections.history ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedSections.history && (
                <div className=" py-3">
                  <p className="text-[12px] text-[#6B7280]">
                    No history data available
                  </p>
                </div>
              )}
            </section>

            {/* Parent(s) */}
            <section className="border-t border-[#E5E7EB]">
              <button
                onClick={() => toggleSection("parents")}
                className="flex w-full items-center justify-between py-3"
                aria-expanded={expandedSections.parents}
              >
                <h3 className="text-[13px] font-semibold text-[#111827]">
                  Parent (’s)
                </h3>
                <img
                  src="/Down-arrow.svg"
                  alt="Toggle"
                  className={`h-4 w-4 transition-transform ${
                    expandedSections.parents ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedSections.parents && (
                <div className=" py-3">
                  <p className="text-[12px] text-[#6B7280]">
                    No parent data available
                  </p>
                </div>
              )}
            </section>

            {/* Hierarchy */}
            <section className="border-t border-[#E5E7EB]">
              <button
                onClick={() => toggleSection("hierarchy")}
                className="flex w-full items-center justify-between py-3"
                aria-expanded={expandedSections.hierarchy}
              >
                <h3 className="text-[13px] font-semibold text-[#111827]">
                  Hierarchy
                </h3>
                <img
                  src="/Down-arrow.svg"
                  alt="Toggle"
                  className={`h-4 w-4 transition-transform ${
                    expandedSections.hierarchy ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedSections.hierarchy && (
                <div className=" py-3">
                  <dl className="space-y-2 text-[12px]">
                    <div>
                      <dt className="text-[#6B7280]">Direct Reports</dt>
                      <dd className="font-medium text-[#111827]">
                        {emp.directReportsCount}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[#6B7280]">Indirect Reports</dt>
                      <dd className="font-medium text-[#111827]">
                        {emp.indirectReportsCount}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[#6B7280]">Employee ID</dt>
                      <dd className="font-medium text-[#111827]">
                        {emp.id}
                      </dd>
                    </div>
                  </dl>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </aside>
  );
}
