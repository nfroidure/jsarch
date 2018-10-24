import assert from 'assert';
import { compareNotes } from './compareNotes';

describe('compareNotes()', () => {
  it('should well compare one level notes', () => {
    assert.equal(compareNotes({ num: '3' }, { num: '4' }), -1);
    assert.equal(compareNotes({ num: '4' }, { num: '3' }), 1);
    assert.equal(compareNotes({ num: '1' }, { num: '10' }), -1);
    assert.equal(compareNotes({ num: '10' }, { num: '1' }), 1);
  });

  it('should well compare two level notes', () => {
    assert.equal(compareNotes({ num: '10.1' }, { num: '10.2' }), -1);
    assert.equal(compareNotes({ num: '10.2' }, { num: '10.1' }), 1);
    assert.equal(compareNotes({ num: '10.1' }, { num: '10.20' }), -1);
    assert.equal(compareNotes({ num: '10.20' }, { num: '10.1' }), 1);
  });

  it('should well compare different level notes', () => {
    assert.equal(compareNotes({ num: '10' }, { num: '10.1' }), -1);
    assert.equal(compareNotes({ num: '10.1' }, { num: '10' }), 1);
    assert.equal(compareNotes({ num: '10.1.3' }, { num: '10.1.4.5' }), -1);
    assert.equal(compareNotes({ num: '10.20' }, { num: '10.1.1' }), 1);
  });
});
