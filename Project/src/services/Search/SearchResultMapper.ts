/* eslint-disable @typescript-eslint/no-explicit-any */
export class SearchResultMapper{
    public static MapToObject(row:any):any{
        const resultObject: { [key: string]: any } = {};

        row.Cells.forEach((cell: { Key: string | number; Value: any; }) => {
            resultObject[cell.Key] = cell.Value;
        });
        return resultObject;
    }
}

