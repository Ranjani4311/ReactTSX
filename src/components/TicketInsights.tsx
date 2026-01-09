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
import { SidebarComponent,TreeViewComponent ,ContextMenuComponent, ClickEventArgs, NodeSelectEventArgs, MenuEventArgs, BeforeOpenCloseMenuEventArgs} from '@syncfusion/ej2-react-navigations';

import { ticketDetails} from '../data/ticketDetails';
import { viewData } from '../data/treeViewData';

import '../styles/ticketDetails.css'
import { FavoriteItem, GridColumn, TreeNode} from '../types/ticketDetails_type';

function App() {
   const gridRef = useRef<GridComponent | null>(null);
  const dialogRef = useRef<DialogComponent | null>(null);
  const treeViewRef = useRef<TreeViewComponent | null>(null);
  const textboxObj = useRef<TextBoxComponent | null>(null);
  const menuObj = useRef<ContextMenuComponent | null>(null)
 

  const [visible, setVisible] = useState(false);
  const [gridVersion] = useState('v.0');
  
  const gridId = 'gridTicketDetails';
  
  let TreeViewfields = { dataSource: viewData, id: 'nodeId', text: 'nodeText', child: 'nodeChild' };
  let contextmenuItem = [
        { text: 'Remove View' },
    ];
 
//column configuaration
  const columns = useMemo(
    () => [
      { field: "ticket_id", headerText: "Ticket ID", width: 180, textAlign: "Right" },
      { field: "subject", headerText: "Subject", width: 320 },
      { field: "status", 
        headerText: "Status", 
        width: 200,
      },
      { field: "priority", headerText: "Priority", width: 180 },
      { field: "category", headerText: "Category", width: 200 },
      { field: "reporter", headerText: "Reporter", width: 200 },
      { field: "assignee", headerText: "Assignee", width: 200 },
      { field: "created_on", headerText: "Created On", width: 200, type: "dateTime", format: "yMd", textAlign: "Right" },
      { field: "updated_on", headerText: "Updated On", width: 200, type: "dateTime", format: "yMd", textAlign: "Right" },
    ],
    []
  );

  //Toolbar configuration
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

  let persisted;
  persisted = JSON.parse(persistedStr);

  // Normalize filterSettings defaults
  const fsBase = persisted.filterSettings ?? {};
  fsBase.type = fsBase.type ?? 'Excel';
  fsBase.mode = fsBase.mode ?? 'OnEnter';
  fsBase.enableCaseSensitivity = fsBase.enableCaseSensitivity ?? false;
  fsBase.ignoreAccent = fsBase.ignoreAccent ?? false;

  const currentColumns = grid.getColumns();

  if (persisted.columns && Array.isArray(persisted.columns)) {
    persisted.columns.forEach((persistedCol: Column) => {
      const liveCol = currentColumns.find((col:Column) => col.field === persistedCol.field);
      if (liveCol) {
        persistedCol.headerText = liveCol.headerText;
      }
    });
  }

  // Save enhanced full state
  localStorage.setItem('gridTicketDetailsFullState', JSON.stringify(persisted));

  // Helper to create filtered snapshots
  const createSnapshot = (field: string, value: string, keySuffix: string) => {
    const snapshot = { ...persisted };
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
    localStorage.setItem(`gridTicketDetails${keySuffix}`, JSON.stringify(snapshot));
  };

  createSnapshot('priority', 'Critical', 'Critical');
  createSnapshot('priority', 'High', 'High');
  createSnapshot('priority', 'Premium', 'Premium');
 
};

// 2. Function to restore favorites in TreeView
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

  // Add parent node if missing
  const existingParent = treeObj.getTreeData().some((node:TreeNode) => node.nodeId === favoritesParentId);
  if (!existingParent) {
    treeObj.addNodes([{
      nodeId: favoritesParentId,
      nodeText: 'Favorites',
      iconCss: 'e-icons e-star-filled',
      hasChildren: true,
      expanded: true
    }]);
  }

  // Prevent duplicates by nodeText
  const existingNames = new Set(
    treeObj.getTreeData()
      .filter((node:TreeNode) => node.parentID === favoritesParentId)
      .map((node:TreeNode) => node.nodeText)
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

// 3. Single useEffect that runs both initializations
useEffect(() => {
  // Run grid persistence update
  updatePersistedGridFilters();

  // Run favorites restoration
  const treeObj = treeViewRef.current;
  restoreFavorites(treeObj);
}, []); 
  

  const toolbarClick = useCallback((args:ClickEventArgs) => {
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

  // 1. Get & enhance current grid state
  const persistDataStr = gridRef.current?.getPersistData();
  if (!persistDataStr) return;

  let persistData = JSON.parse(persistDataStr);

  // Restore correct header texts
  const currentColumns = gridRef.current?.getColumns() || [];
  if (persistData.columns?.length) {
    persistData.columns.forEach((col: Column) => {
      const live = currentColumns.find((c:Column) => c.field === col.field);
      if (live?.headerText) col.headerText = live.headerText;
    });
  }

  // 2. Save the layout state
  localStorage.setItem(storageKey, JSON.stringify(persistData));

  // 3. Update the master favorites list in localStorage
  const FAV_KEY = 'fav-parent';
  let favorites: FavoriteItem[] = [];
  const stored = localStorage.getItem(FAV_KEY);
  if (stored) {
    try { favorites = JSON.parse(stored); } catch {}
  }

  if (!favorites.some(f => f.name === layoutName)) {
    favorites.push({ name: layoutName, key: storageKey });
    localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
  }

  // 4. Add the new view to TreeView — using the same safe pattern as restoreFavorites
  const tree = treeViewRef.current;
  if (!tree) {
    setVisible(false);
    return;
  }

  const favoritesParentId = 'favorites-root';

  // Ensure Favorites parent exists
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

  // Prevent duplicate by checking existing nodeText under Favorites
  const existingNames = new Set(
    tree.getTreeData()
      .filter((node: any) => node.parentID === favoritesParentId)
      .map((node: any) => node.nodeText)
  );

  if (existingNames.has(layoutName)) {
    setVisible(false);
    return; // Already exists
  }

  // Create unique nodeId (safe and consistent with restoreFavorites)
  const uniqueNodeId = `fav-${layoutName.replace(/\s+/g, '-')}-${Date.now()}`;

  // Add the new favorite child node
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


  const filterSettings : FilterSettingsModel = { type: 'Excel' };

  const memoGrid = useMemo(() => (
    <GridComponent
      id="gridTicketDetails"
      height="400px"
      width="100%"
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
  ), [toolbar, toolbarClick, columns, gridVersion]);


const onFavoriteSelect = (storageKey:NodeSelectEventArgs) => {
  const key = gridId + storageKey.nodeData.text;
  const raw = localStorage.getItem(key);
  if (!raw) return;

  let fullState;
  fullState = JSON.parse(raw);
  const grid = gridRef.current;
  if (!grid) return;

  grid.setProperties(fullState);
};


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

  const onContextMenuClick = (args:MenuEventArgs) => {

  const treeObj = treeViewRef.current;
  if (!treeObj) return;

  // Get the currently selected (right-clicked) node
  const targetNodeId = treeObj.selectedNodes[0];
  if (!targetNodeId) return;

  // Get full node data
  const clickedNode = treeObj.getNode(targetNodeId);
  if (!clickedNode) return;

  // Only allow "Remove View" action on child nodes inside Favorites
  if (args.item.text === "Remove View") {
    // Safety check: ensure it's a child of Favorites
   

    const layoutName = clickedNode.text;     
    const storageKey = gridId + layoutName; 

    // 1. Remove node from TreeView
    treeObj.removeNodes([targetNodeId]);

    // 2. Remove the saved grid layout from localStorage
    localStorage.removeItem(storageKey);

    // 3. Update the shared favorites tracking list (if you store names separately)
    const FAV_KEY = 'fav-parent'; // or whatever key you use to track favorite names
    const stored = localStorage.getItem(FAV_KEY);

    if (stored) {
      let favoritesList = JSON.parse(stored);
      favoritesList = favoritesList.filter((item:FavoriteItem) => item.name !== layoutName);

      if (favoritesList.length > 0) {
        localStorage.setItem(FAV_KEY, JSON.stringify(favoritesList));
      } else {
        localStorage.removeItem(FAV_KEY);
      }
    }

    // 4. If no more children in Favorites → remove the parent folder
    const favoritesRoot = treeObj.getNode('favorites-root');
    if (favoritesRoot && (!favoritesRoot.hasChildren)) {
      treeObj.removeNodes(['favorites-root']);
      localStorage.removeItem(FAV_KEY); // cleanup
    }
  }
};


  return (
    <div className="container">
      <SidebarComponent
        id="default-sidebar"
        enableGestures ={false}
        width= {Math.floor(window.innerWidth / 6)}
      >
        <div className="container-header">
          <span className="container-subtitle">Views</span>
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
          <ContextMenuComponent id="contentmenutree" target='#main-treeview' items={contextmenuItem} beforeOpen={ContextMenuBeforeOpen} select={onContextMenuClick} ref={menuObj}/>
         </div>
      </SidebarComponent>

      <div className="content">
        <header className="container-header">
          <div className="header-content">
            <h1 className="container-title">Ticket Insights & Management</h1>
            <p className="container-subtitle">
              Save, Load, and Download your custom grid views. Powered by localStorage!
            </p>
          </div>
        </header> 

        <div className="grid-wrapper">
          {memoGrid}
        </div>
      </div>

      <DialogComponent
        ref={dialogRef}
        header="Save View"
        target=".container"
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

      <footer className="container-footer">
        <p>© 2026 Ticket Dashboard | Powered by Syncfusion EJ2</p>
      </footer>
    </div>
  );
}

export default App