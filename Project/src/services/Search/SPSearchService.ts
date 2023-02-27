export class SPSearchService {
  public static async Search(
    webUrl: string,
    searchText: string,
    sourceListIds: string[]
  ): Promise<any[]> {
    // bsp für refinement https://learn.microsoft.com/en-us/sharepoint/dev/general-development/sharepoint-search-rest-api-overview#querying-with-the-search-rest-service
    return new Promise<any[]>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          // Typical action to be performed when the document is ready:
          resolve(
            JSON.parse(this.responseText).PrimaryQueryResult.RelevantResults
              .Table.Rows
          );
        } else if (this.readyState === 4 && this.status !== 200) {
          // todo Error Handling
          reject("irgendein Fehler. TODO: Fehlerhandling besser machen");
        }
      };
      let refinementFilters = '';
      if (sourceListIds.length > 0) {
        if (sourceListIds.length === 1 && sourceListIds[0] !== "all") {
          refinementFilters = `&refinementfilters='ListID:equals(${sourceListIds[0]})'`;
        } else {
          let listIds = sourceListIds.filter(id => id !== "all").map(id => `ListID:equals(${id})`);
          if (listIds.length > 0) {
            refinementFilters = `&refinementfilters='OR(${listIds.join(',')})'`;
          }
        }
      }
      console.log(
        webUrl +
          "/_api/search/query?querytext='" +
          searchText +
          "'" +
          refinementFilters
      );
      xhr.open(
        "GET",
        webUrl +
          "/_api/search/query?querytext='" +
          searchText +
          "'" +
          refinementFilters
      );
      xhr.setRequestHeader("Accept", "application/json");
      xhr.send();
    });
  }
}
