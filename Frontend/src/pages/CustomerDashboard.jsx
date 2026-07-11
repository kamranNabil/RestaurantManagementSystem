import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const TIME_SLOTS = [
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
    '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM',
    '8:00 PM', '9:00 PM'
];

const CustomerDashboard = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
    const [form, setForm] = useState({ date: '', timeSlot: '', guests: 1 });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const isDark = theme === 'dark';

    const fetchReservations = async () => {
        try {
            const res = await api.get('/reservations/my');
            setReservations(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleBook = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await api.post('/reservations', form);
            setSuccess('Reservation created successfully!');
            setForm({ date: '', timeSlot: '', guests: 1 });
            fetchReservations();
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed');
        }
    };

    const handleCancel = async (id) => {
        try {
            await api.patch(`/reservations/my/${id}/cancel`);
            fetchReservations();
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase();

    return (
        <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-[#f5f5f0] text-gray-800'}`}>
            <nav className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-3 flex justify-between items-center`}>
                <span className={`font-semibold text-base ${isDark ? 'text-white' : 'text-gray-800'}`}>Restaurant Reservations</span>

                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleTheme}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${isDark ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        {isDark ? '☀️' : '🌙'}
                    </button>

                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="w-9 h-9 rounded-full bg-[#3d6b4f] text-white text-sm font-semibold flex items-center justify-center hover:bg-[#345e44] transition-colors"
                        >
                            {initials}
                        </button>

                        {dropdownOpen && (
                            <div className={`absolute right-0 mt-2 w-52 rounded-lg shadow-lg border z-50 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                                <div className={`px-4 py-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>{user?.name}</p>
                                    <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Customer</p>
                                </div>
                                <div className="py-1">
                                    <button
                                        className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        Settings
                                    </button>
                                    <button
                                        className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        Help
                                    </button>
                                    <div className={`border-t my-1 ${isDark ? 'border-gray-700' : 'border-gray-100'}`} />
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 text-red-500 hover:bg-red-50"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-6">
                <div className={`rounded-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                    <h3 className="text-base font-semibold mb-4">Book a Table</h3>
                    {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                    {success && <p className="text-green-500 text-sm mb-3">{success}</p>}
                    <form onSubmit={handleBook}>
                        <div className="flex gap-4 flex-wrap mb-4">
                            <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
                                <label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Date</label>
                                <input
                                    className={`border rounded-md px-3 py-2 text-sm outline-none ${isDark ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-200 text-gray-800'}`}
                                    type="date"
                                    value={form.date}
                                    onChange={e => setForm({ ...form, date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
                                <label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Time Slot</label>
                                <select
                                    className={`border rounded-md px-3 py-2 text-sm outline-none ${isDark ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-200 text-gray-800'}`}
                                    value={form.timeSlot}
                                    onChange={e => setForm({ ...form, timeSlot: e.target.value })}
                                    required
                                >
                                    <option value="">Select a time</option>
                                    {TIME_SLOTS.map(slot => (
                                        <option key={slot} value={slot}>{slot}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
                                <label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Guests</label>
                                <input
                                    className={`border rounded-md px-3 py-2 text-sm outline-none ${isDark ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-200 text-gray-800'}`}
                                    type="number"
                                    min="1"
                                    max="6"
                                    value={form.guests}
                                    onChange={e => setForm({ ...form, guests: parseInt(e.target.value) })}
                                    required
                                />
                            </div>
                        </div>
                        <button
                            className="bg-[#3d6b4f] text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-[#345e44] transition-colors"
                            type="submit"
                        >
                            Book Table
                        </button>
                    </form>
                </div>

                <div className={`rounded-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                    <h3 className="text-base font-semibold mb-4">My Reservations</h3>
                    {reservations.length === 0 ? (
                        <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No reservations yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                                        <th className={`text-left py-2 px-3 text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Date</th>
                                        <th className={`text-left py-2 px-3 text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Time</th>
                                        <th className={`text-left py-2 px-3 text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Guests</th>
                                        <th className={`text-left py-2 px-3 text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Table</th>
                                        <th className={`text-left py-2 px-3 text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Status</th>
                                        <th className={`text-left py-2 px-3 text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reservations.map(r => (
                                        <tr key={r._id} className={`border-b ${isDark ? 'border-gray-700/50' : 'border-gray-50'}`}>
                                            <td className="py-3 px-3">{r.date}</td>
                                            <td className="py-3 px-3">{r.timeSlot}</td>
                                            <td className="py-3 px-3">{r.guests}</td>
                                            <td className="py-3 px-3">Table {r.table?.tableNumber} ({r.table?.capacity} seats)</td>
                                            <td className="py-3 px-3">
                                                <span className={`text-xs px-2 py-1 rounded-full ${r.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                                                    {r.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3">
                                                {r.status === 'active' && (
                                                    <button
                                                        onClick={() => handleCancel(r._id)}
                                                        className="text-xs border border-red-300 text-red-400 px-3 py-1 rounded-md hover:bg-red-50"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;