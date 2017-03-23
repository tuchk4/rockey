import StyleSheet from './StyleSheet';

const isBrowser = typeof document !== 'undefined';

const createStyleSheet = type => {
  if (!isBrowser) {
    return {
      type,
      innerHtml: '',
      appendChild: () => {}
    };
  } else {
    const mountNode = document.createElement('style');

    mountNode.type = 'text/css';

    document.head.appendChild(mountNode);
    mountNode.textContent = '';

    return mountNode;
  }
};

const mount = () => {
  return new StyleSheet({
    rules: createStyleSheet('rules'),
    mixins: createStyleSheet('mixins'),
  });
};

export default mount;
