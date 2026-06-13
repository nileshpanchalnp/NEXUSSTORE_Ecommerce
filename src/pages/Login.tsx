import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext.tsx';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  // 1. Local State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2. Form Submission Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await login({ email, password });
      console.log('Login response:', response);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-card p-8 md:p-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Please enter your details to sign in</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input
            label="Email Address"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <a href="#" className="text-xs text-[#0d6efd] font-bold hover:underline">Forgot?</a>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            fullWidth
            className="py-3 shadow-lg shadow-blue-100 mt-4"
            disabled={loading}
          >
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </Button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-600">
          Don't have an account? <Link to="/register" className="text-[#0d6efd] font-bold hover:underline">Create account</Link>
        </p>
      </div>
    </div>
  );
};