import { motion } from "framer-motion";

export const Greeting = () => {
  return (
    <div
      className="mx-auto mt-4 flex max-w-3xl flex-col items-center justify-center px-4 md:mt-16 md:px-8"
      key="overview"
    >
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.5 }}
        className="
          text-center
          font-bold text-2xl md:text-3xl
          bg-clip-text text-transparent
          bg-gradient-to-r from-blue-400 via-teal-400 to-green-400
          hover:from-teal-400 hover:via-green-400 hover:to-yellow-300
          hover:animate-vibrate
          transition-all duration-300
        "
      >
        Welcome, Young Learner!
      </motion.div>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.6 }}
        className="
          text-center
          text-lg md:text-xl
          text-gray-700 dark:text-gray-300
        "
      >
        I'm your K-12 assistant — ready to explore Math, Science, English, Filipino, or Social Studies with you!
      </motion.div>
    </div>
  );
};
