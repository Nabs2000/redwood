import { Button } from '../ui/Button';

interface TimeSlotPickerProps {
  availableSlots: string[]; // Array of time slots like ["09:00", "10:00", "14:00"]
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
  duration?: number; // Duration in minutes
}

export function TimeSlotPicker({
  availableSlots,
  selectedTime,
  onTimeSelect,
  duration = 30
}: TimeSlotPickerProps) {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (availableSlots.length === 0) {
    return (
      <div className="text-center py-8">
        <svg
          className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-slate-600 dark:text-slate-400 font-medium">
          No available time slots for this date
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
          Please select a different date
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Available Times
        </h3>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {duration} min sessions
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
        {availableSlots.map((time) => (
          <button
            key={time}
            onClick={() => onTimeSelect(time)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium
              transition-all duration-200
              ${selectedTime === time
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950 border border-slate-200 dark:border-slate-600'
              }
            `}
          >
            {formatTime(time)}
          </button>
        ))}
      </div>
    </div>
  );
}
