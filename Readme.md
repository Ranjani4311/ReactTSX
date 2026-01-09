# Ticket Insights & Management

# Overview
The Ticket Insights & Management is a modern React application built with Syncfusion Essential JS 2 (EJ2) components. It demonstrates saving, restoring, exporting, and deleting Grid views (layouts) on top of a ticket data source. With persistence enabled, users can create multiple views (columns, sorting, filtering, paging) and switch between them effortlessly.

# Key Capabilities
1. Enable Persistence: The grid state (columns, sorting, filtering, paging, etc.) is automatically saved using enablePersistence={true}.
2. Version-based Layout Saving : Uses ej2StatePersistenceVersion to manage multiple layouts and avoid conflicts.
3. Save Layout : 
    - Stores the new layout for future use.
4. Restore Layout : 
    - A sidebar list shows all saved views.
    - Select any saved view to apply it instantly.
5. Export Layout: Downloads the selected layout as a file for backup or sharing.
6. Delete Layout : Remove unwanted saved views by the delete icon.

# Project Structure
```

├─ src/
│  ├─ components/
│  │  └─ TicketInsights.tsx            # Main feature component (Grid + Sidebar/TreeView)
│  │
│  ├─ data/
│  │  ├─ ticketDetails.ts              # Mock/seed data for grid tickets
│  │  └─ treeViewData.ts               # Data for Sidebar TreeView (default views, favorites)
│  │
│  ├─ styles/
│  │  └─ ticketDetails.css             # Feature-specific styles (grid, sidebar, context menu)
│  │
│  ├─ types/
│  │  └─ ticketDetails_type.ts         # Shared TypeScript types/interfaces (Ticket, FavoriteItem…)
│  │
│  ├─ main.css                         # Global app styles (layout, fonts, theming)
│  ├─ main.tsx                         # App entry: renders root component, imports global CSS
│
├─ index.html                          # HTML

```


### Implementation Details

1. React Hooks: React.useMemo() is used to optimize rendering of the Grid component.
2. Grid Configuration : GridComponent with features like paging, sorting, filtering, toolbar actions.
3. Persistence Settings
    - enablePersistence ensures grid state is retained.
    - ej2StatePersistenceVersion differentiates layouts.
4. Toolbar Actions:Custom toolbar buttons handle Save, Export, operations.
5. A SidebarComponent is rendered on the left side of the application.
    - Inside the sidebar, a TreeViewComponent displays all saved views.
    - Default Sidebar Views:
        1. All
        2. Premium
        2. Critical
        3. High
    - When you click a view, the grid shows tickets filtered by that priority (Critical, Premium, High).
6. Dialog for Saving Views : A dialog prompts users to enter a unique name when saving a new layout.


## Run the Project:

1. `npm i` 

2. `npm start`

### Interact with the Grid

1. Customize the Grid : 
    - The grid displays ticket details such as Ticket ID, Subject, Status, Priority, Category, etc.
    - You can Sort any column by clicking its header. Filter columns using the filter icon in the header.
    
2. Save a View
    - After customizing the grid (e.g., filtering by Priority = Critical):
        - Click the Add To Favorite (Save) button in the toolbar.
        - Enter a unique name in the dialog (e.g., "Critical Tickets View").
        - Click Save
    - The layout is stored in localStorage and added to the Sidebar TreeView under Saved Views.

3. Restore a View
    - Click any saved view in the TreeView.
    - The grid instantly applies the saved configuration (filters, sorting).

4. Delete a View 
    - In the Sidebar TreeView, right-click the view you want to delete.
    - Select Delete from the context menu.
    - You can delete only views under the Favorites section.
    - Default views (Premium, Critical, High) cannot be deleted.
    - The selected view is removed from the sidebar and localStorage.

5. Download a View
    - Select the layout you want to export.
    - Click the Download button in the toolbar.
    - The layout is exported as an Excel file for backup or sharing.






