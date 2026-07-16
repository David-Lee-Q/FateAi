import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  label: string;
  value: { year: string; month: string; day: string };
  onChange: (date: { year: string; month: string; day: string }) => void;
  placeholder?: string;
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

export default function DatePicker({ label, value, onChange, placeholder = '请选择日期' }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() => {
    const now = new Date();
    return value.year ? parseInt(value.year) : now.getFullYear();
  });
  const [viewMonth, setViewMonth] = useState(() => {
    const now = new Date();
    return value.month ? parseInt(value.month) - 1 : now.getMonth();
  });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const years = Array.from({ length: 91 }, (_, i) => 1940 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handleDayClick = (day: number) => {
    onChange({
      year: String(viewYear),
      month: String(viewMonth + 1),
      day: String(day),
    });
    setIsOpen(false);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value);
    setViewYear(newYear);
    onChange({ ...value, year: e.target.value });
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value) - 1;
    setViewMonth(newMonth);
    onChange({ ...value, month: e.target.value });
  };

  const changeMonth = (delta: number) => {
    let newMonth = viewMonth + delta;
    let newYear = viewYear;
    if (newMonth < 0) { newMonth = 11; newYear -= 1; }
    else if (newMonth > 11) { newMonth = 0; newYear += 1; }
    setViewMonth(newMonth);
    setViewYear(newYear);
  };

  const displayValue = value.year && value.month && value.day
    ? `${value.year}年${value.month}月${value.day}日`
    : placeholder;

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const isSelected = (day: number) =>
    value.year === String(viewYear) &&
    value.month === String(viewMonth + 1) &&
    value.day === String(day);

  return (
    <div className="flex flex-col gap-1.5" ref={containerRef}>
      <label className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors cursor-pointer"
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: value.year ? 'var(--color-text)' : 'var(--color-text-tertiary)',
          }}
        >
          <span>{displayValue}</span>
          <Calendar size={18} style={{ color: 'var(--color-text-secondary)', flexShrink: 0 }} />
        </button>

        {isOpen && (
          <div
            className="absolute top-full left-0 mt-2 z-50 rounded-xl p-4 shadow-lg"
            style={{
              background: 'var(--color-bg-elevated)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              minWidth: '280px',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => changeMonth(-1)}
                className="p-1.5 rounded-lg transition-colors hover:bg-white/10 cursor-pointer"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex items-center gap-1">
                <select
                  value={viewYear}
                  onChange={handleYearChange}
                  className="bg-transparent border-none text-center text-sm font-medium cursor-pointer outline-none appearance-none"
                  style={{ color: 'var(--color-text)' }}
                >
                  {years.map(y => (
                    <option key={y} value={y} style={{ background: 'var(--color-bg-elevated)' }}>{y}</option>
                  ))}
                </select>
                <span style={{ color: 'var(--color-text)' }}>年</span>
                <select
                  value={viewMonth + 1}
                  onChange={handleMonthChange}
                  className="bg-transparent border-none text-center text-sm font-medium cursor-pointer outline-none appearance-none"
                  style={{ color: 'var(--color-text)' }}
                >
                  {months.map(m => (
                    <option key={m} value={m} style={{ background: 'var(--color-bg-elevated)' }}>{m}</option>
                  ))}
                </select>
                <span style={{ color: 'var(--color-text)' }}>月</span>
              </div>

              <button
                type="button"
                onClick={() => changeMonth(1)}
                className="p-1.5 rounded-lg transition-colors hover:bg-white/10 cursor-pointer"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {WEEKDAYS.map(day => (
                <div key={day} className="text-center text-xs py-1" style={{ color: 'var(--color-text-tertiary)' }}>
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {days.map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayClick(day)}
                  className="w-8 h-8 rounded-lg text-sm transition-colors cursor-pointer"
                  style={{
                    background: isSelected(day) ? 'var(--color-primary)' : 'transparent',
                    color: isSelected(day) ? 'var(--color-text-inverse)' : 'var(--color-text)',
                  }}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}