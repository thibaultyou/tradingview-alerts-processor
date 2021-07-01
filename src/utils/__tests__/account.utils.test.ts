import { formatAccount, getAccountId } from '../account.utils';
import { Account } from '../../entities/account.entities';

describe('Account utils', () => {
  describe('getAccountId', () => {
    it('should return stub in uppercase', () => {
      expect(getAccountId({ stub: 'test' })).toEqual('TEST');
    });
  });

  describe('formatAccount', () => {
    it('should return formatted account', () => {
      expect(formatAccount({ stub: 'test' } as Account).stub).toEqual('TEST');
    });
  });
});
