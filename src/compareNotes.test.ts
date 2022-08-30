import { describe, test, expect } from '@jest/globals';
import { compareNotes } from './compareNotes.js';

describe('compareNotes()', () => {
  test('should well compare one level notes', () => {
    expect(compareNotes({ num: '3' }, { num: '4' })).toEqual(-1);
    expect(compareNotes({ num: '4' }, { num: '3' })).toEqual(1);
    expect(compareNotes({ num: '1' }, { num: '10' })).toEqual(-1);
    expect(compareNotes({ num: '10' }, { num: '1' })).toEqual(1);
  });

  test('should well compare two level notes', () => {
    expect(compareNotes({ num: '10.1' }, { num: '10.2' })).toEqual(-1);
    expect(compareNotes({ num: '10.2' }, { num: '10.1' })).toEqual(1);
    expect(compareNotes({ num: '10.1' }, { num: '10.20' })).toEqual(-1);
    expect(compareNotes({ num: '10.20' }, { num: '10.1' })).toEqual(1);
  });

  test('should well compare different level notes', () => {
    expect(compareNotes({ num: '10' }, { num: '10.1' })).toEqual(-1);
    expect(compareNotes({ num: '10.1' }, { num: '10' })).toEqual(1);
    expect(compareNotes({ num: '10.1.3' }, { num: '10.1.4.5' })).toEqual(-1);
    expect(compareNotes({ num: '10.20' }, { num: '10.1.1' })).toEqual(1);
  });
});
