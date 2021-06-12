import { removeAccount } from '../services/account.service';
import { sampleAccount, sampleSubaccount } from './tests.fixtures';

export const clearTestingDatabase = (): void => {
  try {
    removeAccount(sampleAccount.stub);
  } catch (err) {
    // ignore
  }
  try {
    removeAccount(sampleSubaccount.stub);
  } catch (err) {
    // ignore
  }
};
