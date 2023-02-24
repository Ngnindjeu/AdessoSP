import * as React from "react";
import { ReactNode } from "react";
import { SearchResultMapper } from "../../services/Search/SearchResultMapper";
import { ISearchResultsProps } from "./ISearchResultsProps";
import { ISearchResultsState } from "./ISearchResultsState";

export class SearchResults extends React.Component<ISearchResultsProps, ISearchResultsState>{
    public render(): ReactNode {
        return <div>
            {this.props.searchResults.length}        

            {this.props.searchResults.map((val) => {
            const resultObj = SearchResultMapper.MapToObject(val);
            return <div key={val.id}><a href={resultObj.Path}>{resultObj.Title}</a></div>;
            })}         

        </div>;
    }
}