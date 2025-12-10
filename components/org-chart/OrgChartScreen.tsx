"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/store";
import {
  loadOrgChart,
  fetchEmployeesByIds,
} from "@/lib/store/orgChartSlice";
import { OrgChartTree } from "./OrgChartTree";
import { EmployeeDrawer } from "./EmployeeDrawer";
import { SearchBox } from "./SearchBox";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

/**
 * OrgChartScreen
 * Displays header, search, tree, and drawer.
 */
export default function OrgChartScreen({
  employeeId,
  preloadIds = [18, 21, 22, 23, 25, 29, 30],
}: {
  employeeId: number;
  preloadIds?: number[];
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, root } = useSelector(
    (s: RootState) => s.orgChart
  );

  useEffect(() => {
    // load initial tree
    dispatch(loadOrgChart(employeeId));
    // preload employees for search
    dispatch(fetchEmployeesByIds(preloadIds));
  }, [employeeId, preloadIds, dispatch]);

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.debug("[OrgChartScreen] root", { rootId: root?.id });
  }

  return (
    <ErrorBoundary>
      <div className="flex h-full bg-white flex-col lg:flex-row">
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="bg-white px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-semibold text-[#111827] mb-1">
                  Org Chart
                </h2>
                <p className="text-xs sm:text-sm text-[#6B7280] line-clamp-2">
                  This is a collection of all hierarchy in the system, you can
                  view, modify existing datasources or create new ones based on
                  your preferences.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  className="h-9 rounded-md border border-[#D3D7E3] bg-[#7D7D7D] px-2 sm:px-3 text-xs sm:text-sm font-medium text-white whitespace-nowrap"
                  aria-label="Filter by today"
                >
                  <span className="inline-flex items-center">
                    <img
                      src="/Calender.svg"
                      alt=""
                      aria-hidden="true"
                      className="inline-block w-3 h-3 mr-2"
                    />
                    Today
                    <img
                      src="/downarrow-white.svg"
                      alt=""
                      aria-hidden="true"
                      className="inline-block w-3 h-3 ml-2"
                    />
                  </span>
                </button>
                <button
                  className="h-9 rounded-md bg-[#6366F1] px-3 sm:px-4 text-xs sm:text-sm font-medium text-white shadow-sm hover:bg-[#4F46E5] transition-colors whitespace-nowrap"
                  aria-label="Configure org chart"
                >
                  Configure
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 sm:gap-12 -mx-4 sm:-mx-6 px-4 sm:px-6 overflow-x-auto pt-3">
              <button
                className="relative pb-2 text-xs sm:text-sm font-medium text-[#6366F1] whitespace-nowrap"
                aria-current="page"
              >
                People
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#6366F1]" />
              </button>
              <button className="pb-2 text-xs sm:text-sm text-[#9CA3AF] hover:text-[#6B7280] whitespace-nowrap">
                Position
              </button>
              <button className="pb-2 text-xs sm:text-sm text-[#9CA3AF] hover:text-[#6B7280] whitespace-nowrap">
                Organization
              </button>
              <button className="pb-2 text-xs sm:text-sm text-[#9CA3AF] hover:text-[#6B7280] whitespace-nowrap">
                <span className="inline-flex items-center">
                  Others
                  <img
                    src="/Down-arrow.svg"
                    alt=""
                    aria-hidden="true"
                    className="inline-block w-3 h-3 ml-2"
                  />
                </span>
              </button>
            </div>

            {/* Search box */}
            <div className="border border-[#E2E8F0] bg-white w-full p-4 rounded-lg mt-4">
              <SearchBox />
            </div>
          </div>

          {/* Chart area */}
          <div className="flex-1 overflow-auto bg-white p-4 sm:p-8">
            {loading && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-[#E3E5EB] border-t-[#6366F1] animate-spin mb-4" />
                  <p className="text-sm text-[#6B7280]">
                    Loading organization chart...
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center h-full">
                <div className="bg-white rounded-lg border border-[#FEE2E2] p-6 max-w-md text-center">
                  <p className="text-sm font-medium text-[#991B1B] mb-2">
                    Failed to load org chart
                  </p>
                  <p className="text-xs text-[#7F1D1D] mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 rounded-lg bg-[#6366F1] text-white text-xs sm:text-sm font-medium hover:bg-[#4F46E5] transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {!loading && !error && root && (
              <div className="flex justify-center min-h-full">
                <div className="w-full">
                  {/* always render from full root tree */}
                  <OrgChartTree root={root as any} />
                </div>
              </div>
            )}

            {!loading && !error && !root && (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-[#6B7280]">No data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Drawer */}
        <EmployeeDrawer />
      </div>
    </ErrorBoundary>
  );
}
