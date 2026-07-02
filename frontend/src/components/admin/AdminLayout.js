import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { LayoutDashboard, LogOut, Search, Plus, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

const BASE_URL = 'http://localhost:5000';

const AdminLayout = ({ children, title, subtitle }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex min-h-screen page-bg">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-h-screen w-0 lg:ml-[232px]">
        <header className="topbar sticky top-0 z-20 flex items-center justify-between gap-3 px-4 lg:px-6 py-3 mt-14 lg:mt-0 shadow-sm">
          <div className="min-w-0 flex-shrink-0">
            <h1 className="text-lg font-bold text-primary truncate" style={{ fontFamily: 'Playfair Display,serif' }}>{title}</h1>
            {subtitle && <p className="text-xs text-muted truncate">{subtitle}</p>}
          </div>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-xs relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}/>
            <input
              type="text" placeholder="Search anything..."
              className="w-full pl-9 pr-12 py-2 rounded-xl text-sm outline-none transition-all duration-200"
              style={{ background: 'var(--bg-muted)', border: '1px solid var(--border-card)', color: 'var(--text-primary)' }}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold px-1.5 py-0.5 rounded"
              style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border-card)' }}>⌘K</span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => navigate('/dashboard')}
              className="hidden sm:flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-xl font-semibold transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{ background: '#0d1b2a', color: '#fff', boxShadow: '0 1px 6px rgba(13,27,42,0.25)' }}>
              <Plus size={13} /> Service Portal
            </button>

            {/* Alerts bell */}
            <button
              onClick={() => navigate('/notifications')}
              className="relative w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', color: 'var(--text-secondary)' }}>
              <Bell size={15} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ background: '#ef4444' }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Logout button */}
            <button
              onClick={() => setShowConfirm(true)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
              style={{ background: 'rgba(185,28,28,0.12)', color: '#b91c1c', border: '1px solid rgba(185,28,28,0.30)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(185,28,28,0.22)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(185,28,28,0.12)'; }}>
              <LogOut size={13}/> Logout
            </button>

            {/* Profile image */}
            <button
              onClick={() => navigate('/admin/profile')}
              className="transition-all duration-200"
              style={{ borderRadius: '10px', overflow: 'hidden', border: '2px solid rgba(201,168,76,0.35)', width: '36px', height: '36px', flexShrink: 0 }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.75)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.35)'}>
              {user?.avatar
                ? <img src={`${BASE_URL}${user.avatar}`} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #0d1b2a, #243b6a)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '14px' }}>
                    {user?.name?.charAt(0)}
                  </div>
              }
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>

        <footer className="border-t border-[var(--border-card)] py-3 px-4 lg:px-8 text-center text-xs text-muted">
          © 2024 FOT Student Hub · Faculty of Technology, Rajarata University of Sri Lanka
        </footer>
      </div>

      {/* Logout Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowConfirm(false)}>
          <div onClick={e => e.stopPropagation()}
            className="rounded-2xl p-6 w-80"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(185,28,28,0.12)', border: '1px solid rgba(185,28,28,0.25)' }}>
                <LogOut size={26} style={{ color: '#b91c1c' }} />
              </div>
            </div>
            <h2 className="text-center text-base font-bold mb-1"
              style={{ fontFamily: 'Playfair Display, serif', color: 'var(--text-primary)' }}>
              Are you sure you want to logout?
            </h2>
            <p className="text-center text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
              You will be signed out of your admin account.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{ background: 'var(--bg-muted)', color: 'var(--text-secondary)', border: '1px solid var(--border-card)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--border-card)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-muted)'}>
                Cancel
              </button>
              <button onClick={handleLogout}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #991b1b, #b91c1c)', color: '#fff', boxShadow: '0 4px 14px rgba(185,28,28,0.35)' }}>
                <LogOut size={14}/> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
