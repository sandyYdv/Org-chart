"use client";

import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/store";
import { setSearch, loadOrgChart } from "@/lib/store/orgChartSlice";

/**
 * SearchBox Component
 * Shows selected-name chip and loads the selected employee's tree
 * without opening the drawer.
 */
export function SearchBox() {
  const dispatch = useDispatch<AppDispatch>();
  const { search, directory } = useSelector((s: RootState) => s.orgChart);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selected, setSelected] = useState<any | null>(null);

  // Build flat list of matches from the preloaded directory map
  const list: any[] = [];
  if (search.trim().length > 0 && directory) {
    const q = search.toLowerCase();
    for (const node of Object.values(directory)) {
      if (node.name && node.name.toLowerCase().includes(q)) {
        list.push(node);
      }
    }
  }

  const handleSelectEmployee = (e: any) => {
    // Load the selected employee's tree for display but do NOT open the drawer
    dispatch(loadOrgChart(e.id));
    setSelected(e);
    dispatch(setSearch(""));
  };

  const handleEditSelected = (ev?: React.MouseEvent) => {
    ev?.preventDefault();
    if (!selected) return;
    dispatch(setSearch(selected.name || ""));
    setSelected(null);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  useEffect(() => {
    // If search is cleared externally, we keep selected chip as-is
  }, [search, selected]);

  return (
    <div className="relative w-full">
      {/* Input container */}
      <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded border border-[#D3D7E3] bg-white focus-within:ring-2 focus-within:ring-[#6366F1] focus-within:ring-offset-1 transition-all">
        {/* Search icon */}
        <svg
          className="w-4 h-4 text-[#9CA3AF] flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        {/* Chip or input */}
        {selected ? (
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3E8FF] text-[#6B21A8] font-medium text-sm">
              <span className="truncate max-w-[10rem]">{selected.name}</span>
              <button
                aria-label="Edit selected"
                onClick={handleEditSelected}
                className="ml-1 flex items-center justify-center w-6 h-6 rounded-full bg-white bg-opacity-20"
              >
                <img src="/edit.svg" alt="edit" className="w-3 h-3" />
              </button>
            </div>
          </div>
        ) : (
          <input
            ref={inputRef}
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            placeholder="Search for action or people"
            className="flex-1 text-xs sm:text-sm text-[#111827] placeholder-[#9CA3AF] outline-none bg-transparent"
            aria-label="Search for employees"
            aria-autocomplete="list"
            aria-expanded={!!(search && list.length > 0)}
          />
        )}
      </div>

      {/* Results dropdown */}
      {search && list.length > 0 && (
        <div
          className="absolute mt-2 w-full rounded-lg border border-[#E3E5EB] bg-white shadow-lg text-sm max-h-64 overflow-auto z-10"
          role="listbox"
        >
          {list.map((e: any) => (
            <button
              key={e.id}
              className="flex w-full items-center gap-3 px-3 py-2 hover:bg-[#F9FAFB] border-b last:border-b-0 transition-colors text-left"
              onClick={() => handleSelectEmployee(e)}
              role="option"
              aria-label={`${e.name}, ${e.title || "Employee"}`}
            >
              <div className="h-8 w-8 rounded-full bg-[#E5E7EB] overflow-hidden flex-shrink-0">
                {e.picture && (
                  <img
                    src={e.picture}
                    alt=""
                    className="h-full w-full object-cover"
                    aria-hidden="true"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#111827] truncate">{e.name}</p>
                <p className="text-xs text-[#9CA3AF] truncate">
                  {e.title || "Employee"}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {search && list.length === 0 && (
        <div className="absolute mt-2 w-full rounded-lg border border-[#E3E5EB] bg-white shadow-lg text-sm p-3 text-center text-[#9CA3AF]">
          No employees found
        </div>
      )}
    </div>
  );
}
