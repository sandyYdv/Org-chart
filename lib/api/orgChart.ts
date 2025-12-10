// lib/api/orgChart.ts
import { apiClient } from "./client";
import type {
  RawOrgChartResponse,
  EmployeeNode,
  RawEmployeeNode,
} from "../type/orgChart";

function mapNode(raw: RawEmployeeNode): EmployeeNode {
  return {
    id: raw.employee_id,
    name: raw.target,
    title: undefined,
    picture: raw.pic || null,
    directReportsCount: raw.direct_reports,
    indirectReportsCount: raw.indirect_reports,
    relationship: raw.relationship_id,
    children: raw.children?.map(mapNode) ?? [],
  };
}

export async function fetchPeopleChart(employeeId: number): Promise<EmployeeNode> {
  const { data } = await apiClient.get<RawOrgChartResponse>(
    `/relationship/people_chart/${employeeId}`
  );
  return mapNode(data.tree);
}

/**
 * Recursively fetches an employee node and all descendant nodes by calling
 * the API for each child until there are no more children. This ensures the
 * returned tree is fully expanded regardless of how many levels the API
 * returns per call.
 */
export type FetchFullOptions = {
  concurrency?: number;
  onProgress?: (completed: number, total: number) => void;
};

export async function fetchPeopleChartFull(employeeId: number, options: FetchFullOptions = {}): Promise<EmployeeNode> {
  const { concurrency = 5, onProgress } = options;

  // semaphore for concurrency control
  let active = 0;
  const waiting: Array<() => void> = [];
  function acquire(): Promise<void> {
    if (active < concurrency) {
      active++;
      return Promise.resolve();
    }
    return new Promise((res) => waiting.push(() => { active++; res(); }));
  }
  function release() {
    active = Math.max(0, active - 1);
    const fn = waiting.shift();
    if (fn) fn();
  }

  let completedRequests = 0;
  let totalRequests = 1; // root already counted

  async function fetchRaw(id: number) {
    await acquire();
    try {
      const { data } = await apiClient.get<RawOrgChartResponse>(`/relationship/people_chart/${id}`);
      return data.tree;
    } finally {
      completedRequests++;
      onProgress?.(completedRequests, totalRequests);
      release();
    }
  }

  // initial fetch for root
  const { data } = await apiClient.get<RawOrgChartResponse>(`/relationship/people_chart/${employeeId}`);

  // recursive builder that uses fetchRaw when a child has no nested children
  // Protect against circular references by tracking visited IDs
  async function buildNode(raw: RawEmployeeNode, visited = new Set<number>()): Promise<EmployeeNode> {
    if (visited.has(raw.employee_id)) {
      // circular reference detected — return shallow node to stop recursion
      return {
        id: raw.employee_id,
        name: raw.target,
        title: undefined,
        picture: raw.pic || null,
        directReportsCount: raw.direct_reports,
        indirectReportsCount: raw.indirect_reports,
        relationship: raw.relationship_id,
        children: [],
      };
    }

    // mark current id as visited for this branch
    const nextVisited = new Set(visited);
    nextVisited.add(raw.employee_id);

    const childrenRaw = raw.children ?? [];

    const children: EmployeeNode[] = await Promise.all(
      childrenRaw.map(async (c) => {
        // if child id already seen in this branch, avoid descending
        if (nextVisited.has(c.employee_id)) {
          return {
            id: c.employee_id,
            name: c.target,
            title: undefined,
            picture: c.pic || null,
            directReportsCount: c.direct_reports,
            indirectReportsCount: c.indirect_reports,
            relationship: c.relationship_id,
            children: [],
          };
        }

        if (Array.isArray(c.children) && c.children.length > 0) {
          // build using provided nested children
          return buildNode(c, nextVisited);
        }
        // schedule a fetch for the child's subtree
        totalRequests++;
        onProgress?.(completedRequests, totalRequests);
        try {
          const childRaw = await fetchRaw(c.employee_id);
          return buildNode(childRaw, nextVisited);
        } catch (err) {
          // fallback to mapping the raw child (shallow)
          return {
            id: c.employee_id,
            name: c.target,
            title: undefined,
            picture: c.pic || null,
            directReportsCount: c.direct_reports,
            indirectReportsCount: c.indirect_reports,
            relationship: c.relationship_id,
            children: [],
          };
        }
      })
    );

    return {
      id: raw.employee_id,
      name: raw.target,
      title: undefined,
      picture: raw.pic || null,
      directReportsCount: raw.direct_reports,
      indirectReportsCount: raw.indirect_reports,
      relationship: raw.relationship_id,
      children,
    };
  }

  const root = await buildNode(data.tree);
  onProgress?.(completedRequests, totalRequests);
  return root;
}
