const get = require('lodash/get');

const loadRmk = mod => {
  if (process.env.USE_BUILD) {
    const rmk = require('dist/rmk');

    return rmk;
  } else {
    return require(mod);
  }
};
const clear = loadRmk('shorcuts/clear');

// precss.forEach(pre => {
//   if (pre.mixins) {
//     pre.mixins.forEach(mixin => {
//       const result = mixin(props);
//
//       if (result) {
//         if (result.className) {
//           pre.root.forEach(c => {
//             classList[c] += ` ${result.className}`;
//           });
//         }
//
//         if (result.precss) {
//           result.precss.forEach(p => {
//             dynamicCSSToInsert.push(p);
//           });
//         }
//       }
//     });
//   }
// });
//
