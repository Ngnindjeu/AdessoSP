import * as React from 'react';
import styles from './AdessoResults.module.scss';
import { IAdessoResultsProps } from './IAdessoResultsProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class AdessoResults extends React.Component<IAdessoResultsProps, {}> {
  public render(): React.ReactElement<IAdessoResultsProps> {
    const {
      result,
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (
      <section className={`${styles.adessoResults} ${hasTeamsContext ? styles.teams : ''}`}>
        <div className={styles.welcome}>
          <img alt="" src={isDarkTheme ? require('../assets/welcome-dark.png') : require('../assets/welcome-light.png')} className={styles.welcomeImage} />
          <h2>Well done, {escape(userDisplayName)}!</h2>
          <div>{environmentMessage}</div>
          <div>Web part property value: <strong>{escape(description)}</strong></div>
        </div>
        <div>
          {result}  
          </div>
      </section>
    );
  }
}
