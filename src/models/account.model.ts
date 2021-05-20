import { Account } from '../entities/account.entities';
import { getDatabase } from '../db/store.db';

export const addAccount = (account: Account): boolean => {
  const db = getDatabase();
  const { stub } = account;
  try {
    db.getData(`/${stub}`);
  } catch (err) {
    db.push(`/${account.stub}`, account);
    return true;
  }
  console.error(`${stub} account already exists.`);
  return false;
};

export const readAccount = (stub: string): Account | boolean => {
  const db = getDatabase();
  try {
    return db.getData(`/${stub}`);
  } catch (err) {
    console.error(`${stub} account does not exists.`);
  }
  return false;
};

export const removeAccount = (stub: string): boolean => {
  const db = getDatabase();
  try {
    db.getData(`/${stub}`);
    db.delete(`/${stub}`);
    return true;
  } catch (err) {
    console.error(`${stub} account does not exists.`);
  }
  return false;
};
