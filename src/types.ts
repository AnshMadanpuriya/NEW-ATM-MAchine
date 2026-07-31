export interface Transaction {
  id: string;
  amount: number;
  type: 'Amount withdraw' | 'Amount Deposited';
  date: string;
  balanceAfter: number;
}

export type ScreenState = 
  | 'LOGIN'
  | 'MENU'
  | 'BALANCE'
  | 'WITHDRAW'
  | 'DEPOSIT'
  | 'MINISTATEMENT'
  | 'EXIT';

export interface AlertMessage {
  text: string;
  type: 'info' | 'success' | 'error';
}
