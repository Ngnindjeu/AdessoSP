import { IDropdownOption } from 'office-ui-fabric-react/lib/components/Dropdown';  
  
export interface IPropertyPaneMultiselectDropdownProps
 {  
  label: string;  
  loadOptions: () => Promise<IDropdownOption[]>;  
  onPropertyChange: (propertyPath: string, newValue: any) => void;  
  selectedKeys: string[] | number[];  
  disabled?: boolean;  
  multiselect:boolean;

}