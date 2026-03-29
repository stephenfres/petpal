import React from 'react';
import { Clock, CheckCircle, Utensils } from 'lucide-react';

export const ScheduleCard = ({ schedule, onMarkFed, onEdit, onDelete }) => {
  const isFedToday = schedule.lastFed && 
    new Date(schedule.lastFed).toDateString() === new Date().toDateString();

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${isFedToday ? 'border-green-500' : 'border-orange-500'}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <Utensils className="h-5 w-5 text-teal-600 mr-2" />
          <h4 className="font-semibold text-gray-800">{schedule.mealName}</h4>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => onEdit(schedule)}
            className="p-1 text-gray-400 hover:text-teal-600 transition-colors"
          >
            ✏️
          </button>
          {/* FIX: Use schedule.id instead of schedule._id */}
          <button
            onClick={() => onDelete(schedule.id)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          <span>{schedule.scheduleTime}</span>
        </div>
        {/* FIX: Use amountValue and amountUnit instead of schedule.amount.value */}
        <p>{schedule.foodType} - {schedule.amountValue} {schedule.amountUnit}</p>
        {schedule.instructions && (
          <p className="text-xs italic bg-gray-50 p-2 rounded">{schedule.instructions}</p>
        )}
      </div>

      {/* FIX: Use schedule.id instead of schedule._id */}
      <button
        onClick={() => onMarkFed(schedule.id)}
        disabled={isFedToday}
        className={`w-full py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
          isFedToday
            ? 'bg-green-100 text-green-700 cursor-default'
            : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
        }`}
      >
        <CheckCircle className="h-4 w-4" />
        <span>{isFedToday ? 'Fed Today' : 'Mark as Fed'}</span>
      </button>
    </div>
  );
};
