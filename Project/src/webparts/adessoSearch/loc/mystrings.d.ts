declare interface IAdessoSearchWebPartStrings {
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;

  PropertyPaneDescription: string;
  BasicGroupName: string;
  ListNameFieldLabel: string;
}

declare module "AdessoSearchWebPartStrings" {
  const strings: IAdessoSearchWebPartStrings;
  export = strings;
}
