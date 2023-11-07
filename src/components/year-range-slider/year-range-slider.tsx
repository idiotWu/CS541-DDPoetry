import { RangeSlider } from 'rsuite';
import { useAtom } from 'jotai';
import { yearBeginAtom, yearEndAtom } from '@atoms';
import styles from './year-range-slider.module.scss';

export function YearRangeSlider() {
  const [yearBegin, setYearBegin] = useAtom(yearBeginAtom);
  const [yearEnd, setYearEnd] = useAtom(yearEndAtom);

  return (
    <RangeSlider
      min={2000}
      max={2019}
      step={1}
      graduated
      tooltip={false}
      value={[yearBegin, yearEnd]}
      onChange={([begin, end]) => {
        setYearBegin(begin);
        setYearEnd(end);
      }}
      renderMark={m => {
        if (yearBegin === m || yearEnd === m) {
          return <span>{m}</span>;
        }

        return null;
      }}
      className={styles.range}
    />
  );
}
