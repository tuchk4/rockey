const getCss = size => {
  let css = '';

  for (let i = 1; i <= size; i++) {
    css += `
      Button${i} {
        color: red;

        :hover {
          color: yellow;
        }

        Icon: {
          color: green;

          :hover {
            color: purple;

            @media (max-width: 500px) {
              background: black;
            }
          }
        }

        @media (max-width: 500px) {
          color: red;

          :hover {
            color: green;
          }
        }
      }
    `;
  }

  return css;
};

export default getCss;
