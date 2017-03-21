import mount from './mount';

const sheet = mount();

export const insertRules = css => sheet.insertRules(css);
export const insertMixins = css => sheet.insertMixins(css);

export const getRules = css => sheet.getRules();
export const getMixins = css => sheet.getMixins();
export const clearStyles = css => sheet.clear();

export default insertRules;
