
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Sort,
  Toolbar,
  ExcelExport,
  Filter,
  Page,
  Inject,
  FilterSettingsModel,
  Column,
} from '@syncfusion/ej2-react-grids';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { SidebarComponent, TreeViewComponent, ContextMenuComponent, ClickEventArgs, NodeSelectEventArgs, MenuEventArgs, BeforeOpenCloseMenuEventArgs } from '@syncfusion/ej2-react-navigations';

import { ticketDetails } from '../data/ticketDetails';
import { viewData } from '../data/treeViewData';

import '../styles/ticketDetails.css'
import { FavoriteItem } from '../types/ticketDetails_type';

// ────────────────────────────────────────────────────────────────
// DEFAULT COLOR MAPPINGS
// ────────────────────────────────────────────────────────────────
const DEFAULT_STATUS_COLORS = {
  "open": "oklch(43.2% 0.232 292.759)",
  "closed": "oklch(52.7% 0.154 150.069)",
  "waiting for customer": "oklch(66.6% 0.179 58.318)",
  "resolved": "oklch(58.8% 0.158 241.966)",
  "default": "#000000"
};

const DEFAULT_PRIORITY_COLORS = {
  "high": "oklch(55.3% 0.195 38.402)",
  "medium": "oklch(44.8% 0.119 151.328)",
  "low": "oklch(44.2% 0.017 285.786)",
  "critical": "oklch(57.7% 0.245 27.325)",
  "premium": "oklch(44.3% 0.11 240.79)"   // note: corrected "primium" → "premium"
};

// ────────────────────────────────────────────────────────────────
// Template Factories
// ────────────────────────────────────────────────────────────────
function createStatusTemplate(colors: Record<string, string>) {
  return function statusTemplate(props: any) {
    const status = (props?.status || "").toLowerCase().trim();
    const color = colors[status] || colors["default"] || "#000000";

    return (
      <span style={{ fontWeight: 600, color }}>
        {props.status || "-"}
      </span>
    );
  };
}

function createPriorityTemplate(colors: Record<string, string>) {
  return function priorityTemplate(props: any) {
    const priority = (props?.priority || "").toLowerCase().trim();
    const color = colors[priority] || "#000000";

    return (
      <span style={{ fontWeight: 600, color }}>
        {props.priority || "-"}
      </span>
    );
  };
}

function App() {
  const gridRef = useRef<GridComponent | null>(null);
  const dialogRef = useRef<DialogComponent | null>(null);
  const treeViewRef = useRef<TreeViewComponent | null>(null);
  const textboxObj = useRef<TextBoxComponent | null>(null);
  const menuObj = useRef<ContextMenuComponent | null>(null);

  const [visible, setVisible] = useState(false);
  const [gridVersion] = useState('v.0');

  const gridId = 'gridTicketDetails';

  let TreeViewfields = { dataSource: viewData, id: 'nodeId', text: 'nodeText', child: 'nodeChild' };
  let contextmenuItem = [
    { text: 'Remove View' },
  ];

  // Base columns (templates will be injected dynamically)
  const baseColumns = useMemo(
    () => [
      { field: "ticket_id", headerText: "Ticket ID", width: 180, textAlign: "Right" },
      { field: "subject", headerText: "Subject", width: 320 },
      { field: "status", headerText: "Status", width: 200 },
      { field: "priority", headerText: "Priority", width: 180 },
      { field: "category", headerText: "Category", width: 200 },
      { field: "reporter", headerText: "Reporter", width: 200 },
      { field: "assignee", headerText: "Assignee", width: 200 },
      { field: "created_on", headerText: "Created On", width: 200, type: "dateTime", format: "yMd", textAlign: "Right" },
      { field: "updated_on", headerText: "Updated On", width: 200, type: "dateTime", format: "yMd", textAlign: "Right" },
    ],
    []
  );

  const [columns, setColumns] = useState(baseColumns);

  // Initialize default templates on mount
  useEffect(() => {
    setColumns(prev => prev.map(col => {
      if (col.field === "status") {
        return { ...col, template: createStatusTemplate(DEFAULT_STATUS_COLORS) };
      }
      if (col.field === "priority") {
        return { ...col, template: createPriorityTemplate(DEFAULT_PRIORITY_COLORS) };
      }
      return col;
    }));
  }, []);

  const toolbar = [
    {
      id: 'saveView',
      prefixIcon: 'e-star-filled',
      text: 'Add to Favorite',
      tooltipText: 'Add To Favorites'
    },
    {
      id: 'downloadExcel',
      prefixIcon: 'e-download',
      text: 'Download',
      tooltipText: 'Export to Excel'
    }
  ];

  const updatePersistedGridFilters = () => {
    const grid = gridRef.current;
    if (!grid) return;

    const persistedStr = grid.getPersistData();
    if (!persistedStr) return;

    let persisted = JSON.parse(persistedStr);

    const fsBase = persisted.filterSettings ?? {};
    fsBase.type = fsBase.type ?? 'Excel';
    fsBase.mode = fsBase.mode ?? 'OnEnter';
    fsBase.enableCaseSensitivity = fsBase.enableCaseSensitivity ?? false;
    fsBase.ignoreAccent = fsBase.ignoreAccent ?? false;

    const currentColumns = grid.getColumns();

    if (persisted.columns && Array.isArray(persisted.columns)) {
      persisted.columns.forEach((persistedCol: any) => {
        const liveCol = currentColumns.find((col: any) => col.field === persistedCol.field);
        if (liveCol) {
          persistedCol.headerText = liveCol.headerText;
        }
      });
    }

    localStorage.setItem('gridTicketDetailsFullState', JSON.stringify(persisted));

    const createSnapshot = (field: string, value: string, keySuffix: string) => {
      const snapshot = structuredClone(persisted);

      if (keySuffix === 'All') {
        snapshot.filterSettings = { ...fsBase, columns: [] };
        snapshot.sortSettings = { columns: [] };
      } else {
        snapshot.filterSettings = {
          ...fsBase,
          columns: [{
            field,
            value,
            operator: 'equal',
            predicate: 'and',
            type: 'string',
            matchCase: false,
            ignoreAccent: false
          }]
        };
      }

      localStorage.setItem(`gridTicketDetails${keySuffix}`, JSON.stringify(snapshot));
    };

    createSnapshot('priority', 'Critical', 'Critical');
    createSnapshot('priority', 'High', 'High');
    createSnapshot('priority', 'Premium', 'Premium');
    createSnapshot('all', 'All', 'All');
  };

  const restoreFavorites = (treeObj: TreeViewComponent | null) => {
    if (!treeObj) return;

    const FAV_KEY = 'fav-parent';
    const storedFav = localStorage.getItem(FAV_KEY);
    if (!storedFav) return;

    let favoritesList: FavoriteItem[] = [];
    try {
      favoritesList = JSON.parse(storedFav);
    } catch (e) {
      console.error('Failed to parse favorites', e);
      return;
    }

    if (favoritesList.length === 0) return;

    const favoritesParentId = 'favorites-root';

    const existingParent = treeObj.getTreeData().some((node) => node.nodeId === favoritesParentId);
    if (!existingParent) {
      treeObj.addNodes([{
        nodeId: favoritesParentId,
        nodeText: 'Favorites',
        iconCss: 'e-icons e-star-filled',
        hasChildren: true,
        expanded: true
      }]);
    }

    const existingNames = new Set(
      treeObj.getTreeData()
        .filter((node) => node.parentID === favoritesParentId)
        .map((node) => node.nodeText)
    );

    const nodesToAdd = favoritesList
      .filter(item => !existingNames.has(item.name))
      .map((item, idx) => ({
        nodeId: `fav-${item.name.replace(/\s+/g, '-')}-${Date.now()}-${idx}`,
        nodeText: item.name,
        iconCss: 'e-icons e-star',
        storageKey: item.key
      }));

    if (nodesToAdd.length > 0) {
      treeObj.addNodes(nodesToAdd, favoritesParentId);
    }
  };

  useEffect(() => {
     updatePersistedGridFilters();
     restoreFavorites(treeViewRef.current);
  }, []);

  const toolbarClick = useCallback((args: ClickEventArgs) => {
    if (args.item.id === 'downloadExcel') {
      gridRef.current?.excelExport();
    }
    else if (args.item.id === 'saveView') {
      if (textboxObj.current) textboxObj.current.value = '';
      setVisible(true);
    }
  }, []);

  const onSaveLayout = useCallback(() => {
    const layoutName = textboxObj.current?.value?.trim();
    if (!layoutName) return;

    const storageKey = gridId + layoutName;

    const persistDataStr = gridRef.current?.getPersistData();
    if (!persistDataStr) return;

    let persistData = JSON.parse(persistDataStr);

    // Save both color mappings with the view
    persistData.customSettings = {
      statusColors: DEFAULT_STATUS_COLORS,
      priorityColors: DEFAULT_PRIORITY_COLORS
    };

    // Restore correct header texts
    const currentColumns = gridRef.current?.getColumns() || [];
    if (persistData.columns?.length) {
      persistData.columns.forEach((col: Column) => {
        const live = currentColumns.find((c: Column) => c.field === col.field);
        if (live?.headerText) col.headerText = live.headerText;
      });
    }

    localStorage.setItem(storageKey, JSON.stringify(persistData));

    const FAV_KEY = 'fav-parent';
    let favorites: FavoriteItem[] = [];
    const stored = localStorage.getItem(FAV_KEY);
    if (stored) {
      try { favorites = JSON.parse(stored); } catch { }
    }

    if (!favorites.some(f => f.name === layoutName)) {
      favorites.push({ name: layoutName, key: storageKey });
      localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
    }

    const tree = treeViewRef.current;
    if (!tree) {
      setVisible(false);
      return;
    }

    const favoritesParentId = 'favorites-root';

    const parentExists = tree.getTreeData().some((node: any) => node.nodeId === favoritesParentId);
    if (!parentExists) {
      tree.addNodes([{
        nodeId: favoritesParentId,
        nodeText: 'Favorites',
        iconCss: 'e-icons e-star-filled',
        hasChildren: true,
        expanded: true,
      }]);
    }

    const existingNames = new Set(
      tree.getTreeData()
        .filter((node: any) => node.parentID === favoritesParentId)
        .map((node: any) => node.nodeText)
    );

    if (existingNames.has(layoutName)) {
      setVisible(false);
      return;
    }

    const uniqueNodeId = `fav-${layoutName.replace(/\s+/g, '-')}-${Date.now()}`;

    tree.addNodes([{
      nodeId: uniqueNodeId,
      nodeText: layoutName,
      iconCss: 'e-icons e-star',
      storageKey: storageKey,
    }], favoritesParentId);

    setVisible(false);
  }, []);

  const onCancel = useCallback(() => {
    setVisible(false);
  }, []);

  const buttons = useMemo(() => [
    {
      click: onSaveLayout,
      buttonModel: {
        content: 'Save Layout',
        isPrimary: true
      }
    },
    {
      click: onCancel,
      buttonModel: {
        content: 'Cancel'
      }
    }
  ], [onSaveLayout, onCancel]);

  const filterSettings: FilterSettingsModel = { type: 'Excel' };

  const memoGrid = useMemo(() => (
    <GridComponent
      id="gridTicketDetails"
      width="100%"
      height="100%"
      dataSource={ticketDetails}
      allowPaging={true}
      allowExcelExport={true}
      allowSorting={true}
      allowFiltering={true}
      toolbar={toolbar}
      toolbarClick={toolbarClick}
      enablePersistence={true}
      ej2StatePersistenceVersion={gridVersion}
      ref={gridRef}
      filterSettings={filterSettings}
      pageSettings={{ pageSize: 10 }}
    >
      <ColumnsDirective>
        {columns.map((col, index) => (
          <ColumnDirective key={index} {...col} />
        ))}
      </ColumnsDirective>
      <Inject services={[Sort, Toolbar, ExcelExport, Filter, Page]} />
    </GridComponent>
  ), [toolbar, toolbarClick, columns, gridVersion, filterSettings]);

  const onFavoriteSelect = useCallback((args: NodeSelectEventArgs) => {
    debugger
    const key = gridId + (args.nodeData.text || '');
    const raw = localStorage.getItem(key);
    if (!raw) return;

    let fullState;
    try {
      fullState = JSON.parse(raw);
    } catch (e) {
      console.error("Invalid saved view data", e);
      return;
    }

    const grid = gridRef.current;
    if (!grid) return;

    // Default templates
    let statusTemplate = createStatusTemplate(DEFAULT_STATUS_COLORS);
    let priorityTemplate = createPriorityTemplate(DEFAULT_PRIORITY_COLORS);

    // Override with saved colors if available
    if (fullState.customSettings) {
      if (fullState.customSettings.statusColors) {
        statusTemplate = createStatusTemplate(fullState.customSettings.statusColors);
      }
      if (fullState.customSettings.priorityColors) {
        priorityTemplate = createPriorityTemplate(fullState.customSettings.priorityColors);
      }
    }

    // Update columns with correct templates
    setColumns(prevCols =>
      prevCols.map(col => {
        if (col.field === "status") {
          return { ...col, template: statusTemplate };
        }
        if (col.field === "priority") {
          return { ...col, template: priorityTemplate };
        }
        return col;
      })
    );

    // Apply the saved grid state
    grid.setProperties(fullState);

  }, []);

  const ContextMenuBeforeOpen = (args: BeforeOpenCloseMenuEventArgs) => {
    const treeObj = treeViewRef.current;
    if (!treeObj) {
      args.cancel = true;
      return;
    }

    const target = (args as any).event.target.closest('.e-level-2');
    if (!target) {
      args.cancel = true;
      return;
    }
  };

  const onContextMenuClick = (args: MenuEventArgs) => {
    const treeObj = treeViewRef.current;
    if (!treeObj) return;

    const targetNodeId = treeObj.selectedNodes[0];
    if (!targetNodeId) return;

    const clickedNode = treeObj.getNode(targetNodeId);
    if (!clickedNode) return;

    if (args.item.text === "Remove View") {
      const layoutName = clickedNode.text;
      const storageKey = gridId + layoutName;

      treeObj.removeNodes([targetNodeId]);

      localStorage.removeItem(storageKey);

      const FAV_KEY = 'fav-parent';
      const stored = localStorage.getItem(FAV_KEY);

      if (stored) {
        let favoritesList = JSON.parse(stored);
        favoritesList = favoritesList.filter((item: FavoriteItem) => item.name !== layoutName);

        if (favoritesList.length > 0) {
          localStorage.setItem(FAV_KEY, JSON.stringify(favoritesList));
        } else {
          localStorage.removeItem(FAV_KEY);
        }
      }

      const favoritesRoot = treeObj.getNode('favorites-root');
      if (favoritesRoot && (!favoritesRoot.hasChildren)) {
        treeObj.removeNodes(['favorites-root']);
        localStorage.removeItem(FAV_KEY);
      }
    }
  };
    return (
    <div className="ticket-main-container">
      <div className="ticket-content-wrapper">
        <div className="ticket-content-area">
          <header className="container-header">
            <div className="header-content">
              <h1 className="container-title">Ticket Insights & Management</h1>
            </div>
          </header>

          <div className="grid-container">
            {memoGrid}
          </div>
        </div>
      </div>

      <SidebarComponent
        id="ticket-sidebar"
     
        className="sidebar-views"
        width="220px"
        target=".ticket-content-wrapper"
        type="Auto"
        isOpen={true}
        enableGestures={false}
      >
        <div className="sidebar-header">
          <span className="sidebar-title">Views</span>
        </div>

        <div>
          <TreeViewComponent
            id='main-treeview'
            enablePersistence={true}
            ref={treeViewRef}
            fields={TreeViewfields}
            expandOn='Click'
            nodeSelected={onFavoriteSelect}
          />
        </div>

        <div>
          <ContextMenuComponent
            id="contentmenutree"
            target='#main-treeview'
            items={contextmenuItem}
            beforeOpen={ContextMenuBeforeOpen}
            select={onContextMenuClick}
            ref={menuObj}
          />
        </div>
      </SidebarComponent>

      <DialogComponent
        ref={dialogRef}
        header="Save View"
        target=".ticket-main-container"
        showCloseIcon={true}
        width="380px"
        isModal={true}
        visible={visible}
        buttons={buttons}
        close={onCancel}
      >
        <div className="dialog-content">
          <p className="dialog-help">
            Enter a unique name to save your current grid view (filters, sorts, columns, etc.).
          </p>
          <TextBoxComponent
            ref={textboxObj}
            floatLabelType="Always"
            id="reportName"
            placeholder="e.g., 'My Favorite View'"
          />
        </div>
      </DialogComponent>
    </div>
  );
}

export default App