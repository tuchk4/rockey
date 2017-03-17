import StyleSheet from './StyleSheet';

const isBrowser = typeof document !== 'undefined';

const createStyleSheet = type => {
  if (!isBrowser) {
    return {
      type,
      innerHtml: '',
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
    main: createStyleSheet('main'),
    mixins: createStyleSheet('mixins'),
  });
};

export default mount;
