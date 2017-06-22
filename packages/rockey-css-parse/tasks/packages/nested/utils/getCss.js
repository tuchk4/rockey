const getNestedCss = size => {
  let css = `

  `;

  for (let i = 1; i <= size; i++) {
    css += `
    Button${i} {
      background-color: transparent;
      background-color: black;
    }

    Bar${i}, Foo${i} {
      font-size: 10px;
      WarningButton, PrimaryButton, SucceessButton {
        padding: 10px;
        margin: 10px;
        
        Icon {
          padding-right: 15px;
        }
        border: 10px;
        Spinner {
          color: black;
        }
      }
    }
    `;
  }

  return css;
};

export default getNestedCss;
