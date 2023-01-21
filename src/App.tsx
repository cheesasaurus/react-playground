import React from 'react';
import styles from './App.module.css';
import { DebugBlackBox } from './components/DebugBlackBox';
import { DialogContainer } from './components/Dialog/DialogContainer';
import { DialogContext, IDialogContext } from './components/Dialog/DialogContext';
import { DialogControl } from './components/Dialog/DialogControl';
import { ToDudeList } from './components/ToDudeList/DudeList';


interface Props {
  dialogControl: DialogControl;
}

interface State {
  
}

interface Providing {
  dialogContext: IDialogContext;
}

export class App extends React.Component<Props, State> {
  mainRef: React.RefObject<HTMLElement>;

  providing: Providing = {
    dialogContext: {
      control: undefined,
    }
  };

  public constructor(props: Props) {
    super(props);
    this.mainRef = React.createRef();
    this.providing.dialogContext = {control: this.props.dialogControl};
  }

  public render(): React.ReactNode {
    return (
      <div className={styles['app']}>
        <DialogContext.Provider value={this.providing.dialogContext}>
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
