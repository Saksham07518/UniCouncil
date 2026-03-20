import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '@/app/context/AuthContext';
import { supabase } from '@/app/lib/supabase';
import { Card } from '@/app/components/Card';
import { Input } from '@/app/components/Input';
import { Button } from '@/app/components/Button';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { ShieldAlert, Loader2 } from 'lucide-react';
const logo = '/logo.png';

export function AdminLoginPage() {
    const [adminId, setAdminId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();

    // Redirect if already logged in
    useEffect(() => {
        if (user && !authLoading) {
            navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
        }
    }, [user, authLoading, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!adminId || !password) {
            setError('Please enter both Admin ID and Password');
            return;
        }

        // Verify the hardcoded ID before even attempting DB login to prevent spam/abuse
        if (adminId !== 'admin058') {
            setError('Invalid Admin ID or Password');
            return;
        }

        setIsLoading(true);
        try {
            // Under the hood, we map the ID to the hidden central admin email account
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: 'admin058@unicouncil.edu',
                password: password,
            });

            if (signInError) throw signInError;

            // AuthContext will automatically redirect upon detecting user session
        } catch (err: any) {
            console.error('Error signing in:', err);
            setError('Invalid Admin ID or Password');
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
                    <h1 className="text-foreground mb-2">UniCouncil Admin</h1>
                    <p className="text-muted-foreground">Secure Election Management</p>
                </div>

                <Card>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <ShieldAlert className="text-primary" size={24} />
                        </div>
                        <div>
                            <h2 className="mb-0">Admin Login</h2>
                            <p className="text-sm text-muted-foreground">Authorized personnel only</p>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <Input
                            label="Admin ID"
                            type="text"
                            value={adminId}
                            onChange={(e) => setAdminId(e.target.value)}
                            placeholder="Enter your Admin ID"
                            required
                            fullWidth
                            disabled={isLoading}
                        />

                        <Input
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
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
                                    <Loader2 size={16} className="animate-spin" /> Authenticating...
                                </span>
                            ) : (
                                "Login to Dashboard"
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <Link to="/login" className="text-primary hover:underline">
                            Go to Student Login
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
}
