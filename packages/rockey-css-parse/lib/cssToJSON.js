const cache = {};

const cssTOJSON = (styles, context, plugins) => {
  const stylesParts = styles
    .trim()
    .split(';')
    .map(s => (s ? s.split(':') : null))
    .filter(s => !!s);

  const key = stylesParts.toString();

  if (!key.trim()) {
    return {};
  }

  if (cache[key]) {
    return cache[key];
  }

  let stylesJson = stylesParts.reduce((json, raw) => {
    if (raw && raw[0] && raw[1]) {
      let rule = raw[0].trim();
      let value = raw[1].trim();

      if (
        context.hasAnimations &&
        (rule === 'animation' || rule === 'animationName')
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
        if (json[rule]) {
          // css fallback values
          let prev = Array.isArray(json[rule]) ? json[rule] : [json[rule]];

          json[rule] = prev.concat(value);
        } else {
          json[rule] = value;
        }
      }
    }
    return json;
  }, {});

  if (plugins) {
    stylesJson = plugins.reduce((styles, plugin) => plugin(styles), stylesJson);
  }

  cache[key] = stylesJson;

  return stylesJson;
};

export default cssTOJSON;
