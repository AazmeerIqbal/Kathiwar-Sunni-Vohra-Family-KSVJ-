import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

// Step Tracker Component
const StepTracker = ({ currentStep, steps }) => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between relative px-4">
        {/* Progress Bar Background with subtle shadow */}
        <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-100 rounded-full transform -translate-y-1/2 z-0 shadow-inner"></div>

        {/* Progress Bar Fill with enhanced gradient and glow */}
        <motion.div
          className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-full transform -translate-y-1/2 z-0 shadow-lg"
          initial={{ width: "0%" }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{
            duration: 0.8,
            ease: [0.4, 0.0, 0.2, 1],
            delay: 0.2,
          }}
          style={{
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
          }}
        />

        {/* Step Circles */}
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <motion.div
              key={index}
              className="relative z-10 flex flex-col items-center group"
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: [0.4, 0.0, 0.2, 1],
              }}
              whileHover={{ y: -5 }}
            >
              {/* Step Circle with enhanced styling */}
              <motion.div
                className={`w-14 h-14 rounded-full flex items-center justify-center border-3 font-semibold text-base transition-all duration-500 relative ${
                  isCompleted
                    ? "bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 border-transparent text-white shadow-xl"
                    : isCurrent
                    ? "bg-white border-blue-500 text-blue-500 shadow-2xl scale-110 ring-4 ring-blue-100"
                    : "bg-white border-gray-200 text-gray-400 shadow-md hover:border-gray-300 hover:shadow-lg"
                }`}
                whileHover={{
                  scale: isCurrent ? 1.15 : 1.1,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.95 }}
                style={{
                  boxShadow: isCompleted
                    ? "0 10px 25px rgba(59, 130, 246, 0.4)"
                    : isCurrent
                    ? "0 15px 35px rgba(59, 130, 246, 0.3)"
                    : "0 4px 15px rgba(0, 0, 0, 0.1)",
                }}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.3,
                      ease: "backOut",
                    }}
                  >
                    <Check className="w-6 h-6" strokeWidth={3} />
                  </motion.div>
                ) : (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.15 + 0.3 }}
                    className={isCurrent ? "font-bold" : ""}
                  >
                    {index + 1}
                  </motion.span>
                )}

                {/* Subtle glow effect for current step */}
                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-blue-500 opacity-20 blur-xl"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1.5 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  />
                )}
              </motion.div>

              {/* Step Label with enhanced typography */}
              <motion.div
                className={`mt-3 text-sm font-medium text-center max-w-24 leading-tight ${
                  isCompleted
                    ? "text-blue-600 font-semibold"
                    : isCurrent
                    ? "text-blue-500 font-bold"
                    : "text-gray-500"
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.15 + 0.4,
                }}
              >
                {step.title}
              </motion.div>

              {/* Enhanced Current Step Indicator */}
              {isCurrent && (
                <motion.div
                  className="absolute -bottom-2 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.5,
                    ease: "backOut",
                  }}
                  style={{
                    boxShadow: "0 0 15px rgba(59, 130, 246, 0.6)",
                  }}
                />
              )}

              {/* Connection line between steps (for visual flow) */}
              {index < steps.length - 1 && (
                <motion.div
                  className="absolute top-7 left-full w-8 h-0.5 bg-gradient-to-r from-gray-200 to-gray-100"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.15 + 0.8,
                    ease: "easeOut",
                  }}
                  style={{ transformOrigin: "left center" }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Progress percentage display */}
      {/* <motion.div
        className="text-center mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <span className="text-sm text-gray-600 font-medium">
          Step {currentStep + 1} of {steps.length}
        </span>
        <div className="mt-2 text-xs text-gray-400">
          {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
        </div>
      </motion.div> */}
    </div>
  );
};

export default StepTracker;
