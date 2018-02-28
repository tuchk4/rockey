export const ALPHABETICAL = char => {
  const code = char.charCodeAt(0);
  return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
};

ALPHABETICAL.toString = () => 'ALPHABETICAL';
