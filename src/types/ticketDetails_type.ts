export type FavoriteItem = {
  name: string;   // Display name of the layout
  key: string;    // Unique storage key (e.g., gridId + layoutName)
};


export interface TreeNode {
  nodeId: string;            // unique id
  nodeText: string;          // display text
  iconCss?: string;          // CSS classes for icon
  hasChildren?: boolean;     // indicates lazy children or structural parent
  expanded?: boolean;        // initial expanded state
  selected?: boolean;        // initial selected state
  isChecked?: boolean;       // for checkbox TreeView scenarios
  imageUrl?: string;  
  parentID?: string | number;      // optional image (if used)
  navigateUrl?: string;      // optional navigation (if used)
  children?: TreeNode[];     // child nodes (if available)
  // Add any app-specific metadata:
  meta?: Record<string, unknown>;
}


// Define the shape of each column
export interface GridColumn {
  field: string;            // The data field name
  headerText: string;       // Column header text
  width?: string | number;  // Width can be string (e.g., '150') or number
  textAlign?: 'Left' | 'Right' | 'Center';
  type?: 'string' | 'number' | 'date' | 'boolean'; // Column data type
  format?: string;          // Optional format for date/number
  isPrimaryKey?: boolean;   // For unique identification
}

