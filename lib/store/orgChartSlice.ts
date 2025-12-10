// lib/store/orgChartSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { EmployeeNode } from "../type/orgChart";
import { fetchPeopleChart } from "../api/orgChart";
import { sanitizeEmployee, removeCircularReferences } from "../utils/validation";

type OrgChartState = {
    root: EmployeeNode | null;
    expanded: Record<number, boolean>;
    directory: Record<number, EmployeeNode>;
    selectedId: number | null;
    loading: boolean;
    loadingProgress: number;
    error: string | null;
    search: string;
    byId: Record<number, EmployeeNode>;
    parent: Record<number, number | null>;
};

const initialState: OrgChartState = {
    root: null,
    expanded: {},
    directory: {},
    selectedId: null,
    loading: false,
    loadingProgress: 0,
    error: null,
    search: "",
    byId: {},
    parent: {},
};

/**
 * MAIN org chart load (this one controls state.error)
 */
export const loadOrgChart = createAsyncThunk(
    "orgChart/load",
    async (employeeId: number, { rejectWithValue }) => {
        try {
            if (process.env.NODE_ENV !== "production") {
                // eslint-disable-next-line no-console
                console.log("[loadOrgChart] request for id:", employeeId);
            }

            // fetch full tree for this employee
            const data = await fetchPeopleChart(employeeId);

            // validate / sanitize
            const sanitized = sanitizeEmployee(data);
            if (!sanitized) {
                const msg = "Invalid employee data received from API";
                if (process.env.NODE_ENV !== "production") {
                    // eslint-disable-next-line no-console
                    console.log("[loadOrgChart] FAILED sanitize for id:", employeeId, msg);
                }
                return rejectWithValue(msg);
            }

            const cleaned = removeCircularReferences(sanitized);

            if (process.env.NODE_ENV !== "production") {
                // eslint-disable-next-line no-console
                console.log("[loadOrgChart] success for id:", employeeId);
            }

            return cleaned as EmployeeNode;
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to fetch organizational chart";

            if (process.env.NODE_ENV !== "production") {
                // eslint-disable-next-line no-console
                console.log("[loadOrgChart] FAILED for id:", employeeId, message);
            }

            return rejectWithValue(message);
        }
    }
);

/**
 * Preload employees for search (soft‑fail)
 */
export const fetchEmployeesByIds = createAsyncThunk(
    "orgChart/fetchByIds",
    async (ids: number[], { rejectWithValue }) => {
        try {
            const promises = ids.map((id) => fetchPeopleChart(id));
            const settled = await Promise.allSettled(promises);

            const list: EmployeeNode[] = [];
            settled.forEach((res) => {
                if (res.status === "fulfilled") {
                    list.push(res.value);
                }
            });

            if (list.length > 0) return list;
            return rejectWithValue("All preload requests failed");
        } catch {
            return rejectWithValue("All preload requests failed");
        }
    }
);

function buildIndex(
    node: EmployeeNode,
    parentId: number | null,
    byId: Record<number, EmployeeNode>,
    parent: Record<number, number | null>
) {
    byId[node.id] = node;
    parent[node.id] = parentId;
    (node.children || []).forEach((c) =>
        buildIndex(c, node.id, byId, parent)
    );
}

const slice = createSlice({
    name: "orgChart",
    initialState,
    reducers: {
        toggleExpand(state, action: PayloadAction<number>) {
            const id = action.payload;
            state.expanded[id] = !state.expanded[id];
        },
        selectEmployee(state, action: PayloadAction<number | null>) {
            state.selectedId = action.payload;
        },
        setSearch(state, action: PayloadAction<string>) {
            state.search = action.payload;
        },
        setLoadingProgress(state, action: PayloadAction<number>) {
            state.loadingProgress = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadOrgChart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadOrgChart.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;

                const root = action.payload as EmployeeNode | null;
                state.root = root;

                if (root) state.expanded[root.id] = true;

                const byId: Record<number, EmployeeNode> = {};
                const parent: Record<number, number | null> = {};
                if (root) buildIndex(root, null, byId, parent);
                state.byId = byId;
                state.parent = parent;
                state.loadingProgress = 100;
            })
            .addCase(loadOrgChart.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as string) ||
                    "Failed to load organizational chart";
            })
            .addCase(fetchEmployeesByIds.fulfilled, (state, action) => {
                (action.payload as EmployeeNode[]).forEach((emp) => {
                    state.directory[emp.id] = emp;
                });
            })
            .addCase(fetchEmployeesByIds.rejected, (state, action) => {
                if (process.env.NODE_ENV !== "production") {
                    // eslint-disable-next-line no-console
                    console.warn(
                        "[orgChart] Preload employees failed (continuing):",
                        action.payload
                    );
                }
            });
    },
});

export const {
    toggleExpand,
    selectEmployee,
    setSearch,
    setLoadingProgress,
} = slice.actions;
export default slice.reducer;
