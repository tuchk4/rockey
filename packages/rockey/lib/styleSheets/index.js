import StyleSheet from './StyleSheet';

let insertWithQueue = false;
let speedyEnabled = false;
let sheet = null;

export const create = precss => {
  sheet = new StyleSheet(speedyEnabled);
};

export const insert = precss => {
  if (!sheet) {
    create();
  }

  if (insertWithQueue) {
    sheet.insertWithQueue(precss);
  } else {
    sheet.insert(precss);
  }
};

// export const getRules = css => sheet.getRules();
// export const clearStyles = css => sheet.clear();

export const speedy = () => {
  if (sheet) {
    throw new Error(
      'It is not possible to set "speedy" mode because StyleSheet was already created'
    );
  }
  speedyEnabled = true;
};
export const useQueue = () => {
  insertWithQueue = true;
};

export default insert;
