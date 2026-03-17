import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '@/app/context/AuthContext';
import { supabase } from '@/app/lib/supabase';
import { Card } from '@/app/components/Card';
import { Input } from '@/app/components/Input';
import { Button } from '@/app/components/Button';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
const logo = '/logo.png';

export function AdminLoginPage() {
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [email, setEmail] = useState('');
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

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOtp({
                email: email,
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
                email: email,
                token: otp,
                type: 'email',
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
                    email: email,
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
        setStep('email');
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
                    <h1 className="text-foreground mb-2">UniCouncil Admin</h1>
                    <p className="text-muted-foreground">Secure Election Management</p>
                </div>

                <Card>
                    {step === 'email' ? (
                        <>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Mail className="text-primary" size={24} />
                                </div>
                                <div>
                                    <h2 className="mb-0">Admin Login</h2>
                                    <p className="text-sm text-muted-foreground">We'll send you an OTP via email</p>
                                </div>
                            </div>

                            <form onSubmit={handleSendOTP} className="space-y-4">
                                <Input
                                    label="Email Address"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@unicouncil.edu"
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

                            <div className="mt-6 text-center text-sm">
                                <Link to="/login" className="text-primary hover:underline">
                                    Go to Student Login
                                </Link>
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
                                Change email address
                            </button>

                            <div className="mb-6">
                                <h2 className="mb-2">Enter OTP</h2>
                                <p className="text-sm text-muted-foreground">
                                    We've sent a 6-digit code to<br />
                                    <span className="text-foreground font-medium">{email}</span>
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
