import {
  getAccountId,
  formatAccount,
  hideAccountSensitiveData
} from './account.utils';
import { sampleAccount } from '../tests/fixtures/common.fixtures';

describe('getAccountId', () => {
  it('gets capitalized acccount id', () => {
    expect(getAccountId(sampleAccount)).toBe(sampleAccount.stub.toUpperCase());
  });
});

describe('formatAccount', () => {
  it('formats account', () => {
    expect(formatAccount(sampleAccount)).toStrictEqual({
      apiKey: sampleAccount.apiKey,
      exchange: sampleAccount.exchange,
      secret: sampleAccount.secret,
      stub: sampleAccount.stub.toUpperCase()
    });
  });
});

describe('hideAccountSensitiveDate', () => {
  it('removes secret and passphrase', () => {
    const tempAccount = sampleAccount;
    tempAccount.passphrase = 'aPassphrase';
    const hidden = hideAccountSensitiveData(tempAccount);
    expect(hidden.stub).toBeDefined();
    expect(hidden.secret).toBeUndefined();
    expect(hidden.passphrase).toBeUndefined();
  });
});
