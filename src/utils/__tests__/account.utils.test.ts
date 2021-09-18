import {
  getAccountId,
  formatAccount,
  hideAccountSensitiveData
} from '../account.utils';
import { sampleAccount } from '../../tests/fixtures/common.fixtures';

describe('Account utils', () => {
  describe('getAccountId', () => {
    it('should return uppercase stub', () => {
      expect(getAccountId(sampleAccount)).toBe(
        sampleAccount.stub.toUpperCase()
      );
    });
  });

  describe('formatAccount', () => {
    it('should return formatted account', () => {
      expect(formatAccount(sampleAccount)).toStrictEqual({
        apiKey: sampleAccount.apiKey,
        exchange: sampleAccount.exchange,
        secret: sampleAccount.secret,
        stub: sampleAccount.stub.toUpperCase()
      });
    });
  });

  describe('hideAccountSensitiveData', () => {
    it('should return account without sensitive data', () => {
      const tempAccount = sampleAccount;
      tempAccount.passphrase = 'aPassphrase';
      const hidden = hideAccountSensitiveData(tempAccount);
      expect(hidden.stub).toBeDefined();
      expect(hidden.secret).toBeUndefined();
      expect(hidden.passphrase).toBeUndefined();
    });
  });
});
