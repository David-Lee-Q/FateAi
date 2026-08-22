import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock, Settings, Database, Award, Edit3, Download,
  Trash2, Brain, Eye, EyeOff, Save, Check, AlertCircle,
  UserCircle, FileJson, Search, LogOut, X, Loader2, KeyRound,
} from 'lucide-react';
import { getAiConfig, saveAiConfig } from '@/services/api';
import type { AiConfig } from '@/services/api';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { useAuth } from '@/context/useAuth';

/* ============ 占卜系统选项（与后端 /api/fortune 支持的 20 个系统一致） ============ */
const DIVINATION_SYSTEMS: { value: string; label: string }[] = [
  { value: 'bazi', label: '八字命理' },
  { value: 'ziwei', label: '紫微斗数' },
  { value: 'liuyao', label: '六爻占卜' },
  { value: 'meihua', label: '梅花易数' },
  { value: 'qimen', label: '奇门遁甲' },
  { value: 'tieban', label: '铁板神数' },
  { value: 'daliuren', label: '大六壬' },
  { value: 'fengshui', label: '风水堪舆' },
  { value: 'tarot', label: '塔罗占卜' },
  { value: 'zodiac', label: '星座运势' },
  { value: 'numerology', label: '数字能量' },
  { value: 'astrodice', label: '骰子占卜' },
  { value: 'moonphase', label: '月相占卜' },
  { value: 'rune', label: '符文占卜' },
  { value: 'dream', label: '周公解梦' },
  { value: 'nametest', label: '姓名测试' },
  { value: 'shengxiao', label: '生肖运势' },
  { value: 'almanac', label: '黄历宜忌' },
  { value: 'drawlot', label: '签诗抽签' },
  { value: 'palm', label: '手相算命' },
];

/* ============ Tab 配置 ============ */
type TabKey = 'personal' | 'preferences' | 'data';

const TABS: { key: TabKey; label: string; icon: typeof UserCircle }[] = [
  { key: 'personal', label: '个人信息', icon: UserCircle },
  { key: 'preferences', label: '偏好设置', icon: Settings },
  { key: 'data', label: '数据管理', icon: Database },
];

/* ============ 编辑表单输入行 ============ */
function EditField({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 500, marginBottom: 6, color: 'var(--color-text-secondary)' }}>{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', boxSizing: 'border-box', borderRadius: 8,
          border: '1px solid var(--color-border)', padding: '10px 14px',
          fontSize: 'var(--text-sm)', color: 'var(--color-text)',
          background: 'var(--color-bg)', outline: 'none', fontFamily: 'var(--font-body)',
        }}
      />
    </div>
  );
}

/* ============ 个人中心页面 ============ */
export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, updateProfile, accounts, switchAccount, forgetAccount } = useAuth();

  const [activeTab, setActiveTab] = useState<TabKey>('personal');
  const [switching, setSwitching] = useState<string | null>(null);
  const [accountMsg, setAccountMsg] = useState('');

  const handleSwitchAccount = async (username: string) => {
    if (!user || username === user.username || switching) return;
    setSwitching(username);
    setAccountMsg('');
    try {
      await switchAccount(username);
      setAccountMsg(`已切换到 ${username}`);
    } catch (err) {
      setAccountMsg(err instanceof Error ? err.message : '切换失败');
    } finally {
      setSwitching(null);
      window.setTimeout(() => setAccountMsg(''), 3000);
    }
  };
  const [defaultSystem, setDefaultSystem] = useState('bazi');
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);

  // 编辑资料弹窗状态
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ nickname: '', birthday: '', birthdayLunar: '', birthTime: '', birthPlace: '', gender: '' });
  const [editSaving, setEditSaving] = useState(false);
  const [editMsg, setEditMsg] = useState('');

  // 从登录账户派生的展示数据
  const nickname = user?.nickname || '天机用户';
  const profile = user?.profile;
  const registerDays = user
    ? Math.max(1, Math.ceil((Date.now() - new Date(user.createdAt).getTime()) / 86400000))
    : 0;
  const registerDate = user ? new Date(user.createdAt).toLocaleDateString('zh-CN') : '';
  const display = (value?: string) => (value ? value : '未设置');

  const openEdit = () => {
    if (!user) return;
    setEditForm({
      nickname: user.nickname,
      birthday: user.profile.birthday,
      birthdayLunar: user.profile.birthdayLunar,
      birthTime: user.profile.birthTime,
      birthPlace: user.profile.birthPlace,
      gender: user.profile.gender,
    });
    setEditMsg('');
    setEditOpen(true);
  };

  const handleEditSave = async () => {
    if (!editForm.nickname.trim()) {
      setEditMsg('昵称不能为空');
      return;
    }
    setEditSaving(true);
    setEditMsg('');
    try {
      await updateProfile({
        nickname: editForm.nickname.trim(),
        birthday: editForm.birthday.trim(),
        birthdayLunar: editForm.birthdayLunar.trim(),
        birthTime: editForm.birthTime.trim(),
        birthPlace: editForm.birthPlace.trim(),
        gender: editForm.gender,
      });
      setEditOpen(false);
    } catch (err) {
      setEditMsg(err instanceof Error ? err.message : '保存失败，请重试');
    } finally {
      setEditSaving(false);
    }
  };

  /** 退出登录（二次确认 + 倒计时提示，避免 iframe 环境 window.confirm 被拦截导致点击无响应） */
  const [confirmingLogout, setConfirmingLogout] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutCountdown, setLogoutCountdown] = useState(4);
  const logoutTimer = useRef<number | null>(null);
  const logoutTick = useRef<number | null>(null);

  const handleLogout = async () => {
    if (loggingOut) return;
    if (!confirmingLogout) {
      setConfirmingLogout(true);
      setLogoutCountdown(4);
      if (logoutTimer.current) window.clearTimeout(logoutTimer.current);
      if (logoutTick.current) window.clearInterval(logoutTick.current);
      const startedAt = Date.now();
      logoutTick.current = window.setInterval(() => {
        setLogoutCountdown(Math.max(0, 4 - Math.floor((Date.now() - startedAt) / 1000)));
      }, 200);
      logoutTimer.current = window.setTimeout(() => {
        setConfirmingLogout(false);
        if (logoutTick.current) window.clearInterval(logoutTick.current);
      }, 4000);
      return;
    }
    if (logoutTimer.current) window.clearTimeout(logoutTimer.current);
    if (logoutTick.current) window.clearInterval(logoutTick.current);
    setConfirmingLogout(false);
    setLoggingOut(true);
    try {
      await logout();
      navigate('/login');
    } finally {
      setLoggingOut(false);
    }
  };

  // AI 配置状态
  const [aiConfig, setAiConfig] = useState<AiConfig | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [apiBaseInput, setApiBaseInput] = useState('');
  const [modelInput, setModelInput] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [aiSaving, setAiSaving] = useState(false);
  const [aiSaveMessage, setAiSaveMessage] = useState('');

  // 搜索历史
  const { history, deleteHistory, clearHistory, getFormattedHistory, exportData, importData } = useSearchHistory();
  const [formattedHistory, setFormattedHistory] = useState<Array<{id: string; text: string; time: string; system?: string}>>([]);
  const [dataOperationMsg, setDataOperationMsg] = useState('');

  // 格式化历史记录
  useEffect(() => {
    setFormattedHistory(getFormattedHistory());
  }, [getFormattedHistory]);

  // 占卜系统中文名映射
  const SYSTEM_NAMES: Record<string, string> = {
    dream: '周公解梦', tarot: '塔罗牌', zodiac: '星座运势', bazi: '八字命理',
    ziwei: '紫微斗数', fengshui: '风水堪舆', drawlot: '签诗抽签', palm: '手相算命',
    astrodice: '骰子占卜', rune: '符文占卜', shengxiao: '生肖运势', almanac: '黄历宜忌',
    moonphase: '月相占卜', liuyao: '六爻占卜', meihua: '梅花易数', qimen: '奇门遁甲',
    numerology: '数字能量', nametest: '姓名测试',
  };

  /** 导出数据 */
  const handleExportData = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tianji_data_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDataOperationMsg('导出成功');
    setTimeout(() => setDataOperationMsg(''), 3000);
  };

  /** 删除单条记录 */
  const handleDeleteRecord = (id: string) => {
    deleteHistory(id);
  };

  /** 清空所有数据（二次确认，避免 iframe 环境 window.confirm 被拦截导致点击无响应） */
  const [confirmingClear, setConfirmingClear] = useState(false);
  const confirmTimer = useRef<number | null>(null);

  const handleClearAllData = () => {
    if (!confirmingClear) {
      setConfirmingClear(true);
      if (confirmTimer.current) window.clearTimeout(confirmTimer.current);
      confirmTimer.current = window.setTimeout(() => setConfirmingClear(false), 4000);
      return;
    }
    if (confirmTimer.current) window.clearTimeout(confirmTimer.current);
    setConfirmingClear(false);
    clearHistory();
    setDataOperationMsg('已清空所有数据');
    setTimeout(() => setDataOperationMsg(''), 3000);
  };

  useEffect(() => () => {
    if (confirmTimer.current) window.clearTimeout(confirmTimer.current);
    if (logoutTimer.current) window.clearTimeout(logoutTimer.current);
    if (logoutTick.current) window.clearInterval(logoutTick.current);
  }, []);

  /** 加载 AI 配置 */
  useEffect(() => {
    getAiConfig().then((config) => {
      setAiConfig(config);
      setApiBaseInput(config.apiBase);
      setModelInput(config.model);
    }).catch(() => {});
  }, []);

  /* ============ 样式辅助 ============ */
  const containerStyle: React.CSSProperties = {
    maxWidth: 1280,
    margin: '0 auto',
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 'calc(var(--nav-height, 64px) + 32px)',
    paddingBottom: 64,
  };

  const profileCardStyle: React.CSSProperties = {
    background: 'var(--color-bg-elevated)',
    border: '1px solid var(--color-border-light)',
    borderRadius: 16,
    padding: 32,
  };

  const infoRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 0',
    borderBottom: '1px solid var(--color-border-light)',
  };

  const toggleStyle = (active: boolean): React.CSSProperties => ({
    position: 'relative',
    width: 48,
    height: 26,
    background: active ? 'var(--color-primary)' : 'var(--color-border)',
    borderRadius: 13,
    cursor: 'pointer',
    flexShrink: 0,
    border: 'none',
  });

  const statCardStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, rgba(0, 75, 170, 0.1), rgba(200, 168, 78, 0.05))',
    border: '1px solid rgba(0, 75, 170, 0.15)',
    borderRadius: 16,
    padding: 32,
    textAlign: 'center',
  };

  const sideNavItemStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    borderRadius: 12,
    color: isActive ? 'var(--color-gold)' : 'var(--color-text-secondary)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    textDecoration: 'none',
    background: isActive ? 'rgba(0, 75, 170, 0.15)' : 'transparent',
    border: 'none',
    position: 'relative',
  });

  return (
    <div style={{ background: 'var(--color-bg)', color: 'var(--color-text)', minHeight: '100vh' }}>
      <div style={containerStyle}>
        <div style={{ display: 'flex', flexDirection: 'row', gap: 24 }}>
          {/* 左侧：侧边导航 */}
          <aside style={{ width: 240, flexShrink: 0 }}>
            {/* 桌面端纵向导航 */}
            <nav className="hidden lg:flex" style={{ flexDirection: 'column', gap: 4, position: 'sticky', top: 96, ...profileCardStyle }}>
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    style={sideNavItemStyle(activeTab === tab.key)}
                  >
                    <Icon size={18} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
            {/* 移动端横向 Tab */}
            <div className="flex lg:hidden" style={{ overflowX: 'auto', gap: 8 }}>
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    style={sideNavItemStyle(activeTab === tab.key)}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* 右侧：内容区 */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* 用户信息大卡片（深蓝渐变） */}
            <section style={{
              ...profileCardStyle,
              background: 'linear-gradient(135deg, #002060 0%, #003580 40%, #004baa 100%)',
              borderColor: 'rgba(200, 168, 78, 0.15)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                {/* CSS 头像 */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{
                    position: 'absolute', inset: -4, borderRadius: '50%',
                    border: '2px solid rgba(200, 168, 78, 0.4)',
                  }} />
                  <div style={{
                    width: 80, height: 80, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
                    boxShadow: '0 4px 20px rgba(200, 168, 78, 0.3)',
                  }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--color-primary-darker)' }}>T</span>
                  </div>
                </div>
                {/* 用户信息 */}
                <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                  <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text-inverse)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {nickname}
                  </h1>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 12px',
                      borderRadius: 8, fontSize: 'var(--text-xs)', fontWeight: 500, whiteSpace: 'nowrap',
                      background: 'rgba(200, 168, 78, 0.15)', color: 'var(--color-gold-light)',
                      border: '1px solid rgba(200, 168, 78, 0.25)',
                    }}>
                      <Award size={12} /> 普通会员
                    </span>
                    <span style={{ fontSize: 'var(--text-xs)', whiteSpace: 'nowrap', color: 'var(--color-text-secondary)' }} title={registerDate}>
                      已使用 {registerDays} 天
                    </span>
                  </div>
                </div>
                {/* 编辑资料按钮 */}
                <button
                  onClick={openEdit}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '12px 24px', borderRadius: 12, fontSize: 'var(--text-sm)', fontWeight: 600,
                    cursor: 'pointer', whiteSpace: 'nowrap',
                    background: 'transparent', color: 'var(--color-gold)',
                    border: '1px solid rgba(200, 168, 78, 0.3)', flexShrink: 0,
                  }}
                >
                  <Edit3 size={16} /> 编辑资料
                </button>
              </div>
            </section>

            {/* 个人信息区 */}
            {activeTab === 'personal' && (
              <section style={profileCardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <UserCircle size={20} color="var(--color-primary-lighter)" />
                  <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-text)' }}>个人信息</h2>
                </div>
                {/* 出生日期 */}
                <div style={infoRowStyle}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--color-text-tertiary)' }}>出生日期</p>
                    <p style={{ fontSize: 'var(--text-sm)', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--color-text)' }}>{display(profile?.birthday)}</p>
                    <p style={{ fontSize: 'var(--text-xs)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--color-text-tertiary)' }}>{profile?.birthdayLunar || ' '}</p>
                  </div>
                </div>
                {/* 出生时间 */}
                <div style={{ ...infoRowStyle, borderBottom: '1px solid var(--color-border-light)' }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--color-text-tertiary)' }}>出生时间</p>
                    <p style={{ fontSize: 'var(--text-sm)', marginTop: 4, color: 'var(--color-text)' }}>{display(profile?.birthTime)}</p>
                  </div>
                </div>
                {/* 出生地 */}
                <div style={{ ...infoRowStyle, borderBottom: '1px solid var(--color-border-light)' }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--color-text-tertiary)' }}>出生地</p>
                    <p style={{ fontSize: 'var(--text-sm)', marginTop: 4, color: 'var(--color-text)' }}>{display(profile?.birthPlace)}</p>
                  </div>
                </div>
                {/* 性别 */}
                <div style={{ ...infoRowStyle, borderBottom: '1px solid var(--color-border-light)' }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--color-text-tertiary)' }}>性别</p>
                    <p style={{ fontSize: 'var(--text-sm)', marginTop: 4, color: 'var(--color-text)' }}>{display(profile?.gender)}</p>
                  </div>
                </div>

                {/* 账号管理（本机账号一键切换） */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 0', borderBottom: '1px solid var(--color-border-light)' }}>
                    <KeyRound size={15} style={{ color: 'var(--color-gold)' }} />
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text)' }}>账号管理</span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>已在本机保留 {accounts.length} 个账号，可一键切换</span>
                  </div>
                  {accounts.map((a, i) => {
                    const isCurrent = user && a.username === user.username;
                    const isSwitching = switching === a.username;
                    return (
                      <div
                        key={a.username}
                        className="pf-account-row"
                        style={{
                          display: 'flex', alignItems: 'center', gap: 12,
                          padding: '14px 0',
                          borderBottom: i < accounts.length - 1 ? '1px solid var(--color-border-light)' : 'none',
                        }}
                      >
                        <span style={{
                          width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: 'linear-gradient(135deg, var(--color-primary), var(--color-gold))',
                          fontSize: 'var(--text-sm)', fontWeight: 700, color: '#fff',
                        }}>
                          {a.user.nickname.charAt(0).toUpperCase()}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {a.user.nickname}
                            {isCurrent && (
                              <span style={{ marginLeft: 8, fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--color-gold)' }}>当前</span>
                            )}
                          </p>
                          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            @{a.username}
                          </p>
                        </div>
                        {!isCurrent && (
                          isSwitching ? (
                            <Loader2 size={16} className="animate-spin" style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
                          ) : (
                            <button
                              onClick={() => handleSwitchAccount(a.username)}
                              className="pf-btn-switch"
                              style={{
                                flexShrink: 0, height: 32, padding: '0 18px', borderRadius: 8, fontSize: 'var(--text-xs)', fontWeight: 600,
                                color: '#fff', background: 'var(--color-primary)', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                              }}
                            >
                              切换
                            </button>
                          )
                        )}
                        <button
                          onClick={() => forgetAccount(a.username)}
                          title="从本机移除该账号"
                          aria-label={`移除账号 ${a.username}`}
                          className="pf-btn-remove"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)', padding: 8, borderRadius: 8, flexShrink: 0 }}
                        >
                          <X size={15} />
                        </button>
                      </div>
                    );
                  })}
                  {accountMsg && (
                    <p style={{ marginTop: 10, fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{accountMsg}</p>
                  )}

                  {/* 退出登录（破坏性操作，二次确认） */}
                  <div style={{ paddingTop: 16, borderTop: '1px solid var(--color-border-light)' }}>
                    <button
                      onClick={handleLogout}
                      title="退出当前登录（本机账号保留，可随时切换或重新登录）"
                      className={`pf-btn-logout${confirmingLogout ? ' pf-confirming' : ''}`}
                      style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        height: 44, width: '100%', borderRadius: 12,
                        fontSize: 'var(--text-sm)', fontWeight: 600,
                        cursor: 'pointer', whiteSpace: 'nowrap',
                        background: confirmingLogout ? 'transparent' : 'rgba(196, 58, 58, 0.06)',
                        border: '1px solid rgba(196, 58, 58, 0.35)',
                      }}
                    >
                      {loggingOut
                        ? <Loader2 size={16} className="animate-spin" />
                        : <LogOut size={16} />}
                      {confirmingLogout ? (
                        <>
                          再次点击确认退出
                          <span className="pf-logout-count">{logoutCountdown}s</span>
                        </>
                      ) : '退出登录'}
                    </button>
                    <p style={{
                      fontSize: 'var(--text-xs)', marginTop: 8, textAlign: 'center',
                      color: confirmingLogout ? '#ff7b72' : 'var(--color-text-tertiary)',
                      transition: 'color 200ms ease',
                    }}>
                      {confirmingLogout
                        ? `将退出${user?.nickname || '当前'}的本机登录，${logoutCountdown} 秒内无操作自动取消`
                        : '退出后本机账号保留，可随时切换或重新登录'}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* 偏好设置区 */}
            {activeTab === 'preferences' && (
              <section style={profileCardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <Settings size={20} color="var(--color-primary-lighter)" />
                  <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-text)' }}>偏好设置</h2>
                </div>
                {/* 默认占卜体系 */}
                <div style={infoRowStyle}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--color-text-tertiary)' }}>默认占卜体系</p>
                    <p style={{ fontSize: 'var(--text-xs)', marginTop: 4, color: 'var(--color-text-tertiary)' }}>选择查询时默认使用的占卜体系</p>
                  </div>
                  <select
                    value={defaultSystem}
                    onChange={(e) => setDefaultSystem(e.target.value)}
                    style={{
                      appearance: 'none',
                      background: 'var(--color-bg-inset)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text)',
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-sm)',
                      padding: '10px 40px 10px 14px',
                      borderRadius: 8,
                      cursor: 'pointer',
                      flexShrink: 0,
                      maxWidth: 240,
                    }}
                  >
                    {DIVINATION_SYSTEMS.map((sys) => (
                      <option key={sys.value} value={sys.value}>{sys.label}</option>
                    ))}
                  </select>
                </div>
                {/* 推送通知 */}
                <div style={{ ...infoRowStyle, borderBottom: '1px solid var(--color-border-light)' }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text)' }}>推送通知</p>
                    <p style={{ fontSize: 'var(--text-xs)', marginTop: 2, color: 'var(--color-text-tertiary)' }}>接收每日运势推送和提醒</p>
                  </div>
                  <button
                    onClick={() => setNotificationEnabled(!notificationEnabled)}
                    style={toggleStyle(notificationEnabled)}
                    aria-checked={notificationEnabled}
                  >
                    <span style={{
                      position: 'absolute', width: 22, height: 22, borderRadius: '50%',
                      background: 'var(--color-text-inverse)', top: 2,
                      left: notificationEnabled ? 22 : 2,
                      transition: 'transform 250ms ease',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }} />
                  </button>
                </div>
                {/* 深色模式 */}
                <div style={{ ...infoRowStyle, borderBottom: 'none' }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text)' }}>深色模式</p>
                    <p style={{ fontSize: 'var(--text-xs)', marginTop: 2, color: 'var(--color-text-tertiary)' }}>切换页面显示主题</p>
                  </div>
                  <button
                    onClick={() => setDarkModeEnabled(!darkModeEnabled)}
                    style={toggleStyle(darkModeEnabled)}
                    aria-checked={darkModeEnabled}
                  >
                    <span style={{
                      position: 'absolute', width: 22, height: 22, borderRadius: '50%',
                      background: 'var(--color-text-inverse)', top: 2,
                      left: darkModeEnabled ? 22 : 2,
                      transition: 'transform 250ms ease',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }} />
                  </button>
                </div>

                {/* AI 模型配置 */}
                <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--color-border-light)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <Brain size={18} color="var(--color-gold)" />
                    <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)' }}>AI 模型配置</h3>
                    {aiConfig?.hasApiKey && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, borderRadius: 999, padding: '2px 8px', fontSize: 'var(--text-xs)', fontWeight: 500, background: 'rgba(46,204,113,0.1)', color: 'var(--state-success)' }}>
                        <Check size={10} /> 已配置
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 16 }}>
                    配置 AI API Key 后，占卜结果将由 AI 生成专业解读。支持 OpenAI 兼容接口。
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 500, marginBottom: 4, color: 'var(--color-text)' }}>API Key</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showApiKey ? 'text' : 'password'}
                          value={apiKeyInput}
                          onChange={(e) => setApiKeyInput(e.target.value)}
                          placeholder={aiConfig?.hasApiKey ? '****' : 'sk-xxxxxxxxxxxxxxxx'}
                          style={{ width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', padding: '10px 60px 10px 14px', fontSize: 'var(--text-sm)', color: 'var(--color-text)', background: 'var(--color-bg)', outline: 'none' }}
                        />
                        <button type="button" onClick={() => setShowApiKey(!showApiKey)} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)', padding: 4 }}>
                          {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 500, marginBottom: 4, color: 'var(--color-text)' }}>API 地址</label>
                      <input type="text" value={apiBaseInput} onChange={(e) => setApiBaseInput(e.target.value)} placeholder="https://api.openai.com/v1" style={{ width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', padding: '10px 14px', fontSize: 'var(--text-sm)', color: 'var(--color-text)', background: 'var(--color-bg)', outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 500, marginBottom: 4, color: 'var(--color-text)' }}>模型名称</label>
                      <input type="text" value={modelInput} onChange={(e) => setModelInput(e.target.value)} placeholder="gpt-4o-mini" style={{ width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', padding: '10px 14px', fontSize: 'var(--text-sm)', color: 'var(--color-text)', background: 'var(--color-bg)', outline: 'none' }} />
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      setAiSaving(true); setAiSaveMessage('');
                      try {
                        const payload: Record<string, string> = {};
                        if (apiKeyInput) payload.apiKey = apiKeyInput;
                        if (apiBaseInput) payload.apiBase = apiBaseInput;
                        if (modelInput) payload.model = modelInput;
                        await saveAiConfig(payload);
                        const newConfig = await getAiConfig();
                        setAiConfig(newConfig); setAiSaveMessage('保存成功'); setApiKeyInput('');
                      } catch { setAiSaveMessage('保存失败，请检查配置'); }
                      finally { setAiSaving(false); }
                    }}
                    disabled={aiSaving}
                    style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8, borderRadius: 12, padding: '10px 24px', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-inverse)', background: 'var(--color-primary)', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}
                  >
                    <Save size={14} /> {aiSaving ? '保存中...' : '保存 AI 配置'}
                  </button>
                  {aiSaveMessage && (
                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)', fontWeight: 500, color: aiSaveMessage === '保存成功' ? 'var(--state-success)' : 'var(--state-error)' }}>
                      {aiSaveMessage === '保存成功' ? <Check size={12} /> : <AlertCircle size={12} />}
                      {aiSaveMessage}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* 数据管理区 */}
            {activeTab === 'data' && (
              <section style={profileCardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <Database size={20} color="var(--color-primary-lighter)" />
                  <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-text)' }}>数据管理</h2>
                </div>
                {/* 统计数字 */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 24 }}>
                  <div style={statCardStyle}>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 700, whiteSpace: 'nowrap', color: 'var(--color-gold)' }}>{history.length}</p>
                    <p style={{ fontSize: 'var(--text-sm)', marginTop: 8, whiteSpace: 'nowrap', color: 'var(--color-text-secondary)' }}>查询历史条数</p>
                  </div>
                  <div style={statCardStyle}>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 700, whiteSpace: 'nowrap', color: 'var(--color-gold)' }}>{registerDays}</p>
                    <p style={{ fontSize: 'var(--text-sm)', marginTop: 8, whiteSpace: 'nowrap', color: 'var(--color-text-secondary)' }}>注册天数</p>
                  </div>
                </div>

                {/* 查询历史记录 */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Search size={16} color="var(--color-primary-lighter)" />
                      <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text)' }}>查询历史</h3>
                    </div>
                    {formattedHistory.length > 0 && (
                        <button
                        onClick={handleClearAllData}
                        style={{
                          background: confirmingClear ? 'rgba(196, 58, 58, 0.12)' : 'none',
                          border: 'none', cursor: 'pointer',
                          color: 'var(--state-error)', fontSize: 'var(--text-xs)',
                          display: 'flex', alignItems: 'center', gap: 4, padding: confirmingClear ? '2px 8px' : 0, borderRadius: 6,
                        }}
                      >
                        <Trash2 size={12} /> {confirmingClear ? '再次点击确认清空' : '清空'}
                      </button>
                    )}
                  </div>
                  <div style={{
                    background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)',
                    borderRadius: 12, padding: '12px 16px', maxHeight: 320, overflowY: 'auto',
                  }}>
                    {formattedHistory.length === 0 ? (
                      <p style={{ textAlign: 'center', padding: 24, color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>
                        暂无查询记录
                      </p>
                    ) : (
                      formattedHistory.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '12px 0', borderBottom: '1px solid var(--color-border)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                            <Clock size={14} color="var(--color-text-tertiary)" style={{ flexShrink: 0 }} />
                            <div style={{ minWidth: 0 }}>
                              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {item.text}
                              </p>
                              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 2 }}>
                                {item.system ? SYSTEM_NAMES[item.system] || item.system : '通用搜索'} · {item.time}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteRecord(item.id)}
                            style={{
                              background: 'none', border: 'none', cursor: 'pointer',
                              color: 'var(--color-text-tertiary)', padding: 8,
                              display: 'flex', alignItems: 'center',
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 数据导入导出 */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <FileJson size={16} color="var(--color-gold)" />
                    <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text)' }}>数据导入导出</h3>
                  </div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <button
                      onClick={handleExportData}
                      style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        padding: '12px 24px', borderRadius: 12, fontSize: 'var(--text-sm)', fontWeight: 600,
                        cursor: 'pointer', whiteSpace: 'nowrap', border: 'none', flex: 1, minWidth: 140,
                        background: 'var(--color-primary)', color: 'var(--color-text-inverse)',
                      }}
                    >
                      <Download size={16} /> 导出数据
                    </button>
                    <label
                      style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        padding: '12px 24px', borderRadius: 12, fontSize: 'var(--text-sm)', fontWeight: 600,
                        cursor: 'pointer', whiteSpace: 'nowrap', flex: 1, minWidth: 140,
                        background: 'transparent', color: 'var(--color-primary-lighter)',
                        border: '1px solid var(--color-primary-lighter)',
                      }}
                    >
                      <FileJson size={16} /> 导入数据
                      <input
                        type="file"
                        accept=".json"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              const text = ev.target?.result as string;
                              if (importData(text)) {
                                setDataOperationMsg('导入成功');
                              } else {
                                setDataOperationMsg('导入失败，文件格式错误');
                              }
                              setTimeout(() => setDataOperationMsg(''), 3000);
                            };
                            reader.readAsText(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* 危险操作 */}
                <div style={{ paddingTop: 16, borderTop: '1px solid var(--color-border)' }}>
                  <button
                    onClick={handleClearAllData}
                    style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      padding: '12px 24px', borderRadius: 12, fontSize: 'var(--text-sm)', fontWeight: 600,
                      cursor: 'pointer', whiteSpace: 'nowrap', width: '100%',
                      background: confirmingClear ? 'var(--state-error)' : 'transparent',
                      color: confirmingClear ? 'var(--color-text-inverse)' : 'var(--state-error)',
                      border: '1px solid rgba(196, 58, 58, 0.3)',
                    }}
                  >
                    <Trash2 size={16} /> {confirmingClear ? '再次点击确认删除所有数据' : '删除所有数据'}
                  </button>
                  <p style={{ fontSize: 'var(--text-xs)', marginTop: 8, color: 'var(--color-text-tertiary)' }}>
                    删除操作不可恢复，请谨慎操作。
                  </p>
                </div>

                {/* 操作提示 */}
                {dataOperationMsg && (
                  <div style={{
                    marginTop: 16, padding: '12px 16px', borderRadius: 8,
                    background: dataOperationMsg.includes('成功') ? 'rgba(46,204,113,0.1)' : 'rgba(196,58,58,0.1)',
                    color: dataOperationMsg.includes('成功') ? 'var(--state-success)' : 'var(--state-error)',
                    fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    {dataOperationMsg.includes('成功') ? <Check size={14} /> : <AlertCircle size={14} />}
                    {dataOperationMsg}
                  </div>
                )}
              </section>
            )}

          </div>
        </div>
      </div>

      {/* 编辑资料弹窗 */}
      {editOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div
            style={{ position: 'absolute', inset: 0, background: 'rgba(0, 8, 24, 0.72)' }}
            onClick={() => { if (!editSaving) setEditOpen(false); }}
          />
          <div style={{
            position: 'relative', width: '100%', maxWidth: 640,
            background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)',
            borderRadius: 20, padding: '28px 32px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text)' }}>编辑个人资料</h2>
              <button
                onClick={() => setEditOpen(false)}
                aria-label="关闭"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)', padding: 4 }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 20px' }}>
              <EditField label="昵称" value={editForm.nickname} onChange={(v) => setEditForm({ ...editForm, nickname: v })} placeholder="将显示在个人中心" />
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 500, marginBottom: 6, color: 'var(--color-text-secondary)' }}>性别</label>
                <select
                  value={editForm.gender}
                  onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                  style={{
                    width: '100%', boxSizing: 'border-box', borderRadius: 8,
                    border: '1px solid var(--color-border)', padding: '10px 14px',
                    fontSize: 'var(--text-sm)', color: 'var(--color-text)',
                    background: 'var(--color-bg)', outline: 'none', fontFamily: 'var(--font-body)',
                  }}
                >
                  <option value="">请选择</option>
                  <option value="男">男</option>
                  <option value="女">女</option>
                </select>
              </div>
              <EditField label="出生日期" value={editForm.birthday} onChange={(v) => setEditForm({ ...editForm, birthday: v })} placeholder="如 1995年6月15日" />
              <EditField label="出生时间" value={editForm.birthTime} onChange={(v) => setEditForm({ ...editForm, birthTime: v })} placeholder="如 14:30" />
              <EditField label="出生地" value={editForm.birthPlace} onChange={(v) => setEditForm({ ...editForm, birthPlace: v })} placeholder="如 广东省 · 广州市" />
              <EditField label="农历生日（可选）" value={editForm.birthdayLunar} onChange={(v) => setEditForm({ ...editForm, birthdayLunar: v })} placeholder="如 农历：乙亥年五月十八" />
            </div>

            {editMsg && (
              <div style={{
                marginTop: 14, padding: '10px 14px', borderRadius: 8,
                background: 'rgba(196, 58, 58, 0.1)', border: '1px solid rgba(196, 58, 58, 0.25)',
                color: 'var(--state-error)', fontSize: 'var(--text-xs)',
              }}>
                {editMsg}
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button
                onClick={() => setEditOpen(false)}
                style={{
                  flex: 1, padding: '11px 0', borderRadius: 12, fontSize: 'var(--text-sm)', fontWeight: 600,
                  cursor: 'pointer', background: 'transparent', color: 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border)',
                }}
              >
                取消
              </button>
              <button
                onClick={handleEditSave}
                disabled={editSaving}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '11px 0', borderRadius: 12, fontSize: 'var(--text-sm)', fontWeight: 600,
                  cursor: editSaving ? 'not-allowed' : 'pointer',
                  background: editSaving ? 'var(--color-border)' : 'var(--color-primary)',
                  color: 'var(--color-text-inverse)', border: 'none',
                }}
              >
                <Save size={14} /> {editSaving ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
