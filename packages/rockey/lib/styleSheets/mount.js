import StyleSheet from './StyleSheet';

const isBrowser = typeof document !== 'undefined';

const createStyleSheet = type => {
  if (!isBrowser) {
    // TODO: add support to server rendering
    return {
      children: [],
      type,
      innerHtml: '',
      textContent: '',
      appendChild: node => {},
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
