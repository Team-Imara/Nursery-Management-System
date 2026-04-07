import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import axios from '../api/axios';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const MEAL_TYPES = ['Breakfast', 'Snack'];

export default function MealPlanForm({ onClose, onSuccess }) {
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
  const [fetching, setFetching] = useState(true);

  // Load existing meals on mount
  useEffect(() => {
    const fetchExisting = async () => {
      try {
        const response = await axios.get('/meal-plans');
        if (response.data && response.data.length > 0) {
          const newMeals = { ...meals };
          response.data.forEach(m => {
            const day = m.day; 
            if (newMeals[m.meal_type] && newMeals[m.meal_type][day]) {
              newMeals[m.meal_type][day] = { 
                meal_name: m.meal_name
              };
            }
          });
          setMeals(newMeals);
        }
      } catch (error) {
        console.error('Error fetching meal plan:', error);
      } finally {
        setFetching(false);
      }
    };
    fetchExisting();
  }, []);

  // Update single meal fields
  const updateMeal = (mealType, day, field, value) => {
    setMeals(prev => ({
      ...prev,
      [mealType]: {
        ...prev[mealType],
        [day]: { 
          ...prev[mealType][day],
          [field]: value 
        },
      },
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submittedMeals = [];
    Object.entries(meals).forEach(([mealType, daysObj]) => {
      Object.entries(daysObj).forEach(([day, { meal_name }]) => {
        if (meal_name.trim()) {
          submittedMeals.push({
            day: day,
            meal_type: mealType,
            meal_name: meal_name
          });
        }
      });
    });

    try {
      await axios.post('/meal-plans', { meals: submittedMeals });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving meal plan:', error);
      console.dir(error); 
      const errors = error.response?.data?.errors;
      const errorMsg = errors ? Object.values(errors).flat().join('\n') : error.response?.data?.message || 'Failed to save meal plan.';
      alert('Failed to save meal plan:\n' + errorMsg);
    } finally {
      setLoading(false);
    }
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
                          {day.substring(0, 3).toUpperCase()}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {fetching ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500 italic">
                          Loading existing meal plan...
                        </td>
                      </tr>
                    ) : (
                      MEAL_TYPES.map(mealType => (
                        <tr key={mealType} className="border-b border-gray-200 last:border-b-0">
                          <td className="px-4 py-4 border-r border-gray-200 bg-gray-50 font-medium text-sm text-gray-700">
                            {mealType}
                          </td>
                          {DAYS.map(day => {
                            const mealData = meals[mealType][day];
                            return (
                              <td
                                key={day}
                                className="px-4 py-4 border-r border-gray-200 last:border-r-0"
                              >
                                <input
                                  type="text"
                                  value={mealData.meal_name}
                                  onChange={(e) => updateMeal(mealType, day, 'meal_name', e.target.value)}
                                  placeholder="Enter meal"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                              </td>
                            );
                          })}
                        </tr>
                      ))
                    )}
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