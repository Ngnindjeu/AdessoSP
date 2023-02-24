import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneDropdown,
  IPropertyPaneDropdownOption,
  //PropertyPaneTextField,
  IPropertyPaneField,
  // PropertyPaneFieldType,
  IPropertyPaneDropdownProps,
 //IPropertyPaneCustomFieldProps,
  PropertyPaneTextField
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { IReadonlyTheme } from "@microsoft/sp-component-base";

import * as strings from "AdessoSearchWebPartStrings";
import AdessoSearch from "./components/AdessoSearch";
import { IAdessoSearchProps } from "./components/IAdessoSearchProps";
import { SPListService } from "../../services/Lists/SPListService";
import { SPListResultMapper } from "../../services/Lists/SPListResultMapper";

import { CustomTextField } from './components/CustomField';

export interface IAdessoSearchWebPartProps {
  description: string;
  webLists: [];
  optionKey: string;
  selectedOptionName: string;
}
import {
  IDynamicDataPropertyDefinition,
  IDynamicDataCallables
} from '@microsoft/sp-dynamic-data';

interface IData {
  result: string;
}

export default class AdessoSearchWebPart extends BaseClientSideWebPart<IAdessoSearchWebPartProps> implements IDynamicDataCallables {
  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = "";
  private lists: IPropertyPaneDropdownOption[];
  private listsDropdownDisabled: boolean = true;
  public rawSpLists: any[] = [];
  public spLists: IPropertyPaneDropdownOption[] = [];
  private _selectedEvent: IData;

  protected onInit(): Promise<void> {
    this._environmentMessage = this._getEnvironmentMessage();
    this.context.dynamicDataSourceManager.initializeSource(this);

    return new Promise<void>((resolve, reject) => {
      super
        .onInit()
        .then(() => {
          SPListService.getLists(this.context)
            .then((lists: { [key: string]: any }) => {
              this.rawSpLists = [];
              this.spLists = [];

              if (lists["value"].length > 0) {
                lists["value"].map((rawList: any) => {
                  this.spLists.push(
                    SPListResultMapper.MapToIPropertyPaneDropdownOption(rawList)
                  );
                  this.rawSpLists.push(
                    SPListResultMapper.MapToListObject(rawList)
                  );
                });
              }

              resolve();
            })
            .catch((error) => {
              console.log(error);
              reject(error);
            });
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }

  public render(): void {
    const element: React.ReactElement<IAdessoSearchProps> = React.createElement(
      AdessoSearch,
      {
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        webUrl: this.context.pageContext.web.absoluteUrl,
        optionKey: this.properties.optionKey,
        selectedOptionName: this.properties.selectedOptionName
      }
    );

    ReactDom.render(element, this.domElement);
  }

  private _getEnvironmentMessage(): string {
    if (!!this.context.sdks.microsoftTeams) {
      // running in Teams
      return this.context.isServedFromLocalhost
        ? strings.AppLocalEnvironmentTeams
        : strings.AppTeamsTabEnvironment;
    }

    return this.context.isServedFromLocalhost
      ? strings.AppLocalEnvironmentSharePoint
      : strings.AppSharePointEnvironment;
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const { semanticColors } = currentTheme;
    this.domElement.style.setProperty("--bodyText", semanticColors.bodyText);
    this.domElement.style.setProperty("--link", semanticColors.link);
    this.domElement.style.setProperty(
      "--linkHovered",
      semanticColors.linkHovered
    );
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  private loadLists(): Promise<IPropertyPaneDropdownOption[]> {
    return new Promise<IPropertyPaneDropdownOption[]>(
      (
        resolve: (options: IPropertyPaneDropdownOption[]) => void,
        reject: (error: any) => void
      ) => {
        //setTimeout(() => {
          resolve(this.spLists);
        //}, 2000);
      }
    );
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                this._getDropdownField(),
                PropertyPaneTextField('title', {
                  label: 'Blabla'
                }),
                new CustomTextField("whatever", {
                  label: "Custom Field Label",
                  value: "was geht ab",
                  onValueChanged:(value: string) => {
                    console.log(value, "Hey");
                  }
                })
              ],
            },
          ],
        },
      ],
    };
  }

  private _getDropdownField(): IPropertyPaneField<IPropertyPaneDropdownProps> {
    return PropertyPaneDropdown("optionKey", {
      label: strings.ListNameFieldLabel,
      options: this.lists,
      disabled: this.listsDropdownDisabled,
    });
  }

  protected onPropertyPaneConfigurationStart(): void {
    this.listsDropdownDisabled = !this.lists;

    if (this.lists) {
      return;
    }

    this.context.statusRenderer.displayLoadingIndicator(
      this.domElement,
      'lists'
    );

    this.loadLists()
      .then((listOptions: IPropertyPaneDropdownOption[]): void => {
        this.lists = listOptions;
        this.listsDropdownDisabled = false;
        this.context.propertyPane.refresh();
        this.context.statusRenderer.clearLoadingIndicator(this.domElement);
        this.render();
        this.render(); // force again the webpart to the left-side to be rended
      }
      );
  }
  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    const copiedArray = [...this.lists];
    this.properties.selectedOptionName = SPListResultMapper.idToName(copiedArray, this.properties.optionKey);
  }

  /*private renderCustomField(): IPropertyPaneCustomFieldProps {
    const customObject =  {
      key: "",
      onRender: this._renderCustomField.bind(this)
    };

    return customObject;
  }

  private _onCustomFieldValueChanged(value: string): void {
    // Do something with the new value here
  }

  private _renderCustomField(elem: HTMLElement): void {
    const element: React.ReactElement<any> = React.createElement(
      'div',
      {},
      React.createElement(
        'label',
        { htmlFor: 'custom-field' },
        'Custom Field'
      ),
      React.createElement(
        'input',
        {
          id: 'custom-field',
          type: 'text',
          value: this.properties.description,
          onChange: (e: any) => this._onCustomFieldValueChanged(e.target.value)
        }
      )
    );

    ReactDom.render(element, elem);
  }*/

  public getPropertyDefinitions(): ReadonlyArray<IDynamicDataPropertyDefinition> {
    return [
      { id: 'result', title: 'Result' },
    ];
  }
  /**
 * Return the current value of the specified dynamic data set
 * @param propertyId ID of the dynamic data set to retrieve the value for
 */
  public getPropertyValue(propertyId: string): IData {
    switch (propertyId) {
      case 'result':
        return this._selectedEvent;
    }

    throw new Error('Bad property id');
  }

}
