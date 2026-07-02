import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { adminGetUsers, adminUpdateRole, adminDeleteUser } from '../../services/api';
import { Users, Trash2, Search, Shield, ShieldCheck } from 'lucide-react';

const DEPT_COLORS = {
  ICT: 'bg-blue-100 text-blue-700',
  EET: 'bg-amber-100 text-amber-700',
  BPT: 'bg-green-100 text-green-700',
  FDT: 'bg-purple-100 text-purple-700',
  MTT: 'bg-rose-100 text-rose-700',
};

const AdminUsers = () => {
  const { user: me } = useAuth();
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');

  // ── super_admin only ──────────────────────────────────────────────
  if (me?.adminType !== 'super_admin') {
    return (
      <AdminLayout title="User Management" subtitle="Access restricted">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <ShieldCheck size={40} className="text-muted mx-auto mb-3 opacity-40" />
            <p className="text-primary font-bold">Super Admin access required</p>
            <p className="text-muted text-sm mt-1">Only Super Admins can manage user accounts.</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const load = () =>
    adminGetUsers()
      .then(r => { setUsers(r.data); setLoading(false); })
      .catch(() => setLoading(false));

  useEffect(() => { load(); }, []); // eslint-disable-line

  const handleRole = async (id, role) => {
    if (!window.confirm(`Change role to ${role}?`)) return;
    await adminUpdateRole(id, { role });
    load();
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this user?')) return;
    await adminDeleteUser(id);
    load();
  };

  const filtered = users.filter(u =>
    `${u.name} ${u.email} ${u.registrationNumber || ''} ${u.department || ''}`.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="User Management" subtitle="View and manage all registered users">
      <div className="flex items-center gap-3 mb-6 animate-fade-up" style={{ opacity: 0 }}>
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, reg. number or department..."
            className="input-field pl-10" />
        </div>
        <div className="px-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl text-sm font-bold text-secondary whitespace-nowrap">
          {filtered.length} users
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="bg-[var(--bg-card)] rounded-2xl h-16 animate-pulse border border-[var(--border-card)]" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-14 text-center animate-fade-up" style={{ opacity: 0 }}>
          <Users size={48} className="mx-auto mb-3 text-muted opacity-50" />
          <p className="text-muted">No users found.</p>
        </div>
      ) : (
        <div className="card overflow-hidden animate-fade-up" style={{ opacity: 0 }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--bg-muted)] border-b border-[var(--border-card)]">
                  {['User', 'ID / Email', 'Department', 'Year', 'Role', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-bold text-secondary uppercase tracking-wide px-5 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u._id} className="border-b border-[var(--border-card)] hover:bg-[var(--bg-card-hover)] transition">
                    {/* Name + avatar */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0d1b2a] to-[#243b6a] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {u.name?.charAt(0)}
                        </div>
                        <p className="text-sm font-bold text-primary whitespace-nowrap">{u.name}</p>
                      </div>
                    </td>

                    {/* ID + email */}
                    <td className="px-5 py-3">
                      <p className="text-xs font-mono font-bold text-primary">
                        {u.registrationNumber || u.wardenId || u.unionId || '—'}
                      </p>
                      <p className="text-xs text-muted truncate max-w-[180px]">{u.email}</p>
                    </td>

                    {/* Department */}
                    <td className="px-5 py-3">
                      {u.department
                        ? <span className={`text-xs px-2 py-1 rounded-lg font-bold ${DEPT_COLORS[u.department] || 'bg-gray-100 text-gray-600'}`}>{u.department}</span>
                        : <span className="text-xs text-muted">—</span>}
                    </td>

                    {/* Year */}
                    <td className="px-5 py-3 text-xs text-secondary">{u.year || '—'}</td>

                    {/* Role badge */}
                    <td className="px-5 py-3">
                      {u.role === 'admin'
                        ? <span className="flex items-center gap-1 text-xs font-bold text-[#c9a84c] bg-[#0d1b2a] px-2 py-1 rounded-lg whitespace-nowrap">
                            <Shield size={10} />{u.adminType?.replace('_',' ') || 'Admin'}
                          </span>
                        : <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-lg">Student</span>}
                    </td>

                    {/* Joined */}
                    <td className="px-5 py-3 text-xs text-muted whitespace-nowrap">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3">
                      <button onClick={() => handleDelete(u._id)}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition"
                        title="Delete user">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;
