import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '@/app/context/AuthContext';
import { supabase } from '@/app/lib/supabase';
import { Card } from '@/app/components/Card';
import { Input } from '@/app/components/Input';
import { Button } from '@/app/components/Button';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Smartphone, ArrowLeft, Loader2 } from 'lucide-react';
const logo = '/logo.png';

export function LoginPage() {
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const formatPhoneNumber = (number: string) => {
    // Assuming Indian numbers by default for this example
    // Supabase requires E.164 format (+[country code][number])
    return number.startsWith('+') ? number : `+91${number}`;
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate mobile number (10 digits if skipping country code)
    if (!/^\d{10}$/.test(mobileNumber) && !/^\+\d{10,14}$/.test(mobileNumber)) {
      setError('Please enter a valid mobile number');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: formatPhoneNumber(mobileNumber),
      });

      if (error) throw error;

      setStep('otp');
      setResendTimer(60);
    } catch (err: any) {
      console.error('Error sending OTP:', err);
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: formatPhoneNumber(mobileNumber),
        token: otp,
        type: 'sms',
      });

      if (error) throw error;

      // AuthContext will automatically redirect upon detecting user session
    } catch (err: any) {
      console.error('Error verifying OTP:', err);
      setError(err.message || 'Invalid OTP. Please try again.');
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer === 0) {
      setError('');
      setIsLoading(true);
      try {
        const { error } = await supabase.auth.signInWithOtp({
          phone: formatPhoneNumber(mobileNumber),
        });

        if (error) throw error;
        setResendTimer(60);
        setOtp('');
      } catch (err: any) {
        setError(err.message || 'Failed to resend OTP.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    setStep('mobile');
    setOtp('');
    setError('');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* University Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-4">
            <ImageWithFallback
              src={logo}
              alt="UniCouncil Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-foreground mb-2">UniCouncil</h1>
          <p className="text-muted-foreground">Student Council Election 2026</p>
        </div>

        <Card>
          {step === 'mobile' ? (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Smartphone className="text-primary" size={24} />
                </div>
                <div>
                  <h2 className="mb-0">Secure Login</h2>
                  <p className="text-sm text-muted-foreground">We'll send you an OTP via SMS</p>
                </div>
              </div>

              <form onSubmit={handleSendOTP} className="space-y-4">
                <Input
                  label="Mobile Number"
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/[^\d+]/g, ''))}
                  placeholder="Enter mobile number"
                  required
                  fullWidth
                  disabled={isLoading}
                />

                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                <Button type="submit" fullWidth disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" /> Sending...
                    </span>
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  New student?{' '}
                  <Link to="/register" className="text-primary hover:underline font-medium">
                    Register here
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={handleBack}
                disabled={isLoading}
                className="flex items-center gap-2 text-primary mb-6 hover:underline disabled:opacity-50"
              >
                <ArrowLeft size={16} />
                Change mobile number
              </button>

              <div className="mb-6">
                <h2 className="mb-2">Enter OTP</h2>
                <p className="text-sm text-muted-foreground">
                  We've sent a 6-digit code to<br />
                  <span className="text-foreground font-medium">{formatPhoneNumber(mobileNumber)}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <Input
                  label="OTP Code"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  required
                  fullWidth
                  disabled={isLoading}
                  className="text-center text-2xl tracking-widest"
                />

                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                <Button type="submit" fullWidth disabled={otp.length !== 6 || isLoading}>
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" /> Verifying...
                    </span>
                  ) : (
                    "Verify OTP"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                {resendTimer > 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Resend OTP in {resendTimer}s
                  </p>
                ) : (
                  <button
                    onClick={handleResendOTP}
                    disabled={isLoading}
                    className="text-sm text-primary hover:underline disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}