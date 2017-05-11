import isReactProp from 'is-react-prop';

const filterProps = props =>
  Object.keys(props)
    .filter(prop => isReactProp(prop))
    .reduce((filtered, prop) => {
      filtered[prop] = props[prop];

      return filtered;
    }, {});

export default filterProps;
