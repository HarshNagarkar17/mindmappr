import React from "react";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronRight, Clock, Target } from "lucide-react";

interface Props {
  handleSubmit: (e: React.FormEvent) => void;
  goal: string;
  setGoal: (value: string) => void;
  hoursPerDay: number;
  setHoursPerDay: (value: number) => void;
}

const CreateRoadMapForm = ({
  handleSubmit,
  goal,
  setGoal,
  setHoursPerDay,
  hoursPerDay,
}: Props) => {
  return (
    <motion.div
      key="input-form"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">
        SaaS Roadmap Generator
      </h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white rounded-3xl shadow-2xl p-8"
      >
        <div>
          <Label
            htmlFor="goal"
            className="text-sm font-medium text-gray-700 flex items-center"
          >
            <Target className="w-4 h-4 mr-2" />
            What do you want to learn?
          </Label>
          <Input
            id="goal"
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="mt-2"
            placeholder="e.g., Build a SaaS product"
            required
          />
        </div>
        <div>
          <Label
            htmlFor="hours"
            className="text-sm font-medium text-gray-700 flex items-center"
          >
            <Clock className="w-4 h-4 mr-2" />
            Hours available per day
          </Label>
          <Input
            id="hours"
            type="number"
            min="1"
            max="24"
            value={hoursPerDay}
            onChange={(e) => setHoursPerDay(parseInt(e.target.value))}
            className="mt-2"
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center"
        >
          Generate Roadmap
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </form>
    </motion.div>
  );
};

export default CreateRoadMapForm;
