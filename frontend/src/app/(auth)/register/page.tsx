'use client';

import { useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/register', { name, email, password });
      toast.success('Registration successful! Please log in.');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
        <p className="mt-2 text-gray-500">
          Get started with your new task management journey.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <User className="absolute w-5 h-5 text-gray-400 left-4 top-1/2 -translate-y-1/2" />
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            required
            className="w-full py-3 pl-12 pr-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="relative">
          <Mail className="absolute w-5 h-5 text-gray-400 left-4 top-1/2 -translate-y-1/2" />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            required
            className="w-full py-3 pl-12 pr-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="relative">
          <Lock className="absolute w-5 h-5 text-gray-400 left-4 top-1/2 -translate-y-1/2" />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full py-3 pl-12 pr-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-3 font-semibold text-white transition-all duration-300 bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>
      <p className="text-sm text-center text-gray-600">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium text-indigo-600 hover:underline"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}
