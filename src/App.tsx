import React from 'react';
import styles from './App.module.css';
import { DebugBlackBox } from './components/DebugBlackBox';
import { Dialog } from './components/dialog/Dialog';
import { DialogContainer } from './components/dialog/DialogContainer';
import { DialogContext } from './components/dialog/DialogContext';
import { DialogControl } from './components/dialog/DialogControl';
import { ToDudeList } from './components/to-dude-list/DudeList';


interface Props {

}

interface State {
  dialogControl: DialogControl;
}

export class App extends React.Component<Props, State> {
  mainRef: React.RefObject<HTMLElement>;

  public constructor(props: Props) {
    super(props);
    this.state = {
      dialogControl: new DialogControl(),
    };
    this.mainRef = React.createRef();
  }

  public render(): React.ReactNode {
    return (
      <div className={styles['app']}>
        <DialogContext.Provider value={{control: this.state.dialogControl}}>
          <main className={styles['main']} ref={this.mainRef}>
            <ToDudeList />
            <DialogContainer dragBoundary={this.mainRef}/>
          </main>
          <footer className={styles['footer']}>
            debug &nbsp;
            <DebugBlackBox />
          </footer>
        </DialogContext.Provider>
      </div>
    );
  }

}
