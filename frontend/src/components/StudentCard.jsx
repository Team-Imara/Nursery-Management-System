import { motion } from 'framer-motion';

const itemVariants = {
  hover: { scale: 1.05, rotate: 2, transition: { duration: 0.2 } },
  initial: { scale: 1, rotate: 0 },
};

const StudentCard = ({ student, onSelect }) => {
  return (
    <motion.div
      className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
      variants={itemVariants}
      initial="initial"
      whileHover="hover"
      onClick={() => onSelect(student)}
    >
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden">
          <img src={student.image} className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{student.name}</h3>
            <p className="text-sm text-gray-600 mb-1">{student.class} • {student.section}</p>
            <p className="text-sm text-gray-600 mb-1">Guardian: {student.guardian}</p>
          </div>

          {/* Status */}
          <p
            className={`mt-2 font-semibold ${
              student.status === 'Present'
                ? 'text-green-600'
                : student.status === 'Absent'
                ? 'text-red-600'
                : 'text-gray-600'
            }`}
          >
            {student.status}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentCard;
