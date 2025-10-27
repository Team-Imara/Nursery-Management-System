import { motion } from 'framer-motion';

// Animation variants
const itemVariants = {
    hover: { scale: 1.05, rotate: 2, transition: { duration: 0.2 } },
    initial: { scale: 1, rotate: 0 },
};

const TeacherCard = ({ teacher, onSelect }) => {
    return (
        <motion.div
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            variants={itemVariants}
            initial="initial"
            whileHover="hover"
            onClick={() => onSelect(teacher)}
        >
            <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                    <img
                        src={teacher.image}
                        alt={teacher.name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-910 text-lg mb-1">{teacher.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                        {teacher.subject} <span className="text-gray-400">•</span> {teacher.class}
                    </p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{teacher.room}</span>
                            <span>{teacher.experience}</span>
                        </div>
                        <span
                            className={`text-sm font-medium px-3 py-1 rounded-full ${
                                teacher.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                            }`}
                        >
              {teacher.status}
            </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default TeacherCard;