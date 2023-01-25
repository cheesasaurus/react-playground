import React, { useState } from 'react';
import styles from './App.module.css';
import { DebugBlackBox } from './components/DebugBlackBox';
import { DialogContainer } from './components/Dialog/DialogContainer';
import { DialogMonitorContext } from './components/Dialog/DialogContext';
import { DialogProvider } from './components/Dialog/DialogProvider';
import { ToDudeList } from './components/ToDudeList/DudeList';
import { CrudeStoreContext, CrudeStoreProvider } from './crude-store/CrudeStoreProvider';
import { ExampleFunctionComponent } from './store/ExampleFunctionComponent';
import { ExampleClassComponent } from './store/ExampleClassComponent';


interface Props {

}

interface State {
  
}

export class App extends React.Component<Props, State> {
  mainRef: React.RefObject<HTMLElement>;

  public constructor(props: Props) {
    super(props);
    this.mainRef = React.createRef();
  }

  public render(): React.ReactNode {
    return (
      <div className={styles['app']}>
        <CrudeStoreProvider>
          <DialogProvider>
            <main className={styles['main']} ref={this.mainRef}>

              <ExampleFunctionComponent/>

              <ExampleClassComponent text={'hello'}/>

              <CrudeStoreContext.Consumer>
                {(crudeStore) => (
                  <ToDudeList crudeStore={crudeStore!}/>
                )}
              </CrudeStoreContext.Consumer>
             
            
              <DialogMonitorContext.Consumer>
                {(dialogMonitor) => (
                  <DialogContainer dialogMonitor={dialogMonitor!} dragBoundary={this.mainRef}/>
                )}
              </DialogMonitorContext.Consumer>
              
            </main>
            <footer className={styles['footer']}>
              debug &nbsp;
              <DebugBlackBox />
            </footer>
          </DialogProvider>
        </CrudeStoreProvider>
      </div>
    );
  }

}

