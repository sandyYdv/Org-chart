// lib/types/orgChart.ts
export type RawEmployeeNode = {
  id?: number;
  employee_id: number;
  target: string;
  pic: string | null;
  relationship_id?: string;
  effective_start_date?: string;
  effective_end_date?: string;
  direct_reports: number;
  indirect_reports: number;
  children: RawEmployeeNode[];
};

export type RawOrgChartResponse = {
  status: "OK";
  tree: RawEmployeeNode;
};

// normalized type for UI
export type EmployeeNode = {
  id: number;                   
  name: string;
  title?: string;                
  picture: string | null;
  directReportsCount: number;
  indirectReportsCount: number;
  relationship?: string;
  children: EmployeeNode[];
};
