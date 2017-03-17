import { getNotYetDefiendComponents } from '../lib/css/getClassName';
import rule from '../lib/rule';
import { clearCachedClassNames } from '../lib/css/getClassName';

describe('notYenDefined', () => {
  beforeEach(() => {
    clearCachedClassNames();
  });

  it('notYenDefined', () => {
    const css = rule`
      Button {
        color: red;

        Icon {
          color: green;
        }
      }
    `;

    css.getClassList();

    expect(getNotYetDefiendComponents()).toEqual(['Icon']);
  });

  it('notYenDefined to comopnentsClassList', () => {
    const css1 = rule`
      Button {
        color: red;

        Icon {
          color: green;
        }
      }
    `;

    css1.getClassList();

    const css2 = rule`
      Icon {
        color: purple;
      }
    `;

    css2.getClassList();

    expect(getNotYetDefiendComponents()).toEqual([]);
  });
});
