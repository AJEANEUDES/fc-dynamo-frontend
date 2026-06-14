import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGet } from '../../hooks/useApi';
import { useLocalized } from '../../hooks/useLocale';
import type { TourSlot } from '../../types';

interface Props {
  tourId: string;
  selectedSlotId?: string;
  onSlotSelect: (slot: TourSlot | null) => void;
}

export default function TourCalendar({ tourId, selectedSlotId, onSlotSelect }: Props) {
  const { t } = useTranslation('tour');
  const { locale } = useLocalized();

  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { data: slots, isLoading } = useGet<TourSlot[]>(
    `tour-slots-${tourId}`,
    `/tour-slots?tour_id=${tourId}`
  );

  const slotsMap = useMemo(() => {
    const map: Record<string, TourSlot[]> = {};
    (slots ?? []).forEach((slot) => {
      const dateStr = String(slot.date).substring(0, 10);
      if (!map[dateStr]) map[dateStr] = [];
      map[dateStr].push(slot);
    });
    return map;
  }, [slots]);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;

  const intlLocale = locale === 'ru' ? 'ru-RU' : 'en-GB';

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString(intlLocale, {
    month: 'long',
    year: 'numeric',
  });

  // 2024-01-01 is a Monday
  const dayHeaders = Array.from({ length: 7 }, (_, i) =>
    new Date(2024, 0, i + 1).toLocaleDateString(intlLocale, { weekday: 'short' })
  );

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  }

  function handleDayClick(day: number) {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (!slotsMap[dateStr]) return;
    const next = dateStr === selectedDate ? null : dateStr;
    setSelectedDate(next);
    onSlotSelect(null);
  }

  const selectedDaySlots = selectedDate ? (slotsMap[selectedDate] ?? []) : [];

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-gray-100 rounded-2xl" />;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-[#0A2342]">{t('calendar.title')}</h3>

      {/* Month navigation */}
      <div className="flex items-center justify-between bg-[#0A2342] text-white rounded-xl px-4 py-2">
        <button
          onClick={prevMonth}
          className="text-xl font-bold hover:text-[#C8A951] transition-colors px-2"
        >
          &#8249;
        </button>
        <span className="font-semibold capitalize">{monthLabel}</span>
        <button
          onClick={nextMonth}
          className="text-xl font-bold hover:text-[#C8A951] transition-colors px-2"
        >
          &#8250;
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {dayHeaders.map((d) => (
          <div key={d} className="text-xs font-medium text-gray-500 py-1 capitalize">
            {d}
          </div>
        ))}

        {/* Empty cells */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`e${i}`} />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const daySlots = slotsMap[dateStr] ?? [];
          const hasSlots = daySlots.length > 0;
          const allFull = hasSlots && daySlots.every((s) => s.booked_count >= s.capacity);
          const isSelected = selectedDate === dateStr;
          const isPast = new Date(dateStr) < new Date(new Date().toDateString());

          let cls = 'rounded-lg py-2 text-sm text-center transition-colors ';
          if (!hasSlots || isPast) {
            cls += 'text-gray-300 cursor-default';
          } else if (allFull) {
            cls += 'bg-gray-100 text-gray-400 cursor-not-allowed';
          } else if (isSelected) {
            cls += 'bg-[#0A2342] text-white font-bold cursor-pointer';
          } else {
            cls += 'bg-green-100 text-green-700 hover:bg-green-200 font-semibold cursor-pointer';
          }

          return (
            <button
              key={day}
              disabled={!hasSlots || allFull || isPast}
              onClick={() => handleDayClick(day)}
              className={cls}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-green-100 inline-block" />
          {t('calendar.available')}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-gray-100 border border-gray-300 inline-block" />
          {t('calendar.full')}
        </span>
      </div>

      {/* Time slots for selected date */}
      {selectedDate && (
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <p className="text-sm font-medium text-gray-700">{t('calendar.selectSlot')}</p>
          {selectedDaySlots.length === 0 ? (
            <p className="text-sm text-gray-400">{t('calendar.noSlots')}</p>
          ) : (
            selectedDaySlots.map((slot) => {
              const isFull = slot.booked_count >= slot.capacity;
              const remaining = slot.capacity - slot.booked_count;
              const isChosen = selectedSlotId === slot.id;
              return (
                <button
                  key={slot.id}
                  disabled={isFull}
                  onClick={() => onSlotSelect(isChosen ? null : slot)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-colors ${
                    isChosen
                      ? 'border-[#0A2342] bg-[#0A2342] text-white'
                      : isFull
                      ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                      : 'border-gray-200 hover:border-[#0A2342] bg-white'
                  }`}
                >
                  <span className="font-semibold">{slot.start_time}</span>
                  <span className="text-sm">
                    {isFull
                      ? t('calendar.full')
                      : `${remaining} ${t('calendar.remaining')}`}
                  </span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
