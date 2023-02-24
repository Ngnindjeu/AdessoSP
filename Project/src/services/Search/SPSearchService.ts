//import { NormalPeoplePicker } from "office-ui-fabric-react";


export class SPSearchService{

    public static async Search(webUrl:string, searchText:string, sourceListId:string):Promise<any[]>{

        // bsp für refinement https://learn.microsoft.com/en-us/sharepoint/dev/general-development/sharepoint-search-rest-api-overview#querying-with-the-search-rest-service
        return new Promise<any[]>((resolve, reject) => 
        {
            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    // Typical action to be performed when the document is ready:
                    resolve(JSON.parse(this.responseText).PrimaryQueryResult.RelevantResults.Table.Rows);
                }
                else if(this.readyState === 4 && this.status !== 200){
                    // todo Error Handling
                    reject("irgendein Fehler. TODO: Fehlerhandling besser machen");



                    
                }
            };
            xhr.open("GET", webUrl + "/_api/search/query?querytext='"+searchText+"'&refinementfilters='ListID:equals(\""+sourceListId+"\")'");
            xhr.setRequestHeader("Accept","application/json");
            xhr.send();
        });
    } 
}