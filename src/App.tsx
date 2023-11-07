import { Divider } from 'rsuite';
import { useAtomValue } from 'jotai';

import {
  Visulaizer,
  IndicatorPicker,
  YearRangeSlider,
  Poetry,
} from '@components';
import { activeIndicatorAtom } from '@atoms';
import { indicators } from '@constants';
import styles from './App.module.scss';

export function App() {
  const activeIndicator = useAtomValue(activeIndicatorAtom);
  const indicatorDescription = indicators[activeIndicator][1];
  return (
    <div className={styles.app}>
      <aside className={styles.sidebar}>
        <h4>Data-Driven Poetry</h4>

        <Divider />

        <div className={styles.option}>
          <div className={styles.label}>Indicator:</div>
          <IndicatorPicker />
          <footer className={styles.description}>
            {indicatorDescription[0].toUpperCase() +
              indicatorDescription.slice(1)}
          </footer>
        </div>

        <Divider />

        <div className={styles.option}>
          <div className={styles.label}>Year Range:</div>
          <YearRangeSlider />
        </div>

        <Divider />

        <Poetry />
      </aside>
      <Visulaizer />
    </div>
  );
}
