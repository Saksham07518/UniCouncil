import { createBrowserRouter, Navigate } from 'react-router';
import { LoginPage } from '@/app/pages/LoginPage';
import { RegisterPage } from '@/app/pages/RegisterPage';
import { StudentDashboard } from '@/app/pages/StudentDashboard';
import { CandidatesPage } from '@/app/pages/CandidatesPage';
import { CandidateProfilePage } from '@/app/pages/CandidateProfilePage';
import { VotingPage } from '@/app/pages/VotingPage';
import { VoteConfirmationPage } from '@/app/pages/VoteConfirmationPage';
import { ResultsPage } from '@/app/pages/ResultsPage';
import { ProfilePage } from '@/app/pages/ProfilePage';
import { AdminDashboard } from '@/app/pages/AdminDashboard';
import { QuizPage } from '@/app/pages/QuizPage';
import QAPage from '@/app/pages/QAPage';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';
import { AdminLoginPage } from '@/app/pages/AdminLoginPage';
import { AdminProfilePage } from '@/app/pages/AdminProfilePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <StudentDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/candidates',
    element: (
      <ProtectedRoute>
        <CandidatesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/candidates/:id',
    element: (
      <ProtectedRoute>
        <CandidateProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/quiz',
    element: (
      <ProtectedRoute>
        <QuizPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/vote',
    element: (
      <ProtectedRoute>
        <VotingPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/vote-confirmation',
    element: (
      <ProtectedRoute>
        <VoteConfirmationPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/results',
    element: (
      <ProtectedRoute>
        <ResultsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/qa',
    element: (
      <ProtectedRoute>
        <QAPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requireAdmin>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/profile',
    element: (
      <ProtectedRoute requireAdmin>
        <AdminProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
]);