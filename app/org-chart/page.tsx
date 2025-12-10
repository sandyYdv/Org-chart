import OrgChartScreen from "@/components/org-chart/OrgChartScreen";

export default function OrgChartPage() {
  // default root employee id from test list
  const defaultId = 22;
  // Parse preload IDs from env (comma-separated list)
  const preloadIdsEnv = process.env.NEXT_PUBLIC_PRELOAD_EMPLOYEE_IDS || "18,21,22,23,25,29,30";
  const preloadIds = preloadIdsEnv.split(",").map((s) => Number(s.trim())).filter((n) => !isNaN(n));
  return <OrgChartScreen employeeId={defaultId} preloadIds={preloadIds} />;
}
