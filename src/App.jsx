import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  LayoutDashboard, FileText, CheckCircle, XCircle, Clock, CreditCard, Calendar, Bell, Menu, User, LogOut, UploadCloud, QrCode, Printer, Users, TrendingUp, AlertCircle, Settings, Trash2, BookOpen, Beaker, Home, GraduationCap, Stamp, Plus, ToggleLeft, ToggleRight, Check, X, ShieldAlert, Edit2, Shield, ChevronLeft, Mail, Phone, Hash, MapPin, Eye, CalendarCheck, Filter, PieChart, Lock, UserX, Siren, Timer, FileWarning, ExternalLink, Key
} from 'lucide-react';

// --- 1. CONSTANTS & REAL-WORLD DATA ---

const SYSTEM_DATE = "Nov 27, 2025";

const DEFAULT_CONFIG = {
    emergencySLAHours: 24,
    autoEscalationHours: 6,
    maxEmergencyRequestsPerYear: 2
};

// ADDED PASSWORDS FOR LOGIN SIMULATION
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
        email: 'alfayed.admin@uni.edu', // Updated Admin Email
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
        id: 5, 
        name: 'Jordan Smith', 
        role: 'Student', 
        email: 'jordan.s@uni.edu', 
        password: '1234',
        status: 'Active', 
        studentId: '0112420876', 
        dept: 'BBA', 
        batch: '232', 
        semester: '4th', 
        phone: '+1 (555) 444-5555' 
    },
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
    { id: 101, studentId: '0112230676', studentName: 'Alex Thompson', officer: 'Department Head', date: '2025-11-25', time: '10:00 AM', status: 'Confirmed' },
    { id: 102, studentId: '0112230670', studentName: 'Jamie Doe', officer: 'Library Services', date: '2025-11-26', time: '02:00 PM', status: 'Pending' },
    { id: 103, studentId: '0112420876', studentName: 'Jordan Smith', officer: 'Bursary Office', date: '2025-11-28', time: '11:00 AM', status: 'Confirmed' },
    { id: 104, studentId: '0112230676', studentName: 'Alex Thompson', officer: 'Bursary Office', date: '2025-11-28', time: '03:00 PM', status: 'Pending' },
    { id: 105, studentId: '0112230670', studentName: 'Jamie Doe', officer: 'Bursary Office', date: '2025-11-29', time: '09:00 AM', status: 'Confirmed' },
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

const Button = ({ children, variant = 'primary', className = '', onClick, disabled, icon: Icon }) => {
  const baseStyle = "px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";
  const variants = {
    primary: "bg-blue-700 text-white hover:bg-blue-800 shadow-lg shadow-blue-200", 
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100",
    ghost: "text-slate-500 hover:text-slate-800 hover:bg-slate-100",
    emergency: "bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-200 border border-rose-500 animate-pulse-slow"
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
};

const Card = ({ children, className = '', noPadding = false, onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${noPadding ? '' : 'p-6'} ${className}`}
  >
    {children}
  </div>
);

const StatusBadge = ({ status, isEmergency }) => {
  if (isEmergency) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1.5 w-fit whitespace-nowrap bg-rose-600 text-white border-rose-700 animate-pulse">
            <Siren size={14} /> EMERGENCY
        </span>
      )
  }
  const styles = {
    Approved: "bg-emerald-100 text-emerald-700 border-emerald-200", 
    Confirmed: "bg-blue-100 text-blue-700 border-blue-200", 
    Passed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Active: "bg-blue-100 text-blue-700 border-blue-200",
    Cleared: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Pending: "bg-amber-100 text-amber-700 border-amber-200",
    Rejected: "bg-rose-100 text-rose-700 border-rose-200",
    Declined: "bg-rose-100 text-rose-700 border-rose-200",
    Reviewing: "bg-indigo-100 text-indigo-700 border-indigo-200",
    Submitted: "bg-indigo-100 text-indigo-700 border-indigo-200",
  };
  const safeStyle = styles[status] || styles.Pending;
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 w-fit whitespace-nowrap ${safeStyle}`}>
      {status === 'Approved' || status === 'Confirmed' || status === 'Cleared' || status === 'Active' ? <CheckCircle size={14} /> : <Clock size={14} />}
      {status}
    </span>
  );
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-lg text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full"><XCircle size={20} /></button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

// --- 3. VIEW COMPONENTS ---

const ProfileView = ({ user }) => {
    return (
        <div className="animate-in fade-in space-y-6">
            <div className="bg-gradient-to-r from-blue-800 to-indigo-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32 blur-3xl"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-3xl font-bold border-4 border-white/30 shadow-lg">
                        {getInitials(user.name)}
                    </div>
                    <div className="text-center md:text-left space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">{user.name}</h2>
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm flex items-center gap-2"><User size={16}/> {user.role}</span>
                            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm flex items-center gap-2"><CheckCircle size={16}/> {user.status}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-2">Personal Information</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Mail size={20}/></div>
                            <div><p className="text-xs text-slate-500 uppercase font-bold">Email Address</p><p className="font-medium text-slate-800">{user.email}</p></div>
                        </div>
                        <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Phone size={20}/></div>
                            <div><p className="text-xs text-slate-500 uppercase font-bold">Phone Number</p><p className="font-medium text-slate-800">{user.phone || 'Not Provided'}</p></div>
                        </div>
                        {user.role === 'Student' && (
                            <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><MapPin size={20}/></div>
                                <div><p className="text-xs text-slate-500 uppercase font-bold">Address</p><p className="font-medium text-slate-800">{user.address || 'N/A'}</p></div>
                            </div>
                        )}
                    </div>
                </Card>

                {user.role === 'Student' && (
                    <Card className="p-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-2">Academic Details</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Hash size={20}/></div>
                                <div><p className="text-xs text-slate-500 uppercase font-bold">Student ID</p><p className="font-medium text-slate-800 font-mono">{user.studentId}</p></div>
                            </div>
                            <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><BookOpen size={20}/></div>
                                <div><p className="text-xs text-slate-500 uppercase font-bold">Department</p><p className="font-medium text-slate-800">{user.dept}</p></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Users size={20}/></div>
                                    <div><p className="text-xs text-slate-500 uppercase font-bold">Batch</p><p className="font-medium text-slate-800">{user.batch}</p></div>
                                </div>
                                <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Clock size={20}/></div>
                                    <div><p className="text-xs text-slate-500 uppercase font-bold">Semester</p><p className="font-medium text-slate-800">{user.semester}</p></div>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};

const StudentDashboard = ({ studentProfile, clearanceItems, emergencyRequests, handleEmergencySubmit, updateClearanceItem, onNavigate, config }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(null);
  const [uploading, setUploading] = useState(null);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [emergencyForm, setEmergencyForm] = useState({ type: 'Medical', reason: '', date: '', phone: '', file: null });

  const activeEmergency = emergencyRequests.find(req => req.studentId === studentProfile.studentId && req.status !== 'Closed');
  
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

  const baseSize = 192; 
  const strokeWidth = 12;
  const center = baseSize / 2;
  const radius = (baseSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="space-y-8 animate-in fade-in">
      {activeEmergency && (
          <div className={`p-4 rounded-r-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-l-4 ${activeEmergency.status === 'Approved' ? 'bg-emerald-50 border-l-emerald-500' : 'bg-rose-50 border-l-rose-500'}`}>
              <div>
                  <h3 className={`font-bold flex items-center gap-2 ${activeEmergency.status === 'Approved' ? 'text-emerald-800' : 'text-rose-800'}`}>
                      {activeEmergency.status === 'Approved' ? <CheckCircle size={20} /> : <Siren size={20} className="animate-pulse"/>}
                      {activeEmergency.status === 'Approved' ? 'Emergency Clearance Approved' : 'Emergency Clearance Active'}
                  </h3>
                  <p className={`text-sm mt-1 ${activeEmergency.status === 'Approved' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    Reason: <span className="font-medium">{activeEmergency.reason}</span> • Type: {activeEmergency.type}
                  </p>
              </div>
              <div className="text-right">
                  {activeEmergency.status === 'Approved' ? (
                      <Button onClick={() => onNavigate('certificate')} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200">View Certificate</Button>
                  ) : (
                      <>
                        <span className="text-xs uppercase font-bold text-rose-400 block">SLA Timer</span>
                        <span className="text-2xl font-mono font-bold text-rose-700"><Timer className="inline mb-1 mr-1" size={20}/>18:42:12</span>
                      </>
                  )}
              </div>
          </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-2 p-6 bg-gradient-to-br from-blue-900 to-indigo-900 text-white border-none relative overflow-hidden group hover:shadow-2xl hover:scale-[1.01]">
          <div className="flex flex-col md:flex-row justify-between items-center relative z-10 gap-8">
            <div className="flex-1 w-full">
              <div className="flex items-center gap-3 mb-2">
                 <h2 className="text-2xl font-bold">{studentProfile.name}</h2>
                 <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-mono">{studentProfile.studentId}</span>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-blue-100 mb-6">
                 <div><span className="block text-xs opacity-50 uppercase">Department</span>{studentProfile.dept || 'N/A'}</div>
                 <div><span className="block text-xs opacity-50 uppercase">Batch</span>{studentProfile.batch || 'N/A'}</div>
                 <div><span className="block text-xs opacity-50 uppercase">Semester</span>{studentProfile.semester || 'N/A'}</div>
                 <div><span className="block text-xs opacity-50 uppercase">Status</span><span className="text-blue-300 font-bold">Active</span></div>
                 <div className="col-span-2 mt-4 pt-4 border-t border-white/10">
                    {isCleared ? (
                        <div className="flex items-center gap-2 text-emerald-300 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20"><CheckCircle size={20} /><span className="font-bold uppercase tracking-wide">All Dues Cleared</span></div>
                    ) : (
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                           <span className="text-xs opacity-50 uppercase">Financial Status</span>
                           {totalDue > 0 ? (<div className="flex items-center gap-3 text-amber-300 bg-amber-500/20 px-4 py-2 rounded-xl border border-amber-500/30 animate-pulse-slow"><AlertCircle size={24} /><div><span className="text-[10px] uppercase font-bold opacity-80 block leading-tight">Total Payable</span><span className="text-xl font-extrabold tracking-tight">TK {totalDue.toFixed(2)}</span></div></div>) : (<span className="text-blue-300 font-bold flex items-center gap-2 bg-blue-500/20 px-3 py-1 rounded-full text-xs"><Clock size={14} /> In Progress</span>)}
                        </div>
                    )}
                 </div>
              </div>
              <div className="flex flex-wrap gap-3 mt-4">
                <Button onClick={() => onNavigate('appointments')} variant="secondary" className="bg-white/10 border-white/10 text-white hover:bg-white/20"><Calendar size={16} /> Book Appointment</Button>
                {!activeEmergency && !isCleared && (<Button onClick={() => setShowEmergencyModal(true)} variant="emergency" className="border-white/20"><Siren size={16} /> Emergency Clearance</Button>)}
              </div>
            </div>
            <div className="relative flex-shrink-0 mt-6 md:mt-0">
              <svg viewBox={`0 0 ${baseSize} ${baseSize}`} className="transform -rotate-90 w-32 h-32 md:w-48 md:h-48 transition-all duration-300">
                <defs><linearGradient id="royalBlueGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60a5fa" /><stop offset="50%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#2563eb" /></linearGradient></defs>
                <circle cx={center} cy={center} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" className="text-white/10" />
                <circle cx={center} cy={center} r={radius} stroke="url(#royalBlueGradient)" strokeWidth={strokeWidth} fill="transparent" strokeDasharray={circumference} strokeDashoffset={circumference - (circumference * progress) / 100} className="transition-all duration-1000 ease-out" strokeLinecap="round"/>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-2xl md:text-4xl font-bold transition-all duration-300 text-white">{progress}%</span><span className="text-[10px] md:text-xs uppercase tracking-wider text-blue-200">Cleared</span></div>
            </div>
          </div>
        </Card>
        <Card className="p-6 flex flex-col justify-center items-center text-center bg-white border-blue-100 hover:border-blue-300">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4 text-blue-600 shadow-inner"><GraduationCap size={32} /></div>
          <h3 className="text-lg font-bold text-slate-800">Final Clearance</h3>
          <p className="text-sm text-slate-500 mt-2 mb-4">Certificate available upon 100% completion or via Emergency Override.</p>
          <Button disabled={!isCleared && (!activeEmergency || activeEmergency.status !== 'Approved')} onClick={() => onNavigate('certificate')} className="w-full">{isCleared ? 'Download Certificate' : activeEmergency?.status === 'Approved' ? 'Download Provisional' : `${totalItems - completedCount} Steps Remaining`}</Button>
        </Card>
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-4 px-1">Clearance Modules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {myItems.map((item) => (
            <Card key={item.id} className={`p-5 flex flex-col h-full border-l-4 ${item.status === 'Approved' ? 'border-l-emerald-500' : item.status === 'Rejected' ? 'border-l-rose-500' : 'border-l-amber-500'} ${activeEmergency ? 'ring-2 ring-rose-100' : ''}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl shadow-sm border border-slate-100">{getIconForType(item.type)}</div>
                  <div><h4 className="font-bold text-slate-800 text-lg">{item.unit}</h4><p className="text-xs text-slate-500 font-medium tracking-wide uppercase">{item.type} Module</p></div>
                </div>
                <StatusBadge status={item.status} isEmergency={!!activeEmergency && item.status !== 'Approved'} />
              </div>
              <div className="flex-1 space-y-4">
                {item.note && (<div className={`p-3 rounded-lg border text-sm ${item.status === 'Rejected' ? 'bg-rose-50 border-rose-100 text-rose-800' : 'bg-slate-50 border-slate-100 text-slate-600'}`}><div className="flex items-center gap-2 mb-1">{item.status === 'Rejected' && <AlertCircle size={14} />}<span className="font-bold text-xs uppercase">{item.status === 'Rejected' ? 'Rejection Reason' : 'Officer Note'}</span></div>"{item.note}"</div>)}
                {item.breakdown && (<div className="bg-slate-50 rounded-xl p-4 border border-slate-100"><p className="text-xs font-bold text-slate-500 uppercase mb-2">Fee Breakdown</p>{item.breakdown.map((fee, idx) => (<div key={idx} className="flex justify-between text-sm mb-1"><span className="text-slate-600">{fee.label}</span><span className="font-mono font-medium">TK {fee.amount.toFixed(2)}</span></div>))}<div className="border-t border-slate-200 mt-2 pt-2 flex justify-between font-bold text-slate-800"><span>Total Due</span><span>TK {item.fee.toFixed(2)}</span></div></div>)}
                {item.checklist && (
                    <div className="space-y-2 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                        {[...item.checklist].sort((a, b) => {
                            const aDone = isPositiveStatus(a.status);
                            const bDone = isPositiveStatus(b.status);
                            if (aDone === bDone) return 0;
                            return aDone ? 1 : -1; 
                        }).map((check, idx) => (
                            <div key={idx} className="flex items-center gap-3 text-sm">{isPositiveStatus(check.status) ? <CheckCircle size={16} className="text-emerald-500" /> : <AlertCircle size={16} className="text-amber-500" />}<span className={isPositiveStatus(check.status) ? 'text-slate-400 line-through' : 'text-slate-700'}>{check.label}</span></div>
                        ))}
                    </div>
                )}
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100">
                {item.fee > 0 && !item.paid ? <Button onClick={() => setShowPaymentModal(item)} className="w-full" variant="danger">Pay TK {item.fee.toFixed(2)} Now</Button> : 
                 item.status === 'Rejected' || (item.status === 'Pending' && (item.docRequired || item.type === 'Administrative')) ? <Button variant="secondary" className="w-full hover:bg-slate-100 hover:border-slate-300" onClick={() => handleUpload(item.id)}>{uploading === item.id ? 'Uploading...' : <><UploadCloud size={16} /> {item.type === 'Administrative' ? 'Submit Registration Card' : 'Upload Proof'}</>}</Button> : <div className="text-center text-xs text-slate-400 py-2">Updated: {new Date().toLocaleTimeString()}</div>}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Modal isOpen={!!showPaymentModal} onClose={() => setShowPaymentModal(null)} title="Secure Payment Gateway">
        {showPaymentModal && (
          <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center shadow-inner">
              <div><span className="block text-slate-500 text-xs uppercase">Total Amount</span><span className="text-3xl font-bold text-slate-800">TK {showPaymentModal.fee.toFixed(2)}</span></div>
              <div className="text-right"><span className="block text-slate-500 text-xs uppercase">For</span><span className="font-medium text-slate-800 bg-white px-3 py-1 rounded border border-slate-200">{showPaymentModal.unit}</span></div>
            </div>
            <div className="text-xs text-center text-slate-400">Encrypted Transaction • 256-bit SSL</div>
            <Button onClick={() => handlePay(showPaymentModal.id)} className="w-full h-12 text-base shadow-xl shadow-blue-100">Confirm Payment</Button>
          </div>
        )}
      </Modal>

      <Modal isOpen={showEmergencyModal} onClose={() => setShowEmergencyModal(false)} title="🚨 Emergency Clearance Request">
          <form onSubmit={onSubmitEmergency} className="space-y-4">
              <div className="p-3 bg-amber-50 text-amber-800 rounded-lg text-sm border border-amber-100 flex gap-2"><ShieldAlert className="flex-shrink-0" size={20} /><p>Emergency clearance is strictly for medical, job, or travel urgency. <strong>Quota: {config.maxEmergencyRequestsPerYear - studentProfile.emergencyQuotaUsed}/{config.maxEmergencyRequestsPerYear} remaining.</strong></p></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-1">Request Type</label><select className="w-full border p-2 rounded bg-white" required value={emergencyForm.type} onChange={e => setEmergencyForm({...emergencyForm, type: e.target.value})}><option>Medical Emergency</option><option>Job Joining</option><option>Visa/Travel</option><option>Other</option></select></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-1">Reason for Urgency</label><textarea required className="w-full border p-2 rounded" rows="3" placeholder="Describe why you need expedited clearance..." value={emergencyForm.reason} onChange={e => setEmergencyForm({...emergencyForm, reason: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-bold text-slate-700 mb-1">Departure/Joining Date</label><input required type="date" className="w-full border p-2 rounded" value={emergencyForm.date} onChange={e => setEmergencyForm({...emergencyForm, date: e.target.value})} /></div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-1">Emergency Contact</label><input required type="tel" placeholder="+880..." className="w-full border p-2 rounded" value={emergencyForm.phone} onChange={e => setEmergencyForm({...emergencyForm, phone: e.target.value})} /></div>
              </div>
              <div><label className="block text-sm font-bold text-slate-700 mb-1">Supporting Document</label><input required type="file" className="w-full border p-2 rounded bg-slate-50" /></div>
              <div className="pt-4"><Button type="submit" variant="emergency" className="w-full">Submit Priority Request</Button></div>
          </form>
      </Modal>
    </div>
  );
};

const GuidelinesView = () => {
  return (
    <div className="space-y-6 animate-in fade-in">
      <h2 className="text-2xl font-bold text-slate-800">Clearance Guidelines</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6"><div className="flex items-center gap-3 mb-4"><div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><BookOpen size={20}/></div><h3 className="font-bold text-slate-800">Library Services</h3></div><ul className="list-disc pl-5 text-sm text-slate-600 space-y-2"><li>Return all borrowed books.</li><li>Pay outstanding fines.</li></ul></Card>
        <Card className="p-6"><div className="flex items-center gap-3 mb-4"><div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><CreditCard size={20}/></div><h3 className="font-bold text-slate-800">Accounts</h3></div><ul className="list-disc pl-5 text-sm text-slate-600 space-y-2"><li>Clear tuition fees.</li><li>Pay exam fees.</li></ul></Card>
        <Card className="p-6"><div className="flex items-center gap-3 mb-4"><div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Home size={20}/></div><h3 className="font-bold text-slate-800">Hostel</h3></div><ul className="list-disc pl-5 text-sm text-slate-600 space-y-2"><li>Pay rent and mess dues.</li><li>Return room keys.</li></ul></Card>
        <Card className="p-6"><div className="flex items-center gap-3 mb-4"><div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><Beaker size={20}/></div><h3 className="font-bold text-slate-800">Departmental</h3></div><ul className="list-disc pl-5 text-sm text-slate-600 space-y-2"><li>Return lab equipment.</li><li>Clear society dues.</li></ul></Card>
      </div>
    </div>
  );
};

const AppointmentsView = ({ navigate, appointments, addAppointment, studentProfile }) => {
  const [selectedDate, setSelectedDate] = useState(() => {
      const today = new Date();
      return today.toLocaleDateString('en-CA'); // YYYY-MM-DD local time safe
  });
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [booked, setBooked] = useState(false);
  const [unit, setUnit] = useState('Bursary Office');

  const myAppointments = appointments.filter(a => a.studentId === studentProfile.studentId);
  
  const getSlotsForDate = (date, officer) => {
      const takenTimes = appointments
          .filter(a => a.date === date && a.officer === officer && a.status !== 'Declined')
          .map(a => a.time);
      return AVAILABLE_SLOTS.map(slot => ({ ...slot, available: !takenTimes.includes(slot.time) }));
  };

  const currentSlots = useMemo(() => getSlotsForDate(selectedDate, unit), [selectedDate, unit, appointments]);

  const handleBook = () => {
    if(!selectedSlot) return;
    setBooked(true);
    setTimeout(() => {
      const slotTime = currentSlots.find(s => s.id === selectedSlot)?.time;
      if (!slotTime) return;
      const newAppt = { id: Date.now(), studentId: studentProfile.studentId, studentName: studentProfile.name, officer: unit, date: selectedDate, time: slotTime, status: 'Pending' };
      addAppointment(newAppt);
      setBooked(false);
      setSelectedSlot(null);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center"><div><h2 className="text-2xl font-bold text-slate-800">Book Appointment</h2><p className="text-slate-500">Schedule a meeting with officers</p></div></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Calendar size={18} /> Select Date</h3>
            <input type="date" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
            <div className="mt-6 space-y-3">
              <h4 className="text-sm font-medium text-slate-500">Department</h4>
              <select className="w-full p-3 border rounded-xl bg-white" value={unit} onChange={e => setUnit(e.target.value)}>
                  {['Bursary Office', 'Library Services', 'Department Head', 'Hostel Management', 'Registrar Office'].map(u => (<option key={u}>{u}</option>))}
              </select>
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="font-bold text-slate-800 mb-4">My Appointments</h3>
            {myAppointments.length > 0 ? (
              <div className="space-y-3">
                {myAppointments.map(appt => (
                  <div key={appt.id} className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex justify-between items-center">
                    <div><p className="text-xs font-bold text-blue-800">{appt.officer}</p><p className="text-xs text-blue-600">{appt.date} @ {appt.time}</p></div>
                    <StatusBadge status={appt.status} />
                  </div>
                ))}
              </div>
            ) : (<p className="text-sm text-slate-400 italic">No upcoming appointments.</p>)}
          </Card>
        </div>
        <Card className="p-6 lg:col-span-2">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Clock size={18} /> Available Slots</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {currentSlots.map(slot => (
              <button key={slot.id} disabled={!slot.available} onClick={() => setSelectedSlot(slot.id)} className={`p-4 rounded-xl border text-center transition-all ${!slot.available ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-100' : selectedSlot === slot.id ? 'bg-blue-600 text-white shadow-lg' : 'hover:border-blue-500 hover:shadow-md bg-white'}`}>
                <div className="text-lg font-bold">{slot.time}</div><div className="text-xs mt-1 opacity-80">{slot.available ? 'Available' : 'Booked'}</div>
              </button>
            ))}
          </div>
          <div className="p-4 bg-slate-50 rounded-xl flex justify-between items-center border border-slate-100">
            <div><p className="text-sm text-slate-500">Selected Slot</p><p className="font-bold text-slate-800">{selectedSlot ? currentSlots.find(s => s.id === selectedSlot)?.time : 'None selected'}</p></div>
            <Button disabled={!selectedSlot} onClick={handleBook}>{booked ? 'Booking...' : 'Confirm Booking'}</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

const CertificateView = ({ studentProfile, activeEmergency, isCleared }) => {
  // If user has full clearance, it's OFFICIAL.
  // If not full clearance but here via emergency override, it's PROVISIONAL.
  const isProvisional = !isCleared;
  const type = isProvisional ? "PROVISIONAL EMERGENCY" : "OFFICIAL";

  return (
  <div className="flex justify-center p-4 print:p-0 print:m-0 print:absolute print:top-0 print:left-0 print:w-full print:h-full print:z-[9999] print:bg-white">
    <style>{`@media print { body { -webkit-print-color-adjust: exact; } body * { visibility: hidden; } #certificate-container, #certificate-container * { visibility: visible; } #certificate-container { position: absolute; left: 0; top: 0; width: 100%; height: 100%; margin: 0; padding: 40px; box-shadow: none; border: none; } #print-btn { display: none; } }`}</style>
    <div id="certificate-container" className="bg-white shadow-2xl w-[700px] min-h-[900px] p-12 relative border border-slate-200 text-center print:shadow-none print:border-none print:w-full overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-4 bg-blue-900"></div>
      
      {/* --- WATERMARK LOGIC --- */}
      {isProvisional && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.12] z-0">
            <div className="transform -rotate-45 border-[12px] border-slate-900 p-8 rounded-3xl">
                <span className="text-[120px] font-black uppercase text-slate-900 whitespace-nowrap leading-none">PROVISIONAL</span>
            </div>
        </div>
      )}

      <div className="mb-12 relative z-10">
        <div className="w-20 h-20 bg-slate-900 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-serif text-3xl">U</div>
        <h1 className="text-3xl font-serif font-bold text-slate-900 uppercase tracking-widest">University of Tech</h1>
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-500">Office of the Registrar</p>
      </div>
      <div className="mb-12 border-b-2 border-slate-100 pb-8 relative z-10">
        <h2 className="text-4xl font-serif text-blue-900 mb-6 italic">{type} Clearance Certificate</h2>
        <p className="text-slate-600 text-lg">This is to certify that</p>
        <p className="text-3xl font-bold text-slate-800 my-4 font-serif">{studentProfile.name}</p>
        <p className="text-slate-600">Matriculation Number: <strong>{studentProfile.studentId}</strong></p>
        
        {isProvisional ? (
            <div className="bg-amber-50 border border-amber-200 p-4 mt-6 rounded text-sm text-amber-900 max-w-lg mx-auto">
                <strong>Conditional Clearance:</strong> This certificate is issued under emergency protocol ({activeEmergency?.type || 'Special Request'}). Final verification of dues is pending. Validity expires in 30 days.
            </div>
        ) : (
            <p className="text-slate-600 mt-6 max-w-lg mx-auto leading-relaxed">
                Has satisfactorily fulfilled all financial and non-financial obligations to the university and is hereby cleared for graduation.
            </p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-12 text-left mb-16 relative z-10">
        <div><p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Department</p><p className="font-medium">{studentProfile.dept || 'N/A'}</p></div>
        <div><p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Date of Issue</p><p className="font-medium">{new Date().toDateString()}</p></div>
      </div>
      <div className="flex justify-between items-end mt-auto relative z-10">
        <div className="text-center relative">
            <div className="w-48 border-b border-slate-800 mb-2 mx-auto relative"><svg viewBox="0 0 200 60" className="h-16 absolute bottom-0 left-1/2 transform -translate-x-1/2 text-blue-900 pointer-events-none"><path d="M10,40 Q40,10 70,40 T130,40 T180,20" fill="none" stroke="currentColor" strokeWidth="2" /><text x="30" y="45" fontFamily="cursive" fontSize="20" fill="currentColor" style={{fontStyle: 'italic'}}>Dr. Al-Fayed</text></svg></div>
            <p className="text-xs font-bold uppercase">Registrar Signature</p>
        </div>
        <div className="border-4 border-slate-900 p-2"><QrCode size={80} /></div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-4 bg-blue-900"></div>
    </div>
    <div id="print-btn" className="fixed bottom-8 right-8"><Button className="shadow-2xl" onClick={() => window.print()}><Printer size={18} /> Print Certificate</Button></div>
  </div>
)};

const OfficerQueue = ({ clearanceItems, updateClearanceItem, addNotification, emergencyRequests, onEmergencyApprove }) => {
  const [selectedUnit, setSelectedUnit] = useState('Registrar Office');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [comment, setComment] = useState('');

  const urgentRequests = emergencyRequests.filter(req => req.status === 'Active');

  const queue = clearanceItems.filter(item => {
      if (item.unit !== selectedUnit) return false;
      const isUrgent = urgentRequests.some(r => r.studentId === item.studentId);
      if (isUrgent && item.status !== 'Approved') return true; 
      return ['Pending', 'Reviewing', 'Submitted'].includes(item.status);
  });

  const studentFullClearance = selectedRequest ? clearanceItems.filter(item => item.studentId === selectedRequest.studentId && item.unit !== 'Registrar Office') : [];
  const allOthersApproved = studentFullClearance.every(item => item.status === 'Approved');
  
  // Check if selected student has an ACTIVE emergency request
  const activeStudentEmergency = selectedRequest ? urgentRequests.find(r => r.studentId === selectedRequest.studentId) : null;

  const handleAction = (status) => {
    if (!selectedRequest) return;
    updateClearanceItem(selectedRequest.id, { status, note: comment || (status === 'Rejected' ? 'Rejected by officer' : 'Approved by officer') });
    addNotification({ title: `Clearance ${status}`, msg: `Your request for ${selectedUnit} has been ${status}.`, targetRole: 'student', targetId: selectedRequest.studentId });
    setSelectedRequest(null);
    setComment('');
  };

  const toggleChecklistItem = (index) => {
      if (!selectedRequest) return;
      const updatedChecklist = [...selectedRequest.checklist];
      const currentStatus = updatedChecklist[index].status;
      const newStatus = isPositiveStatus(currentStatus) ? 'Pending' : 'Cleared';
      updatedChecklist[index] = { ...updatedChecklist[index], status: newStatus };
      updateClearanceItem(selectedRequest.id, { checklist: updatedChecklist });
      setSelectedRequest(prev => ({ ...prev, checklist: updatedChecklist }));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {urgentRequests.length > 0 && (
          <div className="bg-rose-600 text-white p-3 flex justify-between items-center animate-pulse-slow">
              <span className="font-bold flex items-center gap-2"><Siren size={18}/> {urgentRequests.length} EMERGENCY REQUESTS PENDING</span>
              <span className="text-xs bg-white/20 px-2 py-1 rounded">SLA: &lt; 24h</span>
          </div>
      )}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center gap-4 overflow-x-auto">
         <span className="text-xs font-bold uppercase text-slate-500 whitespace-nowrap">Select Dept:</span>
         {['Registrar Office', 'Department Head', 'Library Services', 'Bursary Office', 'Hostel Management'].map(unit => (<button key={unit} onClick={() => { setSelectedUnit(unit); setSelectedRequest(null); }} className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${selectedUnit === unit ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{unit}</button>))}
      </div>
      <div className="flex flex-1 overflow-hidden">
        <Card className="w-1/3 flex flex-col rounded-none border-r border-t-0 border-b-0 border-l-0" noPadding>
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center"><h3 className="font-bold text-slate-700">{selectedUnit} Queue</h3><span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold">{queue.length}</span></div>
            <div className="overflow-y-auto flex-1">
            {queue.map(item => {
                const isUrgent = urgentRequests.some(r => r.studentId === item.studentId);
                return (
                <div key={item.id} onClick={() => setSelectedRequest(item)} className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 ${selectedRequest?.id === item.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'border-l-4 border-l-transparent'} ${isUrgent ? 'bg-rose-50 border-l-rose-500' : ''}`}>
                    <div className="flex justify-between items-start mb-1"><h4 className="font-bold text-sm text-slate-700 flex items-center gap-2">{item.studentName}{isUrgent && <Siren size={14} className="text-rose-600" />}</h4><StatusBadge status={item.status} /></div>
                    <p className="text-xs text-slate-500">{item.studentId} • Batch {item.batch || 'N/A'}</p>
                    {isUrgent && <p className="text-[10px] text-rose-600 font-bold mt-1">EMERGENCY PRIORITY</p>}
                </div>
            )})}
            {queue.length === 0 && (<div className="p-8 text-center text-slate-400 flex flex-col items-center"><CheckCircle size={32} className="mb-2 text-emerald-200" /><p>All caught up!</p><p className="text-xs mt-1">No pending requests.</p></div>)}
            </div>
        </Card>
        <div className="flex-1 p-8 overflow-y-auto bg-slate-50/50">
            {selectedRequest ? (
            <Card className="max-w-2xl mx-auto">
                <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                    <div><h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">{selectedRequest.studentName}{urgentRequests.some(r => r.studentId === selectedRequest.studentId) && <span className="bg-rose-100 text-rose-700 text-xs px-2 py-1 rounded border border-rose-200">EMERGENCY</span>}</h2><p className="text-slate-500 text-sm">{selectedRequest.studentId}</p></div>
                    <div className="text-right"><span className="text-xs uppercase font-bold text-slate-400">Current Status</span><div className="mt-1"><StatusBadge status={selectedRequest.status} /></div></div>
                </div>
                
                {/* EMERGENCY BANNER & ACTION FOR REGISTRAR */}
                {activeStudentEmergency && (
                    <div className="mb-6 bg-rose-50 border border-rose-100 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-bold text-rose-800 text-sm flex items-center gap-2 mb-2"><FileWarning size={16}/> Emergency Details</h4>
                                <div className="text-sm text-slate-700 grid grid-cols-2 gap-4">
                                    <div><span className="text-xs text-slate-500 block">Reason</span>{activeStudentEmergency.reason}</div>
                                    <div><span className="text-xs text-slate-500 block">Contact</span>{activeStudentEmergency.phone}</div>
                                    <div><span className="text-xs text-slate-500 block">Date Needed</span>{activeStudentEmergency.date}</div>
                                    <div><span className="text-xs text-slate-500 block">Proof</span><a href="#" className="text-blue-600 underline flex items-center gap-1"><ExternalLink size={12}/> View Doc</a></div>
                                </div>
                            </div>
                            {selectedUnit === 'Registrar Office' && (
                                <div className="flex flex-col gap-2">
                                    <Button variant="emergency" className="text-xs px-3 py-2" onClick={() => {
                                        onEmergencyApprove(selectedRequest.studentId);
                                        setSelectedRequest(null);
                                    }}>
                                        Approve Emergency Protocol
                                    </Button>
                                    <span className="text-[10px] text-rose-600 text-center font-bold max-w-[120px] leading-tight">Overrides pending dues for temp certificate</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="space-y-6 mb-8">
                    {selectedUnit === 'Registrar Office' && (<div className="bg-slate-100 rounded-lg p-4 border border-slate-200"><div className="flex justify-between items-center mb-3"><h4 className="text-sm font-bold text-slate-700 uppercase flex items-center gap-2"><Stamp size={16} /> Cross-Department Clearance</h4>{allOthersApproved ? <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded font-bold">All Signatures Verified</span> : <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded font-bold">Pending Signatures</span>}</div><div className="space-y-1">{studentFullClearance.map(item => (<div key={item.id} className="flex justify-between text-sm p-2 bg-white rounded border border-slate-100"><span className="text-slate-600">{item.unit}</span><StatusBadge status={item.status} /></div>))}</div></div>)}
                    {selectedRequest.status === 'Reviewing' && selectedRequest.uploadedFile && (
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-center justify-between mb-4"><div className="flex items-center gap-3"><div className="p-2 bg-white rounded border border-blue-100"><FileText size={20} className="text-blue-600" /></div><div><p className="text-sm font-bold text-slate-700">Proof of Payment</p><p className="text-xs text-blue-600 underline cursor-pointer">{selectedRequest.uploadedFile}</p></div></div><Button variant="secondary" className="h-8 text-xs" onClick={() => alert("Opening document preview...")} icon={Eye}>View</Button></div>
                    )}
                    
                    {selectedRequest.breakdown && (
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-4">
                            <h4 className="text-sm font-bold text-slate-700 uppercase mb-3">Fee Status</h4>
                            {selectedRequest.breakdown.map((fee, idx) => (
                                <div key={idx} className="flex justify-between text-sm mb-1 text-slate-600">
                                    <span>{fee.label}</span>
                                    <span className="font-mono">TK {fee.amount.toFixed(2)}</span>
                                </div>
                            ))}
                            <div className="border-t border-slate-200 mt-2 pt-2 flex justify-between font-bold text-slate-800">
                                <span>Total Amount</span>
                                <span>TK {selectedRequest.fee.toFixed(2)}</span>
                            </div>
                            <div className={`mt-3 p-2 rounded text-center text-xs font-bold border ${selectedRequest.paid ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-rose-100 text-rose-700 border-rose-200'}`}>
                                {selectedRequest.paid ? 'PAYMENT CLEARED' : 'PAYMENT PENDING'}
                            </div>
                        </div>
                    )}

                    {selectedRequest.checklist && (
                        <div>
                            <h4 className="text-sm font-bold text-slate-700 uppercase mb-3">Checklist Verification</h4>
                            <div className="space-y-2">
                                {selectedRequest.checklist.map((c, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-300 transition-colors cursor-pointer" onClick={() => toggleChecklistItem(i)}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isPositiveStatus(c.status) ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'}`}>
                                                {isPositiveStatus(c.status) && <Check size={14} className="text-white" />}
                                            </div>
                                            <span className={`text-sm ${isPositiveStatus(c.status) ? 'text-slate-800 font-medium' : 'text-slate-600'}`}>{c.label}</span>
                                        </div>
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${isPositiveStatus(c.status) ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {c.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div><label className="block text-sm font-bold text-slate-700 mb-2">Officer Decision</label><textarea className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none mb-4 resize-none h-24" placeholder="Enter notes..." value={comment} onChange={(e) => setComment(e.target.value)} /><div className="flex gap-4"><Button variant="danger" className="flex-1" onClick={() => handleAction('Rejected')}>Reject</Button><Button className="flex-1" onClick={() => handleAction('Approved')} disabled={selectedUnit === 'Registrar Office' && !allOthersApproved}>{selectedUnit === 'Registrar Office' && !allOthersApproved ? 'Waiting for other Depts' : 'Approve & Clear'}</Button></div></div>
            </Card>
            ) : (<div className="h-full flex flex-col items-center justify-center text-slate-400"><Users size={48} className="mb-4 opacity-20" /><p>Select a student from the {selectedUnit} queue.</p></div>)}
        </div>
      </div>
    </div>
  );
};

const OfficerAppointments = ({ appointments, updateAppointment }) => {
    const [selectedUnit, setSelectedUnit] = useState('Bursary Office');
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
        <div className="flex flex-col h-[calc(100vh-140px)] p-6 overflow-y-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-slate-800">Appointment Requests</h2>
                <div className="flex items-center gap-2"><span className="text-sm text-slate-500">Viewing as:</span><select className="p-2 border rounded-lg bg-white text-sm font-medium" value={selectedUnit} onChange={(e) => setSelectedUnit(e.target.value)}>{['Bursary Office', 'Library Services', 'Department Head', 'Hostel Management', 'Registrar Office'].map(u => (<option key={u}>{u}</option>))}</select></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {queue.length === 0 ? (<div className="col-span-3 text-center py-8 border-2 border-dashed border-slate-200 rounded-xl"><p className="text-slate-400 italic">No pending appointments for {selectedUnit}.</p></div>) : queue.map(apt => (
                    <Card key={apt.id} className="p-4"><div className="flex justify-between items-start mb-2"><div><h4 className="font-bold text-slate-800">{apt.studentName}</h4><p className="text-xs text-slate-500">{apt.studentId}</p></div><div className="text-right"><span className="block font-bold text-emerald-600">{apt.time}</span><span className="text-xs text-slate-400">{apt.date}</span></div></div><div className="flex gap-2 mt-4"><Button variant="secondary" className="flex-1 h-8 text-xs border-rose-200 text-rose-600 hover:bg-rose-50" onClick={() => handleDecision(apt.id, 'Declined')}><X size={14} /> Decline</Button><Button className="flex-1 h-8 text-xs" onClick={() => handleDecision(apt.id, 'Confirmed')}><Check size={14} /> Confirm</Button></div></Card>
                ))}
            </div>
            <div className="mt-8 pt-8 border-t border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><CalendarCheck size={20} className="text-blue-600"/> Appointment Schedule</h3>
                <div className="space-y-8">{sortedDates.map(date => (<div key={date} className="relative pl-8 border-l-2 border-blue-100 last:border-l-0"><div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-500"></div><h4 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wider">{new Date(date).toDateString()}</h4><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{groupedSchedule[date].map(apt => (<div key={apt.id} className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-all flex justify-between items-center"><div><p className="font-bold text-sm text-slate-800">{apt.studentName}</p><div className="flex items-center gap-2 mt-1"><Clock size={12} className="text-slate-400"/><p className="text-xs text-slate-500 font-medium">{apt.time}</p></div><p className="text-[10px] text-slate-400 mt-1 font-mono">{apt.studentId}</p></div><StatusBadge status={apt.status} /></div>))}</div></div>))}</div>
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
                <Card className="p-5 flex items-center gap-4 border-purple-100 bg-purple-50/50"><div className="p-3 rounded-lg bg-purple-500 text-white shadow-lg shadow-purple-200"><PieChart size={20} /></div><div><p className="text-xs font-bold uppercase text-purple-600 mb-1">Total Processed</p><p className="text-2xl font-bold text-slate-800">{approved + rejected}</p></div></Card>
            </div>
            <Card className="p-0 overflow-hidden shadow-lg border-0">
                <div className="p-6 border-b border-slate-100 bg-slate-50/80 flex justify-between items-center"><h3 className="font-bold text-slate-800 flex items-center gap-2"><Clock size={18} className="text-slate-400"/> Process Logs</h3><span className="text-xs font-mono text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">Total: {historyItems.length}</span></div>
                <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50/50 font-bold border-b text-slate-500 uppercase text-xs"><tr><th className="p-4 w-1/6">Student ID</th><th className="p-4 w-1/4">Name</th><th className="p-4 w-1/4">Unit / Department</th><th className="p-4 w-1/6">Decision</th><th className="p-4 w-1/6">Note</th></tr></thead><tbody className="divide-y divide-slate-50">{historyItems.length === 0 ? (<tr><td colSpan="5" className="p-8 text-center text-slate-400 italic">No records found for the selected filter.</td></tr>) : historyItems.map(item => (<tr key={item.id} className="hover:bg-blue-50/30 transition-colors group"><td className="p-4 font-mono text-xs text-slate-600 font-bold">{item.studentId}</td><td className="p-4 font-medium text-slate-800">{item.studentName}</td><td className="p-4 text-slate-600">{item.unit}</td><td className="p-4"><StatusBadge status={item.status} /></td><td className="p-4 text-slate-500 text-xs max-w-xs truncate group-hover:whitespace-normal group-hover:overflow-visible transition-all" title={item.note}>{item.note || '-'}</td></tr>))}</tbody></table></div>
            </Card>
        </div>
    )
}

const AdminUserManagement = ({ users, setUsers, addNotification, setClearanceDatabase, setAppointments, setEmergencyRequests }) => {
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ id: null, name: '', email: '', role: 'Student', studentId: '', batch: '233' }); 

    const handleDelete = (id) => { 
        if(confirm('Are you sure you want to delete this user and all their data?')) {
            const userToDelete = users.find(u => u.id === id);
            setUsers(users.filter(u => u.id !== id));
            if (userToDelete?.role === 'Student') {
                setClearanceDatabase(prev => prev.filter(item => item.studentId !== userToDelete.studentId));
                setAppointments(prev => prev.filter(app => app.studentId !== userToDelete.studentId));
                setEmergencyRequests(prev => prev.filter(req => req.studentId !== userToDelete.studentId));
            }
            addNotification({ title: 'User Deleted', msg: 'User and associated data removed.', targetRole: 'admin' });
        }
    }
    
    const handleEdit = (user) => { setFormData(user); setIsEditing(true); setShowModal(true); };
    const handleOpenAdd = () => { setFormData({ id: null, name: '', email: '', role: 'Student', studentId: '', batch: '233' }); setIsEditing(false); setShowModal(true); };

    const createClearanceForStudent = (student) => {
        const batch = student.batch || 'N/A';
        const newItems = [
            { id: Date.now() + 1, studentId: student.studentId, studentName: student.name, batch: batch, unit: 'Department Head', type: 'Departmental', status: 'Pending', fee: 0, paid: true, note: 'New student entry.' },
            { id: Date.now() + 2, studentId: student.studentId, studentName: student.name, batch: batch, unit: 'Library Services', type: 'Library', status: 'Pending', fee: 0, paid: true, note: 'Library card issuance pending.' },
            { id: Date.now() + 3, studentId: student.studentId, studentName: student.name, batch: batch, unit: 'Bursary Office', type: 'Finance', status: 'Pending', fee: 0, paid: true, note: 'Initial fee check.' },
            { id: Date.now() + 4, studentId: student.studentId, studentName: student.name, batch: batch, unit: 'Hostel Management', type: 'Hostel', status: 'Pending', fee: 0, paid: true, note: 'Hostel allocation check.' },
            { id: Date.now() + 5, studentId: student.studentId, studentName: student.name, batch: batch, unit: 'Registrar Office', type: 'Administrative', status: 'Pending', fee: 0, paid: false, note: 'Final clearance pending.', checklist: [{label: 'Registration Card', status: 'Pending'}] },
        ];
        setClearanceDatabase(prev => [...prev, ...newItems]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            const updatedUser = { ...formData };
            setUsers(users.map(u => u.id === formData.id ? { ...u, ...updatedUser } : u));
            if (updatedUser.role === 'Student') {
               setClearanceDatabase(prev => prev.map(item => item.studentId === updatedUser.studentId ? { ...item, studentName: updatedUser.name } : item));
               setAppointments(prev => prev.map(app => app.studentId === updatedUser.studentId ? { ...app, studentName: updatedUser.name } : app));
            }
            addNotification({ title: 'User Updated', msg: `Details for ${formData.name} updated.`, targetRole: 'admin' });
        } else {
            if (formData.role === 'Student' && users.some(u => u.studentId === formData.studentId)) { alert(`Error: Student ID ${formData.studentId} already exists!`); return; }
            const newId = users.length > 0 ? Math.max(...users.map(u => Number(u.id))) + 1 : 1;
            const newUser = { id: newId, ...formData, status: 'Active', emergencyQuotaUsed: 0 };
            setUsers([...users, newUser]);
            if (newUser.role === 'Student') createClearanceForStudent(newUser);
            addNotification({ title: 'User Created', msg: `New ${formData.role} account created for ${formData.name}.`, targetRole: 'admin' });
        }
        setShowModal(false);
    };

    return (
        <>
            <Card className="p-6 overflow-hidden">
                <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-slate-800">User Management</h2><Button onClick={handleOpenAdd}><Plus size={16} /> Add User</Button></div>
                <div className="overflow-x-auto max-h-[500px] overflow-y-auto" style={{ scrollbarGutter: 'stable' }}><table className="w-full text-left text-sm min-w-[600px] table-fixed"><thead className="bg-slate-50 font-bold border-b text-slate-500 uppercase text-xs sticky top-0 z-10"><tr><th className="p-4 w-3/12">Name</th><th className="p-4 w-2/12">Role</th><th className="p-4 w-3/12">Email</th><th className="p-4 w-2/12">Status</th><th className="p-4 w-2/12 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{users.map(u => (<tr key={u.id} className="hover:bg-slate-50 transition-colors"><td className="p-4 font-bold text-slate-700 whitespace-nowrap truncate">{u.name}</td><td className="p-4 whitespace-nowrap"><span className={`px-2 py-1 rounded-full text-xs font-bold ${u.role === 'Student' ? 'bg-blue-50 text-blue-600' : u.role === 'Admin' ? 'bg-purple-50 text-purple-600' : 'bg-emerald-50 text-emerald-600'}`}>{u.role}</span></td><td className="p-4 text-slate-500 whitespace-nowrap truncate">{u.email}</td><td className="p-4 text-emerald-600 font-bold text-xs whitespace-nowrap">{u.status}</td><td className="p-4 text-right flex justify-end gap-2"><button onClick={() => handleEdit(u)} className="text-blue-500 hover:bg-blue-50 p-2 rounded"><Edit2 size={16} /></button><button onClick={() => handleDelete(u.id)} className="text-rose-500 hover:bg-rose-50 p-2 rounded"><Trash2 size={16} /></button></td></tr>))}</tbody></table></div>
            </Card>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={isEditing ? "Edit User" : "Add New User"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div><label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label><input required className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                    <div><label className="block text-sm font-bold text-slate-700 mb-1">Email</label><input required type="email" className="w-full border p-2 rounded" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
                    <div><label className="block text-sm font-bold text-slate-700 mb-1">Role</label><select className="w-full border p-2 rounded" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}><option>Student</option><option>Officer</option><option>Admin</option></select></div>
                    {formData.role === 'Student' && (<><div><label className="block text-sm font-bold text-slate-700 mb-1">Student ID</label><input className="w-full border p-2 rounded" value={formData.studentId || ''} onChange={e => setFormData({...formData, studentId: e.target.value})} /></div><div><label className="block text-sm font-bold text-slate-700 mb-1">Batch</label><input className="w-full border p-2 rounded" value={formData.batch || ''} onChange={e => setFormData({...formData, batch: e.target.value})} /></div></>)}
                    <div className="pt-4"><Button type="submit" className="w-full">{isEditing ? "Update User" : "Create Account"}</Button></div>
                </form>
            </Modal>
        </>
    )
}

const AdminAnalytics = ({ clearanceItems }) => {
  const total = clearanceItems.length;
  const approved = clearanceItems.filter(i => i.status === 'Approved').length;
  const pending = clearanceItems.filter(i => i.status === 'Pending' || i.status === 'Reviewing').length;

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[{ label: 'Active Requests', value: total, icon: <Users />, color: 'bg-blue-500' }, { label: 'Approvals', value: approved, icon: <CheckCircle />, color: 'bg-emerald-500' }, { label: 'Pending Action', value: pending, icon: <AlertCircle />, color: 'bg-amber-500' }].map((stat, i) => (
          <Card key={i} className="p-5 flex items-center gap-4"><div className={`p-3 rounded-lg text-white ${stat.color}`}>{stat.icon}</div><div><p className="text-sm text-slate-500">{stat.label}</p><p className="text-2xl font-bold text-slate-800">{stat.value}</p></div></Card>
        ))}
      </div>
      <Card className="p-6"><h3 className="font-bold text-slate-700 mb-4">Recent System Logs</h3><div className="space-y-4"><div className="flex items-center justify-between text-sm border-b border-slate-50 pb-2"><span className="text-slate-700">System sync check completed</span><span className="text-slate-400 text-xs">Just now</span></div></div></Card>
    </div>
  );
};

const AdminSettings = () => {
    const [settings, setSettings] = useState({ regOpen: true, maintenance: false });
    return (
        <div className="max-w-2xl mx-auto space-y-6"><h2 className="text-xl font-bold text-slate-800">System Configuration</h2><Card className="p-6 space-y-6"><div className="flex items-center justify-between"><div><h4 className="font-bold text-slate-700">Student Registration</h4><p className="text-sm text-slate-500">Allow new students to register</p></div><button onClick={() => setSettings({...settings, regOpen: !settings.regOpen})}>{settings.regOpen ? <ToggleRight size={40} className="text-blue-500" /> : <ToggleLeft size={40} className="text-slate-300" />}</button></div><div className="flex items-center justify-between"><div><h4 className="font-bold text-slate-700">Maintenance Mode</h4><p className="text-sm text-slate-500">Disable non-admin access</p></div><button onClick={() => setSettings({...settings, maintenance: !settings.maintenance})}>{settings.maintenance ? <ToggleRight size={40} className="text-blue-500" /> : <ToggleLeft size={40} className="text-slate-300" />}</button></div></Card></div>
    )
}

// --- 4. NEW LOGIN COMPONENT ---

const LoginView = ({ onLogin }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    // No role selection needed, passing generic input
    onLogin(userId, password, setError);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 border border-slate-100">
        <div className="p-8 pb-6 border-b border-slate-100 text-center bg-slate-50/50">
            <div className="w-16 h-16 bg-blue-700 rounded-xl flex items-center justify-center text-white shadow-lg mx-auto mb-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-800 to-indigo-600"></div>
                <Shield size={32} className="relative z-10" fill="currentColor" fillOpacity={0.2} />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">UniClearance</h1>
            <p className="text-sm text-slate-500 mt-1">Secure Clearance Portal</p>
        </div>

        <div className="p-8 pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
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

                <Button type="submit" className="w-full h-11 text-base shadow-lg shadow-blue-200 mt-2">
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

// --- MAIN APP ---
export default function App() {
  const [role, setRole] = useState('student');
  const [view, setView] = useState('dashboard');
  const [currentUserId, setCurrentUserId] = useState(null); // STORES LOGGED IN USER ID
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth >= 768);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);
  
  const [clearanceDatabase, setClearanceDatabase] = useState(INITIAL_DATABASE);
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [emergencyRequests, setEmergencyRequests] = useState(INITIAL_EMERGENCY_REQUESTS);
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  // Active user is derived from the currently logged in ID
  const activeUser = useMemo(() => {
     return users.find(u => u.id === currentUserId) || null;
  }, [currentUserId, users]);

  // LOGIN HANDLER
  const handleLogin = (idInput, passInput, setErrorCallback) => {
      const user = users.find(u => {
          const isPassMatch = u.password === passInput;
          // Check if input matches Student ID OR Email OR Name
          const isIdMatch = u.studentId === idInput || u.email === idInput || u.name === idInput;
          return isIdMatch && isPassMatch;
      });

      if (user) {
          setRole(user.role.toLowerCase()); // 'Student' -> 'student'
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

  const updateClearanceItem = (itemId, updates) => { setClearanceDatabase(prev => prev.map(item => item.id === itemId ? { ...item, ...updates } : item)); };
  const updateAppointment = (id, updates) => { setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a)); };
  const addAppointment = (newAppt) => { setAppointments(prev => [...prev, newAppt]); addNotification({ title: 'Appointment Booked', msg: `Booking request sent to ${newAppt.officer}.`, targetRole: 'student' }); }
  const addNotification = (notif) => { setNotifications(prev => [{ id: Date.now(), time: 'Just now', read: false, ...notif }, ...prev]); };
  
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

  const handleAdminOverride = (studentId) => {
      const emergency = emergencyRequests.find(r => r.studentId === studentId && r.status === 'Active');
      if (emergency) {
          setEmergencyRequests(prev => prev.map(r => r.id === emergency.id ? { ...r, status: 'Approved' } : r));
          addNotification({ title: 'Emergency Approved', msg: 'The Registrar has approved your emergency clearance.', targetRole: 'student', targetId: studentId });
      }
  }

  const renderOfficerContent = () => {
      if (view === 'dashboard') return <OfficerQueue clearanceItems={clearanceDatabase} updateClearanceItem={updateClearanceItem} addNotification={addNotification} emergencyRequests={emergencyRequests} onEmergencyApprove={handleEmergencyApproval} />;
      if (view === 'officer-appointments') return <OfficerAppointments appointments={appointments} updateAppointment={updateAppointment} />; 
      if (view === 'analytics') return <OfficerAnalytics clearanceItems={clearanceDatabase} />;
      if (view === 'profile') return <ProfileView user={activeUser} />;
      return <div>Select a menu item</div>;
  };

  const renderContent = () => {
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
            return <CertificateView studentProfile={activeUser} activeEmergency={emergencyApproved} isCleared={isCleared} />;
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
        />
    );
    
    if (view === 'dashboard' && role === 'admin') {
        const pendingEmergencies = emergencyRequests.filter(r => r.status === 'Active');
        return (
            <div className="space-y-8">
                {pendingEmergencies.length > 0 && (
                    <Card className="p-6 border-rose-200 bg-rose-50">
                        <h3 className="font-bold text-rose-800 flex items-center gap-2 mb-4"><Siren size={20}/> Pending Emergency Overrides</h3>
                        <div className="space-y-4">
                            {pendingEmergencies.map(req => (
                                <div key={req.id} className="bg-white p-4 rounded-xl border border-rose-100 flex justify-between items-center shadow-sm">
                                    <div>
                                        <p className="font-bold text-slate-800">{users.find(u=>u.studentId===req.studentId)?.name} <span className="text-slate-400 text-sm font-normal">({req.studentId})</span></p>
                                        <p className="text-sm text-rose-600 mt-1">Reason: {req.reason}</p>
                                        <p className="text-xs text-slate-400 mt-1">Submitted: {req.submissionTime instanceof Date ? req.submissionTime.toLocaleTimeString() : new Date().toLocaleTimeString()}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="danger" onClick={() => handleAdminOverride(req.studentId)}>Approve Override</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}
                <AdminAnalytics clearanceItems={clearanceDatabase} />
            </div>
        )
    }

    if (view === 'settings') return <AdminSettings />;

    if (role === 'student') return <StudentDashboard studentProfile={activeUser} clearanceItems={clearanceDatabase} updateClearanceItem={updateClearanceItem} onNavigate={setView} addNotification={addNotification} emergencyRequests={emergencyRequests} handleEmergencySubmit={handleEmergencySubmit} config={config} />;
    if (role === 'officer') return renderOfficerContent();
    if (role === 'admin') return <AdminAnalytics clearanceItems={clearanceDatabase} />;
  };

  const menuItems = {
    student: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'appointments', label: 'Appointments', icon: Calendar },
      { id: 'certificate', label: 'My Certificate', icon: Printer },
      { id: 'guidelines', label: 'Guidelines', icon: FileText },
    ],
    officer: [
      { id: 'dashboard', label: 'Queue Management', icon: Users },
      { id: 'officer-appointments', label: 'Appointments', icon: Calendar },
      { id: 'analytics', label: 'Reports & History', icon: FileText },
    ],
    admin: [
      { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
      { id: 'users', label: 'User Management', icon: Users },
      { id: 'settings', label: 'System Settings', icon: Settings },
    ]
  };

  useEffect(() => {
    const handleResize = () => { if(window.innerWidth >= 768) setIsSidebarOpen(true); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- RENDER LOGIN IF NOT LOGGED IN ---
  if (!currentUserId) {
      return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
        {isSidebarOpen && window.innerWidth < 768 && (
          <div className="fixed inset-0 bg-slate-900/60 z-30 backdrop-blur-sm animate-in fade-in" onClick={() => setIsSidebarOpen(false)}></div>
        )}

        <aside className={`fixed md:static inset-y-0 left-0 z-40 bg-slate-50/95 border-r-2 border-blue-100/50 backdrop-blur-sm transition-all duration-300 ease-in-out flex flex-col h-full shadow-2xl md:shadow-none ${isSidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full w-64 md:w-20 md:translate-x-0'}`}>
            <div className="h-20 flex items-center justify-center border-b border-blue-100/50 relative overflow-hidden">
                <div className={`flex items-center gap-3 transition-all duration-300 ${isSidebarOpen ? 'px-6 w-full' : 'justify-center w-full px-0'}`}>
                   <div className="w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 flex-shrink-0 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-800 to-indigo-600"></div>
                      <Shield size={26} className="relative z-10" fill="currentColor" fillOpacity={0.2} />
                      <BookOpen size={16} className="absolute z-20 text-white" strokeWidth={3} />
                   </div>
                   
                   <div className={`flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'}`}>
                      <span className="font-extrabold text-xl text-slate-800 leading-none tracking-tight">UniClearance</span>
                      <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest leading-none mt-1">System</span>
                   </div>
                </div>
            </div>

            <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
                {menuItems[role].map((item) => (
                    <button 
                        key={item.id}
                        onClick={() => { setView(item.id); if(window.innerWidth < 768) setIsSidebarOpen(false); }} 
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 whitespace-nowrap group relative overflow-hidden ${view === item.id ? 'bg-blue-50 text-blue-700 font-bold shadow-sm ring-1 ring-blue-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                    >
                        <div className={`absolute left-0 top-0 bottom-0 w-1 bg-blue-600 transition-all duration-300 ${view === item.id ? 'opacity-100' : 'opacity-0'}`}></div>
                        <item.icon size={20} className={`flex-shrink-0 transition-transform duration-200 ${view === item.id ? 'scale-110' : 'group-hover:scale-110'}`} /> 
                        <span className={`transition-all duration-300 ${isSidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute pointer-events-none'}`}>{item.label}</span>
                        {!isSidebarOpen && (
                            <div className="absolute left-14 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-xl">
                                {item.label}
                            </div>
                        )}
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-blue-100/50">
                <button onClick={handleLogout} className={`w-full flex items-center gap-3 p-3 rounded-xl text-rose-500 hover:bg-rose-50 transition-all ${!isSidebarOpen && 'justify-center'}`}>
                    <LogOut size={20} />
                    {isSidebarOpen && <span className="font-medium">Logout</span>}
                </button>
            </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden relative w-full bg-slate-50/50">
            <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-4 md:px-8 z-20 flex-shrink-0 sticky top-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><Menu size={20} /></button>
                    <h1 className="text-xl font-bold capitalize truncate text-slate-800 tracking-tight">{role} Portal</h1>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                    <div className="relative" ref={notifRef}>
                        <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 relative rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
                            <Bell size={20} />
                            {unreadCount > 0 && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>}
                        </button>
                        {showNotifications && (
                            <div className="absolute top-full right-0 mt-3 w-80 max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                                <div className="p-3 border-b bg-slate-50/80 backdrop-blur-sm flex justify-between items-center"><h3 className="font-bold text-sm text-slate-800">Notifications</h3><button onClick={markAllRead} className="text-xs text-blue-600 font-bold hover:underline">Mark read</button></div>
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
                        <div onClick={() => setView('profile')} className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs border-2 border-blue-200 shadow-sm cursor-pointer hover:bg-blue-200 transition-colors" title={activeUser.name}>
                            {getInitials(activeUser.name)}
                        </div>
                    )}
                </div>
            </header>
            <div className="flex-1 overflow-y-auto p-4 md:p-8 w-full scroll-smooth">
                <div className="max-w-7xl mx-auto pb-10">{renderContent()}</div>
            </div>
        </main>
    </div>
  );
}