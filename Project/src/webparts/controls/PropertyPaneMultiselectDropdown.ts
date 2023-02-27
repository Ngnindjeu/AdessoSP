import * as React from 'react';  
import * as ReactDom from 'react-dom';  
import {  
  IPropertyPaneField,  
  PropertyPaneFieldType  
} from '@microsoft/sp-webpart-base';  
import { IDropdownOption } from 'office-ui-fabric-react/lib/components/Dropdown';  
import { IPropertyPaneMultiselectDropdownProps } from './IPropertyPaneMultiselectDropdownProps';  
import { IPropertyPaneMultiselectDropdownInternalProps } from './IPropertyPaneMultiselectDropdownInternalProps';  
import ListDropdown from './components/ListDropdown';  
import { IListDropdownProps } from './components/IListDropdownProps';  
import { cloneDeep } from 'lodash';
//multiselect dropdown with custom load deligate and on change handler
export class PropertyPaneMultiselectDropdown implements IPropertyPaneField<IPropertyPaneMultiselectDropdownInternalProps> {  
  public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;  
  public targetProperty: string;  
  public properties: IPropertyPaneMultiselectDropdownInternalProps;  
  private elem: HTMLElement;  
  
  constructor(targetProperty: string, properties: IPropertyPaneMultiselectDropdownProps) {  
    this.targetProperty = targetProperty;  
    this.properties = {  
      key: properties.label,  
      label: properties.label,  
      loadOptions: properties.loadOptions,  
      onPropertyChange: properties.onPropertyChange,  
      selectedKeys: properties.selectedKeys,  
      disabled: properties.disabled, 
      multiselect:properties.multiselect, 
      onRender: this.onRender.bind(this)  
    };  
  }  
  
  public render(): void {  
    if (!this.elem) {  
      return;  
    }  
  
    this.onRender(this.elem);  
  }  
  
  private onRender(elem: HTMLElement): void {  
    if (!this.elem) {  
      this.elem = elem;  
    }  
  
    const element: React.ReactElement<IListDropdownProps> = React.createElement(ListDropdown, {  
      label: this.properties.label,  
      loadOptions: this.properties.loadOptions,  
      onChanged: this.onChanged.bind(this),  
      selectedKeys: this.properties.selectedKeys, 
    
      disabled: this.properties.disabled, 
      multiselect:this.properties.multiselect, 
      // required to allow the component to be re-rendered by calling this.render() externally  
      stateKey: new Date().toString()  
    });  
    ReactDom.render(element, elem);  
  }  
  
  private onChanged(option: IDropdownOption, index?: number): void {  
    const updateSelectedKeys: any[] = this.properties.selectedKeys ? cloneDeep(this.properties.selectedKeys) : [];
  if(this.properties.onPropertyChange)
  {  // Check if item got selected
      if (option.selected) {
        updateSelectedKeys.push(option.key);
      } else {
        // Remove the item from the selected keys list
        const itemIdx =updateSelectedKeys.indexOf(option.key);
        if (itemIdx > -1) {
          updateSelectedKeys.splice(itemIdx, 1);
        }
      }
    }
    this.properties.selectedKeys=updateSelectedKeys;
    this.properties.onPropertyChange(this.targetProperty, updateSelectedKeys);  
  }  
}  