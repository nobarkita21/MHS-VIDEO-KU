import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Phone, Lock, ChevronRight, LogIn } from 'lucide-react';
import { auth, googleProvider } from '../../lib/firebase';
import { signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [method, setMethod] = useState<'selection' | 'phone'>('selection');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
      });
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setupRecaptcha();
    const appVerifier = (window as any).recaptchaVerifier;
    try {
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(result);
      setStep('otp');
    } catch (error) {
      console.error(error);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await confirmationResult.confirm(otp);
      onClose();
    } catch (error) {
       console.error(error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-brand-primary" />
            
            <button onClick={onClose} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                <LogIn className="w-8 h-8 text-brand-primary" />
              </div>
              <h2 className="text-2xl font-display font-black text-white italic uppercase tracking-tighter">Terminal Entry</h2>
              <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest mt-1">Select Authentication Protocol</p>
            </div>

            {method === 'selection' ? (
              <div className="space-y-4">
                <button 
                  onClick={handleGoogle}
                  className="w-full group relative"
                >
                  <div className="absolute inset-0 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-white/10 transition-all" />
                  <div className="relative p-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                      <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                    </div>
                    <div className="text-left">
                      <p className="text-white font-bold text-sm">Google Account</p>
                      <p className="text-zinc-500 text-[10px] uppercase font-mono">Instant Verification</p>
                    </div>
                    <ChevronRight className="w-4 h-4 ml-auto text-zinc-600 group-hover:text-white transition-colors" />
                  </div>
                </button>

                <button 
                  onClick={() => setMethod('phone')}
                  className="w-full group relative"
                >
                  <div className="absolute inset-0 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-white/10 transition-all" />
                  <div className="relative p-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-brand-primary/20 rounded-xl flex items-center justify-center border border-brand-primary/30">
                      <Phone className="w-5 h-5 text-brand-primary" />
                    </div>
                    <div className="text-left">
                      <p className="text-white font-bold text-sm">Phone Protocol</p>
                      <p className="text-zinc-500 text-[10px] uppercase font-mono">OTP Secure Sign-In</p>
                    </div>
                    <ChevronRight className="w-4 h-4 ml-auto text-zinc-600 group-hover:text-white transition-colors" />
                  </div>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <button onClick={() => setMethod('selection')} className="text-brand-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:underline">
                  <X className="w-3 h-3" /> Cancel Protocol
                </button>

                {step === 'phone' ? (
                  <form onSubmit={handlePhoneSubmit} className="space-y-6">
                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase font-black mb-2 block tracking-widest">Phone Number (Intl)</label>
                      <div className="flex items-center bg-black/50 border border-white/5 rounded-2xl px-4 py-3">
                        <Phone className="w-4 h-4 text-zinc-600 mr-3" />
                        <input 
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="+62 812..." 
                          className="w-full bg-transparent text-white outline-none font-mono"
                          required
                        />
                      </div>
                    </div>
                    <div id="recaptcha-container"></div>
                    <button className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl">
                      Deliver OTP
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleOtpSubmit} className="space-y-6">
                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase font-black mb-2 block tracking-widest">OTP Code</label>
                      <div className="flex items-center bg-black/50 border border-white/5 rounded-2xl px-4 py-3">
                        <Lock className="w-4 h-4 text-zinc-600 mr-3" />
                        <input 
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="6-digit code" 
                          className="w-full bg-transparent text-white outline-none font-mono tracking-[0.5em]"
                          required
                        />
                      </div>
                    </div>
                    <button className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl">
                      Verify Terminal
                    </button>
                  </form>
                )}
              </div>
            )}

            <div className="mt-8 text-center">
              <p className="text-zinc-600 text-[9px] uppercase tracking-widest px-4 italic leading-relaxed">
                By entering the terminal, you agree to our 2026 data governance and cloud security policies.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
