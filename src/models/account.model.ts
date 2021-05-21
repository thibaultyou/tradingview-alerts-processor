import { Account } from '../entities/account.entities';
import { getDatabase } from '../db/store.db';

export const addAccount = (account: Account): boolean => {
  const { stub, subaccount } = account;
  const id = subaccount ? subaccount : stub;
  const db = getDatabase();
  try {
    db.getData(`/${id}`);
  } catch (err) {
    db.push(`/${id}`, account);
    return true;
  }
  console.error(`"${id}" ${subaccount ? 'sub' : ''}account already exists.`);
  return false;
};

export const readAccount = (stub: string): Account => {
  const db = getDatabase();
  try {
    return db.getData(`/${stub}`);
  } catch (err) {
    console.error(`${stub} account does not exists.`);
  }
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
