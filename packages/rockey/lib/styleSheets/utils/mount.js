const mount = name => {
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
};

export default mount;
