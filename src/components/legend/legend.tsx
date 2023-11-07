import styles from './legend.module.scss';

export type LegendProps = {
  min: number;
  max: number;
  numTicks?: number;
};

export function Legend({ min, max, numTicks = 3 }: LegendProps) {
  const range = max - min;
  const ticks = Array.from(
    { length: numTicks },
    (_, i) => range * (i / (numTicks - 1)),
  );
  const noData = !Number.isFinite(range);

  return (
    <div className={styles.legend}>
      <div className={styles.title}>
        Average Gap Between the Richest and the Poorest
      </div>
      <div className={styles.ruler} />
      <div className={styles.tickWrapper}>
        {ticks.map((t, i) => {
          return (
            <span className={styles.tick} key={i}>
              {noData ? 'No Data' : t.toFixed(2)}
            </span>
          );
        })}
      </div>
    </div>
  );
}
