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

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
    const [tables, setTables] = useState([]);
    const [dateFilter, setDateFilter] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('reservations');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const isDark = theme === 'dark';

    const fetchReservations = async () => {
        try {
            const url = dateFilter ? `/reservations?date=${dateFilter}` : '/reservations';
            const res = await api.get(url);
            setReservations(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchTables = async () => {
        try {
            const res = await api.get('/tables');
            setTables(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchReservations();
        fetchTables();
    }, [dateFilter]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCancel = async (id) => {
        try {
            await api.patch(`/reservations/${id}/cancel`);
            fetchReservations();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditClick = (r) => {
        setEditingId(r._id);
        setEditForm({ date: r.date, timeSlot: r.timeSlot, guests: r.guests, table: r.table?._id });
        setError('');
    };

    const handleUpdate = async (id) => {
        try {
            await api.patch(`/reservations/${id}`, editForm);
            setEditingId(null);
            fetchReservations();
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase();

    const bg = isDark ? 'bg-[#1e1e2e]' : 'bg-[#f5f5f0]';
    const card = isDark ? 'bg-[#2a2a3e]' : 'bg-white';
    const nav = isDark ? 'bg-[#16162a] border-gray-700' : 'bg-white border-gray-200';
    const text = isDark ? 'text-gray-100' : 'text-gray-800';
    const subtext = isDark ? 'text-gray-400' : 'text-gray-500';
    const border = isDark ? 'border-gray-700' : 'border-gray-100';
    const inputCls = `border rounded-md px-3 py-2 text-sm outline-none ${isDark ? 'bg-[#1e1e2e] border-gray-600 text-gray-300' : 'bg-white border-gray-200 text-gray-800'}`;

    return (
        <div className={`min-h-screen ${bg} ${text}`}>
            <nav className={`${nav} border-b px-6 py-3 flex justify-between items-center`}>
                <div className="flex items-center gap-3">
                    <span className="text-xs bg-yellow-500 text-black font-semibold px-2 py-0.5 rounded">ADMIN</span>
                    <span className="font-semibold">Restaurant Management</span>
                </div>

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
                            className="w-9 h-9 rounded-full bg-yellow-500 text-black text-sm font-bold flex items-center justify-center hover:bg-yellow-400 transition-colors"
                        >
                            {initials}
                        </button>

                        {dropdownOpen && (
                            <div className={`absolute right-0 mt-2 w-52 rounded-lg shadow-lg border z-50 ${isDark ? 'bg-[#2a2a3e] border-gray-700' : 'bg-white border-gray-100'}`}>
                                <div className={`px-4 py-3 border-b ${border}`}>
                                    <p className={`text-sm font-medium ${text}`}>{user?.name}</p>
                                    <p className={`text-xs mt-0.5 ${subtext}`}>Administrator</p>
                                </div>
                                <div className="py-1">
                                    <button className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                                        Settings
                                    </button>
                                    <button className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                                        Help
                                    </button>
                                    <div className={`border-t my-1 ${border}`} />
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

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab('reservations')}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'reservations' ? 'bg-yellow-500 text-black' : isDark ? 'bg-[#2a2a3e] text-gray-300 hover:bg-[#32324a]' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    >
                        Reservations
                    </button>
                    <button
                        onClick={() => setActiveTab('tables')}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'tables' ? 'bg-yellow-500 text-black' : isDark ? 'bg-[#2a2a3e] text-gray-300 hover:bg-[#32324a]' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    >
                        Tables
                    </button>
                </div>

                {activeTab === 'reservations' && (
                    <div className={`${card} rounded-lg p-6 shadow-sm`}>
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-base font-semibold">All Reservations</h3>
                            <div className="flex items-center gap-2">
                                <label className={`text-xs ${subtext}`}>Filter by date</label>
                                <input
                                    type="date"
                                    value={dateFilter}
                                    onChange={e => setDateFilter(e.target.value)}
                                    className={inputCls}
                                />
                                {dateFilter && (
                                    <button onClick={() => setDateFilter('')} className={`text-xs ${subtext} hover:text-red-400`}>Clear</button>
                                )}
                            </div>
                        </div>

                        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

                        {reservations.length === 0 ? (
                            <p className={`text-sm ${subtext}`}>No reservations found.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className={`border-b ${border}`}>
                                            {['Customer', 'Date', 'Time', 'Guests', 'Table', 'Status', 'Actions'].map(h => (
                                                <th key={h} className={`text-left py-2 px-3 text-xs font-medium ${subtext}`}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reservations.map(r => (
                                            <tr key={r._id} className={`border-b ${border}`}>
                                                {editingId === r._id ? (
                                                    <>
                                                        <td className="py-3 px-3">{r.user?.name || 'N/A'}</td>
                                                        <td className="py-3 px-3">
                                                            <input type="date" value={editForm.date} onChange={e => setEditForm({ ...editForm, date: e.target.value })} className={`${inputCls} w-32`} />
                                                        </td>
                                                        <td className="py-3 px-3">
                                                            <select value={editForm.timeSlot} onChange={e => setEditForm({ ...editForm, timeSlot: e.target.value })} className={inputCls}>
                                                                {TIME_SLOTS.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                                                            </select>
                                                        </td>
                                                        <td className="py-3 px-3">
                                                            <input type="number" min="1" max="6" value={editForm.guests} onChange={e => setEditForm({ ...editForm, guests: parseInt(e.target.value) })} className={`${inputCls} w-16`} />
                                                        </td>
                                                        <td className="py-3 px-3">
                                                            <select value={editForm.table} onChange={e => setEditForm({ ...editForm, table: e.target.value })} className={inputCls}>
                                                                {tables.map(t => <option key={t._id} value={t._id}>Table {t.tableNumber} ({t.capacity})</option>)}
                                                            </select>
                                                        </td>
                                                        <td className="py-3 px-3">
                                                            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">{r.status}</span>
                                                        </td>
                                                        <td className="py-3 px-3">
                                                            <div className="flex gap-2">
                                                                <button onClick={() => handleUpdate(r._id)} className="text-xs bg-yellow-500 text-black px-3 py-1 rounded-md font-medium">Save</button>
                                                                <button onClick={() => setEditingId(null)} className={`text-xs border ${border} ${subtext} px-3 py-1 rounded-md`}>Cancel</button>
                                                            </div>
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td className="py-3 px-3">
                                                            <div>{r.user?.name || 'N/A'}</div>
                                                            <div className={`text-xs ${subtext}`}>{r.user?.email || ''}</div>
                                                        </td>
                                                        <td className="py-3 px-3">{r.date}</td>
                                                        <td className="py-3 px-3">{r.timeSlot}</td>
                                                        <td className="py-3 px-3">{r.guests}</td>
                                                        <td className="py-3 px-3">Table {r.table?.tableNumber} ({r.table?.capacity} seats)</td>
                                                        <td className="py-3 px-3">
                                                            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">{r.status}</span>
                                                        </td>
                                                        <td className="py-3 px-3">
                                                            <div className="flex gap-2">
                                                                <button onClick={() => handleEditClick(r)} className="text-xs border border-yellow-400 text-yellow-500 px-3 py-1 rounded-md hover:bg-yellow-50">Edit</button>
                                                                <button onClick={() => handleCancel(r._id)} className="text-xs border border-red-300 text-red-400 px-3 py-1 rounded-md hover:bg-red-50">Cancel</button>
                                                            </div>
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'tables' && (
                    <div className={`${card} rounded-lg p-6 shadow-sm`}>
                        <h3 className="text-base font-semibold mb-5">Restaurant Tables</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {tables.map(t => (
                                <div key={t._id} className={`rounded-lg p-4 border ${border} ${isDark ? 'bg-[#1e1e2e]' : 'bg-gray-50'}`}>
                                    <div className="text-lg font-semibold mb-1">Table {t.tableNumber}</div>
                                    <div className={`text-sm ${subtext}`}>{t.capacity} seats</div>
                                    <div className="mt-2">
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-600">active</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;