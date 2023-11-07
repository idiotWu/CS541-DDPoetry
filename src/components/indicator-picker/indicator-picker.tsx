import { SelectPicker } from 'rsuite';
import { useAtom } from 'jotai';
import { indicators } from '@constants';
import { activeIndicatorAtom } from '@atoms';

import styles from './indicator-picker.module.scss';

const options = Object.keys(indicators).map(ind => {
  return {
    value: ind,
    label: indicators[ind][0],
  };
});

export function IndicatorPicker() {
  const [activeIndicator, setActiveIndicator] = useAtom(activeIndicatorAtom);

  return (
    <SelectPicker
      data={options}
      value={activeIndicator}
      onChange={v => setActiveIndicator(v!)}
      cleanable={false}
      className={styles.picker}
    />
  );
}
