import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import api from '../api/config.ts'
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { UserService } from '../services/userService.ts';

export const Register: React.FC = () => {
  const navigate = useNavigate();

  // 1. State management for form fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2. Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 3. Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Replace URL with your actual API endpoint
      const response = await UserService.createUser(formData);
console.log('Registration response:', response);
      if (response.success === true || response.statuscode === 200) {
        alert('Registration Successful!');
        navigate('/login'); // Redirect to login page
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-card p-8 md:p-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 mt-2">Join the NexusStore community today</p>
        </div>

        {/* Error Message Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              placeholder="John"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <Input
              label="Last Name"
              name="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div className="flex items-start gap-2 py-2">
            <input type="checkbox" className="mt-1 rounded text-[#0d6efd]" required />
            <span className="text-xs text-gray-500">I agree to the Terms of Service and Privacy Policy.</span>
          </div>

          <Button
            fullWidth
            className="py-3 mt-2"
            type="submit"
            disabled={loading}
          >
            {loading ? 'CREATING ACCOUNT...' : 'REGISTER NOW'}
          </Button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-600">
          Already a member? <Link to="/login" className="text-[#0d6efd] font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};