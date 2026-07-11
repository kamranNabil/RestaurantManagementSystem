import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', form);
      login(res.data);
      if (res.data.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-sm w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">Restaurant Reservations</h2>
        <p className="text-sm text-gray-500 mb-6">Sign in to your account</p>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-gray-400"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className="border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-gray-400"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />
          <button
            className="bg-[#3d6b4f] text-white py-2 rounded-md text-sm font-medium hover:bg-[#345e44] transition-colors"
            type="submit"
          >
            Sign In
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account? <Link to="/register" className="text-[#3d6b4f] font-medium">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;