This is an interactive organizational chart built with Next.js, React, and Redux Toolkit. It fetches hierarchical employee data from a provided PeopleFusion API and renders it as a responsive, searchable org chart.

Features
Fetch and display an employee’s organizational tree starting from any test employee ID

Recursive org chart rendering with connectors between managers and reports

Employee cards showing name, picture, title/relationship, and direct/indirect reports

Search box that:

Searches across a preloaded directory of employees

Highlights the selected employee in a chip

Reloads the org chart rooted at the selected employee

Employee details drawer triggered from the info icon on each card

Graceful handling of missing or sparse hierarchy data

Responsive layout for desktop and smaller screens

Tech Stack
Next.js 14 + React 18

TypeScript

Redux Toolkit + React Redux

Axios for HTTP requests

Tailwind CSS for styling

Project Structure (key parts)
lib/api/orgChart.ts – HTTP client for the PeopleFusion org chart endpoint

lib/type/orgChart.ts – Type definitions for raw API nodes and normalized EmployeeNode

lib/store/orgChartSlice.ts – Org chart Redux slice, thunks, and indexing logic

components/org-chart/OrgChartScreen.tsx – Main screen layout, header, search, tree, and drawer

components/org-chart/OrgChartTree.tsx – Recursive tree rendering from a hierarchical root node

components/org-chart/EmployeeCard.tsx – Single employee card UI

components/org-chart/SearchBox.tsx – Search input, suggestions dropdown, and chip behavior

components/org-chart/EmployeeDrawer.tsx – Side drawer with employee details

How It Works
On load, the app:

Fetches the org chart for the initial employeeId and stores a full root tree in Redux

Preloads a set of employees into a flat directory for fast search

OrgChartTree renders the hierarchy recursively from state.orgChart.root, using children to traverse the tree.

SearchBox:

Filters over directory (not the current tree) to suggest matching employees

On selection, dispatches loadOrgChart(employeeId) to fetch a fresh tree rooted at that employee

Shows a chip with the selected name and allows editing the search again

EmployeeCard:

Displays core employee info

Dispatches selectEmployee when the info button is clicked so the drawer can show details

Getting Started
Install dependencies

bash
npm install
# or
yarn install
Configure environment

Create .env.local with:

text
NEXT_PUBLIC_API_BASE_URL=<peoplefusion-api-base-url>
NEXT_PUBLIC_API_TOKEN=<non-expiring-token>
Run the dev server

bash
npm run dev
# or
yarn dev
Visit http://localhost:3000 in your browser.

Usage
Use the search box to find an employee by name and re-root the org chart.

Click the info icon on any employee card to open the details drawer.

Use the provided test employee IDs (e.g. 18, 21, 22, 23, 25, 29, 30) to validate different hierarchies.

Handling Incomplete Data
The test data may be sparse, contain repeated employees in different branches, or return different roots for the same requested ID. The implementation:

Treats the API response as the single source of truth for the current root tree

Keeps a separate flat directory for search, without using it to rebuild trees

Indexes EmployeeNodes by ID for drawers and lookups without mutating the tree structure

Scripts
dev – Start the development server

build – Build the production bundle

start – Run the production server

lint – Run linting