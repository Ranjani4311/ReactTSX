export type FavoriteItem = {
  name: string;   // Display name of the layout
  key: string;    // Unique storage key (e.g., gridId + layoutName)
};



export interface TreeNode {
  nodeId: string;
  nodeText: string;
  iconCss?: string;
  hasChildren?: boolean;
  expanded?: boolean;
  selected?: boolean;
  isChecked?: boolean;
  imageUrl?: string;
  parentID?: string | number;
  navigateUrl?: string;
  children?: TreeNode[];
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

