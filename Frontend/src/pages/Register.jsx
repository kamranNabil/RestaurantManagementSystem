import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import restaurantBg from '../assets/img2.webp';


const Register = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/register', form);
            login(res.data);
            if (res.data.role === 'admin') navigate('/admin');
            else navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 relative"
            style={{
                backgroundImage: `url(${restaurantBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="absolute inset-0 bg-black/55" />
            <div className="relative z-10 bg-white/95 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-1">Create an Account</h2>
                <p className="text-sm text-gray-500 mb-6">Join us to make a reservation</p>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        className="border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-gray-400"
                        type="text"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        required
                    />
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
                    <select
                        className="border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-gray-400 bg-white"
                        value={form.role}
                        onChange={e => setForm({ ...form, role: e.target.value })}
                    >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                    </select>
                    <button
                        className="bg-[#3d6b4f] text-white py-2 rounded-md text-sm font-medium hover:bg-[#345e44] transition-colors"
                        type="submit"
                    >
                        Register
                    </button>
                </form>
                <p className="text-center text-sm text-gray-500 mt-4">
                    Already have an account? <Link to="/login" className="text-[#3d6b4f] font-medium">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;