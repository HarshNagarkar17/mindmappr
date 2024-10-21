"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
} from "reactflow";
import "reactflow/dist/style.css";

import CreateRoadMapForm from "./forms/create-roadmap";
import CreateRoadMapSmallForm from "./forms/create-roadmap-below";

const generateRoadmap = (
  goal: string,
  hoursPerDay: number
): { nodes: Node[]; edges: Edge[] } => {
  const calculateDays = (hours: number) => Math.ceil(hours / hoursPerDay);

  const topics = [
    {
      label: "Research",
      hours: 20,
      details: "Market analysis, competitor research, identify target audience",
    },
    {
      label: "Planning",
      hours: 15,
      details:
        "Define MVP features, create project timeline, allocate resources",
    },
    {
      label: "Design",
      hours: 30,
      details: "UI/UX design, wireframing, prototyping, user testing",
    },
    {
      label: "Development",
      hours: 80,
      details:
        "Frontend and backend implementation, database setup, API integration",
    },
    {
      label: "Testing",
      hours: 25,
      details: "Unit testing, integration testing, user acceptance testing",
    },
    {
      label: "Deployment",
      hours: 10,
      details: "Server setup, CI/CD pipeline, monitoring tools implementation",
    },
    {
      label: "Marketing",
      hours: 30,
      details: "Launch strategy, content creation, social media campaigns",
    },
  ];

  const nodes: Node[] = [
    {
      id: "1",
      data: {
        label: (
          <>
            <div className="font-semibold">Start</div>
            <div className="text-xs mt-1">Begin your SaaS journey</div>
          </>
        ),
      },
      position: { x: 0, y: 0 },
      style: {
        background: "#E5E5EA",
        color: "#000",
        border: "1px solid #000",
        borderRadius: "12px",
        padding: "10px",
        fontSize: "14px",
        width: 180,
      },
    },
    {
      id: "2",
      data: {
        label: (
          <>
            <div className="font-semibold">{goal}</div>
            <div className="text-xs mt-1">Your SaaS project goal</div>
          </>
        ),
      },
      position: { x: 0, y: 100 },
      style: {
        background: "#007AFF",
        color: "#fff",
        border: "1px solid #007AFF",
        borderRadius: "12px",
        padding: "10px",
        fontSize: "14px",
        width: 180,
      },
    },
  ];
  const edges: Edge[] = [
    {
      id: "e1-2",
      source: "1",
      target: "2",
      animated: true,
      style: { stroke: "#007AFF" },
    },
  ];

  let y = 200;
  let totalDays = 0;
  for (let i = 0; i < topics.length; i++) {
    const id = (i + 3).toString();
    const days = calculateDays(topics[i].hours);
    totalDays += days;
    nodes.push({
      id,
      data: {
        label: (
          <>
            <div className="font-semibold">{topics[i].label}</div>
            <div className="text-xs mt-1">Time: {days} days</div>
            <div className="text-xs mt-1">Hours: {topics[i].hours}</div>
            <div className="text-xs mt-1">{topics[i].details}</div>
          </>
        ),
      },
      position: { x: i % 2 === 0 ? -200 : 200, y },
      style: {
        background: "#F2F2F7",
        color: "#000",
        border: "1px solid #000",
        borderRadius: "12px",
        padding: "10px",
        fontSize: "14px",
        width: 200,
      },
    });
    edges.push({
      id: `e${i + 2}-${id}`,
      source: (i + 2).toString(),
      target: id,
      animated: true,
      style: { stroke: "#007AFF" },
    });
    y += 150;
  }

  nodes.push({
    id: "10",
    data: {
      label: (
        <>
          <div className="font-semibold">Complete</div>
          <div className="text-xs mt-1">Total time: {totalDays} days</div>
          <div className="text-xs mt-1">Launch your SaaS!</div>
        </>
      ),
    },
    position: { x: 0, y },
    style: {
      background: "#34C759",
      color: "#fff",
      border: "1px solid #34C759",
      borderRadius: "12px",
      padding: "10px",
      fontSize: "14px",
      width: 180,
    },
  });
  edges.push({
    id: "e9-10",
    source: "9",
    target: "10",
    animated: true,
    style: { stroke: "#34C759" },
  });

  return { nodes, edges };
};

export function RevampedRoadmapGeneratorComponent() {
  const [goal, setGoal] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState(4);
  const [roadmap, setRoadmap] = useState<{
    nodes: Node[];
    edges: Edge[];
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRoadmap(generateRoadmap(goal, hoursPerDay));
  };

  const resetRoadmap = () => {
    setRoadmap(null);
    setGoal("");
    setHoursPerDay(4);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <AnimatePresence>
        {!roadmap && (
          <CreateRoadMapForm
            handleSubmit={handleSubmit}
            goal={goal}
            setGoal={setGoal}
            hoursPerDay={hoursPerDay}
            setHoursPerDay={setHoursPerDay}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {roadmap && (
          <motion.div
            key="roadmap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-gray-50 flex flex-col"
          >
            <div className="flex-grow relative">
              <ReactFlow
                nodes={roadmap.nodes}
                edges={roadmap.edges}
                fitView
                minZoom={0.1}
                maxZoom={1.5}
                defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
              >
                <Background color="#f0f0f0" />
                <Controls />
                <MiniMap />
              </ReactFlow>
            </div>
            <CreateRoadMapSmallForm
              generateRoadmap={generateRoadmap}
              setHoursPerDay={setHoursPerDay}
              setGoal={setGoal}
              goal={goal}
              hoursPerDay={hoursPerDay}
              resetRoadmap={resetRoadmap}
              setRoadmap={setRoadmap}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
