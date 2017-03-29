import { clearStylesCache } from '../lib/rule';
import condition from '../lib/condition';

describe('condition', () => {
  beforeEach(() => {
    clearStylesCache();
  });

  it('condition', () => {
    const conditionFunc = condition(() => {
      return true;
    });

    const raw = conditionFunc`
      Button {
        color: red
      }
    `;

    expect(raw.trim()).toEqual('Button { color: red }');
  });

  it('condition with variable', () => {
    const conditionFunc = condition(() => {
      return true;
    });

    const color = '#ffcc33';
    const raw = conditionFunc`
      color: ${color}
    `;

    expect(raw.trim()).toEqual('color: #ffcc33');
  });

  it('condition with mixins', () => {
    const conditionFunc = condition(() => {
      return true;
    });

    expect(
      () => conditionFunc`
      color: red;
      ${() => {}}
    `
    ).toThrow('Static rule should not contain mixins');
  });

  it('negative condition', () => {
    const conditionFunc = condition(() => {
      return false;
    });

    const color = '#ffcc33';
    const raw = conditionFunc`
      color: ${color}
    `;

    expect(raw).toEqual(null);
  });
});
