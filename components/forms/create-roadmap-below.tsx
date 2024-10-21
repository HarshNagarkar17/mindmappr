/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Props {
  goal: string;
  setGoal: (value: string) => void;
  hoursPerDay: number;
  setHoursPerDay: (value: number) => void;
  resetRoadmap: () => void;
  setRoadmap: (values: any) => void;
  generateRoadmap: (goal: string, hoursPerDay: number) => void;
}

const CreateRoadMapSmallForm = ({
  goal,
  setGoal,
  setHoursPerDay,
  hoursPerDay,
  resetRoadmap,
  setRoadmap,
  generateRoadmap,
}: Props) => {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="bg-white p-4 shadow-lg flex justify-center items-center space-x-4"
    >
      <Input
        type="text"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        className="max-w-xs"
        placeholder="Update your goal"
      />
      <Input
        type="number"
        min="1"
        max="24"
        value={hoursPerDay}
        onChange={(e) => setHoursPerDay(parseInt(e.target.value))}
        className="w-20"
        placeholder="Hours/day"
      />
      <Button
        onClick={() => setRoadmap(generateRoadmap(goal, hoursPerDay))}
        className="bg-blue-500 hover:bg-blue-600 text-white"
      >
        Update
      </Button>
      <Button
        onClick={resetRoadmap}
        variant="outline"
        className="text-red-500 hover:text-red-600"
      >
        <X className="w-4 h-4" />
      </Button>
    </motion.div>
  );
};

export default CreateRoadMapSmallForm;
