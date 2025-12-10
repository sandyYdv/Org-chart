import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { EmployeeNode } from "../type/orgChart";
import { fetchPeopleChart } from "../api/orgChart";
import type { RawEmployeeNode } from "../type/orgChart";
import { sanitizeEmployee, removeCircularReferences } from "../utils/validation";

type OrgChartState = {
    root: EmployeeNode | null;
    // expanded kept for UI state per id
    expanded: Record<number, boolean>;
    directory: Record<number, EmployeeNode>;
    selectedId: number | null;
    loading: boolean;
    loadingProgress: number; // 0-100
    error: string | null;
    search: string;
    // Lightweight indexes for O(1) lookups
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
 * Async thunk to load organizational chart data for a specific employee
 * Fetches data from API and handles errors gracefully
 */
export const loadOrgChart = createAsyncThunk(
    "orgChart/load",
    async (employeeId: number, { rejectWithValue, dispatch }) => {
        try {
            // Use the non-recursive fetch so we only load the employee and whatever
            // immediate children the API returns in this single call.
            const data = await fetchPeopleChart(employeeId);

            // Validate and sanitize the data
            const sanitized = sanitizeEmployee(data);
            if (!sanitized) {
                return rejectWithValue("Invalid employee data received from API");
            }

            // Remove any circular references (defensive)
            return removeCircularReferences(sanitized);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to fetch organizational chart";
            return rejectWithValue(message);
        }
    }
);

/**
 * Fetch several employee records (one API call per id) and return a map id->EmployeeNode
 * Used to pre-populate the search directory without expanding hierarchy
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
            return list; // <-- array now
        } catch {
            return rejectWithValue("Failed to fetch employees for directory");
        }
    }
);

function buildIndex(node: EmployeeNode, parentId: number | null, byId: Record<number, EmployeeNode>, parent: Record<number, number | null>) {
    byId[node.id] = node;
    parent[node.id] = parentId;
    (node.children || []).forEach((c) => buildIndex(c, node.id, byId, parent));
}

const slice = createSlice({
    name: "orgChart",
    initialState,
    reducers: {
        /**
         * Toggles the expanded state of an employee (not currently used)
         * Can be used for future collapse/expand functionality
         */
        toggleExpand(state, action: PayloadAction<number>) {
            const id = action.payload;
            state.expanded[id] = !state.expanded[id];
        },

        /**
         * Selects an employee to view in the details drawer
         * Pass null to deselect
         */
        selectEmployee(state, action: PayloadAction<number | null>) {
            state.selectedId = action.payload;
        },

        /**
         * Updates the search query for filtering employees
         */
        setSearch(state, action: PayloadAction<string>) {
            state.search = action.payload;
        },
        setLoadingProgress(state, action: PayloadAction<number>) {
            state.loadingProgress = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Handle async thunk pending state
            .addCase(loadOrgChart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // Handle successful data load
            .addCase(loadOrgChart.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                const root = action.payload;

                // Store hierarchical root directly (no flatten)
                state.root = root;
                if (root) state.expanded[root.id] = true;
                // Build quick lookup maps for fast access
                const byId: Record<number, EmployeeNode> = {};
                const parent: Record<number, number | null> = {};
                if (root) buildIndex(root, null, byId, parent);
                state.byId = byId;
                state.parent = parent;
                // when loaded fully, set progress to 100
                state.loadingProgress = 100;
            })
            // Handle directory fetch completion
            .addCase(fetchEmployeesByIds.fulfilled, (state, action) => {
                // merge existing byId with the directory map
                action.payload.forEach(emp => {
                    state.directory[emp.id] = emp;
                });
            })
            // Handle API errors
            .addCase(loadOrgChart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to load organizational chart";
            });
    },
});

export const { toggleExpand, selectEmployee, setSearch, setLoadingProgress } = slice.actions;
export default slice.reducer;