import styles from './App.module.css';
import { DebugBlackBox } from './components/DebugBlackBox';
import { ToDudeList } from './components/to-dude-list/DudeList';

function App() {
  return (
    <div className={styles['app']}>
      <main className={styles['main']}>
        <ToDudeList />
      </main>
      <footer className={styles['footer']}>
        debug &nbsp;
        <DebugBlackBox />
      </footer>
    </div>
  );
}

export default App;
