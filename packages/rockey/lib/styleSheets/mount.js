import StyleSheet from './StyleSheet';

const isBrowser = typeof document !== 'undefined';

const createStyleNode = name => {
  if (!isBrowser) {
    return {};
  } else {
    const mountNode = document.createElement('style');

    mountNode.type = 'text/css';

    const link = document.querySelector('link[rel="stylesheet"]');
    if (link) {
      document.head.insertBefore(mountNode, link);
    } else {
      document.head.appendChild(mountNode);
    }

    mountNode.textContent = '';

    return mountNode;
  }
};

const mount = () => {
  return new StyleSheet({
    rules: createStyleNode('rules'),
    mixins: createStyleNode('mixins'),
  });
};

export const mountStyleNode = name => {
  return createStyleNode(name);
};

export default mount;
