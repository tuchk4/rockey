const mergeCss = (main, child) => {
  if (!Object.keys(child).length) {
    return main;
  }

  for (const key of Object.keys(child)) {
    const value = child[key];

    if (main[key]) {
      Object.assign(main, {
        [key]: Object.assign(main[key], value),
      });
    } else {
      Object.assign(main, {
        [key]: value,
      });
    }
  }

  return main;
};

export default mergeCss;
