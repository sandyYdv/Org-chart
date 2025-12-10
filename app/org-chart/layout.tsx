"use client";

import { SearchBox } from "@/components/org-chart/SearchBox";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

/**
 * OrgChartLayout Component
 * Provides the top-level layout for the org chart pages
 * Includes header with breadcrumb, title, and search functionality
 * Wraps all org chart pages with error boundary for global error handling
 */
export default function OrgChartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <div className="flex flex-col h-full bg-white">
        {/* Top Header with Navigation and Search */}
        <header 
          className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#E3E5EB] bg-white px-4 py-3 gap-3 sm:gap-4"
          role="banner"
        >
          {/* Breadcrumb Navigation */}
          <nav className="flex-shrink-0" aria-label="Breadcrumb">
            <p className="text-xs sm:text-sm text-[#6B7280]">
              <span className="font-medium">Home</span> / Org Chart
            </p>
          </nav>

          {/* Search and Actions */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1 sm:flex-none justify-end">
            <div className="flex-1 sm:flex-none">
              <SearchBox />
            </div>

            {/* header icons (line / question / activity) */}
            <div className="flex items-center gap-2 ml-3">
              <div className="relative self-stretch w-3">
                <img src="/line.svg" alt="divider" aria-hidden="true" className="absolute left-1/2 top-0 bottom-0 w-px transform -translate-x-1/2" />
              </div>
              <button className="h-9 w-9 rounded-md flex items-center justify-center text-[#6B7280] hover:bg-[#F3F4F6] transition-colors" aria-label="Help">
                <img src="/Question.svg" alt="Help" className="w-5 h-5" />
              </button>
              <button className="h-9 w-9 rounded-md flex items-center justify-center text-[#6B7280] hover:bg-[#F3F4F6] transition-colors" aria-label="Activity">
                <img src="/Activity.svg" alt="Activity" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden" role="main">
          {children}
        </main>
      </div>
    </ErrorBoundary>
  );
}
