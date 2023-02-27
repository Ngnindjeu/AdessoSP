import * as React from 'react';  
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/components/Dropdown';  
import { Spinner } from 'office-ui-fabric-react/lib/components/Spinner';  
import { IListDropdownProps } from './IListDropdownProps';  
import { IListDropdownState } from './IListDropdownState';  
  
export default class ListDropdown extends React.Component<IListDropdownProps, IListDropdownState> {  
  
  
  constructor(props: IListDropdownProps, state: IListDropdownState) {  
    super(props);  
    this.state = {  
      loading: false,  
      options: undefined, 
      selectedKeys :this.props.selectedKeys, 
      error: undefined  
    };  
  }  
  
  public componentDidMount(): void {  
    this.loadOptions();  
  }  
  
  public componentDidUpdate(prevProps: IListDropdownProps, prevState: IListDropdownState): void {  
    if (this.props.disabled !== prevProps.disabled ||  
      this.props.stateKey !== prevProps.stateKey) {  
      this.loadOptions();  
    }  
  }  
  
  private loadOptions(): void {  
    this.setState({  
      loading: true,  
      error: undefined,  
      options: undefined ,
      selectedKeys :this.props.selectedKeys, 
    });  
  
    this.props.loadOptions()  
      .then((options: IDropdownOption[]): void => {  
        this.setState({  
          loading: false,  
          error: undefined,  
          options: options,
         selectedKeys:this.props.selectedKeys, 
        });  
      }, (error: any): void => {  
        this.setState((prevState: IListDropdownState, props: IListDropdownProps): IListDropdownState => {  
          prevState.loading = false;  
          prevState.error = error;  
          return prevState;  
        });  
      });  
  }  
  
  public render(): JSX.Element {  
    const loading: JSX.Element = this.state.loading ? <div><Spinner label={'Loading options...'} /></div> : <div />;  
    const error: JSX.Element = this.state.error !== undefined ? <div className={'ms-TextField-errorMessage ms-u-slideDownIn20'}>Error while loading items: {this.state.error}</div> : <div />;  
   
    return (   
      <div>  
        <Dropdown label={this.props.label}  
          disabled={this.props.disabled || this.state.loading || this.state.error !== undefined}  
          onChanged={this.onChanged.bind(this)}  
          options={this.state.options} 
          selectedKeys={this.state.selectedKeys}
          placeHolder="Select option" multiSelect={this.props.multiselect}/>  
        {loading}  
        {error}  
      </div>  
    );  
  }  
  
  private onChanged(option: IDropdownOption, index?: number): void {  
    let newselectedkeys: any[];
    if (this.state.selectedKeys !== undefined && this.state.selectedKeys.length > 0) {
      newselectedkeys = [...this.state.selectedKeys];
    } else {
      newselectedkeys = [];
    }
    if (option.selected) {
      newselectedkeys.push(option.key as string);
    } else {
      const itemIdx = newselectedkeys.indexOf(option.key as string);
      if (itemIdx > -1) {
        newselectedkeys.splice(itemIdx, 1);
      }
    }
    this.setState((prevState: IListDropdownState, props: IListDropdownProps): IListDropdownState => {  
      prevState.selectedKeys = newselectedkeys;
      return prevState;  
    });  
    if (this.props.onChanged) {  
      this.props.onChanged(option, index);  
    }  
  }
    


}