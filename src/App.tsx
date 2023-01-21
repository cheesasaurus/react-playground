import React from 'react';
import styles from './App.module.css';
import { DebugBlackBox } from './components/DebugBlackBox';
import { DialogContainer } from './components/Dialog/DialogContainer';
import { DialogControlContext, IDialogControlContext } from './components/Dialog/DialogContext';
import { DialogControl } from './components/Dialog/DialogControl';
import { ToDudeList } from './components/ToDudeList/DudeList';


interface Props {
  dialogControl: DialogControl;
}

interface State {
  
}

interface Providing {
  dialogContext: IDialogControlContext;
}

export class App extends React.Component<Props, State> {
  mainRef: React.RefObject<HTMLElement>;

  providing: Providing = {
    dialogContext: undefined,
  };

  public constructor(props: Props) {
    super(props);
    this.mainRef = React.createRef();
    this.providing.dialogContext = this.props.dialogControl;
  }

  public render(): React.ReactNode {
    return (
      <div className={styles['app']}>
        <DialogControlContext.Provider value={this.providing.dialogContext}>
          <main className={styles['main']} ref={this.mainRef}>
            <ToDudeList />
            <DialogContainer dragBoundary={this.mainRef}/>
          </main>
          <footer className={styles['footer']}>
            debug &nbsp;
            <DebugBlackBox />
          </footer>
        </DialogControlContext.Provider>
      </div>
    );
  }

}
