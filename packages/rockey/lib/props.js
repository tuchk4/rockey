import when from './when';

const props = name => {
  return when(name, () => true);
};

export default props;
