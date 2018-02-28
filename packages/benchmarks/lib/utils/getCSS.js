export function getCSS(size) {
  let css = '';

  for (let i = 1; i <= size; i++) {
    css += `
      .foo${i}, .bar${i} .baz${i} {
        color:red;
        background: yellow;
      }
    `;
  }

  return css;
}

export function getNativeAsArrayCSS(size) {
  let css = [];

  for (let i = 1; i <= size; i++) {
    css.push(`
        .foo${i}, .bar${i} .baz${i} {
          color: red;
          background: yellow;
        }
      `);
  }

  return css;
}

export function getNestedCSS(size) {
  let css = '';

  for (let i = 1; i <= size; i++) {
    css += `
    .bar${i} {
      color: red;
    
      & :hover {
        color: blue;
      }
      
      display: flex;
    
      & :active {
        color: orange;
    
      }
    
      & :visited {
        color: orange;
      }
    
      width: full;
    }
    `;
  }

  return css;
}
