import React, { useState } from 'react';
import { AtmHeader } from './components/AtmHeader';
import { AtmKiosk } from './components/AtmKiosk';
import { ConsoleTerminal } from './components/ConsoleTerminal';
import { Transaction, ScreenState } from './types';

export default function App() {
  const [viewMode, setViewMode] = useState<'kiosk' | 'terminal'>('kiosk');
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [screenState, setScreenState] = useState<ScreenState>('LOGIN');

  // Login handler
  const handleLogin = (cardNumber: string, pin: string): boolean => {
    const validCard = '12345';
    const validPin = '11111';
    if (cardNumber.trim() === validCard && pin.trim() === validPin) {
      setIsAuthenticated(true);
      return true;
    }
    setIsAuthenticated(false);
    return false;
  };

  // Withdraw handler
  const handleWithdraw = (amount: number) => {
    if (amount < 500) {
      return { success: false, message: 'Minimum Amount 500 to be withdraw' };
    }
    if (amount > balance) {
      return { success: false, message: 'Insufficient balance' };
    }

    const newBalance = balance - amount;
    setBalance(newBalance);

    const newTx: Transaction = {
      id: Math.random().toString(36).substring(2, 9),
      amount,
      type: 'Amount withdraw',
      date: new Date().toLocaleTimeString(),
      balanceAfter: newBalance,
    };

    setTransactions((prev) => [newTx, ...prev]);
    return { success: true, message: `Collect the cash ${amount}` };
  };

  // Deposit handler
  const handleDeposit = (amount: number) => {
    const newBalance = balance + amount;
    setBalance(newBalance);

    const newTx: Transaction = {
      id: Math.random().toString(36).substring(2, 9),
      amount,
      type: 'Amount Deposited',
      date: new Date().toLocaleTimeString(),
      balanceAfter: newBalance,
    };

    setTransactions((prev) => [newTx, ...prev]);
    return {
      success: true,
      message: `${amount} Deposited Succesfully`,
    };
  };

  // Exit handler
  const handleExit = () => {
    setIsAuthenticated(false);
  };

  // Reset all state
  const handleReset = () => {
    setBalance(0);
    setTransactions([]);
    setIsAuthenticated(false);
    setScreenState('LOGIN');
  };

  const handleQuickFill = () => {
    setIsAuthenticated(true);
    setScreenState('MENU');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      <AtmHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        onQuickFill={handleQuickFill}
        onReset={handleReset}
        isAuthenticated={isAuthenticated}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
        {viewMode === 'kiosk' ? (
          <AtmKiosk
            balance={balance}
            transactions={transactions}
            onWithdraw={handleWithdraw}
            onDeposit={handleDeposit}
            onLogin={handleLogin}
            onExit={handleExit}
            isAuthenticated={isAuthenticated}
            screenState={screenState}
            setScreenState={setScreenState}
            quickFill={false}
          />
        ) : (
          <ConsoleTerminal
            balance={balance}
            transactions={transactions}
            onWithdraw={handleWithdraw}
            onDeposit={handleDeposit}
            onLogin={handleLogin}
            onExit={handleExit}
            isAuthenticated={isAuthenticated}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 px-4 text-center text-xs text-slate-500">
        <p>
          ATM Machine System &bull; Originally authored in Java by AnshMadanpuriya &bull; Migrated for AI Studio Node.js Web Runtime
        </p>
      </footer>
    </div>
  );
}
