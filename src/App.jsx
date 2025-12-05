import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  LayoutDashboard, FileText, CheckCircle, XCircle, Clock, CreditCard, Calendar, Bell, Menu, User, LogOut, UploadCloud, QrCode, Printer, Users, TrendingUp, AlertCircle, Settings, Trash2, BookOpen, Beaker, Home, GraduationCap, Stamp, Plus, ToggleLeft, ToggleRight, Check, X, ShieldAlert, Edit2, Shield, ChevronLeft, Mail, Phone, Hash, MapPin, Eye, CalendarCheck, Filter, PieChart, Lock, UserX, Siren, Timer, FileWarning, ExternalLink, Key, MessageSquare, Search, ChevronDown, Download, Activity
} from 'lucide-react';

// --- 1. CONSTANTS & REAL-WORLD DATA ---

const SYSTEM_DATE = "Nov 27, 2025";

const DEFAULT_CONFIG = {
    emergencySLAHours: 12,
    autoEscalationHours: 12,
    maxEmergencyRequestsPerYear: 2
};

const menuItems = {
  student: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'certificate', label: 'Clearance Certificate', icon: FileText },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'guidelines', label: 'Guidelines', icon: BookOpen },
  ],
  officer: [
    { id: 'dashboard', label: 'Queue Management', icon: LayoutDashboard },
    { id: 'officer-appointments', label: 'Appointments', icon: Calendar },
    { id: 'analytics', label: 'Department Analytics', icon: Activity },
  ],
  admin: [
    { id: 'dashboard', label: 'System Overview', icon: LayoutDashboard },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ]
};

const INITIAL_USERS = [
    { 
        id: 1, 
        name: 'Alex Thompson', 
        role: 'Student', 
        email: 'alex.t@uni.edu', 
        password: '1234',
        status: 'Active', 
        studentId: '0112230676',
        dept: 'Computer Science',
        batch: '223', 
        semester: '8th (Final)',
        phone: '+1 (555) 012-3456',
        address: '123 Campus Dorm, Block B',
        emergencyQuotaUsed: 0
    },
    { 
        id: 2, 
        name: 'Sarah Jenkins', 
        role: 'Officer', 
        email: 'sarah.j@uni.edu', 
        password: '1234',
        status: 'Active', 
        phone: '+1 (555) 987-6543', 
        dept: 'Registrar Office' 
    },
    { 
        id: 3, 
        name: 'Dr. Al-Fayed', 
        role: 'Admin', 
        email: 'alfayed.admin@uni.edu', 
        password: '1234',
        status: 'Active', 
        phone: '+1 (555) 000-1111' 
    },
    { 
        id: 4, 
        name: 'Jamie Doe', 
        role: 'Student', 
        email: 'jamie.d@uni.edu', 
        password: '1234',
        status: 'Active', 
        studentId: '0112230670', 
        dept: 'EEE', 
        batch: '231', 
        semester: '6th', 
        phone: '+1 (555) 222-3333', 
        emergencyQuotaUsed: 1 
    },
    { 
        id: 10, 
        name: 'Mrs. Pince', 
        role: 'Officer', 
        email: 'librarian@uni.edu', 
        password: '1234', 
        status: 'Active', 
        dept: 'Library Services' 
    },
    { 
        id: 11, 
        name: 'Mr. Scrooge', 
        role: 'Officer', 
        email: 'bursar@uni.edu', 
        password: '1234', 
        status: 'Active', 
        dept: 'Bursary Office' 
    },
    { 
        id: 12, 
        name: 'Prof. Snape', 
        role: 'Officer', 
        email: 'hod@uni.edu', 
        password: '1234', 
        status: 'Active', 
        dept: 'Department Head' 
    },
    { 
        id: 13, 
        name: 'Mr. Filch', 
        role: 'Officer', 
        email: 'warden@uni.edu', 
        password: '1234', 
        status: 'Active', 
        dept: 'Hostel Management' 
    }
];

const INITIAL_DATABASE = [
  { 
    id: 1, 
    studentId: '0112230676',
    studentName: 'Alex Thompson',
    batch: '223',
    unit: 'Department Head', 
    type: 'Departmental',
    status: 'Pending', 
    fee: 0, 
    paid: true, 
    note: 'Pending lab verification.',
    checklist: [
      { label: 'Lab Equipment Return', status: 'Pending' },
      { label: 'Dept. Society Dues', status: 'Cleared' },
      { label: 'HOD Confirmation', status: 'Pending' }
    ]
  },
  { 
    id: 2, 
    studentId: '0112230676',
    studentName: 'Alex Thompson',
    batch: '223',
    unit: 'Library Services', 
    type: 'Library',
    status: 'Pending', 
    fee: 15.50, 
    paid: false, 
    note: 'Strict verification required.', 
    docRequired: true,
    checklist: [
      { label: 'All Borrowed Books', status: 'Pending' }, 
      { label: 'Book Damage Assessment', status: 'Pending' }, 
      { label: 'Library Account Status', status: 'Active' } 
    ]
  },
  { 
    id: 3, 
    studentId: '0112230676',
    studentName: 'Alex Thompson',
    batch: '223',
    unit: 'Bursary Office', 
    type: 'Finance',
    status: 'Rejected', 
    fee: 1200.00, 
    paid: false, 
    note: 'Outstanding tuition balance for Semester 8.',
    breakdown: [
      { label: 'Tuition Fee (Sem 8)', amount: 1000.00 },
      { label: 'Exam Fees', amount: 150.00 },
      { label: 'ID Card Fine', amount: 50.00 }
    ]
  },
  { 
    id: 5, 
    studentId: '0112230676',
    studentName: 'Alex Thompson',
    batch: '223',
    unit: 'Hostel Management', 
    type: 'Hostel',
    status: 'Approved', 
    fee: 0, 
    paid: true, 
    note: 'Room checked and keys returned.',
    checklist: [
      { label: 'Hostel Rent (Dec)', status: 'Cleared' },
      { label: 'Mess Dues', status: 'Cleared' },
      { label: 'Room Handover', status: 'Cleared' }
    ]
  },
  { 
    id: 8, 
    studentId: '0112230676',
    studentName: 'Alex Thompson',
    batch: '223',
    unit: 'Registrar Office', 
    type: 'Administrative',
    status: 'Pending', 
    fee: 50.00, 
    paid: false, 
    note: 'Awaiting final document submission.',
    checklist: [
      { label: 'Registration Card Submission', status: 'Pending' },
      { label: 'Certificate Application Form', status: 'Pending' },
      { label: 'Verification of All Signatures', status: 'Pending' }
    ]
  },
  { 
    id: 6, 
    studentId: '0112230670',
    studentName: 'Jamie Doe',
    batch: '231', 
    unit: 'Library Services', 
    type: 'Library',
    status: 'Pending', 
    fee: 0, 
    paid: true, 
    note: 'Verification in progress.', 
    checklist: [
      { label: 'All Borrowed Books', status: 'Returned' },
      { label: 'Book Damage Assessment', status: 'Passed' },
      { label: 'Library Account Status', status: 'Active' }
    ]
  },
];

const INITIAL_APPOINTMENTS = [
    { id: 101, studentId: '0112230676', studentName: 'Alex Thompson', officer: 'Department Head', date: '2025-11-25', time: '10:00 AM', status: 'Confirmed', reason: 'Need signature on project report' },
    { id: 102, studentId: '0112230670', studentName: 'Jamie Doe', officer: 'Library Services', date: '2025-11-26', time: '02:00 PM', status: 'Pending', reason: 'Returning overdue books' },
    { id: 103, studentId: '0112420876', studentName: 'Jordan Smith', officer: 'Bursary Office', date: '2025-11-28', time: '11:00 AM', status: 'Confirmed', reason: 'Clarification on exam fees' },
    { id: 104, studentId: '0112230676', studentName: 'Alex Thompson', officer: 'Bursary Office', date: '2025-11-28', time: '03:00 PM', status: 'Pending', reason: 'Payment issue' },
    { id: 105, studentId: '0112230670', studentName: 'Jamie Doe', officer: 'Bursary Office', date: '2025-11-29', time: '09:00 AM', status: 'Confirmed', reason: 'Scholarship application' },
];

const INITIAL_EMERGENCY_REQUESTS = [];

const INITIAL_NOTIFICATIONS = [
  { id: 1, title: 'Hostel Cleared', msg: 'Your room handover was successful.', time: '2 mins ago', read: false, targetRole: 'student', targetId: '0112230676' },
  { id: 2, title: 'New Request', msg: 'Alex Thompson (0112230676) uploaded a document.', time: '1 hour ago', read: false, targetRole: 'officer' },
  { id: 3, title: 'System Update', msg: 'Maintenance scheduled for tonight.', time: '5 hours ago', read: true, targetRole: 'all' },
];

const AVAILABLE_SLOTS = [
  { id: 1, time: '09:00 AM' },
  { id: 2, time: '10:00 AM' },
  { id: 3, time: '11:00 AM' },
  { id: 4, time: '02:00 PM' },
];

// --- 2. UTILITIES & SHARED COMPONENTS ---

const isPositiveStatus = (status) => ['Cleared', 'Submitted', 'Returned', 'Passed', 'None', 'Active', 'Confirmed', 'Approved'].includes(status);
const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : 'U';

const Button = ({ children, variant = 'primary', className = '', onClick, disabled, icon: Icon, fullWidth }) => {
  const baseStyle = "group relative flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg shadow-blue-200/50 focus:ring-blue-500 border border-transparent", 
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm hover:shadow focus:ring-slate-200",
    danger: "bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 hover:border-rose-300 shadow-sm focus:ring-rose-200",
    ghost: "text-slate-500 hover:text-slate-800 hover:bg-slate-100 bg-transparent border-transparent",
    emergency: "bg-gradient-to-r from-rose-500 to-red-600 text-white hover:from-rose-600 hover:to-red-700 shadow-lg shadow-rose-200 border border-transparent focus:ring-rose-500"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      className={`${baseStyle} ${variants[variant]} ${className} ${fullWidth ? 'w-full' : ''}`}
    >
      {Icon && <Icon size={18} className="transition-transform group-hover:scale-110" />}
      {children}
    </button>
  );
};

const Card = ({ children, className = '', noPadding = false, onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 ${onClick ? 'cursor-pointer active:scale-[0.99]' : ''} ${noPadding ? '' : 'p-6'} ${className}`}
  >
    {children}
  </div>
);

const StatusBadge = ({ status, isEmergency }) => {
  if (isEmergency) {
      return (
        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 w-fit whitespace-nowrap bg-rose-50 text-rose-600 border-rose-200 shadow-sm">
            <Siren size={12} className="animate-pulse" /> Emergency
        </span>
      )
  }
  const styles = {
    Approved: "bg-emerald-50 text-emerald-700 border-emerald-100", 
    Confirmed: "bg-blue-50 text-blue-700 border-blue-100", 
    Passed: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Active: "bg-blue-50 text-blue-700 border-blue-100",
    Cleared: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Pending: "bg-amber-50 text-amber-700 border-amber-100",
    Rejected: "bg-rose-50 text-rose-700 border-rose-100",
    Declined: "bg-rose-50 text-rose-700 border-rose-100",
    Reviewing: "bg-indigo-50 text-indigo-700 border-indigo-100",
    Submitted: "bg-indigo-50 text-indigo-700 border-indigo-100",
  };
  const safeStyle = styles[status] || styles.Pending;
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 w-fit whitespace-nowrap ${safeStyle} shadow-sm`}>
      {status === 'Approved' || status === 'Confirmed' || status === 'Cleared' || status === 'Active' ? <CheckCircle size={12} /> : <Clock size={12} />}
      {status}
    </span>
  );
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
          <h3 className="font-bold text-lg text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

const CountDownTimer = ({ submissionTime, durationHours }) => {
    const [timeLeft, setTimeLeft] = useState('');
    
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const deadline = new Date(submissionTime).getTime() + (durationHours * 60 * 60 * 1000);
            const distance = deadline - now;

            if (distance < 0) {
                setTimeLeft("ESCALATED");
                clearInterval(interval);
            } else {
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [submissionTime, durationHours]);

    return <span>{timeLeft}</span>;
};

const TimeAgo = ({ timestamp }) => {
    const [timeString, setTimeString] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const submitted = new Date(timestamp);
            const diff = Math.max(0, now - submitted);
            
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            
            setTimeString(`${hours}h ${minutes}m ago`);
        };
        
        updateTime();
        const interval = setInterval(updateTime, 60000); 
        return () => clearInterval(interval);
    }, [timestamp]);

    return <span>{timeString}</span>;
};

// --- 3. VIEW COMPONENTS ---

const LoginView = ({ onLogin }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    onLogin(userId, password, setError);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 border border-slate-100">
        <div className="p-8 pb-6 border-b border-slate-100 text-center bg-slate-50/50">
            <div className="w-16 h-16 bg-blue-700 rounded-xl flex items-center justify-center text-white shadow-lg mx-auto mb-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-800 to-indigo-600"></div>
                <Shield size={32} className="relative z-10" fill="currentColor" fillOpacity={0.2} />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">UniClearance</h1>
            <p className="text-sm text-slate-500 mt-1">Secure Clearance Portal</p>
        </div>

        <div className="p-8 pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">
                        User ID / Email
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-3 text-slate-400">
                            <User size={18} />
                        </div>
                        <input 
                            type="text" 
                            required
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50"
                            placeholder="Student ID or Email"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Password</label>
                    <div className="relative">
                        <div className="absolute left-3 top-3 text-slate-400">
                            <Key size={18} />
                        </div>
                        <input 
                            type="password" 
                            required
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                        <AlertCircle size={14} /> {error}
                    </div>
                )}

                <Button type="submit" className="w-full h-11 text-base shadow-lg shadow-blue-200 mt-4">
                    Login to Portal
                </Button>
            </form>
        </div>
        <div className="bg-slate-50 p-4 text-center text-[10px] text-slate-400 border-t border-slate-100">
            Secure Access • 256-bit Encryption • v2.4.0
        </div>
      </div>
    </div>
  );
};

const ProfileView = ({ user }) => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            <div className="bg-gradient-to-br from-blue-700 to-indigo-800 rounded-2xl p-8 text-white shadow-xl shadow-blue-200/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl font-bold border border-white/30 shadow-inner">
                        {getInitials(user.name)}
                    </div>
                    <div className="text-center md:text-left space-y-3">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">{user.name}</h2>
                            <p className="text-blue-100 font-medium">{user.role}</p>
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                            <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md border border-white/10 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                {user.status}
                            </span>
                            {user.dept && (
                                <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md border border-white/10 flex items-center gap-2">
                                    <Stamp size={12} /> {user.dept}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="h-full">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 pb-2 border-b border-slate-100">Contact Information</h3>
                    <div className="space-y-1">
                        <div className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-xl transition-colors group">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors"><Mail size={18}/></div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium mb-0.5">Email Address</p>
                                <p className="font-medium text-slate-800">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-xl transition-colors group">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors"><Phone size={18}/></div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium mb-0.5">Phone Number</p>
                                <p className="font-medium text-slate-800">{user.phone || 'Not Provided'}</p>
                            </div>
                        </div>
                        {user.role === 'Student' && (
                            <div className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-xl transition-colors group">
                                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors"><MapPin size={18}/></div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium mb-0.5">Current Address</p>
                                    <p className="font-medium text-slate-800">{user.address || 'N/A'}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {user.role === 'Student' && (
                    <Card className="h-full">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 pb-2 border-b border-slate-100">Academic Profile</h3>
                        <div className="space-y-1">
                            <div className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-xl transition-colors group">
                                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center group-hover:bg-indigo-100 transition-colors"><Hash size={18}/></div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium mb-0.5">Student ID</p>
                                    <p className="font-medium text-slate-800 font-mono tracking-wide">{user.studentId}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-xl transition-colors group">
                                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center group-hover:bg-indigo-100 transition-colors"><BookOpen size={18}/></div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium mb-0.5">Department</p>
                                    <p className="font-medium text-slate-800">{user.dept}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-1">
                                <div className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-xl transition-colors group">
                                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center group-hover:bg-indigo-100 transition-colors"><Users size={18}/></div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium mb-0.5">Batch</p>
                                        <p className="font-medium text-slate-800">{user.batch}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-xl transition-colors group">
                                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center group-hover:bg-indigo-100 transition-colors"><Clock size={18}/></div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium mb-0.5">Semester</p>
                                        <p className="font-medium text-slate-800">{user.semester}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};

const CertificateView = ({ studentProfile, isCleared }) => {
    // Determine certificate type: 
    // IF isCleared (all due cleared) => Original
    // ELSE IF NOT isCleared (implying access granted via emergency) => Provisional
    const isProvisional = !isCleared;

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
            {/* --- CERTIFICATE CONTAINER WITH DECORATIVE BORDER --- */}
            <div className="bg-[#fdfbf7] p-10 md:p-20 rounded-sm shadow-2xl border-8 double border-slate-800 relative overflow-hidden text-center" style={{ fontFamily: 'Times New Roman, serif' }}>
                
                {/* --- WATERMARK --- */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                    <GraduationCap size={600} />
                </div>

                {/* --- CORNER DECORATIONS --- */}
                <div className="absolute top-4 left-4 w-24 h-24 border-t-4 border-l-4 border-slate-800 rounded-tl-3xl"></div>
                <div className="absolute top-4 right-4 w-24 h-24 border-t-4 border-r-4 border-slate-800 rounded-tr-3xl"></div>
                <div className="absolute bottom-4 left-4 w-24 h-24 border-b-4 border-l-4 border-slate-800 rounded-bl-3xl"></div>
                <div className="absolute bottom-4 right-4 w-24 h-24 border-b-4 border-r-4 border-slate-800 rounded-br-3xl"></div>

                <div className="relative z-10 flex flex-col items-center">
                    
                    {/* --- HEADER --- */}
                    <div className="mb-8">
                        <div className="mx-auto w-24 h-24 bg-slate-900 text-[#fdfbf7] rounded-full flex items-center justify-center mb-4 shadow-lg">
                            <Shield size={48} fill="currentColor" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-wide uppercase mb-2">University of Technology</h1>
                        <p className="text-slate-600 uppercase tracking-[0.3em] text-sm font-semibold">Office of the Registrar</p>
                    </div>

                    {/* --- TITLE --- */}
                    <div className="mb-10 w-full">
                        <div className="h-px bg-slate-300 w-full mb-1"></div>
                        <div className="h-px bg-slate-300 w-full"></div>
                        <h2 className={`text-4xl md:text-5xl font-bold my-8 ${isProvisional ? 'text-amber-700' : 'text-slate-800'}`} style={{ fontFamily: 'Pinyon Script, cursive' }}>
                            {isProvisional ? "Provisional Clearance Certificate" : "Official Clearance Certificate"}
                        </h2>
                        <div className="h-px bg-slate-300 w-full mb-1"></div>
                        <div className="h-px bg-slate-300 w-full"></div>
                    </div>

                    {/* --- BODY --- */}
                    <div className="max-w-3xl mx-auto space-y-6 text-lg md:text-xl text-slate-800 leading-relaxed">
                        <p className="italic text-slate-500">This is to certify that</p>
                        
                        <div className="text-4xl font-bold text-slate-900 my-4 border-b-2 border-slate-800 inline-block pb-2 px-8">
                            {studentProfile.name}
                        </div>
                        
                        <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-12 text-base md:text-lg font-semibold text-slate-700 uppercase tracking-wider mb-4">
                            <span>ID: <span className="text-slate-900">{studentProfile.studentId}</span></span>
                            <span>Dept: <span className="text-slate-900">{studentProfile.dept}</span></span>
                        </div>

                        <p>
                            Has successfully completed all necessary clearance procedures for the 
                            <span className="font-bold"> Fall 2025 Semester</span>.
                        </p>

                        <p className="text-base text-slate-600 max-w-2xl mx-auto">
                            {isProvisional 
                                ? "This certificate is issued provisionally based on approved emergency protocols. The student is pending final financial reconciliation but is cleared for immediate academic requirements."
                                : "The student has cleared all departmental, library, hostel, and administrative dues. This certificate serves as official proof of clearance for graduation and convocation protocols."
                            }
                        </p>
                    </div>

                    {/* --- FOOTER / SIGNATURES --- */}
                    <div className="mt-20 w-full grid grid-cols-1 md:grid-cols-3 gap-12 items-end">
                        <div className="text-center">
                            <div className="border-b border-slate-400 pb-2 mb-2 font-dancing-script text-2xl text-blue-900">Sarah Jenkins</div>
                            <p className="text-xs uppercase font-bold text-slate-500 tracking-wider">Registrar</p>
                        </div>

                        <div className="text-center flex justify-center">
                            <div className="w-32 h-32 border-4 border-double border-slate-300 rounded-full flex items-center justify-center relative">
                                <div className="absolute inset-2 border border-slate-200 rounded-full"></div>
                                <Stamp size={48} className="text-blue-900 opacity-80 rotate-[-12deg]" />
                                <span className="absolute bottom-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Official Seal</span>
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="border-b border-slate-400 pb-2 mb-2 font-mono text-lg text-slate-800">{SYSTEM_DATE}</div>
                            <p className="text-xs uppercase font-bold text-slate-500 tracking-wider">Date of Issue</p>
                        </div>
                    </div>

                </div>
            </div>

            {/* --- ACTION BAR --- */}
            <div className="mt-8 flex justify-center gap-4 print:hidden">
                <Button onClick={() => window.print()} icon={Printer}>Print Certificate</Button>
                <Button variant="secondary" icon={Download}>Download PDF</Button>
            </div>
            
            {/* Style for script font fallback */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap');
                .font-dancing-script { font-family: 'cursive'; } 
            `}</style>
        </div>
    );
};

const AppointmentsView = ({ navigate, appointments, addAppointment, studentProfile }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [newAppt, setNewAppt] = useState({ officer: 'Department Head', date: '', time: '09:00 AM', reason: '' });

    const myAppointments = appointments.filter(a => a.studentId === studentProfile.studentId);

    const handleSubmit = (e) => {
        e.preventDefault();
        addAppointment({ 
            id: Date.now(), 
            studentId: studentProfile.studentId, 
            studentName: studentProfile.name,
            status: 'Pending',
            ...newAppt 
        });
        setModalOpen(false);
    };

    return (
        <div className="space-y-6 animate-in fade-in">
             <div className="flex justify-between items-center">
                 <div>
                    <h2 className="text-2xl font-bold text-slate-800">My Appointments</h2>
                    <p className="text-slate-500">Manage meetings with university officials</p>
                 </div>
                 <Button onClick={() => setModalOpen(true)} icon={Plus}>Book Appointment</Button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {myAppointments.length === 0 ? (
                     <div className="col-span-3 text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
                         <Calendar size={48} className="mx-auto text-slate-300 mb-4"/>
                         <p className="text-slate-500">No appointments scheduled.</p>
                     </div>
                 ) : myAppointments.map(appt => (
                     <Card key={appt.id} className="p-5 flex flex-col gap-4 relative overflow-hidden">
                         <div className={`absolute top-0 left-0 w-1 h-full ${appt.status === 'Confirmed' ? 'bg-blue-500' : appt.status === 'Declined' ? 'bg-rose-500' : 'bg-amber-500'}`}></div>
                         <div className="flex justify-between items-start">
                             <div>
                                 <h3 className="font-bold text-slate-800">{appt.officer}</h3>
                                 <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><CalendarCheck size={12}/> {new Date(appt.date).toDateString()}</p>
                             </div>
                             <StatusBadge status={appt.status} />
                         </div>
                         <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                             <div className="flex items-center gap-2 mb-2">
                                 <Clock size={16} className="text-slate-400"/>
                                 <span className="font-bold text-slate-700">{appt.time}</span>
                             </div>
                             <p className="text-xs text-slate-500 italic">"{appt.reason}"</p>
                         </div>
                     </Card>
                 ))}
             </div>

             <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Book New Appointment">
                 <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Department/Officer</label>
                         <select className="w-full p-3 bg-white border border-slate-200 rounded-xl" value={newAppt.officer} onChange={e => setNewAppt({...newAppt, officer: e.target.value})}>
                             <option>Department Head</option>
                             <option>Registrar Office</option>
                             <option>Bursary Office</option>
                             <option>Library Services</option>
                             <option>Hostel Management</option>
                         </select>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                         <div>
                             <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date</label>
                             <input type="date" required className="w-full p-3 bg-white border border-slate-200 rounded-xl" value={newAppt.date} onChange={e => setNewAppt({...newAppt, date: e.target.value})}/>
                         </div>
                         <div>
                             <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Time Slot</label>
                             <select className="w-full p-3 bg-white border border-slate-200 rounded-xl" value={newAppt.time} onChange={e => setNewAppt({...newAppt, time: e.target.value})}>
                                 {AVAILABLE_SLOTS.map(s => <option key={s.id}>{s.time}</option>)}
                             </select>
                         </div>
                     </div>
                     <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Purpose</label>
                         <textarea required className="w-full p-3 bg-white border border-slate-200 rounded-xl resize-none" rows="3" placeholder="Briefly describe why you need this meeting..." value={newAppt.reason} onChange={e => setNewAppt({...newAppt, reason: e.target.value})}></textarea>
                     </div>
                     <Button type="submit" fullWidth>Request Booking</Button>
                 </form>
             </Modal>
        </div>
    );
};

const GuidelinesView = () => (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Clearance Guidelines</h2>
            <p className="text-slate-500 mt-2">Official procedures for the Fall 2025 Semester</p>
        </div>
        
        {[
            { title: 'Library Clearance', icon: BookOpen, text: 'All borrowed books must be returned 7 days prior to the final exam. Late fees are calculated at TK 50/day.' },
            { title: 'Laboratory Dues', icon: Beaker, text: 'Breakage fees must be paid at the Bursar office. Get the receipt signed by the Lab Technician.' },
            { title: 'Hall Clearance', icon: Home, text: 'Room handover checklist must be signed by the Provost. Keys must be returned to the caretaker.' },
            { title: 'Emergency Protocol', icon: Siren, text: 'In case of medical or travel urgency, apply for Emergency Clearance. This requires Registrar approval and has a yearly quota.' }
        ].map((rule, i) => (
            <div key={i} className="flex gap-4 p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <rule.icon size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 text-lg mb-2">{rule.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{rule.text}</p>
                </div>
            </div>
        ))}
    </div>
);

const AdminUserManagement = ({ users, setUsers, addNotification, addUser }) => {
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Student', dept: '', studentId: '' });

    const handleAddUser = (e) => {
        e.preventDefault();
        addUser(newUser);
        setIsAddUserModalOpen(false);
        setNewUser({ name: '', email: '', role: 'Student', dept: '', studentId: '' });
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
                <Button icon={Plus} onClick={() => setIsAddUserModalOpen(true)}>Add New User</Button>
            </div>
            <Card noPadding className="overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold">
                        <tr>
                            <th className="p-4">User</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-slate-50">
                                <td className="p-4">
                                    <div className="font-bold text-slate-800">{user.name}</div>
                                    <div className="text-xs text-slate-500">{user.email}</div>
                                </td>
                                <td className="p-4"><span className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-bold uppercase">{user.role}</span></td>
                                <td className="p-4"><span className="text-emerald-600 font-bold text-xs flex items-center gap-1"><CheckCircle size={12}/> {user.status}</span></td>
                                <td className="p-4 text-right">
                                    <button className="text-slate-400 hover:text-blue-600 p-1"><Edit2 size={16}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            <Modal isOpen={isAddUserModalOpen} onClose={() => setIsAddUserModalOpen(false)} title="Add New User">
                <form onSubmit={handleAddUser} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                        <input required className="w-full p-3 border border-slate-200 rounded-xl" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} placeholder="John Doe" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                        <input required type="email" className="w-full p-3 border border-slate-200 rounded-xl" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} placeholder="john@uni.edu" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Role</label>
                            <select className="w-full p-3 border border-slate-200 rounded-xl bg-white" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                                <option>Student</option>
                                <option>Officer</option>
                                <option>Admin</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Department</label>
                            <input className="w-full p-3 border border-slate-200 rounded-xl" value={newUser.dept} onChange={e => setNewUser({...newUser, dept: e.target.value})} placeholder="e.g. CSE or Library" />
                        </div>
                    </div>
                    {newUser.role === 'Student' && (
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Student ID</label>
                            <input required className="w-full p-3 border border-slate-200 rounded-xl" value={newUser.studentId} onChange={e => setNewUser({...newUser, studentId: e.target.value})} placeholder="011..." />
                        </div>
                    )}
                    <Button type="submit" fullWidth>Create Account</Button>
                </form>
            </Modal>
        </div>
    );
};

const AdminSettings = () => (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in">
        <h2 className="text-2xl font-bold text-slate-800">System Configuration</h2>
        <Card className="space-y-6">
            <div>
                <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Clearance SLAs</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Standard Processing Time</label>
                        <select className="w-full p-2 border border-slate-200 rounded-lg"><option>24 Hours</option><option>48 Hours</option></select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Emergency SLA</label>
                        <select className="w-full p-2 border border-slate-200 rounded-lg"><option>12 Hours</option><option>6 Hours</option></select>
                    </div>
                </div>
            </div>
            <div>
                <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">System Access</h3>
                <div className="flex items-center justify-between py-2">
                    <span className="text-slate-700 font-medium">Allow Student Logins</span>
                    <ToggleRight size={32} className="text-emerald-500 cursor-pointer"/>
                </div>
                <div className="flex items-center justify-between py-2">
                    <span className="text-slate-700 font-medium">Maintenance Mode</span>
                    <ToggleLeft size={32} className="text-slate-300 cursor-pointer"/>
                </div>
            </div>
            <div className="pt-4">
                <Button fullWidth>Save Changes</Button>
            </div>
        </Card>
    </div>
);

const StudentDashboard = ({ studentProfile, clearanceItems, emergencyRequests, handleEmergencySubmit, updateClearanceItem, onNavigate, config }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(null);
  const [uploading, setUploading] = useState(null);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [emergencyForm, setEmergencyForm] = useState({ type: 'Medical', reason: '', date: '', phone: '', file: null });

  const activeEmergency = emergencyRequests.find(req => req.studentId === studentProfile.studentId && req.status !== 'Closed');
  const isEmergencyApproved = activeEmergency && activeEmergency.status === 'Approved';
  
  const onSubmitEmergency = (e) => {
      e.preventDefault();
      const success = handleEmergencySubmit(studentProfile, emergencyForm);
      if (success) {
          setShowEmergencyModal(false);
          setEmergencyForm({ type: 'Medical', reason: '', date: '', phone: '', file: null });
      }
  };

  const myItems = useMemo(() => {
      const items = clearanceItems.filter(item => item.studentId === studentProfile.studentId);
      return items.sort((a, b) => {
          const getScore = (status) => {
              if (status === 'Rejected') return 0;
              if (status === 'Approved') return 2;
              return 1; 
          };
          return getScore(a.status) - getScore(b.status);
      });
  }, [clearanceItems, studentProfile]);
  
  const completedCount = myItems.filter(i => i.status === 'Approved').length;
  const totalItems = myItems.length;
  const progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;
  
  const totalDue = myItems.reduce((acc, curr) => acc + (curr.paid ? 0 : curr.fee), 0);
  const isCleared = totalItems > 0 && myItems.every(i => i.status === 'Approved');

  const handleUpload = (id) => {
    setUploading(id);
    setTimeout(() => {
      updateClearanceItem(id, { status: 'Reviewing', note: 'Document uploaded.', uploadedFile: 'Proof.pdf' });
      setUploading(null);
    }, 1500);
  };

  const handlePay = (id) => {
    updateClearanceItem(id, { paid: true, fee: 0, status: 'Pending', docRequired: true, note: 'Payment successful.' });
    setShowPaymentModal(null);
  };

  const getIconForType = (type) => {
    switch(type) {
        case 'Library': return <BookOpen size={20} className="text-blue-500" />;
        case 'Finance': return <CreditCard size={20} className="text-purple-500" />;
        case 'Departmental': return <Beaker size={20} className="text-orange-500" />;
        case 'Hostel': return <Home size={20} className="text-emerald-500" />;
        case 'Administrative': return <Stamp size={20} className="text-slate-700" />;
        default: return <FileText size={20} className="text-slate-500" />;
    }
  };

  // Progress Circle Calculation
  const baseSize = 120; 
  const strokeWidth = 8;
  const center = baseSize / 2;
  const radius = (baseSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // LOGIC UPDATE FOR BUTTON:
  const canDownload = isCleared || isEmergencyApproved;
  const buttonText = isCleared 
    ? 'Download Certificate' 
    : isEmergencyApproved 
        ? 'Download Provisional' 
        : `${totalItems - completedCount} Steps Remaining`;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* UPDATE EMERGENCY BANNER STYLE */}
      {activeEmergency && (
          <div className={`p-6 rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-l-4 ${isEmergencyApproved ? 'bg-emerald-50 border-l-emerald-500' : 'bg-rose-50 border-l-rose-500'}`}>
              <div className="space-y-1">
                  <h3 className={`font-bold flex items-center gap-2 text-lg ${isEmergencyApproved ? 'text-emerald-800' : 'text-rose-800'}`}>
                      {isEmergencyApproved ? <CheckCircle size={24} /> : <Siren size={24} className="animate-pulse"/>}
                      {isEmergencyApproved ? 'Emergency Clearance Approved' : 'Active Emergency Clearance'}
                  </h3>
                  <p className={`text-sm ${isEmergencyApproved ? 'text-emerald-700' : 'text-rose-700'}`}>
                    Reason: <span className="font-medium">{activeEmergency.reason}</span> • Type: {activeEmergency.type}
                  </p>
              </div>
              <div className="text-right bg-white/50 px-4 py-2 rounded-lg border border-white/50">
                  {isEmergencyApproved ? (
                      <Button onClick={() => onNavigate('certificate')} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200">View Certificate</Button>
                  ) : (
                      <>
                        <span className="text-[10px] uppercase font-bold text-rose-500 block tracking-wider mb-1">SLA Countdown</span>
                        <span className="text-2xl font-mono font-bold text-rose-700 flex items-center gap-2 justify-end">
                            <Timer className="inline mb-1" size={20}/>
                            <CountDownTimer submissionTime={activeEmergency.submissionTime} durationHours={config.emergencySLAHours} />
                        </span>
                      </>
                  )}
              </div>
          </div>
      )}

      {/* ... (Rest of layout matches previous, just updated button logic) ... */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-2 p-0 bg-blue-700 text-white border-none overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-indigo-800 opacity-90"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
          
          <div className="relative z-10 p-8 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex-1 w-full space-y-6">
              <div>
                  <div className="flex items-center gap-3 mb-1">
                     <h2 className="text-3xl font-bold tracking-tight">{studentProfile.name}</h2>
                     <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-mono text-blue-50">{studentProfile.studentId}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm text-blue-100 mt-4">
                     <div><span className="block text-[10px] opacity-60 uppercase tracking-wider font-bold mb-0.5">Department</span>{studentProfile.dept || 'N/A'}</div>
                     <div><span className="block text-[10px] opacity-60 uppercase tracking-wider font-bold mb-0.5">Batch</span>{studentProfile.batch || 'N/A'}</div>
                     <div><span className="block text-[10px] opacity-60 uppercase tracking-wider font-bold mb-0.5">Semester</span>{studentProfile.semester || 'N/A'}</div>
                     <div><span className="block text-[10px] opacity-60 uppercase tracking-wider font-bold mb-0.5">Status</span><span className="text-emerald-300 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full">Active</span></div>
                  </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                 <div className="flex flex-col sm:flex-row items-center gap-4">
                   <div className="flex-1 w-full">
                       <span className="text-[10px] opacity-60 uppercase tracking-wider font-bold block mb-2">Financial Status</span>
                       {totalDue > 0 ? (
                           <div className="flex items-center gap-3 bg-amber-500/20 px-4 py-3 rounded-xl border border-amber-500/30 backdrop-blur-sm">
                               <AlertCircle size={24} className="text-amber-300" />
                               <div>
                                   <span className="text-[10px] uppercase font-bold text-amber-200 block leading-none mb-1">Total Payable</span>
                                   <span className="text-2xl font-bold text-white">TK {totalDue.toFixed(2)}</span>
                               </div>
                           </div>
                       ) : (
                           <div className="flex items-center gap-2 text-emerald-300 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20 w-fit"><CheckCircle size={20} /><span className="font-bold uppercase tracking-wide">All Dues Cleared</span></div>
                       )}
                   </div>
                 </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => onNavigate('appointments')} className="bg-white/10 hover:bg-white/20 border-white/10 text-white backdrop-blur-sm" icon={Calendar}>Book Appointment</Button>
                {!activeEmergency && !isCleared && (<Button onClick={() => setShowEmergencyModal(true)} className="bg-rose-500 hover:bg-rose-600 border-transparent text-white shadow-lg shadow-rose-900/20" icon={Siren}>Emergency Clearance</Button>)}
              </div>
            </div>

            <div className="relative flex-shrink-0 flex flex-col items-center">
              <div className="relative w-48 h-48">
                  <svg viewBox={`0 0 ${baseSize} ${baseSize}`} className="transform -rotate-90 w-full h-full">
                    <circle cx={center} cy={center} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" className="text-blue-900/30" />
                    <circle cx={center} cy={center} r={radius} stroke="white" strokeWidth={strokeWidth} fill="transparent" strokeDasharray={circumference} strokeDashoffset={circumference - (circumference * progress) / 100} className="transition-all duration-1000 ease-out drop-shadow-glow" strokeLinecap="round"/>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold text-white">{progress}%</span>
                      <span className="text-[10px] uppercase tracking-widest text-blue-200 mt-1 font-bold">Cleared</span>
                  </div>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-8 flex flex-col justify-center items-center text-center border border-slate-200 hover:border-blue-300 h-full bg-gradient-to-b from-white to-blue-50/50 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 text-blue-600 shadow-inner group-hover:scale-110 transition-transform duration-300">
             <GraduationCap size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Final Clearance</h3>
          <p className="text-sm text-slate-500 mb-8 leading-relaxed max-w-[200px]">Certificate available upon 100% completion or via Emergency Override.</p>
          <Button 
             disabled={!canDownload} 
             onClick={() => onNavigate('certificate')} 
             fullWidth
             variant={canDownload ? 'primary' : 'secondary'}
             className={canDownload ? 'shadow-lg shadow-blue-200/50' : 'opacity-60 cursor-not-allowed'}
          >
             {buttonText}
          </Button>
        </Card>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-6 px-1">
            <h3 className="text-xl font-bold text-slate-800">Clearance Modules</h3>
            <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">{totalItems} Total</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myItems.map((item) => (
            <Card key={item.id} className={`p-0 flex flex-col h-full overflow-hidden border-l-4 ${item.status === 'Approved' ? 'border-l-emerald-500' : item.status === 'Rejected' ? 'border-l-rose-500' : 'border-l-amber-500'} ${!!activeEmergency && !isEmergencyApproved ? 'ring-2 ring-rose-100' : ''}`}>
              <div className="p-6 pb-4 flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-600">{getIconForType(item.type)}</div>
                  <div>
                      <h4 className="font-bold text-slate-800 text-lg">{item.unit}</h4>
                      <p className="text-xs text-slate-500 font-medium tracking-wide uppercase mt-0.5">{item.type} Module</p>
                  </div>
                </div>
                <StatusBadge status={item.status} isEmergency={!!activeEmergency && item.status !== 'Approved' && !isEmergencyApproved} />
              </div>
              
              <div className="px-6 flex-1 space-y-4">
                {item.note && (
                    <div className={`p-3 rounded-lg border text-sm flex gap-3 ${item.status === 'Rejected' ? 'bg-rose-50 border-rose-100 text-rose-800' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                        <div className="mt-0.5 flex-shrink-0">{item.status === 'Rejected' ? <AlertCircle size={16} /> : <FileText size={16}/>}</div>
                        <div>
                            <span className="font-bold text-xs uppercase block mb-1 opacity-80">{item.status === 'Rejected' ? 'Rejection Reason' : 'Officer Note'}</span>
                            <span className="leading-relaxed">"{item.note}"</span>
                        </div>
                    </div>
                )}
                
                {item.breakdown && (
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-sm">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-wider">Fee Breakdown</p>
                        <div className="space-y-2">
                            {item.breakdown.map((fee, idx) => (
                                <div key={idx} className="flex justify-between">
                                    <span className="text-slate-600">{fee.label}</span>
                                    <span className="font-mono font-medium text-slate-800">TK {fee.amount.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-slate-200 mt-3 pt-3 flex justify-between font-bold text-slate-900">
                            <span>Total Due</span>
                            <span>TK {item.fee.toFixed(2)}</span>
                        </div>
                    </div>
                )}
                
                {item.checklist && (
                    <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 space-y-2">
                        {[...item.checklist].sort((a, b) => {
                            const aDone = isPositiveStatus(a.status);
                            const bDone = isPositiveStatus(b.status);
                            if (aDone === bDone) return 0;
                            return aDone ? 1 : -1; 
                        }).map((check, idx) => (
                            <div key={idx} className="flex items-center gap-3 text-sm p-1">
                                {isPositiveStatus(check.status) ? <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-300 flex-shrink-0"></div>}
                                <span className={`${isPositiveStatus(check.status) ? 'text-slate-400 line-through' : 'text-slate-700 font-medium'}`}>{check.label}</span>
                            </div>
                        ))}
                    </div>
                )}
              </div>
              
              <div className="p-6 mt-auto">
                {item.fee > 0 && !item.paid ? (
                    <Button onClick={() => setShowPaymentModal(item)} fullWidth variant="danger" className="shadow-md shadow-rose-100">
                        Pay TK {item.fee.toFixed(2)} Now
                    </Button>
                ) : item.status === 'Rejected' || (item.status === 'Pending' && (item.docRequired || item.type === 'Administrative')) ? (
                    <Button variant="secondary" fullWidth onClick={() => handleUpload(item.id)}>
                        {uploading === item.id ? 'Uploading...' : <><UploadCloud size={16} /> {item.type === 'Administrative' ? 'Submit Registration Card' : 'Upload Proof'}</>}
                    </Button>
                ) : (
                    <div className="text-center text-xs text-slate-400 font-medium bg-slate-50 py-2.5 rounded-lg">Updated: {new Date().toLocaleTimeString()}</div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Modal isOpen={!!showPaymentModal} onClose={() => setShowPaymentModal(null)} title="Secure Payment Gateway">
        {showPaymentModal && (
          <div className="space-y-8">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex justify-between items-center shadow-inner">
              <div>
                  <span className="block text-slate-500 text-xs uppercase tracking-wider font-bold mb-1">Total Amount</span>
                  <span className="text-4xl font-black text-slate-800 tracking-tight">TK {showPaymentModal.fee.toFixed(2)}</span>
              </div>
              <div className="text-right">
                  <span className="block text-slate-500 text-xs uppercase tracking-wider font-bold mb-1">For</span>
                  <span className="font-bold text-slate-700 bg-white px-4 py-1.5 rounded-lg border border-slate-200 shadow-sm">{showPaymentModal.unit}</span>
              </div>
            </div>
            
            <div className="space-y-4">
                <div className="relative">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block ml-1">Card Number</label>
                    <div className="flex items-center border border-slate-200 rounded-xl px-4 py-3 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                        <CreditCard size={20} className="text-slate-400 mr-3"/>
                        <input type="text" placeholder="0000 0000 0000 0000" className="w-full outline-none text-slate-700 font-mono bg-transparent" disabled/>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block ml-1">Expiry</label>
                        <input type="text" placeholder="MM/YY" className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-white shadow-sm outline-none text-slate-700 font-mono text-center" disabled/>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block ml-1">CVC</label>
                        <input type="text" placeholder="123" className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-white shadow-sm outline-none text-slate-700 font-mono text-center" disabled/>
                    </div>
                </div>
            </div>

            <div>
                <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mb-4">
                    <Lock size={12} /> 256-bit SSL Encrypted Connection
                </div>
                <Button onClick={() => handlePay(showPaymentModal.id)} fullWidth className="h-12 text-base shadow-xl shadow-blue-200">Confirm Payment</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={showEmergencyModal} onClose={() => setShowEmergencyModal(false)} title="🚨 Emergency Clearance Request">
          <form onSubmit={onSubmitEmergency} className="space-y-5">
              <div className="p-4 bg-amber-50 text-amber-800 rounded-xl text-sm border border-amber-100 flex gap-3 leading-relaxed">
                  <ShieldAlert className="flex-shrink-0 text-amber-600" size={20} />
                  <p>Emergency clearance is strictly reserved for medical, job, or travel urgency. <br/><span className="font-bold mt-1 block">Quota Remaining: {config.maxEmergencyRequestsPerYear - studentProfile.emergencyQuotaUsed}/{config.maxEmergencyRequestsPerYear}</span></p>
              </div>
              
              <div className="space-y-4">
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Request Type</label>
                      <div className="relative">
                          <select className="w-full border border-slate-200 p-3 rounded-xl bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" required value={emergencyForm.type} onChange={e => setEmergencyForm({...emergencyForm, type: e.target.value})}>
                              <option>Medical Emergency</option>
                              <option>Job Joining</option>
                              <option>Visa/Travel</option>
                              <option>Other</option>
                          </select>
                          <ChevronDown size={16} className="absolute right-4 top-4 text-slate-400 pointer-events-none" />
                      </div>
                  </div>
                  
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Reason for Urgency</label>
                      <textarea required className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none text-sm" rows="3" placeholder="Describe why you need expedited clearance..." value={emergencyForm.reason} onChange={e => setEmergencyForm({...emergencyForm, reason: e.target.value})} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Date Needed</label>
                          <input required type="date" className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" value={emergencyForm.date} onChange={e => setEmergencyForm({...emergencyForm, date: e.target.value})} />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Emergency Contact</label>
                          <input required type="tel" placeholder="+880..." className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" value={emergencyForm.phone} onChange={e => setEmergencyForm({...emergencyForm, phone: e.target.value})} />
                      </div>
                  </div>

                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Supporting Document</label>
                      <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                          <input required type="file" className="hidden" id="file-upload" />
                          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors"><UploadCloud size={20}/></div>
                              <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">Click to upload proof</span>
                              <span className="text-xs text-slate-400">PDF, JPG or PNG (Max 5MB)</span>
                          </label>
                      </div>
                  </div>
              </div>
              
              <div className="pt-2">
                  <Button type="submit" variant="emergency" fullWidth className="h-12 text-base">Submit Priority Request</Button>
              </div>
          </form>
      </Modal>
    </div>
  );
};

const AdminAnalytics = ({ clearanceItems, emergencyRequests, handleAdminOverride }) => {
  const total = clearanceItems.length;
  const approved = clearanceItems.filter(i => i.status === 'Approved').length;
  const pending = clearanceItems.filter(i => i.status === 'Pending' || i.status === 'Reviewing').length;

  const escalatedRequests = emergencyRequests.filter(req => {
    // Check if 12 hours passed
    const elapsed = new Date().getTime() - new Date(req.submissionTime).getTime();
    const isOverdue = elapsed > (12 * 60 * 60 * 1000);
    return isOverdue && req.status === 'Active';
  });

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center">
         <div>
            <h2 className="text-2xl font-bold text-slate-800">Admin Overview</h2>
            <p className="text-slate-500 text-sm">System-wide health and performance metrics</p>
         </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[{ label: 'Active Requests', value: total, icon: <Users />, color: 'bg-blue-500' }, { label: 'Approvals', value: approved, icon: <CheckCircle />, color: 'bg-emerald-500' }, { label: 'Pending Action', value: pending, icon: <AlertCircle />, color: 'bg-amber-500' }].map((stat, i) => (
          <Card key={i} className="p-6 flex items-center gap-5 border-none shadow-md hover:shadow-lg transition-all duration-200">
              <div className={`p-4 rounded-xl text-white shadow-lg ${stat.color}`}>{stat.icon}</div>
              <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-3xl font-black text-slate-800 mt-1">{stat.value}</p>
              </div>
          </Card>
        ))}
      </div>

      {escalatedRequests.length > 0 && (
        <Card className="p-0 border-rose-200 bg-white overflow-hidden">
            <div className="p-6 border-b border-rose-100 bg-rose-50/50 flex justify-between items-center">
                <h3 className="font-bold text-rose-800 flex items-center gap-2"><Siren size={20} className="animate-pulse"/> Escalated Emergency Overrides</h3>
                <span className="bg-rose-100 text-rose-700 text-xs font-bold px-3 py-1 rounded-full">{escalatedRequests.length} Requires Action</span>
            </div>
            <div className="divide-y divide-slate-100">
                {escalatedRequests.map(req => (
                    <div key={req.id} className="p-6 hover:bg-slate-50 transition-colors flex justify-between items-center">
                        <div>
                            <p className="font-bold text-slate-800 flex items-center gap-3">
                                {req.studentId} 
                                <span className="text-[10px] bg-rose-100 text-rose-600 px-2 py-0.5 rounded uppercase font-bold border border-rose-200">Overdue {'>'} 12h</span>
                            </p>
                            <p className="text-sm text-rose-600 mt-1 font-medium">Reason: {req.reason}</p>
                            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><Clock size={12}/> Submitted: {new Date(req.submissionTime).toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="danger" onClick={() => handleAdminOverride(req.studentId)} className="shadow-sm">Approve Override</Button>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
      )}

      <Card className="p-6"><h3 className="font-bold text-slate-700 mb-4">Recent System Logs</h3><div className="space-y-4"><div className="flex items-center justify-between text-sm border-b border-slate-50 pb-2"><span className="text-slate-700">System sync check completed</span><span className="text-slate-400 text-xs">Just now</span></div></div></Card>
    </div>
  );
};

const OfficerQueue = ({ activeUser, clearanceItems, updateClearanceItem, addNotification, emergencyRequests, onEmergencyApprove }) => {
  const selectedUnit = activeUser.dept; 
  const [selectedRequestId, setSelectedRequestId] = useState(null); 
  const [comment, setComment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const urgentRequests = emergencyRequests.filter(req => req.status === 'Active');

  const queue = useMemo(() => {
      // 1. FILTERING LOGIC
      let filtered = clearanceItems;

      if (searchTerm) {
          // SEARCH MODE: Filter by ID or Name
          const term = searchTerm.toLowerCase();
          filtered = filtered.filter(item => 
              item.studentId.toLowerCase().includes(term) || 
              item.studentName.toLowerCase().includes(term)
          );

          // REGISTRAR SPECIAL ACCESS: Can see items from other units if searching
          if (activeUser.dept !== 'Registrar Office') {
               filtered = filtered.filter(item => item.unit === selectedUnit);
          }
      } else {
          // DEFAULT MODE: Pending/Active items for MY UNIT only
          filtered = filtered.filter(item => {
              if (item.unit !== selectedUnit) return false;
              const isUrgent = urgentRequests.some(r => r.studentId === item.studentId);
              if (isUrgent && item.status !== 'Approved') return true; 
              return ['Pending', 'Reviewing', 'Submitted'].includes(item.status);
          });
      }

      // 2. DEDUPLICATION (For Search Mode mainly)
      // If we show multiple units for same student, user might get confused. 
      // Let's show unique Students. For each student, pick the most relevant item (My Unit > First Available)
      const uniqueStudents = [];
      const studentMap = new Map();

      filtered.forEach(item => {
          if (!studentMap.has(item.studentId)) {
              studentMap.set(item.studentId, []);
          }
          studentMap.get(item.studentId).push(item);
      });

      studentMap.forEach((items, studentId) => {
          // Try to find item for THIS unit
          let bestItem = items.find(i => i.unit === selectedUnit);
          // If not found (Registrar searching global), pick first
          if (!bestItem) bestItem = items[0];
          uniqueStudents.push(bestItem);
      });

      return uniqueStudents;
  }, [clearanceItems, searchTerm, selectedUnit, urgentRequests, activeUser.dept]);

  // DERIVE SELECTED REQUEST
  const selectedRequest = useMemo(() => {
      if (!selectedRequestId) return null;
      let item = clearanceItems.find(item => item.id === selectedRequestId);
      
      // REGISTRAR CONTEXT SWITCH:
      // If I selected an item that is NOT 'Registrar Office' (via search), 
      // try to find the corresponding 'Registrar Office' item for that student to allow actions.
      if (item && activeUser.dept === 'Registrar Office' && item.unit !== 'Registrar Office') {
          const registrarItem = clearanceItems.find(i => i.studentId === item.studentId && i.unit === 'Registrar Office');
          if (registrarItem) return registrarItem; 
          // If no registrar item exists, return original (view only)
      }
      return item;
  }, [clearanceItems, selectedRequestId, activeUser.dept]);

  const studentFullClearance = selectedRequest ? clearanceItems.filter(item => item.studentId === selectedRequest.studentId && item.unit !== 'Registrar Office') : [];
  const allOthersApproved = studentFullClearance.every(item => item.status === 'Approved');
  
  const activeStudentEmergency = selectedRequest ? urgentRequests.find(r => r.studentId === selectedRequest.studentId) : null;

  const pendingCount = clearanceItems.filter(item => item.unit === selectedUnit && ['Pending', 'Reviewing'].includes(item.status)).length;
  const totalProcessed = clearanceItems.filter(i => i.unit === selectedUnit && i.status !== 'Pending').length;

  const handleAction = (status) => {
    if (!selectedRequest) return;
    updateClearanceItem(selectedRequest.id, { status, note: comment || (status === 'Rejected' ? 'Rejected by officer' : 'Approved by officer') });
    addNotification({ title: `Clearance ${status}`, msg: `Your request for ${selectedUnit} has been ${status}.`, targetRole: 'student', targetId: selectedRequest.studentId });
    setSelectedRequestId(null);
    setComment('');
  };

  const toggleChecklistItem = (index) => {
      if (!selectedRequest) return;
      const updatedChecklist = [...selectedRequest.checklist];
      const currentStatus = updatedChecklist[index].status;
      const newStatus = isPositiveStatus(currentStatus) ? 'Pending' : 'Cleared';
      updatedChecklist[index] = { ...updatedChecklist[index], status: newStatus };
      updateClearanceItem(selectedRequest.id, { checklist: updatedChecklist });
  };

  return (
    <div className="flex flex-col h-full">
      {urgentRequests.length > 0 && (
          <div className="bg-rose-600 text-white p-3 flex justify-between items-center animate-pulse-slow">
              <span className="font-bold flex items-center gap-2"><Siren size={18}/> {urgentRequests.length} EMERGENCY REQUESTS PENDING</span>
              <span className="text-xs bg-white/20 px-2 py-1 rounded">SLA: &lt; 24h</span>
          </div>
      )}

      <div className="bg-white border-b border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                {selectedUnit}
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full border border-blue-200">Dashboard</span>
            </h2>
            <p className="text-slate-500 text-sm mt-1">Manage student clearance requests and verifications</p>
         </div>
         <div className="flex gap-3">
            <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl flex flex-col items-center min-w-[100px] shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase">Pending</span>
                <span className="text-xl font-black text-blue-600">{pendingCount}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl flex flex-col items-center min-w-[100px] shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase">Processed</span>
                <span className="text-xl font-black text-emerald-600">{totalProcessed}</span>
            </div>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden bg-slate-50/50">
        {/* LEFT SIDE: QUEUE LIST */}
        <Card className="w-1/3 flex flex-col rounded-none border-r border-t-0 border-b-0 border-l-0 shadow-none" noPadding>
            <div className="p-4 border-b border-slate-100 bg-white sticky top-0 z-10">
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search Student ID..." 
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Filter size={14} className="absolute left-3 top-3 text-slate-400" />
                </div>
            </div>
            <div className="overflow-y-auto flex-1 scrollbar-hide">
            {queue.map(item => {
                const isUrgent = urgentRequests.some(r => r.studentId === item.studentId);
                const isSelected = selectedRequestId === item.id;
                return (
                <div key={item.id} onClick={() => setSelectedRequestId(item.id)} className={`p-4 border-b border-slate-100 cursor-pointer transition-all duration-200 hover:bg-slate-50 group relative ${isSelected ? 'bg-blue-50/50' : 'bg-white'}`}>
                    {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>}
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm transition-colors ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'}`}>
                                {getInitials(item.studentName)}
                             </div>
                             <div>
                                <h4 className={`font-bold text-sm ${isSelected ? 'text-blue-800' : 'text-slate-700'}`}>{item.studentName}</h4>
                                <p className="text-xs text-slate-500 font-mono">{item.studentId}</p>
                             </div>
                        </div>
                        {isUrgent && <Siren size={16} className="text-rose-600 animate-pulse" />}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-wider">Batch {item.batch || 'N/A'}</span>
                        <StatusBadge status={item.status} />
                    </div>
                </div>
            )})}
            {queue.length === 0 && (<div className="p-8 text-center text-slate-400 flex flex-col items-center h-full justify-center"><CheckCircle size={48} className="mb-4 opacity-10" /><p>{searchTerm ? 'No student found' : 'All caught up!'}</p><p className="text-xs mt-1">{searchTerm ? 'Try a different ID' : `No pending requests for ${selectedUnit}.`}</p></div>)}
            </div>
        </Card>

        {/* RIGHT SIDE: DETAILS PANEL */}
        <div className="flex-1 p-8 overflow-y-auto scroll-smooth">
            {selectedRequest ? (
            <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
                <Card className="mb-6 border-t-4 border-t-blue-600 shadow-lg">
                    <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800 mb-1">{selectedRequest.studentName}</h1>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                <span className="flex items-center gap-1"><Hash size={14}/> {selectedRequest.studentId}</span>
                                <span className="flex items-center gap-1"><Users size={14}/> Batch {selectedRequest.batch || 'N/A'}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <StatusBadge status={selectedRequest.status} />
                            <p className="text-xs text-slate-400 mt-2">Last Updated: Today</p>
                        </div>
                    </div>
                
                    {/* EMERGENCY BANNER & ACTION FOR REGISTRAR */}
                    {activeStudentEmergency && (
                        <div className="mb-8 bg-rose-50 border border-rose-100 p-5 rounded-xl relative overflow-hidden shadow-sm">
                            <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-rose-100 rounded-full blur-2xl"></div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-rose-800 text-base flex items-center gap-2 mb-3">
                                            <Siren size={20} className="animate-pulse"/> 
                                            Emergency Override Request
                                            <span className="ml-auto text-xs font-mono bg-rose-100 px-2 py-1 rounded text-rose-700 border border-rose-200 shadow-sm">
                                                <Clock size={12} className="inline mr-1 mb-0.5"/>
                                                <TimeAgo timestamp={activeStudentEmergency.submissionTime} />
                                            </span>
                                        </h4>
                                        <div className="text-sm text-slate-700 grid grid-cols-2 gap-x-8 gap-y-2">
                                            <div><span className="text-xs text-slate-500 uppercase font-bold block mb-0.5">Reason</span>{activeStudentEmergency.reason}</div>
                                            <div><span className="text-xs text-slate-500 uppercase font-bold block mb-0.5">Contact</span>{activeStudentEmergency.phone}</div>
                                            <div><span className="text-xs text-slate-500 uppercase font-bold block mb-0.5">Date Needed</span>{activeStudentEmergency.date}</div>
                                            <div><span className="text-xs text-slate-500 uppercase font-bold block mb-0.5">Proof</span><a href="#" className="text-blue-600 underline flex items-center gap-1 font-medium hover:text-blue-800"><ExternalLink size={12}/> View Document</a></div>
                                        </div>
                                    </div>
                                    {selectedUnit === 'Registrar Office' && (
                                        <div className="flex flex-col gap-2 items-end">
                                            <Button variant="emergency" className="text-xs px-4 py-2 shadow-none" onClick={() => {
                                                onEmergencyApprove(selectedRequest.studentId);
                                                setSelectedRequestId(null);
                                            }}>
                                                Approve Override
                                            </Button>
                                            <span className="text-[10px] text-rose-600 font-medium max-w-[140px] text-right leading-tight">Authorizes provisional certificate despite pending dues.</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-8">
                        {/* REGISTRAR SEES ALL STATUSES */}
                        {selectedUnit === 'Registrar Office' && (
                            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 shadow-inner">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-sm font-bold text-slate-700 uppercase flex items-center gap-2"><Stamp size={16} className="text-slate-400" /> Departmental Clearances</h4>
                                    {allOthersApproved ? <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded font-bold border border-emerald-200 flex items-center gap-1 shadow-sm"><CheckCircle size={12}/> All Verified</span> : <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded font-bold border border-amber-200 flex items-center gap-1 shadow-sm"><Clock size={12}/> Pending Signatures</span>}
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {studentFullClearance.map(item => (
                                        <div key={item.id} className="flex justify-between items-center text-sm p-3 bg-white rounded-lg border border-slate-200 shadow-sm transition-all hover:border-blue-200">
                                            <span className="font-medium text-slate-700">{item.unit}</span>
                                            <StatusBadge status={item.status} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedRequest.status === 'Reviewing' && selectedRequest.uploadedFile && (
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white rounded-lg border border-blue-100 shadow-sm text-blue-600"><FileText size={24} /></div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">Proof of Payment / Document</p>
                                        <p className="text-xs text-blue-600 underline cursor-pointer mt-0.5 font-medium">{selectedRequest.uploadedFile}</p>
                                    </div>
                                </div>
                                <Button variant="secondary" className="h-9 text-xs bg-white shadow-sm" onClick={() => alert("Opening document preview...")} icon={Eye}>Preview</Button>
                            </div>
                        )}
                        
                        {selectedRequest.breakdown && (
                            <div>
                                <h4 className="text-sm font-bold text-slate-800 uppercase mb-4 flex items-center gap-2"><CreditCard size={16} className="text-slate-400"/> Financial Status</h4>
                                <div className="bg-slate-50 rounded-xl p-0 border border-slate-200 overflow-hidden shadow-sm">
                                    <div className="divide-y divide-slate-200">
                                        {selectedRequest.breakdown.map((fee, idx) => (
                                            <div key={idx} className="flex justify-between text-sm p-4 hover:bg-slate-100 transition-colors">
                                                <span className="text-slate-600 font-medium">{fee.label}</span>
                                                <span className="font-mono font-bold text-slate-800">TK {fee.amount.toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="bg-slate-100 p-4 flex justify-between items-center border-t border-slate-200">
                                        <span className="font-bold text-slate-700">Total Payable</span>
                                        <span className="font-mono text-xl font-black text-slate-900">TK {selectedRequest.fee.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className={`mt-3 p-3 rounded-lg text-center text-sm font-bold border flex items-center justify-center gap-2 shadow-sm ${selectedRequest.paid ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                                    {selectedRequest.paid ? <CheckCircle size={18}/> : <XCircle size={18}/>}
                                    {selectedRequest.paid ? 'PAYMENT VERIFIED & CLEARED' : 'PAYMENT PENDING'}
                                </div>
                            </div>
                        )}

                        {selectedRequest.checklist && (
                            <div>
                                <h4 className="text-sm font-bold text-slate-800 uppercase mb-4 flex items-center gap-2"><CheckCircle size={16} className="text-slate-400"/> Checklist Verification</h4>
                                <div className="space-y-3">
                                    {selectedRequest.checklist.map((c, i) => (
                                        <div key={i} className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer group ${isPositiveStatus(c.status) ? 'bg-emerald-50 border-emerald-200 shadow-sm' : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md'}`} onClick={() => toggleChecklistItem(i)}>
                                            <div className="flex items-center gap-4">
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isPositiveStatus(c.status) ? 'bg-emerald-500 border-emerald-500 scale-110' : 'border-slate-300 bg-white group-hover:border-blue-400'}`}>
                                                    {isPositiveStatus(c.status) && <Check size={14} className="text-white" />}
                                                </div>
                                                <span className={`text-sm font-medium ${isPositiveStatus(c.status) ? 'text-emerald-900' : 'text-slate-700'}`}>{c.label}</span>
                                            </div>
                                            <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${isPositiveStatus(c.status) ? 'bg-white text-emerald-700 shadow-sm' : 'bg-slate-100 text-slate-500'}`}>
                                                {c.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100">
                        {/* Only show actions if this is the correct unit */}
                        {selectedRequest.unit === selectedUnit ? (
                            <>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Officer Decision & Notes</label>
                                <textarea 
                                    className="w-full border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 mb-4 resize-none h-32 bg-slate-50 transition-all shadow-inner" 
                                    placeholder="Enter any remarks regarding this application..." 
                                    value={comment} 
                                    onChange={(e) => setComment(e.target.value)} 
                                />
                                <div className="flex gap-4">
                                    <Button variant="danger" className="flex-1 h-12 text-base bg-white border-2 border-rose-100 text-rose-600 hover:bg-rose-50 hover:border-rose-200 shadow-none" onClick={() => handleAction('Rejected')}>
                                        <XCircle size={18} /> Reject Request
                                    </Button>
                                    <Button className="flex-[2] h-12 text-base shadow-xl shadow-blue-100" onClick={() => handleAction('Approved')} disabled={selectedUnit === 'Registrar Office' && !allOthersApproved}>
                                        <CheckCircle size={18} /> {selectedUnit === 'Registrar Office' && !allOthersApproved ? 'Waiting for other Depts' : 'Approve & Clear Student'}
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="p-4 bg-slate-50 text-slate-500 text-center text-sm rounded-lg border border-slate-200 shadow-sm">
                                Viewing <b>{selectedRequest.unit}</b> clearance for this student. You can only approve <b>{selectedUnit}</b> items.
                            </div>
                        )}
                    </div>
                </Card>
            </div>
            ) : (<div className="h-full flex flex-col items-center justify-center text-slate-400 animate-in fade-in zoom-in duration-300">
                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                        <Users size={40} className="text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-600">Select a Student</h3>
                    <p className="text-sm mt-2 max-w-xs text-center leading-relaxed">Choose a student from the queue on the left to view details and process their clearance.</p>
                </div>)}
        </div>
      </div>
    </div>
  );
};

const OfficerAnalytics = ({ clearanceItems }) => {
    const [filter, setFilter] = useState('All');
    const total = clearanceItems.length;
    const approved = clearanceItems.filter(i => i.status === 'Approved').length;
    const rejected = clearanceItems.filter(i => i.status === 'Rejected').length;
    const rate = total > 0 ? Math.round((approved / total) * 100) : 0;
    const historyItems = clearanceItems.filter(i => i.status !== 'Pending' && i.status !== 'Reviewing' && (filter === 'All' || i.status === filter));

    return (
        <div className="space-y-8 animate-in fade-in">
            <div className="flex justify-between items-center"><div><h2 className="text-2xl font-bold text-slate-800">Analytics & History</h2><p className="text-slate-500">Overview of departmental performance and logs</p></div><div className="flex items-center gap-2 bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm"><div className="p-1.5 bg-blue-50 text-blue-600 rounded"><Filter size={16} /></div><select className="text-sm font-medium text-slate-700 bg-transparent outline-none pr-2" value={filter} onChange={(e) => setFilter(e.target.value)}><option value="All">All Actions</option><option value="Approved">Approved Only</option><option value="Rejected">Rejected Only</option></select></div></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-5 flex items-center gap-4 border-blue-100 bg-blue-50/50"><div className="p-3 rounded-lg bg-blue-500 text-white shadow-lg shadow-blue-200"><TrendingUp size={20} /></div><div><p className="text-xs font-bold uppercase text-blue-600 mb-1">Clearance Rate</p><p className="text-2xl font-bold text-slate-800">{rate}%</p></div></Card>
                <Card className="p-5 flex items-center gap-4 border-emerald-100 bg-emerald-50/50"><div className="p-3 rounded-lg bg-emerald-500 text-white shadow-lg shadow-emerald-200"><CheckCircle size={20} /></div><div><p className="text-xs font-bold uppercase text-emerald-600 mb-1">Approved</p><p className="text-2xl font-bold text-slate-800">{approved}</p></div></Card>
                <Card className="p-5 flex items-center gap-4 border-rose-100 bg-rose-50/50"><div className="p-3 rounded-lg bg-rose-500 text-white shadow-lg shadow-rose-200"><XCircle size={20} /></div><div><p className="text-xs font-bold uppercase text-rose-600 mb-1">Rejected</p><p className="text-2xl font-bold text-slate-800">{rejected}</p></div></Card>
                <Card className="p-5 flex items-center gap-4 border-purple-100 bg-purple-50/50"><div className="p-3 rounded-lg bg-purple-500 text-white shadow-lg shadow-purple-200"><Activity size={20} /></div><div><p className="text-xs font-bold uppercase text-purple-600 mb-1">Total Processed</p><p className="text-2xl font-bold text-slate-800">{approved + rejected}</p></div></Card>
            </div>
            <Card className="p-0 overflow-hidden shadow-lg border-0">
                <div className="p-6 border-b border-slate-100 bg-slate-50/80 flex justify-between items-center"><h3 className="font-bold text-slate-800 flex items-center gap-2"><Clock size={18} className="text-slate-400"/> Process Logs</h3><span className="text-xs font-mono text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">Total: {historyItems.length}</span></div>
                <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50/50 font-bold border-b text-slate-500 uppercase text-xs"><tr><th className="p-4 w-1/6">Student ID</th><th className="p-4 w-1/4">Name</th><th className="p-4 w-1/4">Unit / Department</th><th className="p-4 w-1/6">Decision</th><th className="p-4 w-1/6">Note</th></tr></thead><tbody className="divide-y divide-slate-100">{historyItems.length === 0 ? (<tr><td colSpan="5" className="p-8 text-center text-slate-400 italic">No records found for the selected filter.</td></tr>) : historyItems.map(item => (<tr key={item.id} className="hover:bg-blue-50/30 transition-colors group"><td className="p-4 font-mono text-xs text-slate-600 font-bold">{item.studentId}</td><td className="p-4 font-medium text-slate-800">{item.studentName}</td><td className="p-4 text-slate-600">{item.unit}</td><td className="p-4"><StatusBadge status={item.status} /></td><td className="p-4 text-slate-500 text-xs max-w-xs truncate group-hover:whitespace-normal group-hover:overflow-visible transition-all" title={item.note}>{item.note || '-'}</td></tr>))}</tbody></table></div>
            </Card>
        </div>
    )
}

const OfficerAppointments = ({ activeUser, appointments, updateAppointment }) => {
    const selectedUnit = activeUser.dept;
    const queue = appointments.filter(a => a.officer === selectedUnit && a.status === 'Pending');
    const schedule = appointments.filter(a => a.officer === selectedUnit && a.status !== 'Pending'); 
    const groupedSchedule = schedule.reduce((acc, appt) => {
        const date = appt.date;
        if (!acc[date]) acc[date] = [];
        acc[date].push(appt);
        return acc;
    }, {});
    const sortedDates = Object.keys(groupedSchedule).sort();
    const handleDecision = (id, status) => updateAppointment(id, { status });

    return (
        <div className="space-y-8 animate-in fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Appointment Requests</h2>
                    <p className="text-slate-500 text-sm mt-1">Manage your meeting schedule</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Department</span>
                    <span className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 shadow-sm">{selectedUnit}</span>
                </div>
            </div>

            {/* PENDING REQUESTS SECTION */}
            <div className="mb-10">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Bell size={20} className="text-amber-500"/> Pending Approvals <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">{queue.length}</span></h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {queue.length === 0 ? (
                        <div className="col-span-3 py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 flex flex-col items-center justify-center text-slate-400">
                            <CalendarCheck size={32} className="mb-2 opacity-50"/>
                            <p>No pending requests.</p>
                        </div>
                    ) : queue.map(apt => (
                        <Card key={apt.id} className="p-5 border-l-4 border-l-amber-400">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="font-bold text-slate-800 text-lg">{apt.studentName}</h4>
                                    <p className="text-xs text-slate-500 font-mono">{apt.studentId}</p>
                                </div>
                                <div className="text-right">
                                    <span className="block font-black text-emerald-600 text-xl">{apt.time}</span>
                                    <span className="text-xs text-slate-400 font-bold uppercase">{new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric'})}</span>
                                </div>
                            </div>
                            
                            {/* DISPLAY REASON NOTE */}
                            {apt.reason && (
                                <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-100 mb-4">
                                    <p className="text-[10px] uppercase font-bold text-amber-400 mb-1">Student Note</p>
                                    <p className="text-xs text-slate-600 italic leading-relaxed">"{apt.reason}"</p>
                                </div>
                            )}

                            <div className="flex gap-3 mt-auto">
                                <Button variant="secondary" className="flex-1 h-10 text-xs border-rose-100 text-rose-600 hover:bg-rose-50 hover:border-rose-200" onClick={() => handleDecision(apt.id, 'Declined')}>
                                    <X size={16} /> Decline
                                </Button>
                                <Button className="flex-1 h-10 text-xs shadow-lg shadow-blue-100" onClick={() => handleDecision(apt.id, 'Confirmed')}>
                                    <Check size={16} /> Confirm
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* SCHEDULE SECTION */}
            <div className="pt-8 border-t border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><CalendarCheck size={20} className="text-blue-600"/> Upcoming Schedule</h3>
                <div className="space-y-8">
                    {sortedDates.length === 0 && <p className="text-slate-400 italic text-sm">No confirmed appointments.</p>}
                    {sortedDates.map(date => (
                        <div key={date} className="relative pl-8 border-l-2 border-blue-100 last:border-l-0 pb-2">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-100 border-4 border-white shadow-sm ring-1 ring-blue-500"></div>
                            <h4 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                                {new Date(date).toDateString()}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {groupedSchedule[date].map(apt => (
                                    <div key={apt.id} className={`p-4 bg-white border rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col gap-2 ${apt.status === 'Declined' ? 'border-rose-100 opacity-60' : 'border-slate-100'}`}>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-sm text-slate-800">{apt.studentName}</p>
                                                <p className="text-[10px] text-slate-400 font-mono">{apt.studentId}</p>
                                            </div>
                                            <StatusBadge status={apt.status} />
                                        </div>
                                        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg">
                                            <Clock size={14} className="text-blue-500"/>
                                            <p className="text-sm font-bold text-slate-700">{apt.time}</p>
                                        </div>
                                        {apt.reason && (
                                            <div className="flex gap-2 items-start mt-1">
                                                <MessageSquare size={12} className="text-slate-300 mt-0.5 flex-shrink-0"/>
                                                <p className="text-xs text-slate-500 line-clamp-1" title={apt.reason}>{apt.reason}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- MAIN APP ---
export default function App() {
  const [role, setRole] = useState('student');
  const [view, setView] = useState('dashboard');
  const [currentUserId, setCurrentUserId] = useState(null); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth >= 768);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);
  
  const [clearanceDatabase, setClearanceDatabase] = useState(INITIAL_DATABASE);
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [emergencyRequests, setEmergencyRequests] = useState(INITIAL_EMERGENCY_REQUESTS);
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  const activeUser = useMemo(() => {
     return users.find(u => u.id === currentUserId) || null;
  }, [currentUserId, users]);

  const handleLogin = (idInput, passInput, setErrorCallback) => {
      const user = users.find(u => {
          const isPassMatch = u.password === passInput;
          const isIdMatch = u.studentId === idInput || u.email === idInput || u.name === idInput;
          return isIdMatch && isPassMatch;
      });

      if (user) {
          setRole(user.role.toLowerCase()); 
          setCurrentUserId(user.id);
          setView('dashboard');
      } else {
          setErrorCallback('Invalid credentials. Please check your ID/Email and Password.');
      }
  };

  const handleLogout = () => {
      setCurrentUserId(null);
      setRole('student');
      setView('dashboard');
  };

  const handleEmergencySubmit = (student, form) => {
      if(student.emergencyQuotaUsed >= config.maxEmergencyRequestsPerYear) {
          alert("Yearly emergency quota exceeded.");
          return false;
      }
      const newRequest = {
          id: Date.now(),
          studentId: student.studentId,
          ...form,
          submissionTime: new Date(),
          status: 'Active',
          approvals: { dept: 'Pending', library: 'Pending', hostel: 'Pending', finance: 'Pending' }
      };
      setEmergencyRequests(prev => [...prev, newRequest]);
      setUsers(prev => prev.map(u => u.id === student.id ? { ...u, emergencyQuotaUsed: u.emergencyQuotaUsed + 1 } : u));
      addNotification({ title: 'Emergency Request Submitted', msg: 'Your request is being processed on priority.', targetRole: 'student', targetId: student.studentId });
      addNotification({ title: '🚨 Emergency Alert', msg: `${student.name} initiated emergency clearance.`, targetRole: 'officer' });
      return true;
  };

  const handleEmergencyApproval = (studentId) => {
      const emergency = emergencyRequests.find(r => r.studentId === studentId && r.status === 'Active');
      if (emergency) {
          setEmergencyRequests(prev => prev.map(r => r.id === emergency.id ? { ...r, status: 'Approved' } : r));
          addNotification({ title: 'Emergency Approved', msg: 'The Registrar has approved your emergency clearance.', targetRole: 'student', targetId: studentId });
      }
  }

  const handleAddUser = (newUser) => {
      const user = { ...newUser, id: Date.now(), status: 'Active', emergencyQuotaUsed: 0, password: '1234' };
      setUsers(prev => [...prev, user]);
      addNotification({ title: 'User Added', msg: `${user.name} added to the system.`, targetRole: 'admin' });
  };

  const updateClearanceItem = (itemId, updates) => { setClearanceDatabase(prev => prev.map(item => item.id === itemId ? { ...item, ...updates } : item)); };
  const updateAppointment = (id, updates) => { setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a)); };
  const addAppointment = (newAppt) => { setAppointments(prev => [...prev, newAppt]); addNotification({ title: 'Appointment Booked', msg: `Booking request sent to ${newAppt.officer}.`, targetRole: 'student' }); }
  const addNotification = (notif) => { setNotifications(prev => [{ id: Date.now(), time: 'Just now', read: false, ...notif }, ...prev]); };

  const handleAdminOverride = (studentId) => {
      const emergency = emergencyRequests.find(r => r.studentId === studentId && r.status === 'Active');
      if (emergency) {
          setEmergencyRequests(prev => prev.map(r => r.id === emergency.id ? { ...r, status: 'Approved' } : r));
          addNotification({ title: 'Emergency Approved', msg: 'The Registrar has approved your emergency clearance.', targetRole: 'student', targetId: studentId });
      }
  }

  const roleNotifications = notifications.filter(n => {
      if (n.targetRole === 'all') return true;
      if (n.targetRole !== role) return false;
      if (role === 'student' && n.targetId && activeUser && n.targetId !== activeUser.studentId) return false;
      return true;
  });

  const unreadCount = roleNotifications.filter(n => !n.read).length;
  const markAllRead = () => { setNotifications(prev => prev.map(n => (n.targetRole === role || n.targetRole === 'all') ? { ...n, read: true } : n)); };

  useEffect(() => {
      const handleClickOutside = (event) => { if (notifRef.current && !notifRef.current.contains(event.target)) setShowNotifications(false); };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifRef]);

  const renderContent = () => {
    if (!activeUser) return null;

    if (view === 'certificate') {
       if(role === 'student') {
            const studentItems = clearanceDatabase.filter(item => item.studentId === activeUser.studentId);
            const isCleared = studentItems.length > 0 && studentItems.every(i => i.status === 'Approved');
            const emergencyApproved = emergencyRequests.find(r => r.studentId === activeUser.studentId && r.status === 'Approved');
            
            if (!isCleared && !emergencyApproved) {
               return (
                 <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8 animate-in fade-in zoom-in duration-300">
                   <div className="bg-red-50 p-6 rounded-full mb-6 border-4 border-red-100 shadow-xl"><Lock size={64} className="text-red-500" /></div>
                   <h2 className="text-3xl font-bold text-slate-800 mb-3">Restricted Access</h2>
                   <p className="text-slate-500 max-w-md text-lg leading-relaxed">Your clearance is incomplete. You need 100% Approval or an approved Emergency Override.</p>
                   <Button onClick={() => setView('dashboard')} className="mt-8 px-8 py-3 text-lg shadow-xl shadow-blue-200">Return to Dashboard</Button>
                 </div>
               );
            }
            return <CertificateView studentProfile={activeUser} isCleared={isCleared} />;
       }
       return <CertificateView studentProfile={activeUser} isCleared={true} />;
    }

    if (view === 'profile') return <ProfileView user={activeUser} />;
    if (view === 'appointments') return <AppointmentsView navigate={setView} appointments={appointments} addAppointment={addAppointment} studentProfile={activeUser} />;
    if (view === 'guidelines') return <GuidelinesView />;
    
    if (view === 'users') return (
        <AdminUserManagement 
            users={users} setUsers={setUsers} addNotification={addNotification} 
            setClearanceDatabase={setClearanceDatabase} setAppointments={setAppointments}
            emergencyRequests={emergencyRequests} setEmergencyRequests={setEmergencyRequests}
            addUser={handleAddUser}
        />
    );
    
    if (view === 'dashboard' && role === 'admin') {
        return <AdminAnalytics clearanceItems={clearanceDatabase} emergencyRequests={emergencyRequests} handleAdminOverride={handleAdminOverride} />;
    }

    if (view === 'settings') return <AdminSettings />;

    if (role === 'student') return <StudentDashboard studentProfile={activeUser} clearanceItems={clearanceDatabase} updateClearanceItem={updateClearanceItem} onNavigate={setView} addNotification={addNotification} emergencyRequests={emergencyRequests} handleEmergencySubmit={handleEmergencySubmit} config={config} />;
    
    if (role === 'officer') {
        if (view === 'dashboard') return <OfficerQueue activeUser={activeUser} clearanceItems={clearanceDatabase} updateClearanceItem={updateClearanceItem} addNotification={addNotification} emergencyRequests={emergencyRequests} onEmergencyApprove={handleEmergencyApproval} />;
        if (view === 'officer-appointments') return <OfficerAppointments activeUser={activeUser} appointments={appointments} updateAppointment={updateAppointment} />; 
        if (view === 'analytics') return <OfficerAnalytics clearanceItems={clearanceDatabase} />;
        if (view === 'profile') return <ProfileView user={activeUser} />;
    }
    return <div>Select a menu item</div>;
  };

  if (!currentUserId) {
      return <LoginView onLogin={handleLogin} />;
  }

  // --- SCROLL FIX LOGIC ---
  // If the view is the Officer Dashboard (Queue), we disable the main scroll because that component has its own split-pane scrolling.
  // For all other views, we allow normal vertical scrolling.
  const isFixedView = view === 'dashboard' && role === 'officer';

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden selection:bg-blue-100 selection:text-blue-900">
        {isSidebarOpen && window.innerWidth < 768 && (
          <div className="fixed inset-0 bg-slate-900/60 z-30 backdrop-blur-sm animate-in fade-in" onClick={() => setIsSidebarOpen(false)}></div>
        )}

        <aside className={`fixed md:static inset-y-0 left-0 z-40 bg-white border-r border-slate-200 transition-all duration-300 ease-in-out flex flex-col h-full shadow-2xl md:shadow-none ${isSidebarOpen ? 'w-72 translate-x-0' : '-translate-x-full w-72 md:w-20 md:translate-x-0'}`}>
            <div className="h-20 flex items-center justify-center border-b border-slate-100 relative overflow-hidden">
                <div className={`flex items-center gap-3 transition-all duration-300 ${isSidebarOpen ? 'px-6 w-full' : 'justify-center w-full px-0'}`}>
                   <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 flex-shrink-0 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-700 to-indigo-600"></div>
                      <Shield size={20} className="relative z-10" fill="currentColor" fillOpacity={0.2} />
                   </div>
                   
                   <div className={`flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'}`}>
                      <span className="font-bold text-lg text-slate-800 leading-none tracking-tight">UniClearance</span>
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest leading-none mt-1">System</span>
                   </div>
                </div>
            </div>

            <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto scrollbar-hide">
                {menuItems[role].map((item) => (
                    <button 
                        key={item.id}
                        onClick={() => { setView(item.id); if(window.innerWidth < 768) setIsSidebarOpen(false); }} 
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 whitespace-nowrap group relative overflow-hidden ${view === item.id ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                    >
                        {view === item.id && <div className="absolute left-0 top-3 bottom-3 w-1 bg-blue-600 rounded-r-full"></div>}
                        <item.icon size={20} className={`flex-shrink-0 transition-transform duration-200 ${view === item.id ? 'text-blue-600' : 'group-hover:text-slate-600'}`} /> 
                        <span className={`transition-all duration-300 ${isSidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute pointer-events-none'}`}>{item.label}</span>
                        {!isSidebarOpen && (
                            <div className="absolute left-16 bg-slate-800 text-white text-xs px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-xl">
                                {item.label}
                            </div>
                        )}
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <button onClick={handleLogout} className={`w-full flex items-center gap-3 p-3 rounded-xl text-rose-500 hover:bg-rose-50 transition-all ${!isSidebarOpen && 'justify-center'}`}>
                    <LogOut size={20} />
                    {isSidebarOpen && <span className="font-medium">Logout</span>}
                </button>
            </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden relative w-full bg-slate-50/30">
            <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-4 md:px-8 z-20 flex-shrink-0 sticky top-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><Menu size={20} /></button>
                    <h1 className="text-xl font-bold capitalize truncate text-slate-800 tracking-tight">{role} Portal</h1>
                </div>
                <div className="flex items-center gap-3 md:gap-5">
                    <div className="relative" ref={notifRef}>
                        <button onClick={() => setShowNotifications(!showNotifications)} className="p-2.5 relative rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
                            <Bell size={20} />
                            {unreadCount > 0 && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>}
                        </button>
                        {showNotifications && (
                            <div className="absolute top-full right-0 mt-3 w-80 max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                                <div className="p-4 border-b bg-white flex justify-between items-center"><h3 className="font-bold text-sm text-slate-800">Notifications</h3><button onClick={markAllRead} className="text-xs text-blue-600 font-bold hover:underline">Mark read</button></div>
                                <div className="max-h-[300px] overflow-y-auto">
                                    {roleNotifications.length === 0 ? <div className="p-8 text-center text-xs text-slate-400">No new notifications</div> : roleNotifications.map(n => (
                                        <div key={n.id} className={`p-4 border-b hover:bg-slate-50 transition-colors cursor-pointer ${!n.read ? 'bg-blue-50/30' : ''}`}>
                                            <div className="flex justify-between mb-1"><span className="font-bold text-sm text-slate-700">{n.title}</span><span className="text-[10px] text-slate-400 font-medium">{n.time}</span></div>
                                            <p className="text-xs text-slate-500 leading-relaxed">{n.msg}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    {activeUser && (
                        <div onClick={() => setView('profile')} className="flex items-center gap-3 cursor-pointer group">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-slate-700 leading-none group-hover:text-blue-700 transition-colors">{activeUser.name}</p>
                                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">{activeUser.role}</p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm border-2 border-white shadow-sm group-hover:shadow-md transition-all" title={activeUser.name}>
                                {getInitials(activeUser.name)}
                            </div>
                        </div>
                    )}
                </div>
            </header>
            
            {/* SCROLL FIX: 
               - If it's a fixed view (like OfficerQueue with split panes), we hide the main scrollbar and let the component handle it.
               - Otherwise, we use overflow-y-auto for standard vertical scrolling.
            */}
            <div className={`flex-1 w-full ${isFixedView ? 'overflow-hidden flex flex-col' : 'overflow-y-auto scroll-smooth'} p-4 md:p-8`}>
                <div className={`max-w-7xl mx-auto ${!isFixedView ? 'pb-10' : 'h-full'}`}>
                    {renderContent()}
                </div>
            </div>
        </main>
    </div>
  );
}