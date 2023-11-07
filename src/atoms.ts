import { atom } from 'jotai';
import { VERSES } from '@constants';

// year range atoms
export const yearBeginAtom = atom(2005);
export const yearEndAtom = atom(2015);

// active indicator
export const activeIndicatorAtom = atom('comp_prim_v2_m');

// highlighted verse
export const highlightedVerseAtom = atom(VERSES.OPENING);
