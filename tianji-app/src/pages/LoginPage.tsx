/**
 * 登录 / 注册页
 * 独立全屏页面，不经过 MainLayout（无导航栏和页脚）
 */
import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, User, Lock, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '@/context/useAuth';

type Mode = 'login' | 'register';

export default function LoginPage() {
  const { user, loading, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState<Mode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = (location.state as { from?: string } | null)?.from || '/profile';

  // 已登录访问登录页时直接进入个人中心
  if (!loading && user) {
    return <Navigate to="/profile" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError('');

    if (!username.trim()) { setError('请输入用户名'); return; }
    if (!password) { setError('请输入密码'); return; }
    if (mode === 'register' && password.length < 6) { setError('密码长度至少 6 位'); return; }

    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login(username.trim(), password);
      } else {
        await register(username.trim(), password, nickname.trim() || undefined);
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : (mode === 'login' ? '登录失败，请重试' : '注册失败，请重试'));
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setError('');
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    background: 'var(--color-bg)',
    border: '1px solid var(--color-border)',
    borderRadius: 10,
    padding: '12px 44px 12px 14px',
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text)',
    outline: 'none',
    fontFamily: 'var(--font-body)',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 'var(--text-xs)', fontWeight: 500,
    marginBottom: 6, color: 'var(--color-text-secondary)',
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at top, #003580 0%, var(--color-bg) 55%)',
      padding: 24,
    }}>
      {/* 品牌标识 */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-gold))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(200, 168, 78, 0.25)',
        }}>
          <Sparkles size={28} color="#fff" />
        </div>
        <h1 style={{
          marginTop: 16, fontSize: 28, fontWeight: 700,
          fontFamily: 'var(--font-display)', color: 'var(--color-gold)', letterSpacing: 4,
        }}>
          天机
        </h1>
        <p style={{ marginTop: 6, fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
          登录后同步你的命理资料与查询记录
        </p>
      </div>

      {/* 表单卡片 */}
      <div style={{
        width: '100%', maxWidth: 400,
        background: 'var(--color-bg-elevated)',
        border: '1px solid var(--color-border-light)',
        borderRadius: 20, padding: 28,
      }}>
        {/* 模式切换 */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {([['login', '登录', LogIn], ['register', '注册', UserPlus]] as [Mode, string, typeof LogIn][]).map(([m, label, Icon]) => (
            <button
              key={m}
              type="button"
              onClick={() => switchMode(m)}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '10px 0', borderRadius: 10, fontSize: 'var(--text-sm)', fontWeight: 600,
                cursor: 'pointer',
                background: mode === m ? 'var(--color-primary)' : 'transparent',
                color: mode === m ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
                border: mode === m ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
              }}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>用户名</label>
            <div style={{ position: 'relative' }}>
              <User size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="2-20 位中文、字母、数字或下划线"
                autoComplete="username"
                style={inputStyle}
              />
            </div>
          </div>

          {mode === 'register' && (
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>昵称（可选）</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="将显示在个人中心"
                maxLength={20}
                style={{ ...inputStyle, padding: '12px 14px' }}
              />
            </div>
          )}

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>密码</label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'register' ? '至少 6 位' : '请输入密码'}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? '隐藏密码' : '显示密码'}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)', padding: 4 }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              marginBottom: 16, padding: '10px 14px', borderRadius: 8,
              background: 'rgba(196, 58, 58, 0.1)', border: '1px solid rgba(196, 58, 58, 0.25)',
              color: 'var(--state-error)', fontSize: 'var(--text-xs)',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%', padding: '13px 0', borderRadius: 12,
              fontSize: 'var(--text-base)', fontWeight: 600, cursor: 'pointer',
              background: submitting ? 'var(--color-border)' : 'linear-gradient(135deg, var(--color-primary), var(--color-gold))',
              color: 'var(--color-text-inverse)', border: 'none',
            }}
          >
            {submitting ? '请稍候...' : (mode === 'login' ? '登 录' : '注 册')}
          </button>
        </form>
      </div>
    </div>
  );
}
