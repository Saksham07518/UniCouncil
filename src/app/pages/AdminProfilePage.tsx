import { Sidebar } from '@/app/components/Sidebar';
import { Card } from '@/app/components/Card';
import { useAuth } from '@/app/context/AuthContext';
import { User, Mail, Shield } from 'lucide-react';

export function AdminProfilePage() {
    const { user } = useAuth();

    if (!user || user.role !== 'admin') return null;

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar isAdmin />

            <div className="flex-1 p-8">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="mb-2">Admin Profile</h1>
                        <p className="text-muted-foreground">Your administrator account information</p>
                    </div>

                    {/* Profile Information */}
                    <Card className="mb-6">
                        <h3 className="mb-6">Personal Information</h3>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <User className="text-primary" size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Full Name</p>
                                    <p className="text-foreground">{user.name || 'Not set'}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <Mail className="text-primary" size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Email Address</p>
                                    <p className="text-foreground">{user.email || 'Not set'}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg border-l-4 border-accent">
                                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                                    <Shield className="text-accent" size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Role</p>
                                    <p className="text-foreground capitalize">{user.role}</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
