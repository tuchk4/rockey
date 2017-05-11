export const getNativeCss = size => {
  let css = '';

  for (let i = 1; i <= size; i++) {
    css += `
      @keyframes animation1 {
        0% { color: red; }
        40% { color: #fc3; }
        50% { color: red; }
        60% { color: black; width: 100px; }
        100% { color: red; }
      }

      @media (max-width: 500px) {
        Button${i}:hover {
          font-size: 15px;
        }

        Button${i} {
          color: #222;
        }

        Icon${i} {
          color: #111;
        }

        Icon${i}:hover {
          color: #000;
        }
      }

      @media (max-width: 699px) {
        ~ Spinner {
          color: yellow;
        }
      }

      ~Spinner {
        color: red;
        animation: animation1 1s infinity;
      }

      Button${i}:hover, Button${i}:active, Button${i}:focus {
        color: red;
      }

      @media (max-width: 100px) {
        Button${i}:hover, Button${i}:active, Button${i}:focus {
          color: yellow;
        }
      }

      @keyframes animation2 {
        from { color: red; }
        to { color: #fc3; }
      }

      Icon${i} {
        color: green;
          animation: animation2 1s infinity;
      }

      Icon${i}:hover {
        color: purple;
      }
    `;
  }

  return css;
};

export default getNativeCss;
