import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  DollarSign,
  Receipt,
  LogOut,
  Wallet,
  Shield,
  CornerDownLeft,
  Delete,
} from 'lucide-react';
import { ScreenState, Transaction } from '../types';

interface AtmKioskProps {
  balance: number;
  transactions: Transaction[];
  onWithdraw: (amount: number) => { success: boolean; message: string };
  onDeposit: (amount: number) => { success: boolean; message: string };
  onLogin: (cardNumber: string, pin: string) => boolean;
  onExit: () => void;
  isAuthenticated: boolean;
  screenState: ScreenState;
  setScreenState: (screen: ScreenState) => void;
  quickFill: boolean;
}

export const AtmKiosk: React.FC<AtmKioskProps> = ({
  balance,
  transactions,
  onWithdraw,
  onDeposit,
  onLogin,
  onExit,
  isAuthenticated,
  screenState,
  setScreenState,
}) => {
  // Login fields
  const [cardNumber, setCardNumber] = useState('');
  const [pin, setPin] = useState('');
  const [activeInput, setActiveInput] = useState<'card' | 'pin'>('card');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Operation fields
  const [withdrawInput, setWithdrawInput] = useState('');
  const [depositInput, setDepositInput] = useState('');
  const [operationMessage, setOperationMessage] = useState<{
    text: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  // Cash dispense animation
  const [isDispensingCash, setIsDispensingCash] = useState(false);
  const [dispensedAmount, setDispensedAmount] = useState<number | null>(null);

  // Handle keypad press
  const handleKeyPress = (val: string) => {
    if (screenState === 'LOGIN') {
      if (activeInput === 'card') {
        if (cardNumber.length < 10) setCardNumber((prev) => prev + val);
      } else {
        if (pin.length < 6) setPin((prev) => prev + val);
      }
    } else if (screenState === 'WITHDRAW') {
      setWithdrawInput((prev) => prev + val);
    } else if (screenState === 'DEPOSIT') {
      setDepositInput((prev) => prev + val);
    }
  };

  const handleClear = () => {
    if (screenState === 'LOGIN') {
      if (activeInput === 'card') setCardNumber('');
      else setPin('');
    } else if (screenState === 'WITHDRAW') {
      setWithdrawInput('');
    } else if (screenState === 'DEPOSIT') {
      setDepositInput('');
    }
    setOperationMessage(null);
  };

  const handleBackspace = () => {
    if (screenState === 'LOGIN') {
      if (activeInput === 'card') setCardNumber((prev) => prev.slice(0, -1));
      else setPin((prev) => prev.slice(0, -1));
    } else if (screenState === 'WITHDRAW') {
      setWithdrawInput((prev) => prev.slice(0, -1));
    } else if (screenState === 'DEPOSIT') {
      setDepositInput((prev) => prev.slice(0, -1));
    }
  };

  const handleLoginSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError(null);
    const success = onLogin(cardNumber, pin);
    if (success) {
      setScreenState('MENU');
      setCardNumber('');
      setPin('');
    } else {
      setLoginError('Incorrect Details');
    }
  };

  const handleWithdrawSubmit = (amtVal?: number) => {
    const amt = amtVal ?? parseFloat(withdrawInput);
    if (isNaN(amt) || amt <= 0) {
      setOperationMessage({ text: 'Please enter a valid amount', type: 'error' });
      return;
    }

    const res = onWithdraw(amt);
    if (res.success) {
      setOperationMessage({ text: res.message, type: 'success' });
      setIsDispensingCash(true);
      setDispensedAmount(amt);
      setTimeout(() => setIsDispensingCash(false), 3000);
      setWithdrawInput('');
    } else {
      setOperationMessage({ text: res.message, type: 'error' });
    }
  };

  const handleDepositSubmit = (amtVal?: number) => {
    const amt = amtVal ?? parseFloat(depositInput);
    if (isNaN(amt) || amt <= 0) {
      setOperationMessage({ text: 'Please enter a valid amount', type: 'error' });
      return;
    }

    const res = onDeposit(amt);
    setOperationMessage({ text: res.message, type: 'success' });
    setDepositInput('');
  };

  const handleQuickFillAuth = () => {
    setCardNumber('12345');
    setPin('11111');
    setLoginError(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4">
      {/* ATM Main Enclosure / Cabinet */}
      <div className="bg-slate-900 border-2 border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-blue-950/40 relative overflow-hidden">
        {/* Top Metallic Header Panel */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" />
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-slate-400">
                SECURE BANK ATM TERMINAL
              </span>
              <h2 className="text-sm font-semibold text-slate-200">
                SYSTEM ID: #ATM-12345-JAVA
              </h2>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-full border border-slate-800">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>Encrypted Session</span>
          </div>
        </div>

        {/* Two Column ATM Layout: Display Screen + Card Slot & Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ATM Screen Container (Col 1-8) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Screen Bezel */}
            <div className="bg-slate-950 p-4 sm:p-6 rounded-xl border-4 border-slate-800 shadow-inner min-h-[420px] flex flex-col justify-between relative overflow-hidden">
              {/* Screen Ambient Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none" />

              {/* Screen Header */}
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400/80 border-b border-cyan-900/40 pb-2 mb-4 relative z-10">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  ATM SYSTEM ONLINE
                </span>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>

              {/* Screen Content Views */}
              <div className="flex-1 flex flex-col justify-center relative z-10">
                <AnimatePresence mode="wait">
                  {/* 1. LOGIN SCREEN */}
                  {screenState === 'LOGIN' && (
                    <motion.div
                      key="login"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <div className="text-center space-y-1">
                        <h3 className="text-xl font-bold text-cyan-300 tracking-wide uppercase">
                          Welcome to ATM Machine
                        </h3>
                        <p className="text-xs text-slate-400">
                          Please enter your ATM Number and PIN to proceed
                        </p>
                      </div>

                      <form onSubmit={handleLoginSubmit} className="space-y-4 max-w-sm mx-auto">
                        <div
                          onClick={() => setActiveInput('card')}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            activeInput === 'card'
                              ? 'bg-cyan-950/40 border-cyan-500/60 shadow-lg shadow-cyan-950/50'
                              : 'bg-slate-900/60 border-slate-800'
                          }`}
                        >
                          <label className="block text-xs text-cyan-400/80 font-mono mb-1">
                            Enter the ATM number :
                          </label>
                          <input
                            type="text"
                            readOnly
                            value={cardNumber}
                            placeholder="e.g. 12345"
                            className="w-full bg-transparent font-mono text-lg font-bold text-white outline-none tracking-widest placeholder:text-slate-600"
                          />
                        </div>

                        <div
                          onClick={() => setActiveInput('pin')}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            activeInput === 'pin'
                              ? 'bg-cyan-950/40 border-cyan-500/60 shadow-lg shadow-cyan-950/50'
                              : 'bg-slate-900/60 border-slate-800'
                          }`}
                        >
                          <label className="block text-xs text-cyan-400/80 font-mono mb-1">
                            Enter the PIN :
                          </label>
                          <input
                            type="password"
                            readOnly
                            value={pin}
                            placeholder="e.g. 11111"
                            className="w-full bg-transparent font-mono text-lg font-bold text-white outline-none tracking-widest placeholder:text-slate-600"
                          />
                        </div>

                        {loginError && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-3 bg-rose-950/80 border border-rose-500/40 rounded-lg text-rose-300 text-xs font-mono text-center flex items-center justify-center gap-2"
                          >
                            <AlertTriangle className="w-4 h-4 text-rose-400" />
                            <span>{loginError}</span>
                          </motion.div>
                        )}

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleQuickFillAuth}
                            className="flex-1 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 rounded-lg border border-slate-700 transition"
                          >
                            Fill Credentials (12345 / 11111)
                          </button>
                          <button
                            type="submit"
                            className="py-2.5 px-6 bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white rounded-lg shadow-md shadow-cyan-950/50 transition uppercase tracking-wider"
                          >
                            Verify & Enter
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {/* 2. MAIN MENU SCREEN */}
                  {screenState === 'MENU' && (
                    <motion.div
                      key="menu"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="space-y-4"
                    >
                      <div className="text-center border-b border-cyan-900/40 pb-3">
                        <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
                          ✓ Verified Successfully
                        </span>
                        <h3 className="text-lg font-bold text-white">SELECT OPTION</h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
                        <button
                          onClick={() => {
                            setOperationMessage(null);
                            setScreenState('BALANCE');
                          }}
                          className="p-4 bg-slate-900/90 hover:bg-cyan-950/60 border border-cyan-800/50 hover:border-cyan-500 rounded-xl text-left transition group flex items-start space-x-3"
                        >
                          <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg group-hover:scale-110 transition-transform">
                            <Wallet className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-xs font-mono text-cyan-400 font-bold block">
                              1. VIEW DETAILS
                            </span>
                            <span className="text-xs text-slate-300">Check balance</span>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setOperationMessage(null);
                            setScreenState('WITHDRAW');
                          }}
                          className="p-4 bg-slate-900/90 hover:bg-cyan-950/60 border border-cyan-800/50 hover:border-cyan-500 rounded-xl text-left transition group flex items-start space-x-3"
                        >
                          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg group-hover:scale-110 transition-transform">
                            <DollarSign className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-xs font-mono text-amber-400 font-bold block">
                              2. WITHDRAW MONEY
                            </span>
                            <span className="text-xs text-slate-300">Minimum $500</span>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setOperationMessage(null);
                            setScreenState('DEPOSIT');
                          }}
                          className="p-4 bg-slate-900/90 hover:bg-cyan-950/60 border border-cyan-800/50 hover:border-cyan-500 rounded-xl text-left transition group flex items-start space-x-3"
                        >
                          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg group-hover:scale-110 transition-transform">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-xs font-mono text-emerald-400 font-bold block">
                              3. DEPOSIT AMOUNT
                            </span>
                            <span className="text-xs text-slate-300">Add funds</span>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setOperationMessage(null);
                            setScreenState('MINISTATEMENT');
                          }}
                          className="p-4 bg-slate-900/90 hover:bg-cyan-950/60 border border-cyan-800/50 hover:border-cyan-500 rounded-xl text-left transition group flex items-start space-x-3"
                        >
                          <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg group-hover:scale-110 transition-transform">
                            <Receipt className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-xs font-mono text-purple-400 font-bold block">
                              4. VIEW MINISTATEMENT
                            </span>
                            <span className="text-xs text-slate-300">Transaction history</span>
                          </div>
                        </button>
                      </div>

                      <div className="pt-2 text-center">
                        <button
                          onClick={() => {
                            onExit();
                            setScreenState('EXIT');
                          }}
                          className="py-2.5 px-6 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/50 hover:border-rose-600 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 mx-auto"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>5. EXIT (COLLECT CARD)</span>
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* 3. BALANCE VIEW SCREEN */}
                  {screenState === 'BALANCE' && (
                    <motion.div
                      key="balance"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6 text-center max-w-md mx-auto"
                    >
                      <div className="p-4 bg-slate-900/80 border border-cyan-800/50 rounded-2xl shadow-inner space-y-3">
                        <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">
                          ACCOUNT INQUIRY
                        </span>
                        <p className="text-slate-400 text-sm">Available Balance is :</p>
                        <div className="text-4xl font-extrabold font-mono text-emerald-400 tracking-tight">
                          ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                      </div>

                      <button
                        onClick={() => setScreenState('MENU')}
                        className="py-2.5 px-6 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-mono font-bold border border-slate-700 inline-flex items-center gap-2 transition"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Main Menu</span>
                      </button>
                    </motion.div>
                  )}

                  {/* 4. WITHDRAW SCREEN */}
                  {screenState === 'WITHDRAW' && (
                    <motion.div
                      key="withdraw"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4 max-w-md mx-auto"
                    >
                      <div className="text-center">
                        <h4 className="text-lg font-bold text-amber-300">Withdraw Money</h4>
                        <p className="text-xs text-slate-400 font-mono">
                          Minimum Amount 500 to be withdraw
                        </p>
                      </div>

                      <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
                        <label className="block text-xs font-mono text-cyan-400">
                          Enter the amount to withdraw:
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 font-mono text-lg text-slate-500">
                            $
                          </span>
                          <input
                            type="number"
                            value={withdrawInput}
                            onChange={(e) => setWithdrawInput(e.target.value)}
                            placeholder="500"
                            className="w-full bg-slate-950 pl-8 pr-4 py-2 font-mono text-xl font-bold text-amber-300 border border-slate-700 rounded-lg outline-none focus:border-amber-500"
                          />
                        </div>

                        {/* Quick amount chips */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          {[500, 1000, 2000, 5000].map((amt) => (
                            <button
                              key={amt}
                              onClick={() => {
                                setWithdrawInput(amt.toString());
                                handleWithdrawSubmit(amt);
                              }}
                              className="px-3 py-1 bg-slate-800 hover:bg-amber-950/50 hover:border-amber-500/50 border border-slate-700 text-amber-300 rounded-md text-xs font-mono transition"
                            >
                              +${amt}
                            </button>
                          ))}
                        </div>
                      </div>

                      {operationMessage && (
                        <div
                          className={`p-3 rounded-lg text-xs font-mono text-center border ${
                            operationMessage.type === 'success'
                              ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
                              : 'bg-rose-950/70 border-rose-500/50 text-rose-300'
                          }`}
                        >
                          {operationMessage.text}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setOperationMessage(null);
                            setScreenState('MENU');
                          }}
                          className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-semibold rounded-lg border border-slate-700"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleWithdrawSubmit()}
                          className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-mono font-bold rounded-lg shadow-md uppercase tracking-wider"
                        >
                          Withdraw
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* 5. DEPOSIT SCREEN */}
                  {screenState === 'DEPOSIT' && (
                    <motion.div
                      key="deposit"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4 max-w-md mx-auto"
                    >
                      <div className="text-center">
                        <h4 className="text-lg font-bold text-emerald-300">Deposit Amount</h4>
                        <p className="text-xs text-slate-400 font-mono">
                          Insert or enter cash amount to deposit
                        </p>
                      </div>

                      <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
                        <label className="block text-xs font-mono text-cyan-400">
                          Enter amount to deposit :
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 font-mono text-lg text-slate-500">
                            $
                          </span>
                          <input
                            type="number"
                            value={depositInput}
                            onChange={(e) => setDepositInput(e.target.value)}
                            placeholder="e.g. 5000"
                            className="w-full bg-slate-950 pl-8 pr-4 py-2 font-mono text-xl font-bold text-emerald-300 border border-slate-700 rounded-lg outline-none focus:border-emerald-500"
                          />
                        </div>

                        {/* Quick deposit chips */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          {[500, 1000, 2000, 5000].map((amt) => (
                            <button
                              key={amt}
                              onClick={() => {
                                setDepositInput(amt.toString());
                                handleDepositSubmit(amt);
                              }}
                              className="px-3 py-1 bg-slate-800 hover:bg-emerald-950/50 hover:border-emerald-500/50 border border-slate-700 text-emerald-300 rounded-md text-xs font-mono transition"
                            >
                              +${amt}
                            </button>
                          ))}
                        </div>
                      </div>

                      {operationMessage && (
                        <div
                          className={`p-3 rounded-lg text-xs font-mono text-center border ${
                            operationMessage.type === 'success'
                              ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
                              : 'bg-rose-950/70 border-rose-500/50 text-rose-300'
                          }`}
                        >
                          {operationMessage.text}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setOperationMessage(null);
                            setScreenState('MENU');
                          }}
                          className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-semibold rounded-lg border border-slate-700"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDepositSubmit()}
                          className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold rounded-lg shadow-md uppercase tracking-wider"
                        >
                          Deposit
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* 6. MINISTATEMENT SCREEN */}
                  {screenState === 'MINISTATEMENT' && (
                    <motion.div
                      key="ministatement"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-cyan-900/40 pb-2">
                        <h4 className="text-sm font-bold font-mono text-purple-300 flex items-center gap-2">
                          <Receipt className="w-4 h-4" />
                          MINI STATEMENT
                        </h4>
                        <span className="text-xs font-mono text-slate-400">
                          {transactions.length} record(s)
                        </span>
                      </div>

                      <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-3 max-h-[220px] overflow-y-auto space-y-2 font-mono text-xs">
                        {transactions.length === 0 ? (
                          <p className="text-center py-6 text-slate-500">
                            No transactions recorded yet.
                          </p>
                        ) : (
                          transactions.map((tx) => (
                            <div
                              key={tx.id}
                              className="flex items-center justify-between p-2.5 bg-slate-950 rounded border border-slate-850 hover:border-slate-700 transition"
                            >
                              <div className="space-y-0.5">
                                <span
                                  className={`font-semibold block ${
                                    tx.type === 'Amount Deposited'
                                      ? 'text-emerald-400'
                                      : 'text-amber-400'
                                  }`}
                                >
                                  {tx.amount}.0 {tx.type}
                                </span>
                                <span className="text-[10px] text-slate-500">{tx.date}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-slate-300 font-bold block">
                                  ${tx.amount.toFixed(2)}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  Bal: ${tx.balanceAfter.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="text-center pt-2">
                        <button
                          onClick={() => setScreenState('MENU')}
                          className="py-2.5 px-6 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-mono font-bold border border-slate-700 inline-flex items-center gap-2 transition"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Back to Menu</span>
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* 7. EXIT SCREEN */}
                  {screenState === 'EXIT' && (
                    <motion.div
                      key="exit"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="space-y-6 text-center py-6"
                    >
                      <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                        <CreditCard className="w-8 h-8 animate-bounce" />
                      </div>

                      <div className="space-y-2 font-mono">
                        <h4 className="text-lg font-bold text-amber-300">
                          Collect your ATM Card
                        </h4>
                        <p className="text-sm text-cyan-300 font-semibold">
                          Thankyou for choosing ATM machine
                        </p>
                      </div>

                      <div className="pt-4">
                        <button
                          onClick={() => setScreenState('LOGIN')}
                          className="py-2.5 px-6 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold rounded-xl shadow-lg transition uppercase tracking-wider"
                        >
                          Insert Card Again
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Screen Footer Status Line */}
              <div className="mt-4 pt-2 border-t border-cyan-900/30 flex justify-between items-center text-[10px] font-mono text-slate-500 relative z-10">
                <span>ATM VER 1.0 (JAVA REPLICA)</span>
                <span>STATUS: OPERATIONAL</span>
              </div>
            </div>

            {/* Cash Dispenser Slot & Cash Ejection Animation */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <DollarSign className="w-3 h-3 text-emerald-400" /> CASH DISPENSER SLOT
              </span>
              <div className="w-full max-w-xs h-3 bg-slate-900 border border-slate-700 rounded-full relative flex items-center justify-center">
                <div className="w-3/4 h-1 bg-emerald-500/30 rounded-full"></div>
              </div>

              {isDispensingCash && (
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 15, opacity: 1 }}
                  exit={{ y: 30, opacity: 0 }}
                  className="mt-3 p-3 bg-emerald-900/90 border-2 border-emerald-400 rounded-lg shadow-xl shadow-emerald-950 text-emerald-100 font-mono font-bold text-sm flex items-center gap-2"
                >
                  <DollarSign className="w-5 h-5 text-emerald-300" />
                  <span>COLLECT CASH: ${dispensedAmount?.toFixed(2)}</span>
                </motion.div>
              )}
            </div>
          </div>

          {/* Keypad & Card Slot Side Panel (Col 9-12) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Physical Card Reader Slot */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-blue-400" /> CARD SLOT
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    isAuthenticated
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isAuthenticated ? 'CARD INSERTED' : 'READY'}
                </span>
              </div>

              <div className="h-4 bg-slate-900 border border-slate-700 rounded-md relative flex items-center justify-center overflow-hidden">
                <motion.div
                  animate={{
                    x: isAuthenticated ? [0, 10, 0] : 0,
                  }}
                  transition={{ repeat: isAuthenticated ? Infinity : 0, duration: 2 }}
                  className={`h-1.5 w-16 rounded-full ${
                    isAuthenticated ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-slate-700'
                  }`}
                />
              </div>
            </div>

            {/* Physical Metallic Keypad */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4 shadow-inner">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  PIN PAD
                </span>
                <span className="text-[10px] text-slate-500 font-mono">ENCRYPTED</span>
              </div>

              {/* Keypad Grid 3x4 */}
              <div className="grid grid-cols-3 gap-2.5">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleKeyPress(num)}
                    className="p-3 bg-gradient-to-b from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 border border-slate-700 active:scale-95 text-slate-100 font-mono text-lg font-bold rounded-lg shadow-md transition text-center"
                  >
                    {num}
                  </button>
                ))}

                {/* Bottom row: Clear, 0, Backspace */}
                <button
                  onClick={handleClear}
                  className="p-3 bg-gradient-to-b from-amber-900/40 to-amber-950/80 hover:from-amber-800/60 hover:to-amber-900/80 border border-amber-800/60 active:scale-95 text-amber-300 font-mono text-xs font-bold rounded-lg transition flex items-center justify-center"
                  title="Clear Input"
                >
                  CLEAR
                </button>

                <button
                  onClick={() => handleKeyPress('0')}
                  className="p-3 bg-gradient-to-b from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 border border-slate-700 active:scale-95 text-slate-100 font-mono text-lg font-bold rounded-lg shadow-md transition text-center"
                >
                  0
                </button>

                <button
                  onClick={handleBackspace}
                  className="p-3 bg-gradient-to-b from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 border border-slate-700 active:scale-95 text-slate-300 font-mono text-xs font-bold rounded-lg transition flex items-center justify-center"
                  title="Backspace"
                >
                  <Delete className="w-4 h-4" />
                </button>
              </div>

              {/* Action Buttons: Cancel, Enter */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    if (screenState !== 'LOGIN') {
                      onExit();
                      setScreenState('EXIT');
                    } else {
                      handleClear();
                    }
                  }}
                  className="py-2.5 px-3 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/60 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 uppercase"
                >
                  CANCEL
                </button>

                <button
                  onClick={() => {
                    if (screenState === 'LOGIN') {
                      handleLoginSubmit();
                    } else if (screenState === 'WITHDRAW') {
                      handleWithdrawSubmit();
                    } else if (screenState === 'DEPOSIT') {
                      handleDepositSubmit();
                    }
                  }}
                  className="py-2.5 px-3 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/60 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 uppercase shadow-sm"
                >
                  ENTER <CornerDownLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
