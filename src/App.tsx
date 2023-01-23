import React from 'react';
import styles from './App.module.css';
import { DebugBlackBox } from './components/DebugBlackBox';
import { DialogContainer } from './components/Dialog/DialogContainer';
import { DialogMonitorContext } from './components/Dialog/DialogContext';
import { DialogProvider } from './components/Dialog/DialogProvider';
import { ToDudeList } from './components/ToDudeList/DudeList';


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
        <DialogProvider>
          <main className={styles['main']} ref={this.mainRef}>

            <ToDudeList />
          
            <DialogMonitorContext.Consumer>
              {/*
                  This consumer is just being used for practice.
                  It would be senseless to use it like this in the real world,
                  Since the provider is obviously right there above it.
              */}

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
      </div>
    );
  }

}
