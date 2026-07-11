import { useState, useEffect } from 'react';
import {
  User, Clock, Settings, Database, Award, Edit3, Download,
  Trash2, Brain, Eye, EyeOff, Save, Check, AlertCircle,
  UserCircle,
} from 'lucide-react';
import { getAiConfig, saveAiConfig } from '@/services/api';
import type { AiConfig } from '@/services/api';

/* ============ 模拟用户数据 ============ */
const MOCK_USER = {
  nickname: '天机用户',
  registerDays: 128,
  registerDate: '2024-03-15',
  birthday: '1995年6月15日（阳历）',
  birthdayLunar: '农历：乙亥年五月十八',
  birthTime: '14:30',
  birthPlace: '广东省 · 广州市',
  gender: '男',
  totalQueries: 86,
  totalFavorites: 23,
};

/* ============ Tab 配置 ============ */
type TabKey = 'personal' | 'preferences' | 'data';

const TABS: { key: TabKey; label: string; icon: typeof UserCircle }[] = [
  { key: 'personal', label: '个人信息', icon: UserCircle },
  { key: 'preferences', label: '偏好设置', icon: Settings },
  { key: 'data', label: '数据管理', icon: Database },
];

/* ============ 个人中心页面 ============ */
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabKey>('personal');
  const [defaultSystem, setDefaultSystem] = useState('bazi');
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);

  // AI 配置状态
  const [aiConfig, setAiConfig] = useState<AiConfig | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [apiBaseInput, setApiBaseInput] = useState('');
  const [modelInput, setModelInput] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [aiSaving, setAiSaving] = useState(false);
  const [aiSaveMessage, setAiSaveMessage] = useState('');

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

  const btnEditStyle: React.CSSProperties = {
    background: 'transparent',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text-secondary)',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    padding: '6px 14px',
    borderRadius: 8,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
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
                    {MOCK_USER.nickname}
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
                    <span style={{ fontSize: 'var(--text-xs)', whiteSpace: 'nowrap', color: 'var(--color-text-secondary)' }}>
                      已使用 {MOCK_USER.registerDays} 天
                    </span>
                  </div>
                </div>
                {/* 编辑资料按钮 */}
                <button style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '12px 24px', borderRadius: 12, fontSize: 'var(--text-sm)', fontWeight: 600,
                  cursor: 'pointer', whiteSpace: 'nowrap', border: 'none',
                  background: 'transparent', color: 'var(--color-gold)',
                  border: '1px solid rgba(200, 168, 78, 0.3)', flexShrink: 0,
                }}>
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
                    <p style={{ fontSize: 'var(--text-sm)', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--color-text)' }}>{MOCK_USER.birthday}</p>
                    <p style={{ fontSize: 'var(--text-xs)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--color-text-tertiary)' }}>{MOCK_USER.birthdayLunar}</p>
                  </div>
                  <button style={btnEditStyle}>编辑</button>
                </div>
                {/* 出生时间 */}
                <div style={{ ...infoRowStyle, borderBottom: '1px solid var(--color-border-light)' }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--color-text-tertiary)' }}>出生时间</p>
                    <p style={{ fontSize: 'var(--text-sm)', marginTop: 4, color: 'var(--color-text)' }}>{MOCK_USER.birthTime}</p>
                  </div>
                  <button style={btnEditStyle}>编辑</button>
                </div>
                {/* 出生地 */}
                <div style={{ ...infoRowStyle, borderBottom: '1px solid var(--color-border-light)' }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--color-text-tertiary)' }}>出生地</p>
                    <p style={{ fontSize: 'var(--text-sm)', marginTop: 4, color: 'var(--color-text)' }}>{MOCK_USER.birthPlace}</p>
                  </div>
                  <button style={btnEditStyle}>编辑</button>
                </div>
                {/* 性别 */}
                <div style={{ ...infoRowStyle, borderBottom: 'none' }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--color-text-tertiary)' }}>性别</p>
                    <p style={{ fontSize: 'var(--text-sm)', marginTop: 4, color: 'var(--color-text)' }}>{MOCK_USER.gender}</p>
                  </div>
                  <button style={btnEditStyle}>编辑</button>
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
                    <option value="bazi">八字命理</option>
                    <option value="tarot">塔罗占卜</option>
                    <option value="zodiac">星座运势</option>
                    <option value="dream">周公解梦</option>
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
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 700, whiteSpace: 'nowrap', color: 'var(--color-gold)' }}>{MOCK_USER.totalQueries}</p>
                    <p style={{ fontSize: 'var(--text-sm)', marginTop: 8, whiteSpace: 'nowrap', color: 'var(--color-text-secondary)' }}>历史查询总数</p>
                  </div>
                  <div style={statCardStyle}>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 700, whiteSpace: 'nowrap', color: 'var(--color-gold)' }}>{MOCK_USER.totalFavorites}</p>
                    <p style={{ fontSize: 'var(--text-sm)', marginTop: 8, whiteSpace: 'nowrap', color: 'var(--color-text-secondary)' }}>收藏结果数量</p>
                  </div>
                </div>
                {/* 操作按钮 */}
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <button style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '12px 24px', borderRadius: 12, fontSize: 'var(--text-sm)', fontWeight: 600,
                    cursor: 'pointer', whiteSpace: 'nowrap', border: 'none', flex: 1, minWidth: 140,
                    background: 'var(--color-primary)', color: 'var(--color-text-inverse)',
                  }}>
                    <Download size={16} /> 导出所有数据
                  </button>
                  <button style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '12px 24px', borderRadius: 12, fontSize: 'var(--text-sm)', fontWeight: 600,
                    cursor: 'pointer', whiteSpace: 'nowrap', flex: 1, minWidth: 140,
                    background: 'transparent', color: 'var(--state-error)',
                    border: '1px solid rgba(196, 58, 58, 0.3)',
                  }}>
                    <Trash2 size={16} /> 删除所有数据
                  </button>
                </div>
                <p style={{ fontSize: 'var(--text-xs)', marginTop: 12, color: 'var(--color-text-tertiary)' }}>
                  删除操作不可恢复，请谨慎操作。删除后将清除所有历史查询记录与收藏数据。
                </p>
              </section>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
