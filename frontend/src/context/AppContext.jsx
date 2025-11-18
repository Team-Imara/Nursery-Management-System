import { createContext, useState, useContext } from 'react';
import { initialStudents, initialMealRecords } from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [students, setStudents] = useState(initialStudents);
  const [mealRecords, setMealRecords] = useState(initialMealRecords);

  const updateStudentHealth = (studentId, healthData) => {
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.id === studentId
          ? { ...student, ...healthData }
          : student
      )
    );
  };

  const addMealRecord = (record) => {
    setMealRecords(prev => [...prev, { ...record, id: Date.now() }]);
  };

  const updateMealRecord = (recordId, updates) => {
    setMealRecords(prev =>
      prev.map(record =>
        record.id === recordId ? { ...record, ...updates } : record
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        students,
        mealRecords,
        updateStudentHealth,
        addMealRecord,
        updateMealRecord
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
