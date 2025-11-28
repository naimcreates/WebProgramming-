import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  LayoutDashboard, FileText, CheckCircle, XCircle, Clock, CreditCard, Calendar, Bell, Menu, User, LogOut, UploadCloud, QrCode, Printer, Users, TrendingUp, AlertCircle, Settings, Trash2, BookOpen, Beaker, Home, GraduationCap, Stamp, Plus, ToggleLeft, ToggleRight, Check, X, ShieldAlert, Edit2, Shield, ChevronLeft, Mail, Phone, Hash, MapPin, Eye, CalendarCheck
} from 'lucide-react';

// --- 1. CONSTANTS & REAL-WORLD DATA ---

const SYSTEM_DATE = "Nov 27, 2025";

// Initial User Data
const INITIAL_USERS = [
    { 
        id: 1, 
        name: 'Alex Thompson', 
        role: 'Student', 
        email: 'alex.t@uni.edu', 
        status: 'Active', 
        studentId: '0112230676',
        dept: 'Computer Science',
        batch: '223', 
        semester: '8th (Final)',
        phone: '+1 (555) 012-3456',
        address: '123 Campus Dorm, Block B'
    },
    { id: 2, name: 'Sarah Jenkins', role: 'Officer', email: 'sarah.j@uni.edu', status: 'Active', phone: '+1 (555) 987-6543', dept: 'Registrar Office' },
    { id: 3, name: 'Dr. Al-Fayed', role: 'Admin', email: 'admin@uni.edu', status: 'Active', phone: '+1 (555) 000-1111' },
    { id: 4, name: 'Jamie Doe', role: 'Student', email: 'jamie.d@uni.edu', status: 'Active', studentId: '0112230670', dept: 'EEE', batch: '231', semester: '6th', phone: '+1 (555) 222-3333' },
    { id: 5, name: 'Jordan Smith', role: 'Student', email: 'jordan.s@uni.edu', status: 'Active', studentId: '0112420876', dept: 'BBA', batch: '232', semester: '4th', phone: '+1 (555) 444-5555' },
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

const INITIAL_NOTIFICATIONS = [
  { id: 1, title: 'Hostel Cleared', msg: 'Your room handover was successful.', time: '2 mins ago', read: false, targetRole: 'student', targetId: '0112230676' },
  { id: 2, title: 'New Request', msg: 'Alex Thompson (0112230676) uploaded a document.', time: '1 hour ago', read: false, targetRole: 'officer' },
  { id: 3, title: 'System Update', msg: 'Maintenance scheduled for tonight.', time: '5 hours ago', read: true, targetRole: 'all' },
];

const AVAILABLE_SLOTS = [
  { id: 1, time: '09:00 AM', available: true },
  { id: 2, time: '10:00 AM', available: false },
  { id: 3, time: '11:00 AM', available: true },
  { id: 4, time: '02:00 PM', available: true },
];

// --- 2. UTILITIES ---
const isPositiveStatus = (status) => ['Cleared', 'Submitted', 'Returned', 'Passed', 'None', 'Active', 'Confirmed', 'Approved'].includes(status);
const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : 'U';

// --- 3. SHARED COMPONENTS ---

const Button = ({ children, variant = 'primary', className = '', onClick, disabled, icon: Icon }) => {
  const baseStyle = "px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";
  const variants = {
    primary: "bg-blue-700 text-white hover:bg-blue-800 shadow-lg shadow-blue-200", 
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100",
    ghost: "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
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

const StatusBadge = ({ status }) => {
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

// --- 4. VIEW COMPONENTS ---

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

const StudentDashboard = ({ studentProfile, clearanceItems, updateClearanceItem, onNavigate, addNotification }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(null);
  const [uploading, setUploading] = useState(null);

  const myItems = useMemo(() => clearanceItems.filter(item => item.studentId === studentProfile.studentId), [clearanceItems, studentProfile]);
  
  const progress = myItems.length > 0 ? Math.round((myItems.filter(i => i.status === 'Approved').length / myItems.length) * 100) : 0;
  const totalDue = myItems.reduce((acc, curr) => acc + (curr.paid ? 0 : curr.fee), 0);
  const isCleared = progress === 100 && myItems.length > 0;

  const handleUpload = (id) => {
    setUploading(id);
    setTimeout(() => {
      updateClearanceItem(id, { 
          status: 'Reviewing', 
          note: 'Document uploaded. Waiting for officer review.',
          uploadedFile: 'Payment_Receipt_Nov2025.pdf' // Mock file upload
      });
      const item = myItems.find(i => i.id === id);
      addNotification({
          title: 'Document Uploaded',
          msg: `You uploaded a document for ${item.unit}.`,
          targetRole: 'student',
          targetId: studentProfile.studentId
      });
      addNotification({
          title: 'Action Required',
          msg: `${studentProfile.name} (${studentProfile.studentId}) uploaded proof for ${item.unit}.`,
          targetRole: 'officer'
      });
      setUploading(null);
    }, 1500);
  };

  const handlePay = (id) => {
    const unitName = myItems.find(i => i.id === id).unit;
    updateClearanceItem(id, { 
        paid: true, 
        fee: 0, 
        status: 'Pending', 
        docRequired: true, 
        note: 'Payment successful. Please upload payment receipt for verification.' 
    });
    addNotification({ title: 'Payment Successful', msg: `Payment to ${unitName} successful. Upload receipt now.`, targetRole: 'student', targetId: studentProfile.studentId });
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
                        <div className="flex items-center gap-2 text-emerald-300 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
                            <CheckCircle size={20} />
                            <span className="font-bold uppercase tracking-wide">All Dues Cleared</span>
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                           <span className="text-xs opacity-50 uppercase">Financial Status</span>
                           {totalDue > 0 ? (
                               <div className="flex items-center gap-3 text-amber-300 bg-amber-500/20 px-4 py-2 rounded-xl border border-amber-500/30 animate-pulse-slow">
                                   <AlertCircle size={24} />
                                   <div>
                                       <span className="text-[10px] uppercase font-bold opacity-80 block leading-tight">Total Payable</span>
                                       <span className="text-xl font-extrabold tracking-tight">TK {totalDue.toFixed(2)}</span>
                                   </div>
                               </div>
                           ) : (
                               <span className="text-blue-300 font-bold flex items-center gap-2 bg-blue-500/20 px-3 py-1 rounded-full text-xs">
                                   <Clock size={14} /> In Progress
                               </span>
                           )}
                        </div>
                    )}
                 </div>
              </div>
              <div className="flex gap-3 mt-4">
                <Button onClick={() => onNavigate('appointments')} variant="secondary" className="bg-white/10 border-white/10 text-white hover:bg-white/20">
                  <Calendar size={16} /> Book Appointment
                </Button>
                <Button onClick={() => onNavigate('guidelines')} variant="secondary" className="bg-white/10 border-white/10 text-white hover:bg-white/20">
                  <FileText size={16} /> Guidelines
                </Button>
              </div>
            </div>
            
            <div className="relative flex-shrink-0 mt-6 md:mt-0">
              <svg viewBox={`0 0 ${baseSize} ${baseSize}`} className="transform -rotate-90 w-32 h-32 md:w-48 md:h-48 transition-all duration-300">
                <defs>
                    <linearGradient id="royalBlueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#60a5fa" /> 
                        <stop offset="50%" stopColor="#3b82f6" /> 
                        <stop offset="100%" stopColor="#2563eb" /> 
                    </linearGradient>
                </defs>
                <circle cx={center} cy={center} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" className="text-white/10" />
                <circle cx={center} cy={center} r={radius} stroke="url(#royalBlueGradient)" strokeWidth={strokeWidth} fill="transparent" strokeDasharray={circumference} strokeDashoffset={circumference - (circumference * progress) / 100} className="transition-all duration-1000 ease-out" strokeLinecap="round"/>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl md:text-4xl font-bold transition-all duration-300 text-white">{progress}%</span>
                  <span className="text-[10px] md:text-xs uppercase tracking-wider text-blue-200">Cleared</span>
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-6 flex flex-col justify-center items-center text-center bg-white border-blue-100 hover:border-blue-300">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4 text-blue-600 shadow-inner"><GraduationCap size={32} /></div>
          <h3 className="text-lg font-bold text-slate-800">Final Clearance</h3>
          <p className="text-sm text-slate-500 mt-2 mb-4">Certificate available upon 100% completion.</p>
          <Button disabled={progress < 100} onClick={() => onNavigate('certificate')} className="w-full">
             {progress < 100 ? `${myItems.length - myItems.filter(i=>i.status==='Approved').length} Steps Remaining` : 'Download Certificate'}
          </Button>
        </Card>
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-4 px-1">Clearance Modules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {myItems.map((item) => (
            <Card key={item.id} className={`p-5 flex flex-col h-full border-l-4 ${item.status === 'Approved' ? 'border-l-emerald-500' : item.status === 'Rejected' ? 'border-l-rose-500' : 'border-l-amber-500'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl shadow-sm border border-slate-100">{getIconForType(item.type)}</div>
                  <div><h4 className="font-bold text-slate-800 text-lg">{item.unit}</h4><p className="text-xs text-slate-500 font-medium tracking-wide uppercase">{item.type} Module</p></div>
                </div>
                <StatusBadge status={item.status} />
              </div>
              <div className="flex-1 space-y-4">
                {item.note && (
                    <div className={`p-3 rounded-lg border text-sm ${item.status === 'Rejected' ? 'bg-rose-50 border-rose-100 text-rose-800' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                        <div className="flex items-center gap-2 mb-1">{item.status === 'Rejected' && <AlertCircle size={14} />}<span className="font-bold text-xs uppercase">{item.status === 'Rejected' ? 'Rejection Reason' : 'Officer Note'}</span></div>"{item.note}"
                    </div>
                )}
                {item.breakdown && (
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <p className="text-xs font-bold text-slate-500 uppercase mb-2">Fee Breakdown</p>
                        {item.breakdown.map((fee, idx) => (<div key={idx} className="flex justify-between text-sm mb-1"><span className="text-slate-600">{fee.label}</span><span className="font-mono font-medium">TK {fee.amount.toFixed(2)}</span></div>))}
                        <div className="border-t border-slate-200 mt-2 pt-2 flex justify-between font-bold text-slate-800"><span>Total Due</span><span>TK {item.fee.toFixed(2)}</span></div>
                    </div>
                )}
                {item.checklist && (
                    <div className="space-y-2 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                        {item.checklist.map((check, idx) => (<div key={idx} className="flex items-center gap-3 text-sm">{isPositiveStatus(check.status) ? <CheckCircle size={16} className="text-emerald-500" /> : <AlertCircle size={16} className="text-amber-500" />}<span className={isPositiveStatus(check.status) ? 'text-slate-400 line-through' : 'text-slate-700'}>{check.label}</span></div>))}
                    </div>
                )}
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100">
                {item.fee > 0 && !item.paid ? <Button onClick={() => setShowPaymentModal(item)} className="w-full" variant="danger">Pay TK {item.fee.toFixed(2)} Now</Button> : 
                 item.status === 'Rejected' || (item.status === 'Pending' && (item.docRequired || item.type === 'Administrative')) ? 
                 <Button variant="secondary" className="w-full hover:bg-slate-100 hover:border-slate-300" onClick={() => handleUpload(item.id)}>{uploading === item.id ? 'Uploading...' : <><UploadCloud size={16} /> {item.type === 'Administrative' ? 'Submit Registration Card' : 'Upload Proof'}</>}</Button> : 
                 <div className="text-center text-xs text-slate-400 py-2">Updated: {new Date().toLocaleTimeString()}</div>}
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
    </div>
  );
};

const GuidelinesView = () => {
  return (
    <div className="space-y-6 animate-in fade-in">
      <h2 className="text-2xl font-bold text-slate-800">Clearance Guidelines</h2>
      <p className="text-slate-600">Please follow the instructions below for each department to ensure a smooth clearance process.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><BookOpen size={20}/></div>
            <h3 className="font-bold text-slate-800">Library Services</h3>
          </div>
          <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
            <li>Return all borrowed books to the central library.</li>
            <li>Pay any outstanding fines for late returns or damaged books.</li>
            <li>Ensure your library account status is marked as 'Active' or 'Closed' by the librarian.</li>
          </ul>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><CreditCard size={20}/></div>
            <h3 className="font-bold text-slate-800">Accounts / Finance</h3>
          </div>
          <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
            <li>Clear all tuition fees up to the final semester.</li>
            <li>Pay exam fees and any retake fees if applicable.</li>
            <li>Clear miscellaneous dues (ID card fines, lab breakage fees, etc.).</li>
          </ul>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Home size={20}/></div>
            <h3 className="font-bold text-slate-800">Hostel Management</h3>
          </div>
          <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
            <li>Pay all hostel rent and mess dues.</li>
            <li>Hand over your room keys to the warden.</li>
            <li>Get a room condition check to ensure no damages.</li>
          </ul>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><Beaker size={20}/></div>
            <h3 className="font-bold text-slate-800">Departmental</h3>
          </div>
          <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
            <li>Return all lab equipment and kits.</li>
            <li>Clear departmental society dues.</li>
            <li>Obtain final confirmation/signature from the Head of Department (HOD).</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

const AppointmentsView = ({ navigate, appointments, addAppointment, studentProfile }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [booked, setBooked] = useState(false);
  const [unit, setUnit] = useState('Bursary Office');

  const myAppointments = appointments.filter(a => a.studentId === studentProfile.studentId);
  
  const handleBook = () => {
    if(!selectedSlot) return;
    setBooked(true);
    setTimeout(() => {
      const slotTime = AVAILABLE_SLOTS.find(s => s.id === selectedSlot).time;
      const newAppt = {
        id: Date.now(),
        studentId: studentProfile.studentId,
        studentName: studentProfile.name,
        officer: unit,
        date: selectedDate,
        time: slotTime,
        status: 'Pending'
      };
      addAppointment(newAppt);
      setBooked(false);
      setSelectedSlot(null);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div><h2 className="text-2xl font-bold text-slate-800">Book Appointment</h2><p className="text-slate-500">Schedule a meeting with officers</p></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Calendar size={18} /> Select Date</h3>
            <input type="date" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
            <div className="mt-6 space-y-3">
              <h4 className="text-sm font-medium text-slate-500">Department</h4>
              <select className="w-full p-3 border rounded-xl bg-white" value={unit} onChange={e => setUnit(e.target.value)}>
                  {['Bursary Office', 'Library Services', 'Department Head', 'Hostel Management', 'Registrar Office'].map(u => (
                      <option key={u}>{u}</option>
                  ))}
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
            {AVAILABLE_SLOTS.map(slot => (
              <button key={slot.id} onClick={() => setSelectedSlot(slot.id)} className={`p-4 rounded-xl border text-center transition-all ${selectedSlot === slot.id ? 'bg-blue-600 text-white shadow-lg' : 'hover:border-blue-500'}`}>
                <div className="text-lg font-bold">{slot.time}</div><div className="text-xs mt-1 opacity-80">Available</div>
              </button>
            ))}
          </div>
          <div className="p-4 bg-slate-50 rounded-xl flex justify-between items-center border border-slate-100">
            <div><p className="text-sm text-slate-500">Selected Slot</p><p className="font-bold text-slate-800">{selectedSlot ? AVAILABLE_SLOTS.find(s => s.id === selectedSlot).time : 'None selected'}</p></div>
            <Button disabled={!selectedSlot} onClick={handleBook}>{booked ? 'Booking...' : 'Confirm Booking'}</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

const CertificateView = ({ studentProfile }) => (
  <div className="flex justify-center p-4 print:p-0 print:m-0 print:absolute print:top-0 print:left-0 print:w-full print:h-full print:z-[9999] print:bg-white">
    <style>{`@media print { body { -webkit-print-color-adjust: exact; } body * { visibility: hidden; } #certificate-container, #certificate-container * { visibility: visible; } #certificate-container { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; box-shadow: none; border: none; } #print-btn { display: none; } }`}</style>
    <div id="certificate-container" className="bg-white shadow-2xl w-[700px] min-h-[900px] p-12 relative border border-slate-200 text-center print:shadow-none print:border-none print:w-full">
      <div className="absolute top-0 left-0 w-full h-4 bg-blue-900"></div>
      <div className="mb-12">
        <div className="w-20 h-20 bg-slate-900 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-serif text-3xl">U</div>
        <h1 className="text-3xl font-serif font-bold text-slate-900 uppercase tracking-widest">University of Tech</h1>
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-500">Office of the Registrar</p>
      </div>
      <div className="mb-12 border-b-2 border-slate-100 pb-8">
        <h2 className="text-4xl font-serif text-blue-900 mb-6 italic">Certificate of Clearance</h2>
        <p className="text-slate-600 text-lg">This is to certify that</p>
        <p className="text-3xl font-bold text-slate-800 my-4 font-serif">{studentProfile.name}</p>
        <p className="text-slate-600">Matriculation Number: <strong>{studentProfile.studentId}</strong></p>
        <p className="text-slate-600 mt-2">Has satisfactorily fulfilled all financial and non-financial obligations to the university and is hereby cleared for graduation.</p>
      </div>
      <div className="grid grid-cols-2 gap-12 text-left mb-16">
        <div><p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Department</p><p className="font-medium">{studentProfile.dept || 'N/A'}</p></div>
        <div><p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Date of Issue</p><p className="font-medium">{SYSTEM_DATE}</p></div>
      </div>
      <div className="flex justify-between items-end mt-auto">
        <div className="text-center relative">
            <div className="w-48 border-b border-slate-800 mb-2 mx-auto relative">
                {/* Simulated Signature using SVG Path */}
                <svg viewBox="0 0 200 60" className="h-16 absolute bottom-0 left-1/2 transform -translate-x-1/2 text-blue-900 pointer-events-none">
                    <path d="M10,40 Q40,10 70,40 T130,40 T180,20" fill="none" stroke="currentColor" strokeWidth="2" />
                    <text x="30" y="45" fontFamily="cursive" fontSize="20" fill="currentColor" style={{fontStyle: 'italic'}}>Dr. Al-Fayed</text> 
                </svg>
            </div>
            <p className="text-xs font-bold uppercase">Registrar Signature</p>
        </div>
        <div className="border-4 border-slate-900 p-2"><QrCode size={80} /></div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-4 bg-blue-900"></div>
    </div>
    <div id="print-btn" className="fixed bottom-8 right-8"><Button className="shadow-2xl" onClick={() => window.print()}><Printer size={18} /> Print Certificate</Button></div>
  </div>
);

// --- 5. ADMIN MODULES ---

const AdminUserManagement = ({ users, setUsers, addNotification }) => {
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ id: null, name: '', email: '', role: 'Student', studentId: '' });

    const handleDelete = (id) => { if(confirm('Are you sure?')) setUsers(users.filter(u => u.id !== id)); }
    
    const handleEdit = (user) => {
        setFormData(user);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleOpenAdd = () => {
        setFormData({ id: null, name: '', email: '', role: 'Student', studentId: '' });
        setIsEditing(false);
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            setUsers(users.map(u => u.id === formData.id ? { ...u, ...formData } : u));
            addNotification({ title: 'User Updated', msg: `Details for ${formData.name} updated.`, targetRole: 'admin' });
        } else {
            // Fix: Calculate new ID correctly to avoid duplicates even after deletions
            const newId = users.length > 0 ? Math.max(...users.map(u => Number(u.id))) + 1 : 1;
            setUsers([...users, { id: newId, ...formData, status: 'Active' }]);
            addNotification({ title: 'User Created', msg: `New ${formData.role} account created for ${formData.name}.`, targetRole: 'admin' });
        }
        setShowModal(false);
    };

    return (
        <Card className="p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-slate-800">User Management</h2><Button onClick={handleOpenAdd}><Plus size={16} /> Add User</Button></div>
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto" style={{ scrollbarGutter: 'stable' }}>
                <table className="w-full text-left text-sm min-w-[600px] table-fixed">
                    <thead className="bg-slate-50 font-bold border-b text-slate-500 uppercase text-xs sticky top-0 z-10">
                        <tr>
                            <th className="p-4 w-3/12">Name</th>
                            <th className="p-4 w-2/12">Role</th>
                            <th className="p-4 w-3/12">Email</th>
                            <th className="p-4 w-2/12">Status</th>
                            <th className="p-4 w-2/12 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map(u => (
                            <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 font-bold text-slate-700 whitespace-nowrap truncate">{u.name}</td>
                                <td className="p-4 whitespace-nowrap"><span className={`px-2 py-1 rounded-full text-xs font-bold ${u.role === 'Student' ? 'bg-blue-50 text-blue-600' : u.role === 'Admin' ? 'bg-purple-50 text-purple-600' : 'bg-emerald-50 text-emerald-600'}`}>{u.role}</span></td>
                                <td className="p-4 text-slate-500 whitespace-nowrap truncate">{u.email}</td>
                                <td className="p-4 text-emerald-600 font-bold text-xs whitespace-nowrap">{u.status}</td>
                                <td className="p-4 text-right flex justify-end gap-2">
                                    <button onClick={() => handleEdit(u)} className="text-blue-500 hover:bg-blue-50 p-2 rounded"><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete(u.id)} className="text-rose-500 hover:bg-rose-50 p-2 rounded"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={isEditing ? "Edit User" : "Add New User"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div><label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label><input required className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                    <div><label className="block text-sm font-bold text-slate-700 mb-1">Email</label><input required type="email" className="w-full border p-2 rounded" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
                    <div><label className="block text-sm font-bold text-slate-700 mb-1">Role</label><select className="w-full border p-2 rounded" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}><option>Student</option><option>Officer</option><option>Admin</option></select></div>
                    {formData.role === 'Student' && (
                        <div><label className="block text-sm font-bold text-slate-700 mb-1">Student ID</label><input className="w-full border p-2 rounded" value={formData.studentId || ''} onChange={e => setFormData({...formData, studentId: e.target.value})} /></div>
                    )}
                    <div className="pt-4"><Button type="submit" className="w-full">{isEditing ? "Update User" : "Create Account"}</Button></div>
                </form>
            </Modal>
        </Card>
    )
}

const AdminAnalytics = ({ clearanceItems }) => {
  const total = clearanceItems.length;
  const approved = clearanceItems.filter(i => i.status === 'Approved').length;
  const pending = clearanceItems.filter(i => i.status === 'Pending' || i.status === 'Reviewing').length;
  const revenue = clearanceItems.reduce((acc, curr) => acc + (curr.paid ? (curr.fee > 0 ? curr.fee : 0) : 0), 45000);

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[{ label: 'Active Requests', value: total, icon: <Users />, color: 'bg-blue-500' }, { label: 'Approvals', value: approved, icon: <CheckCircle />, color: 'bg-emerald-500' }, { label: 'Pending Action', value: pending, icon: <AlertCircle />, color: 'bg-amber-500' }, { label: 'Revenue (Est)', value: `TK ${(revenue/1000).toFixed(1)}k`, icon: <TrendingUp />, color: 'bg-purple-500' }].map((stat, i) => (
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

// ... (Officer modules kept the same as previous)
const OfficerQueue = ({ clearanceItems, updateClearanceItem, addNotification }) => {
  const [selectedUnit, setSelectedUnit] = useState('Registrar Office');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [comment, setComment] = useState('');

  const queue = clearanceItems.filter(item => item.unit === selectedUnit);
  const studentFullClearance = selectedRequest ? clearanceItems.filter(item => item.studentId === selectedRequest.studentId && item.unit !== 'Registrar Office') : [];
  const allOthersApproved = studentFullClearance.every(item => item.status === 'Approved');

  const handleAction = (status) => {
    if (!selectedRequest) return;
    updateClearanceItem(selectedRequest.id, { status, note: comment || (status === 'Rejected' ? 'Rejected by officer' : 'Approved by officer') });
    addNotification({ title: `Clearance ${status}`, msg: `Your request for ${selectedUnit} has been ${status}.`, targetRole: 'student', targetId: selectedRequest.studentId });
    setSelectedRequest(null);
    setComment('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <div className="bg-white border-b border-slate-200 p-4 flex items-center gap-4 overflow-x-auto">
         <span className="text-xs font-bold uppercase text-slate-500 whitespace-nowrap">Select Dept:</span>
         {['Registrar Office', 'Department Head', 'Library Services', 'Bursary Office', 'Hostel Management'].map(unit => (
             <button key={unit} onClick={() => { setSelectedUnit(unit); setSelectedRequest(null); }} className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${selectedUnit === unit ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{unit}</button>
         ))}
      </div>
      <div className="flex flex-1 overflow-hidden">
        <Card className="w-1/3 flex flex-col rounded-none border-r border-t-0 border-b-0 border-l-0" noPadding>
            <div className="p-4 border-b border-slate-100 bg-slate-50/50"><h3 className="font-bold text-slate-700">{selectedUnit} Queue ({queue.length})</h3></div>
            <div className="overflow-y-auto flex-1">
            {queue.map(item => (
                <div key={item.id} onClick={() => setSelectedRequest(item)} className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 ${selectedRequest?.id === item.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'border-l-4 border-l-transparent'}`}>
                    <div className="flex justify-between items-start mb-1"><h4 className="font-bold text-sm text-slate-700">{item.studentName}</h4><StatusBadge status={item.status} /></div>
                    <p className="text-xs text-slate-500">{item.studentId} • Batch {item.batch || 'N/A'}</p>
                </div>
            ))}
            {queue.length === 0 && <div className="p-8 text-center text-slate-400">No pending requests.</div>}
            </div>
        </Card>
        <div className="flex-1 p-8 overflow-y-auto bg-slate-50/50">
            {selectedRequest ? (
            <Card className="max-w-2xl mx-auto">
                <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                    <div><h2 className="text-2xl font-bold text-slate-800">{selectedRequest.studentName}</h2><p className="text-slate-500 text-sm">{selectedRequest.studentId}</p></div>
                    <div className="text-right"><span className="text-xs uppercase font-bold text-slate-400">Current Status</span><div className="mt-1"><StatusBadge status={selectedRequest.status} /></div></div>
                </div>
                <div className="space-y-6 mb-8">
                    {selectedUnit === 'Registrar Office' && (
                        <div className="bg-slate-100 rounded-lg p-4 border border-slate-200">
                            <div className="flex justify-between items-center mb-3"><h4 className="text-sm font-bold text-slate-700 uppercase flex items-center gap-2"><Stamp size={16} /> Cross-Department Clearance</h4>{allOthersApproved ? <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded font-bold">All Signatures Verified</span> : <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded font-bold">Pending Signatures</span>}</div>
                            <div className="space-y-1">{studentFullClearance.map(item => (<div key={item.id} className="flex justify-between text-sm p-2 bg-white rounded border border-slate-100"><span className="text-slate-600">{item.unit}</span><StatusBadge status={item.status} /></div>))}</div>
                        </div>
                    )}
                    {/* New Section: Display Uploaded Proof for Reviewing Items */}
                    {selectedRequest.status === 'Reviewing' && selectedRequest.uploadedFile && (
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded border border-blue-100">
                                    <FileText size={20} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-700">Proof of Payment</p>
                                    <p className="text-xs text-blue-600 underline cursor-pointer">{selectedRequest.uploadedFile}</p>
                                </div>
                            </div>
                            <Button variant="secondary" className="h-8 text-xs" onClick={() => alert("Opening document preview...")} icon={Eye}>View</Button>
                        </div>
                    )}

                    {selectedRequest.checklist && (
                        <div>
                            <h4 className="text-sm font-bold text-slate-700 uppercase mb-3">Checklist Actions</h4>
                            <div className="space-y-2">{selectedRequest.checklist.map((c, i) => (<div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100"><span className="text-sm text-slate-700">{c.label}</span><span className={`text-xs font-bold px-2 py-1 rounded ${isPositiveStatus(c.status) ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{c.status}</span></div>))}</div>
                        </div>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Officer Decision</label>
                    <textarea className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none mb-4 resize-none h-24" placeholder="Enter notes..." value={comment} onChange={(e) => setComment(e.target.value)} />
                    <div className="flex gap-4">
                        <Button variant="danger" className="flex-1" onClick={() => handleAction('Rejected')}>Reject</Button>
                        <Button className="flex-1" onClick={() => handleAction('Approved')} disabled={selectedUnit === 'Registrar Office' && !allOthersApproved}>{selectedUnit === 'Registrar Office' && !allOthersApproved ? 'Waiting for other Depts' : 'Approve & Clear'}</Button>
                    </div>
                </div>
            </Card>
            ) : (<div className="h-full flex flex-col items-center justify-center text-slate-400"><Users size={48} className="mb-4 opacity-20" /><p>Select a student from the {selectedUnit} queue.</p></div>)}
        </div>
      </div>
    </div>
  );
};

const OfficerAppointments = ({ appointments, updateAppointment }) => {
    // New State for Officer Department Filtering
    const [selectedUnit, setSelectedUnit] = useState('Bursary Office');

    // Filter appointments for the selected department
    const queue = appointments.filter(a => a.officer === selectedUnit && a.status === 'Pending');
    
    // New Logic: Group schedule/history by date
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
                <div className="flex items-center gap-2">
                     <span className="text-sm text-slate-500">Viewing as:</span>
                     <select 
                         className="p-2 border rounded-lg bg-white text-sm font-medium"
                         value={selectedUnit}
                         onChange={(e) => setSelectedUnit(e.target.value)}
                     >
                         {['Bursary Office', 'Library Services', 'Department Head', 'Hostel Management', 'Registrar Office'].map(u => (
                             <option key={u}>{u}</option>
                         ))}
                     </select>
                </div>
            </div>

            {/* Pending Requests Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {queue.length === 0 ? (
                    <div className="col-span-3 text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
                        <p className="text-slate-400 italic">No pending appointments for {selectedUnit}.</p>
                    </div>
                ) : queue.map(apt => (
                    <Card key={apt.id} className="p-4">
                        <div className="flex justify-between items-start mb-2"><div><h4 className="font-bold text-slate-800">{apt.studentName}</h4><p className="text-xs text-slate-500">{apt.studentId}</p></div><div className="text-right"><span className="block font-bold text-emerald-600">{apt.time}</span><span className="text-xs text-slate-400">{apt.date}</span></div></div>
                        <div className="flex gap-2 mt-4">
                            <Button variant="secondary" className="flex-1 h-8 text-xs border-rose-200 text-rose-600 hover:bg-rose-50" onClick={() => handleDecision(apt.id, 'Declined')}><X size={14} /> Decline</Button>
                            <Button className="flex-1 h-8 text-xs" onClick={() => handleDecision(apt.id, 'Confirmed')}><Check size={14} /> Confirm</Button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* New: Appointment Schedule & History Section */}
            <div className="mt-8 pt-8 border-t border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <CalendarCheck size={20} className="text-blue-600"/> 
                    Appointment Schedule
                </h3>
                <div className="space-y-8">
                    {sortedDates.length === 0 ? (
                        <p className="text-slate-400 italic text-center">No scheduled appointments.</p>
                    ) : (
                        sortedDates.map(date => (
                            <div key={date} className="relative pl-8 border-l-2 border-blue-100 last:border-l-0">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-500"></div>
                                <h4 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wider">{new Date(date).toDateString()}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {groupedSchedule[date].map(apt => (
                                        <div key={apt.id} className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-all flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-sm text-slate-800">{apt.studentName}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Clock size={12} className="text-slate-400"/>
                                                    <p className="text-xs text-slate-500 font-medium">{apt.time}</p>
                                                </div>
                                                <p className="text-[10px] text-slate-400 mt-1 font-mono">{apt.studentId}</p>
                                            </div>
                                            <StatusBadge status={apt.status} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

const OfficerHistory = ({ clearanceItems }) => {
    const historyItems = clearanceItems.filter(i => i.status !== 'Pending' && i.status !== 'Reviewing');
    return (
        <Card className="p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Process History</h2>
            <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 font-bold border-b"><tr><th className="p-3">Student ID</th><th className="p-3">Name</th><th className="p-3">Unit</th><th className="p-3">Decision</th><th className="p-3">Note</th></tr></thead><tbody>{historyItems.map(item => (<tr key={item.id} className="border-b hover:bg-slate-50"><td className="p-3 font-mono text-xs">{item.studentId}</td><td className="p-3">{item.studentName}</td><td className="p-3">{item.unit}</td><td className="p-3"><StatusBadge status={item.status} /></td><td className="p-3 text-slate-500 truncate max-w-xs">{item.note}</td></tr>))}</tbody></table></div>
        </Card>
    )
}

const OfficerReports = ({ clearanceItems }) => {
    const total = clearanceItems.length;
    const approved = clearanceItems.filter(i => i.status === 'Approved').length;
    const rejected = clearanceItems.filter(i => i.status === 'Rejected').length;
    const rate = total > 0 ? Math.round((approved / total) * 100) : 0;
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800">Departmental Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-5 bg-blue-50 border-blue-100"><p className="text-xs font-bold uppercase text-blue-600 mb-1">Clearance Rate</p><p className="text-3xl font-bold text-blue-800">{rate}%</p></Card>
                <Card className="p-5 bg-rose-50 border-rose-100"><p className="text-xs font-bold uppercase text-rose-600 mb-1">Rejections</p><p className="text-3xl font-bold text-rose-800">{rejected}</p></Card>
                <Card className="p-5 bg-indigo-50 border-indigo-100"><p className="text-xs font-bold uppercase text-indigo-600 mb-1">Total Processed</p><p className="text-3xl font-bold text-indigo-800">{approved + rejected}</p></Card>
            </div>
        </div>
    )
}

// --- MAIN APP ---
export default function UniversityClearanceSystem() {
  const [role, setRole] = useState('student');
  const [view, setView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth >= 768);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);
  
  // Central State Management
  const [clearanceDatabase, setClearanceDatabase] = useState(INITIAL_DATABASE);
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Derived Active User based on Role
  const activeUser = useMemo(() => {
     if(role === 'student') return users.find(u => u.studentId === '0112230676') || users[0];
     if(role === 'officer') return users.find(u => u.role === 'Officer') || users[1];
     if(role === 'admin') return users.find(u => u.role === 'Admin') || users[2];
     return users[0];
  }, [role, users]);

  const updateClearanceItem = (itemId, updates) => { setClearanceDatabase(prev => prev.map(item => item.id === itemId ? { ...item, ...updates } : item)); };
  const updateAppointment = (id, updates) => { setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a)); };
  const addAppointment = (newAppt) => { setAppointments(prev => [...prev, newAppt]); addNotification({ title: 'Appointment Booked', msg: `Booking request sent to ${newAppt.officer}.`, targetRole: 'student' }); }
  const addNotification = (notif) => { setNotifications(prev => [{ id: Date.now(), time: 'Just now', read: false, ...notif }, ...prev]); };
  
  const roleNotifications = notifications.filter(n => n.targetRole === role || n.targetRole === 'all');
  const unreadCount = roleNotifications.filter(n => !n.read).length;
  const markAllRead = () => { setNotifications(prev => prev.map(n => (n.targetRole === role || n.targetRole === 'all') ? { ...n, read: true } : n)); };

  // Click outside listener for notifications
  useEffect(() => {
    function handleClickOutside(event) {
        if (notifRef.current && !notifRef.current.contains(event.target)) {
            setShowNotifications(false);
        }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notifRef]);

  const renderOfficerContent = () => {
      if (view === 'dashboard') return <OfficerQueue clearanceItems={clearanceDatabase} updateClearanceItem={updateClearanceItem} addNotification={addNotification} />;
      if (view === 'officer-appointments') return <OfficerAppointments appointments={appointments} updateAppointment={updateAppointment} />; 
      if (view === 'history') return <OfficerHistory clearanceItems={clearanceDatabase} />;
      if (view === 'reports') return <OfficerReports clearanceItems={clearanceDatabase} />;
      if (view === 'profile') return <ProfileView user={activeUser} />;
      return <div>Select a menu item</div>;
  };

  const renderContent = () => {
    // Safety check if active user is deleted or unavailable
    if (!activeUser) return <div className="p-8 text-center text-slate-500">User account not found. Please contact admin.</div>;

    // Global Student Check for Certificate Access
    if (view === 'certificate') {
       if(role === 'student') {
            const studentItems = clearanceDatabase.filter(item => item.studentId === activeUser.studentId);
            const progress = studentItems.length > 0 ? Math.round((studentItems.filter(i => i.status === 'Approved').length / studentItems.length) * 100) : 0;
            
            if (progress < 100) {
               return (
                 <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8">
                   <div className="bg-red-100 p-4 rounded-full mb-4"><ShieldAlert size={48} className="text-red-600" /></div>
                   <h2 className="text-2xl font-bold text-slate-800 mb-2">Restricted Access</h2>
                   <p className="text-slate-500 max-w-md">Your clearance process is not yet complete (100% required). Please complete all pending steps in the dashboard to unlock your certificate.</p>
                   <Button onClick={() => setView('dashboard')} className="mt-6">Return to Dashboard</Button>
                 </div>
               );
            }
       }
       return <CertificateView studentProfile={activeUser} />;
    }

    if (view === 'profile') return <ProfileView user={activeUser} />;
    if (view === 'appointments') return <AppointmentsView navigate={setView} appointments={appointments} addAppointment={addAppointment} studentProfile={activeUser} />;
    if (view === 'guidelines') return <GuidelinesView />;
    
    if (view === 'history') return <OfficerHistory clearanceItems={clearanceDatabase} />;
    if (view === 'reports') return <OfficerReports clearanceItems={clearanceDatabase} />;
    if (view === 'users') return <AdminUserManagement users={users} setUsers={setUsers} addNotification={addNotification} />;
    if (view === 'settings') return <AdminSettings />;

    if (role === 'student') return <StudentDashboard studentProfile={activeUser} clearanceItems={clearanceDatabase} updateClearanceItem={updateClearanceItem} onNavigate={setView} addNotification={addNotification} />;
    if (role === 'officer') return renderOfficerContent();
    if (role === 'admin') return <AdminAnalytics clearanceItems={clearanceDatabase} />;
  };

  const menuItems = {
    student: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      // { id: 'profile', label: 'My Profile', icon: User }, // Hidden from menu as requested
      { id: 'appointments', label: 'Appointments', icon: Calendar },
      { id: 'certificate', label: 'My Certificate', icon: Printer },
      { id: 'guidelines', label: 'Guidelines', icon: FileText },
    ],
    officer: [
      { id: 'dashboard', label: 'Queue Management', icon: Users },
      // { id: 'profile', label: 'My Profile', icon: User }, // Hidden from menu as requested
      { id: 'officer-appointments', label: 'Appointments', icon: Calendar },
      { id: 'history', label: 'History', icon: Clock },
      { id: 'reports', label: 'Reports', icon: FileText },
    ],
    admin: [
      { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
      // { id: 'profile', label: 'My Profile', icon: User }, // Hidden from menu as requested
      { id: 'users', label: 'User Management', icon: Users },
      { id: 'settings', label: 'System Settings', icon: Settings },
    ]
  };

  useEffect(() => {
    const handleResize = () => { if(window.innerWidth >= 768) setIsSidebarOpen(true); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
        {/* Mobile Sidebar Backdrop */}
        {isSidebarOpen && window.innerWidth < 768 && (
          <div className="fixed inset-0 bg-slate-900/60 z-30 backdrop-blur-sm animate-in fade-in" onClick={() => setIsSidebarOpen(false)}></div>
        )}

        {/* Sidebar */}
        <aside className={`fixed md:static inset-y-0 left-0 z-40 bg-slate-50/95 border-r-2 border-blue-100/50 backdrop-blur-sm transition-all duration-300 ease-in-out flex flex-col h-full shadow-2xl md:shadow-none ${isSidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full w-64 md:w-20 md:translate-x-0'}`}>
            <div className="h-20 flex items-center justify-center border-b border-blue-100/50 relative overflow-hidden">
                <div className={`flex items-center gap-3 transition-all duration-300 ${isSidebarOpen ? 'px-6 w-full' : 'justify-center w-full px-0'}`}>
                   {/* Improved Logo Icon - Book & Shield Concept */}
                   <div className="w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 flex-shrink-0 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-800 to-indigo-600"></div>
                      <Shield size={26} className="relative z-10" fill="currentColor" fillOpacity={0.2} />
                      <BookOpen size={16} className="absolute z-20 text-white" strokeWidth={3} />
                   </div>
                   
                   {/* Logo Text - Only visible when open */}
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
                <button className={`w-full flex items-center gap-3 p-3 rounded-xl text-rose-500 hover:bg-rose-50 transition-all ${!isSidebarOpen && 'justify-center'}`}>
                    <LogOut size={20} />
                    {isSidebarOpen && <span className="font-medium">Logout</span>}
                </button>
            </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden relative w-full bg-slate-50/50">
            <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-4 md:px-8 z-20 flex-shrink-0 sticky top-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><Menu size={20} /></button>
                    <h1 className="text-xl font-bold capitalize truncate text-slate-800 tracking-tight">{role} Portal</h1>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                    <div className="bg-slate-100 p-1 rounded-lg flex shadow-inner">
                        {['student', 'officer', 'admin'].map(r => (
                            <button key={r} onClick={() => { setRole(r); setView('dashboard'); }} className={`px-3 py-1.5 rounded-md capitalize text-xs md:text-sm transition-all duration-200 ${role === r ? 'bg-white shadow-sm font-bold text-slate-800 transform scale-105' : 'text-slate-500 hover:text-slate-700'}`}>{r}</button>
                        ))}
                    </div>
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