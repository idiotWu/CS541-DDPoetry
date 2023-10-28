import { SelectPicker, RangeSlider, Divider } from 'rsuite';
import { useState } from 'react';

import { Visulaizer } from '@components';
import styles from './App.module.scss';

const selections = ['Primary Completion Rate', 'To Be Added...'].map(item => ({
  label: item,
  value: item,
}));

export function App() {
  const [yearRange, setYearRange] = useState<[number, number]>([2010, 2015]);
  return (
    <div className={styles.app}>
      <aside className={styles.sidebar}>
        <h4>Data-Driven Poetry</h4>

        <Divider />

        <div className={styles.option}>
          <div className={styles.label}>Indicator:</div>
          <SelectPicker
            data={selections}
            defaultValue={selections[0].value}
            cleanable={false}
            className={styles.dropdown}
          />
        </div>

        <Divider />

        <div className={styles.option}>
          <div className={styles.label}>Year Range:</div>
          <RangeSlider
            min={2000}
            max={2019}
            step={1}
            graduated
            tooltip={false}
            value={yearRange}
            onChange={setYearRange}
            renderMark={m => {
              if (yearRange.includes(m)) {
                return <span>{m}</span>;
              }

              return null;
            }}
            className={styles.range}
          />
        </div>

        <Divider />

        <section className={styles.poetry}>
          <h6>Distorted Kingdom</h6>
          <section className={styles.verse}>
            <p>In a distorted kingdom, we live,</p>
            <p>Guarding a distorted mirror,</p>
            <p>In the distorted mirror of the distorted kingdom,</p>
            <p>Corridors of knowledge are uneven.</p>
          </section>
          <section className={styles.verse}>
            <p>Some stride through halls carpeted with gold,</p>
            <p>Their futures scripted, their stories told,</p>
            <p>In the palace of privilege, they're crowned,</p>
            <p>Enjoying the nectar their parents brewed.</p>
          </section>
          <section className={styles.verse}>
            <p>While others trudge along the bumpy road,</p>
            <p>Their dreams faded, their voices silenced.</p>
            <p>In the shadows of riches, they're lost,</p>
            <p>Lurching into darkness and no way out.</p>
          </section>
          <section className={styles.verse}>
            <p>In this distorted kingdom, scales are unjust,</p>
            <p>By the accident of birth, fate is spawned.</p>
            <p>But can't we shatter the mirror, reshape the world?</p>
            <p>Let education be a right, not just a reward.</p>
          </section>
          <section className={styles.verse}>
            <p>In the heart of this distorted kingdom, we stand,</p>
            <p>To reveal the gaps that persist, to correct the wrongs,</p>
            <p>To illuminate the disparities, to expose the truth.</p>
            <p>Make education equal, so every child may dream.</p>
          </section>
        </section>
      </aside>
      <Visulaizer />
    </div>
  );
}
