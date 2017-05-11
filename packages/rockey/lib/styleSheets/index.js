import StyleSheet from './StyleSheet';

const sheet = new StyleSheet();

let insertWithQueue = false;

export const insert = precss => {
  if (insertWithQueue) {
    sheet.insertWithQueue(precss);
  } else {
    sheet.insert(precss);
  }
};

export const getRules = css => sheet.getRules();
export const clearStyles = css => sheet.clear();

export const speedy = () => sheet.enableSpeedy();
export const useQueue = () => {
  insertWithQueue = true;
};

export default insert;
