import React from 'react';
import styles from './App.module.css';
import { DebugBlackBox } from './components/DebugBlackBox';
import { DialogContainer } from './components/Dialog/DialogContainer';
import { DialogControlContext, DialogMonitorContext } from './components/Dialog/DialogContext';
import { DialogControl, DialogMonitor } from './components/Dialog/DialogManagement';
import { ToDudeList } from './components/ToDudeList/DudeList';


interface Props {
  dialogControl: DialogControl;
  dialogMonitor: DialogMonitor;
}

interface State {
  
}

export class App extends React.Component<Props, State> {
  mainRef: React.RefObject<HTMLElement>;

  providing: {
    dialogControl: DialogControl,
    dialogMonitor: DialogMonitor,
  }

  public constructor(props: Props) {
    super(props);
    this.mainRef = React.createRef();
    this.providing = {
      dialogControl: props.dialogControl,
      dialogMonitor: props.dialogMonitor,
    };
  }

  public render(): React.ReactNode {
    return (
      <div className={styles['app']}>
        <DialogMonitorContext.Provider value={this.providing.dialogMonitor}>
          <DialogControlContext.Provider value={this.providing.dialogControl}>
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
          </DialogControlContext.Provider>
        </DialogMonitorContext.Provider>
      </div>
    );
  }

}
