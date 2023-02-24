import { IPropertyPaneField } from '@microsoft/sp-property-pane';

export interface ICustomTextFieldProps {
  label: string;
  value: string;
  onValueChanged: (newValue: string) => void;
}

export class CustomTextField implements IPropertyPaneField<ICustomTextFieldProps> {
  public type: any = undefined; // This should always be undefined
  public targetProperty: string;
  public properties: ICustomTextFieldProps;
  private elem: HTMLElement;

  constructor(targetProperty: string, properties: ICustomTextFieldProps) {
    this.targetProperty = targetProperty;
    this.properties = properties;
  }

  public render(): void {
    if (!this.elem) {
      this.elem = document.createElement('div');
    }

    this.elem.innerHTML = `
      <label>${this.properties.label}</label>
      <input type="text" value="${this.properties.value}">
      <a href="http://google.com" target="_blank">Click me</a>
    `;

    this.elem.querySelector('input').addEventListener('input', (event) => {
      this.properties.onValueChanged((event.target as HTMLInputElement).value);
    });
  }

  public getPropertyPaneConfiguration(): IPropertyPaneField<ICustomTextFieldProps> {
    return this;
  }
}
