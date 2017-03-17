const wrapTemplateStrings = (displayName, strings) => {
  const wraped = [...strings];

  wraped[0] = `${displayName} { ${wraped[0]}`;
  wraped[wraped.length - 1] = `${wraped[wraped.length - 1]} }`;

  return wraped;
};

export default wrapTemplateStrings;
