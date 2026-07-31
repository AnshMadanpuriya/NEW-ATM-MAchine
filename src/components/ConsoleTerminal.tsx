import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, Play, RotateCcw, Copy, Check } from 'lucide-react';
import { Transaction } from '../types';

interface ConsoleTerminalProps {
  balance: number;
  transactions: Transaction[];
  onWithdraw: (amount: number) => { success: boolean; message: string };
  onDeposit: (amount: number) => { success: boolean; message: string };
  onLogin: (cardNumber: string, pin: string) => boolean;
  onExit: () => void;
  isAuthenticated: boolean;
}

type StepState =
  | 'ASK_CARD'
  | 'ASK_PIN'
  | 'MENU'
  | 'WITHDRAW_AMT'
  | 'DEPOSIT_AMT'
  | 'EXITED';

export const ConsoleTerminal: React.FC<ConsoleTerminalProps> = ({
  balance,
  transactions,
  onWithdraw,
  onDeposit,
  onLogin,
  onExit,
  isAuthenticated,
}) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [currentStep, setCurrentStep] = useState<StepState>('ASK_CARD');
  const [tempCardNo, setTempCardNo] = useState('');
  const [copied, setCopied] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Initialize terminal output
  const initTerminal = () => {
    setCurrentStep('ASK_CARD');
    setTempCardNo('');
    setLogs([
      '$ javac Main.java && java Main',
      'Welcome to ATM Machine',
      'Enter the ATM number :',
    ]);
  };

  useEffect(() => {
    initTerminal();
  }, []);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const printMenu = (currentLogs: string[]) => {
    return [
      ...currentLogs,
      '1. View Details\n 2.Withdraw Money\n 3. Deposit Amount\n 4.view Ministatement\n 5. EXIT',
      'ENTER YOUR CHOICE :',
    ];
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = inputVal.trim();
    if (!val && currentStep !== 'EXITED') return;

    const newLogs = [...logs, `> ${val}`];

    if (currentStep === 'ASK_CARD') {
      setTempCardNo(val);
      setCurrentStep('ASK_PIN');
      setLogs([...newLogs, 'Enter the PIN :']);
      setInputVal('');
      return;
    }

    if (currentStep === 'ASK_PIN') {
      const success = onLogin(tempCardNo, val);
      if (success) {
        let menuLogs = [...newLogs, 'Varified Succesfully'];
        menuLogs = printMenu(menuLogs);
        setLogs(menuLogs);
        setCurrentStep('MENU');
      } else {
        setLogs([...newLogs, 'Incorrect Details', '', '$ Program terminated with exit code 1']);
        setCurrentStep('EXITED');
      }
      setInputVal('');
      return;
    }

    if (currentStep === 'MENU') {
      const choice = parseInt(val, 10);
      if (choice === 1) {
        // View balance
        let updated = [...newLogs, `Available Balance is :${balance}`];
        updated = printMenu(updated);
        setLogs(updated);
      } else if (choice === 2) {
        // Withdraw money prompt
        setLogs([...newLogs, 'Enter the amount to withdraw']);
        setCurrentStep('WITHDRAW_AMT');
      } else if (choice === 3) {
        // Deposit amount prompt
        setLogs([...newLogs, 'Enter amount to deposit :']);
        setCurrentStep('DEPOSIT_AMT');
      } else if (choice === 4) {
        // View Ministatement
        let updated = [...newLogs];
        if (transactions.length === 0) {
          updated.push('(Mini statement is empty)');
        } else {
          transactions.forEach((tx) => {
            updated.push(`${tx.amount}.0${tx.type}`);
          });
        }
        updated = printMenu(updated);
        setLogs(updated);
      } else if (choice === 5) {
        // EXIT
        onExit();
        setLogs([
          ...newLogs,
          'Collect your ATM Card\n Thankyou for choosing ATM machine',
          '',
          '$ Program terminated successfully (exit status 0)',
        ]);
        setCurrentStep('EXITED');
      } else {
        let updated = [...newLogs, 'Please Enter the correct choice'];
        updated = printMenu(updated);
        setLogs(updated);
      }
      setInputVal('');
      return;
    }

    if (currentStep === 'WITHDRAW_AMT') {
      const amt = parseFloat(val);
      if (isNaN(amt)) {
        let updated = [...newLogs, 'Invalid amount format'];
        updated = printMenu(updated);
        setLogs(updated);
        setCurrentStep('MENU');
        setInputVal('');
        return;
      }

      if (amt < 500) {
        let updated = [...newLogs, 'Minimum Amount 500 to be withdraw'];
        updated = printMenu(updated);
        setLogs(updated);
      } else {
        if (amt <= balance) {
          const res = onWithdraw(amt);
          let updated = [
            ...newLogs,
            `Collect the cash${amt}`,
            `Available Balance is :${balance - amt}`,
          ];
          updated = printMenu(updated);
          setLogs(updated);
        } else {
          let updated = [...newLogs, 'Insufficient balance'];
          updated = printMenu(updated);
          setLogs(updated);
        }
      }

      setCurrentStep('MENU');
      setInputVal('');
      return;
    }

    if (currentStep === 'DEPOSIT_AMT') {
      const amt = parseFloat(val);
      if (isNaN(amt) || amt <= 0) {
        let updated = [...newLogs, 'Invalid deposit amount'];
        updated = printMenu(updated);
        setLogs(updated);
        setCurrentStep('MENU');
        setInputVal('');
        return;
      }

      onDeposit(amt);
      let updated = [
        ...newLogs,
        `${amt}Deposited Succesfully`,
        `Available Balance is :${balance + amt}`,
      ];
      updated = printMenu(updated);
      setLogs(updated);
      setCurrentStep('MENU');
      setInputVal('');
      return;
    }
  };

  const handleCopyLogs = () => {
    navigator.clipboard.writeText(logs.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4">
      <div className="bg-slate-950 border border-slate-800 rounded-xl shadow-2xl overflow-hidden font-mono">
        {/* Terminal Titlebar */}
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
            <span className="text-xs text-slate-400 font-semibold ml-2 flex items-center gap-1.5">
              <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
              bash — java Main (ATM Console Replica)
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyLogs}
              className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800 rounded transition text-xs flex items-center gap-1"
              title="Copy output"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={initTerminal}
              className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800 rounded transition text-xs flex items-center gap-1"
              title="Restart Java CLI"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Rerun</span>
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="p-4 sm:p-6 min-h-[420px] max-h-[550px] overflow-y-auto text-xs sm:text-sm text-slate-200 space-y-2 leading-relaxed">
          {logs.map((line, idx) => (
            <div
              key={idx}
              className={`whitespace-pre-wrap ${
                line.startsWith('$')
                  ? 'text-emerald-400 font-bold'
                  : line.startsWith('>')
                  ? 'text-cyan-300 font-bold'
                  : line.includes('Varified Succesfully') || line.includes('Deposited')
                  ? 'text-emerald-300'
                  : line.includes('Incorrect') || line.includes('Insufficient') || line.includes('Minimum')
                  ? 'text-rose-400 font-semibold'
                  : 'text-slate-300'
              }`}
            >
              {line}
            </div>
          ))}

          {currentStep !== 'EXITED' && (
            <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2 pt-2">
              <span className="text-emerald-400 font-bold">$</span>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                autoFocus
                placeholder="Type command or choice (e.g. 12345, 11111, 1, 2, 3...)"
                className="flex-1 bg-transparent border-none outline-none text-cyan-300 font-bold caret-cyan-400"
              />
              <button type="submit" className="hidden">
                Submit
              </button>
            </form>
          )}

          {currentStep === 'EXITED' && (
            <div className="pt-4 border-t border-slate-800/80 text-center">
              <button
                onClick={initTerminal}
                className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-mono font-bold transition inline-flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" /> Restart Console Application
              </button>
            </div>
          )}
          <div ref={terminalEndRef} />
        </div>
      </div>
    </div>
  );
};
