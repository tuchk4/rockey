import interpolateString from './utils/interpolateString';

const condition = conditionFunc => (...args) => {
  if (conditionFunc()) {
    return interpolateString(...args);
  } else {
    return null;
  }
};

export default condition;
