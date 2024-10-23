"use client";
import React, { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const parseAndTransformText = (text: string) => {
  const tags: Record<string, string> = {
    goal: "bg-blue-100 px-2 py-1 rounded",
    day: "bg-green-100 px-2 py-1 rounded block mt-2",
    context: "bg-yellow-100 px-2 py-1 rounded",
    score: "text-sm text-gray-600 ml-2",
  };

  let processedText = text;

  Object.keys(tags).forEach((tagName) => {
    const startTag = new RegExp(`<${tagName}>`, "g");
    const endTag = new RegExp(`</${tagName}>`, "g");

    processedText = processedText
      .replace(startTag, `<span class="${tags[tagName]}">`)
      .replace(endTag, "</span>");
  });

  return processedText;
};

const AIChatComponent = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const responseRef = useRef<HTMLDivElement>(null);

  const processStreamChunk = (chunk: string) => {
    const lines = chunk.split("\n").filter((line) => line.trim() !== "");

    for (const line of lines) {
      if (line === "data: [DONE]") {
        continue;
      }

      if (line.startsWith("data: ")) {
        try {
          const jsonStr = line.slice(6);
          const safeJsonStr = jsonStr.replace(
            /<(\/?)(goal|day|context|score)>/g,
            "|||$1$2|||"
          );

          const data = JSON.parse(safeJsonStr);

          if (data.response) {
            const restoredResponse = data.response.replace(
              /\|\|\|(\/?)(goal|day|context|score)\|\|\|/g,
              "<$1$2>"
            );

            setResponse((prev) => prev + restoredResponse);
          }
        } catch (e) {
          console.error("Error processing chunk:", e);
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    setResponse("");

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No reader available");
      }

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        processStreamChunk(chunk);

        if (responseRef.current) {
          responseRef.current.scrollTop = responseRef.current.scrollHeight;
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setResponse("An error occurred while fetching the response.");
    } finally {
      setIsLoading(false);
    }
  };

  const sanitizedResponse = response
    ? parseAndTransformText(response)
    : "AI response will appear here...";

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardContent className="p-6">
        <div
          ref={responseRef}
          className="min-h-[200px] max-h-[400px] overflow-y-auto mb-4 p-4 bg-gray-50 rounded whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: sanitizedResponse }}
        />

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask something..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AIChatComponent;
