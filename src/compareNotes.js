'use strict';

module.exports = {
  compareNotes,
};


/* Architecture Note #1.2: Ordering

To order architecture notes in a meaningful way we
 use title hierarchy like we used too at school with
 argumentative texts ;).

A sample tree structure could be:
- 1
- 1.1
- 1.2
- 2
- 3

*/
function compareNotes(aNote, bNote) {
  const aNoteLevels = aNote.num.split('.').map(n => parseInt(n, 10));
  const bNoteLevels = bNote.num.split('.').map(n => parseInt(n, 10));
  const levelsDepth = Math.max(aNoteLevels.length, bNoteLevels.length);
  let result = 0;

  result = (new Array(levelsDepth)).fill('').reduce((result, unused, index) => {
    if(0 !== result) {
      return result;
    } else if('undefined' === typeof aNoteLevels[index]) {
      result = -1;
    } else if('undefined' === typeof bNoteLevels[index]) {
      result = 1;
    } else if(aNoteLevels[index] === bNoteLevels[index]) {
      result = 0;
    } else if(aNoteLevels[index] < bNoteLevels[index]) {
      result = -1;
    } else if(aNoteLevels[index] > bNoteLevels[index]) {
      result = 1;
    }
    return result;
  }, result);
  return result;
}
