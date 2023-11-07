import { useEffect, useRef } from 'react';
import { useAtomValue } from 'jotai';
import clsx from 'clsx';

import { highlightedVerseAtom } from '@atoms';
import { VERSES } from '@constants';

import styles from './poetry.module.scss';

export function Poetry() {
  const highlightedVerse = useAtomValue(highlightedVerseAtom);
  const verseRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const elem = verseRefs.current[highlightedVerse];

    if (!elem) {
      return;
    }

    elem.scrollIntoView({
      behavior: 'smooth',
    });
  }, [highlightedVerse]);

  return (
    <section className={styles.poetry}>
      <h6>Distorted Kingdom</h6>
      <section
        className={clsx(styles.verse, {
          [styles.active]: highlightedVerse === VERSES.OPENING,
        })}
        ref={el => {
          if (el) {
            verseRefs.current[VERSES.OPENING] = el;
          }
        }}
      >
        <header className={styles.verseTitle}>[The Distorted Reality]</header>
        <p>In a distorted kingdom, we live,</p>
        <p>Guarding a distorted mirror,</p>
        <p>In the distorted mirror of the distorted kingdom,</p>
        <p>Corridors of knowledge are uneven.</p>
      </section>
      <section
        className={clsx(styles.verse, {
          [styles.active]: highlightedVerse === VERSES.RICH,
        })}
        ref={el => {
          if (el) {
            verseRefs.current[VERSES.RICH] = el;
          }
        }}
      >
        <header className={styles.verseTitle}>[The Palace of Privilege]</header>
        <p>Some stride through halls carpeted with gold,</p>
        <p>Their futures scripted, their stories told,</p>
        <p>In the palace of privilege, they're crowned,</p>
        <p>Enjoying the nectar their parents brewed.</p>
      </section>
      <section
        className={clsx(styles.verse, {
          [styles.active]: highlightedVerse === VERSES.POOR,
        })}
        ref={el => {
          if (el) {
            verseRefs.current[VERSES.POOR] = el;
          }
        }}
      >
        <header className={styles.verseTitle}>[The Road of Disparity]</header>
        <p>While others trudge along the bumpy road,</p>
        <p>Their dreams faded, their voices silenced.</p>
        <p>In the shadows of riches, they're lost,</p>
        <p>Lurching into darkness and no way out.</p>
      </section>
      <section
        className={clsx(styles.verse, {
          [styles.active]: highlightedVerse === VERSES.ACTION,
        })}
        ref={el => {
          if (el) {
            verseRefs.current[VERSES.ACTION] = el;
          }
        }}
      >
        <header className={styles.verseTitle}>[The Call for Change]</header>
        <p>In this distorted kingdom, scales are unjust,</p>
        <p>By the accident of birth, fate is spawned.</p>
        <p>But can't we shatter the mirror, reshape the world?</p>
        <p>Let education be a right, not just a reward.</p>
      </section>
      <section
        className={clsx(styles.verse, {
          [styles.active]: highlightedVerse === VERSES.ENDING,
        })}
        ref={el => {
          if (el) {
            verseRefs.current[VERSES.ENDING] = el;
          }
        }}
      >
        <header className={styles.verseTitle}>
          [The Dream of Educational Equality]
        </header>
        <p>In the heart of this distorted kingdom, we stand,</p>
        <p>To reveal the gaps that persist, to correct the wrongs,</p>
        <p>To illuminate the disparities, to expose the truth.</p>
        <p>Make education equal, so every child may dream.</p>
      </section>
    </section>
  );
}
