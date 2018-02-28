const timer = func => {
  const timeStart = Date.now();
  return Promise.resolve(func()).then(() => {
    return (Date.now() - timeStart) / 1000;
  });
};

export default timer;
