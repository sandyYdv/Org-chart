import type { EmployeeNode } from "../type/orgChart";

/**
 * Validates that an employee object has all required fields
 * Returns true if valid, false otherwise
 */
export function isValidEmployee(employee: any): employee is EmployeeNode {
  return (
    typeof employee === "object" &&
    employee !== null &&
    typeof employee.id === "number" &&
    typeof employee.name === "string" &&
    employee.name.trim().length > 0 &&
    Array.isArray(employee.children)
  );
}

/**
 * Sanitizes employee data by providing defaults for missing fields
 */
export function sanitizeEmployee(employee: any): EmployeeNode | null {
  try {
    if (!employee || typeof employee !== "object") {
      return null;
    }

    const id = Number(employee.id);
    const name = String(employee.name || "Unknown Employee").trim();

    if (!id || !name) {
      return null;
    }

    return {
      id,
      name,
      title: employee.title ? String(employee.title).trim() : undefined,
      picture: employee.picture ? String(employee.picture) : null,
      relationship: employee.relationship
        ? String(employee.relationship)
        : undefined,
      directReportsCount: Number(employee.directReportsCount) || 0,
      indirectReportsCount: Number(employee.indirectReportsCount) || 0,
      children: Array.isArray(employee.children)
        ? employee.children.map(sanitizeEmployee).filter((e: any): e is EmployeeNode => e !== null)
        : [],
    };
  } catch (error) {
    console.error("Error sanitizing employee data:", error);
    return null;
  }
}

/**
 * Validates the entire org chart tree structure
 */
export function validateOrgChartData(data: any): boolean {
  try {
    if (!data || typeof data !== "object") {
      return false;
    }

    // Check if root employee is valid
    return isValidEmployee(data) || sanitizeEmployee(data) !== null;
  } catch (error) {
    console.error("Error validating org chart data:", error);
    return false;
  }
}

/**
 * Checks if an employee has no data (missing critical fields)
 */
export function isEmptyEmployee(employee: EmployeeNode): boolean {
  return (
    !employee.name ||
    (employee.directReportsCount === 0 && employee.indirectReportsCount === 0 && employee.children.length === 0)
  );
}

/**
 * Detects and removes circular references in employee tree
 */
export function removeCircularReferences(
  node: EmployeeNode,
  visitedIds = new Set<number>()
): EmployeeNode {
  if (visitedIds.has(node.id)) {
    return { ...node, children: [] };
  }

  const newVisited = new Set(visitedIds);
  newVisited.add(node.id);

  return {
    ...node,
    children: node.children.map((child) =>
      removeCircularReferences(child, newVisited)
    ),
  };
}
