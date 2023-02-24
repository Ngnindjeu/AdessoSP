import { WebPartContext } from "@microsoft/sp-webpart-base";

export class SPListService{

    public static getLists(context:WebPartContext):Promise<any[]> {

        return new Promise<any[]>((ok, nok) => {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", context.pageContext.web.absoluteUrl + "/_api/web/lists?$expand=RootFolder&$select=RootFolder/ServerRelativeUrl,Id,Title,BaseTemplate&$filter=BaseTemplate lt 109");
            xhr.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    // Typical action to be performed when the document is ready:
                    ok(JSON.parse(this.responseText));
                }
                else if(this.readyState == 4 && this.status !== 200){
                    // todo Error Handling
                    nok("irgendein Fehler. TODO: Fehlerhandling besser machen");

                }
            };

            xhr.setRequestHeader("Accept","application/json");
            xhr.send();
        });
    }
}