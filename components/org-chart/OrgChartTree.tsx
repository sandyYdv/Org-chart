// components/org-chart/OrgChartTree.tsx
"use client";

import { EmployeeCard } from "./EmployeeCard";
import type { EmployeeNode } from "@/lib/type/orgChart";

type Props = { root: EmployeeNode };

/**
 * OrgChartTree
 * Recursively renders the entire hierarchy from the root node.
 */
export function OrgChartTree({ root }: Props) {
  console.log("Rendering OrgChartTree with root:", root);
  const renderNode = (node: EmployeeNode | null) => {
    if (!node) return null;

    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.debug("[OrgChartTree] renderNode", {
        id: node.id,
        name: node.name,
        childIds: (node.children || []).map((c) => c.id),
      });
    }

    return (
      <div
        key={`${node.id}-${node.name}`}
        className="flex flex-col items-center"
      >
        {/* Employee Card */}
        <EmployeeCard employee={node} />

        {node.children && node.children.length > 0 && (
          <>
            {/* vertical connector down from this card */}
            <div className="h-4 w-px bg-[#D3D7E3]" />

            {/* children row */}
            <div className="relative flex gap-8">
              {node.children.length > 1 && (
                <div className="absolute top-0 left-0 right-0 h-px bg-[#D3D7E3]" />
              )}

              {node.children.map((child) => (
                <div
                  key={`${child.id}-${child.name}`}
                  className="relative pt-1"
                >
                  <div className="absolute -top-1 left-1/2 w-px h-3 bg-[#D3D7E3] -translate-x-1/2" />
                  {renderNode(child)}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return <>{renderNode(root)}</>;
}
