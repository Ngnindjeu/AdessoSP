import { IPropertyPaneDropdownOption} from "@microsoft/sp-property-pane";


export class SPListResultMapper{
    public static MapToIPropertyPaneDropdownOption(list:any):IPropertyPaneDropdownOption{
        return {
            key:list.Id,
            text:list.Title
        };
    }

    public static MapToListObject(list:any){
        return{
                key:list.Id,
                text:list.Title,
                isList:list.BaseTemplate !== 101,
                path:list.RootFolder.ServerRelativeUrl
        };
    }

    public static idToName(list: IPropertyPaneDropdownOption[], id: string): string{ 
        if (list.length == 0) 
            return "";
        if (list[0].key == id) return list[0].text;
        return this.idToName(list.splice(1), id);
    }
}