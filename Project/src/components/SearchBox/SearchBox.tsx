import { TextField, DefaultButton } from 'office-ui-fabric-react';
import * as React from "react";
import { ISearchBoxProps } from "./ISearchBoxProps";
import { ISearchBoxState } from "./ISearchBoxState";

export class SearchBox extends React.Component<ISearchBoxProps, ISearchBoxState>{

    /**
     *
     */
    constructor(p: ISearchBoxProps | Readonly<ISearchBoxProps>) {
        super(p);
        this.state = {
            currentSearchText : ""
        };
        // initialisierungslogik z.b. den alten Suchbegriff - wenn verfügbar -  wieder in die Textbox schreiben
        
    }

    public render(): React.ReactElement {
        return <div>
            {/* TODO: Fluent UI Textbox (idealerweise die Searchvariante) hier einbinden */}
            {/* TODO: Starte Suche Button (ggf. via 'Enter'-Taste Suche auslösen) */}
            <TextField id='result' onChange={(ev,newVal) => this.updateSearchText(newVal)} />
            <DefaultButton text='Suche starten' onClick={() => this.startSearch()} />
        </div>;
    }
    public updateSearchText(value?:string): void {
        if(value !== null){
            this.setState({currentSearchText : value.toString()});
        }
    }

    public startSearch(): void {
        this.props.startSearch(this.state.currentSearchText);
    }
    
}