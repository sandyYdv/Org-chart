// components/org-chart/EmployeeCard.tsx
"use client";

import { useDispatch } from "react-redux";
import type { EmployeeNode } from "../../lib/type/orgChart";
import { selectEmployee } from "@/lib/store/orgChartSlice";

/**
 * EmployeeCard Component
 * Displays a single employee's information in a card format
 * Shows: avatar, name, title, and direct/indirect report counts
 * Includes an info button to open the employee details drawer
 */
export function EmployeeCard({
  employee,
}: {
  employee: EmployeeNode;
}) {
  const dispatch = useDispatch();

  // Fallback title if neither title nor relationship is available
  const displayTitle = employee.title ?? employee.relationship ?? "—";

  return (
    <div className="flex flex-col items-center">
      {/* Employee Information Card */}
      <div className="relative min-w-[220px] sm:min-w-[260px] rounded-[16px] bg-white px-4 sm:px-5 py-3 sm:py-4 shadow-[0_8px_30px_rgba(15,23,42,0.06)] border border-[#E3E5EB]">
        {/* Info Icon Button - Opens employee details drawer */}
        <button
          onClick={() => dispatch(selectEmployee(employee.id))}
          className="absolute right-2 sm:right-3 top-2 sm:top-3 inline-flex h-7 w-7 items-center justify-center rounded-[10px] border border-[#E3E5EB] bg-white hover:bg-[#F3F4F6] transition-colors"
          aria-label={`View details for ${employee.name}`}
          title="View employee details"
        >
          <img
            src="/Vector.svg"
            alt=""
            className="h-4 w-4"
            aria-hidden="true"
          />
        </button>

        {/* Avatar + Text Container */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Employee Avatar */}
          <div className="h-10 sm:h-11 w-10 sm:w-11 overflow-hidden rounded-full bg-gradient-to-br from-[#F3F4F6] to-[#E5E7EB] flex-shrink-0">
            {employee.picture && (
              <img
                src={employee.picture}
                alt={employee.name}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          {/* Employee Information */}
          <div className="flex-1 min-w-0">
            {/* Employee Name */}
            <p className="text-[12px] sm:text-[13px] font-semibold leading-tight text-[#111827] truncate">
              {employee.name}
            </p>
            
            {/* Employee Title or Relationship */}
            <p className="mt-0.5 text-[10px] sm:text-[11px] leading-tight text-[#6B7280] truncate">
              {displayTitle}
            </p>
            
            {/* Direct and Indirect Reports Count */}
            <p className="mt-1 text-[9px] sm:text-[10px] leading-tight text-[#9CA3AF]">
              {employee.directReportsCount} / {employee.indirectReportsCount}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
