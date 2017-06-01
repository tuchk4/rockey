import StyleSheet from './StyleSheet';

let insertWithQueue = false;
let speedyEnabled = false;

const sheet = new StyleSheet(speedyEnabled);

export const insert = precss => {
  sheet.insert(precss);
};

export const useQueue = () => {
  insertWithQueue = true;
};

export default insert;
