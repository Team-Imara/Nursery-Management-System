import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
const MEAL_TYPES = ['Breakfast', 'Snack'];

// Mock Data
const MOCK_CLASSES = [
  { id: '1', name: 'Kindergarten 1' },
  { id: '2', name: 'Kindergarten 2' },
];

const MOCK_EXISTING_MEALS = {
  all: [
    { day_of_week: 'MON', meal_type: 'Breakfast', meal_name: 'Oatmeal' },
    { day_of_week: 'MON', meal_type: 'Snack', meal_name: 'Apple Slices' },
  ],
  '1': [
    { day_of_week: 'TUE', meal_type: 'Snack', meal_name: 'Biscuites' },
  ],
  '2': [],
};

export default function MealPlanForm({ onClose, onSuccess }) {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('all');

  // Initialize empty meal grid: meals[mealType][day] = { meal_name: '' }
  const [meals, setMeals] = useState(() => {
    const init = {};
    MEAL_TYPES.forEach(type => {
      init[type] = {};
      DAYS.forEach(day => {
        init[type][day] = { meal_name: '' };
      });
    });
    return init;
  });

  const [loading, setLoading] = useState(false);

  // Load classes (mock)
  useEffect(() => {
    setClasses(MOCK_CLASSES);
  }, []);

  // Load existing meals when class changes
  useEffect(() => {
    const data = MOCK_EXISTING_MEALS[selectedClass] || [];

    const newMeals = {};
    MEAL_TYPES.forEach(type => {
      newMeals[type] = {};
      DAYS.forEach(day => {
        newMeals[type][day] = { meal_name: '' };
      });
    });

    data.forEach(m => {
      if (newMeals[m.meal_type] && newMeals[m.meal_type][m.day_of_week]) {
        newMeals[m.meal_type][m.day_of_week].meal_name = m.meal_name;
      }
    });

    setMeals(newMeals);
  }, [selectedClass]);

  // Update single meal input
  const updateMeal = (mealType, day, value) => {
    setMeals(prev => ({
      ...prev,
      [mealType]: {
        ...prev[mealType],
        [day]: { meal_name: value },
      },
    }));
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const submittedMeals = [];
    Object.entries(meals).forEach(([mealType, daysObj]) => {
      Object.entries(daysObj).forEach(([day, { meal_name }]) => {
        if (meal_name.trim()) {
          submittedMeals.push({
            day_of_week: day,
            meal_type: mealType,
            meal_name,
          });
        }
      });
    });

    // Fake save
    setTimeout(() => {
      console.log('Saved meals:', submittedMeals);
      onSuccess();
      onClose();
      setLoading(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <h2 className="text-2xl font-semibold text-gray-800">Add/Update Meal Plan</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            type="button"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Class Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Classes</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Meal Table */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Meal Plan Editor</h3>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="w-28 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                        Meal Type
                      </th>
                      {DAYS.map(day => (
                        <th
                          key={day}
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 last:border-r-0"
                        >
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MEAL_TYPES.map(mealType => (
                      <tr key={mealType} className="border-b border-gray-200 last:border-b-0">
                        <td className="px-4 py-4 border-r border-gray-200 bg-gray-50 font-medium text-sm text-gray-700">
                          {mealType}
                        </td>
                        {DAYS.map(day => {
                          const mealName = meals[mealType][day].meal_name;
                          return (
                            <td
                              key={day}
                              className="px-4 py-4 border-r border-gray-200 last:border-r-0"
                            >
                              <input
                                type="text"
                                value={mealName}
                                onChange={(e) => updateMeal(mealType, day, e.target.value)}
                                placeholder="Enter meal"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                              />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-slate-800 text-white text-sm font-medium rounded-md hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Meal Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}