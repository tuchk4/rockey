import RockeySyntaxError from './utils/RockeySyntaxError';
const RULE_SYMBOLS = /^[a-z\-]+$/;
const empty = ['', ''];

const cssTOJSON = (styles, context, plugins) => {
  const stylesParts = styles.split(';').map(s => (s ? s.split(':') : empty));

  let stylesJson = stylesParts.reduce((json, raw) => {
    if (raw.length === 2) {
      let rule = raw[0].trim();
      let value = raw[1].trim();

      if (
        context.hasAnimations &&
        (rule === 'animation' || rule === 'animation-name')
      ) {
        let animationName = null;

        if (rule === 'animation') {
          animationName = value.split(' ')[0];
        } else if (rule === 'animation-name') {
          animationName = value;
        }

        if (animationName !== 'none') {
          const uniqAnimationName = context.animations[animationName];
          value = value.replace(animationName, uniqAnimationName);
        }
      }

      if (rule && value) {
        if (!RULE_SYMBOLS.test(rule)) {
          throw new RockeySyntaxError(rule);
        }

        if (json[rule]) {
          // css fallback values
          let prev = Array.isArray(json[rule]) ? json[rule] : [json[rule]];

          json[rule] = prev.concat(value);
        } else {
          json[rule] = value;
        }
      }
    } else {
      if (raw.join('').trim().length) {
        throw new RockeySyntaxError(raw.join(':'));
      }
    }

    return json;
  }, {});

  if (plugins) {
    stylesJson = plugins.reduce((styles, plugin) => plugin(styles), stylesJson);
  }

  return stylesJson;
};

export default cssTOJSON;
