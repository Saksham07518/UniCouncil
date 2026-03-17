import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '@/app/context/AuthContext';
import { supabase } from '@/app/lib/supabase';
import { Card } from '@/app/components/Card';
import { Input } from '@/app/components/Input';
import { Button } from '@/app/components/Button';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { UserPlus, Loader2, CheckCircle2 } from 'lucide-react';
const logo = '/logo.png';

export function RegisterPage() {
    const [name, setName] = useState('');
    const [rollNumber, setRollNumber] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();

    // Redirect if already logged in
    useEffect(() => {
        if (user && !authLoading) {
            navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
        }
    }, [user, authLoading, navigate]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate fields
        if (!name.trim()) {
            setError('Please enter your full name');
            return;
        }
        if (!rollNumber.trim()) {
            setError('Please enter your roll number');
            return;
        }
        if (!/^\d{10}$/.test(mobileNumber)) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }

        setIsLoading(true);
        try {
            // LoginPage signs in users with '+' format (+91...), so we MUST register them 
            // with the EXACT same format so the trigger can match them up later.
            const phone = `+91${mobileNumber}`;

            // Check if phone is already registered
            const { data: existingPhone } = await supabase
                .from('registered_students')
                .select('id')
                .eq('phone', phone)
                .maybeSingle();

            if (existingPhone) {
                setError('This phone number is already registered. Please login instead.');
                setIsLoading(false);
                return;
            }

            // Check if roll number is already taken
            const { data: existingRoll } = await supabase
                .from('registered_students')
                .select('id')
                .eq('roll_number', rollNumber.trim().toUpperCase())
                .maybeSingle();

            if (existingRoll) {
                setError('This roll number is already registered.');
                setIsLoading(false);
                return;
            }

            // Insert registration into the database
            const { error: insertError } = await supabase
                .from('registered_students')
                .insert({
                    name: name.trim(),
                    roll_number: rollNumber.trim().toUpperCase(),
                    phone: phone,
                });

            if (insertError) throw insertError;

            // Show success and redirect to login
            setIsRegistered(true);
            setTimeout(() => {
                navigate('/login', { replace: true });
            }, 2000);

        } catch (err: any) {
            console.error('Registration error:', err);
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
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
                    <p className="text-muted-foreground">Student Registration</p>
                </div>

                <Card>
                    {isRegistered ? (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="text-primary" size={32} />
                            </div>
                            <h2 className="mb-2">Registration Successful!</h2>
                            <p className="text-muted-foreground mb-4">
                                Redirecting you to the login page...
                            </p>
                            <p className="text-sm text-muted-foreground">
                                You can now login using your phone number to receive an OTP.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                    <UserPlus className="text-primary" size={24} />
                                </div>
                                <div>
                                    <h2 className="mb-0">Register</h2>
                                    <p className="text-sm text-muted-foreground">Create your account to vote</p>
                                </div>
                            </div>

                            <form onSubmit={handleRegister} className="space-y-4">
                                <Input
                                    label="Full Name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your full name"
                                    required
                                    fullWidth
                                    disabled={isLoading}
                                />

                                <Input
                                    label="Roll Number"
                                    type="text"
                                    value={rollNumber}
                                    onChange={(e) => setRollNumber(e.target.value)}
                                    placeholder="Enter your roll number"
                                    required
                                    fullWidth
                                    disabled={isLoading}
                                />

                                <Input
                                    label="Mobile Number"
                                    type="tel"
                                    value={mobileNumber}
                                    onChange={(e) => setMobileNumber(e.target.value.replace(/[^\d]/g, '').slice(0, 10))}
                                    placeholder="Enter 10-digit mobile number"
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
                                            <Loader2 size={16} className="animate-spin" /> Registering...
                                        </span>
                                    ) : (
                                        "Register"
                                    )}
                                </Button>
                            </form>

                            <div className="mt-6 text-center space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    Already registered?{' '}
                                    <Link to="/login" className="text-primary hover:underline font-medium">
                                        Login here
                                    </Link>
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Are you an admin?{' '}
                                    <Link to="/admin/login" className="text-primary hover:underline font-medium">
                                        Admin Login
                                    </Link>
                                </p>
                            </div>
                        </>
                    )}
                </Card>
            </div>
        </div>
    );
}
