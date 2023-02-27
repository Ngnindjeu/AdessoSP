import * as React from "react";
import styles from "./AdessoSearch.module.scss";
import { IAdessoSearchProps } from "./IAdessoSearchProps";
import { escape } from "@microsoft/sp-lodash-subset";
import { SearchBox } from "../../../components/SearchBox/SearchBox";
import { SearchResults } from "../../../components/SearchResults/SearchResults";
//import { ISearchResultsProps } from '../../../components/SearchResults/ISearchResultsProps';
import { SPSearchService } from "../../../services/Search/SPSearchService";
import { IAdessoSearchState } from "./IAdessoSearchState";

export default class AdessoSearch extends React.Component<
  IAdessoSearchProps,
  IAdessoSearchState
> {
  /**
   *
   */
  constructor(p: IAdessoSearchProps | Readonly<IAdessoSearchProps>) {
    super(p);
    this.state = {
      searchResults: [],
    };
  }

  private initSearch = (searchText: string): void => {
    SPSearchService.Search(this.props.webUrl, searchText, this.props.multiselectvalue)
      .then((results) => {
        this.setState({ searchResults: results });
      })
      .catch((error) => {
        // Gérer l'erreur ici
      });
  }

  public render(): React.ReactElement<IAdessoSearchProps> {
    const {
      // description,
     
     
      hasTeamsContext,
     
      //optionKey,
      selectedOptionName
    } = this.props;

    return (
      <section
        className={`${styles.adessoSearch} ${
          hasTeamsContext ? styles.teams : ""
        }`}
      >
        <div className={styles.welcome}>
         
          <div>
            List name: <strong>{escape(selectedOptionName)}</strong>
          </div>
          <div>
            <SearchBox startSearch={this.initSearch} />
            <SearchResults searchResults={this.state.searchResults} />
          </div>
        </div>
      </section>
    );
  }
}
