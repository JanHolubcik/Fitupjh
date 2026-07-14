"use client";

import React, { useState } from "react";
import { useT } from "next-i18next/client";
import { Input, Button, Card, CardBody, Spinner, Divider } from "@heroui/react";
import { FaUserShield, FaBrain, FaUtensils } from "react-icons/fa";
import { ApiResponse } from "@/lib/api-response";

type AnalyzedFood = {
  name: string;
  weight: number;
  calories: number;
  fat: number;
  protein: number;
  carbohydrates: number;
  fiber: number;
  sugar: number;
  salt: number;
};

type AdminTestContentProps = {
  lng: string;
};

export const AdminTestContent = ({ lng }: AdminTestContentProps) => {
  const { t } = useT("common");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnalyzedFood[]>([]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/aitextsearchmacros?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error("Failed to analyze food");
      }
      const data = (await response.json()) as ApiResponse<AnalyzedFood[]>;
      setResults(data.data || []);
    } catch (error) {
      console.error(error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-100px)] flex flex-col items-center justify-start sm:p-6 p-4 relative overflow-hidden bg-background text-foreground transition-colors duration-200 pt-10 sm:pt-16">
      <div className="max-w-[600px] w-full bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-zinc-200/50 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl dark:shadow-2xl flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#006FEE]/10 to-[#38bdf8]/10 dark:from-[#006FEE]/15 dark:to-[#38bdf8]/15 flex items-center justify-center border border-zinc-200/30 dark:border-white/10 text-primary">
            <FaUserShield className="text-2xl" />
          </div>

          <div className="flex flex-col items-center gap-1">
            <h1 className="text-2xl sm:text-3xl font-black text-primary">
              {t("adminTest.title")}
            </h1>
            <p className="text-sm text-default-500">
              {t("adminTest.welcome")}
            </p>
          </div>
        </div>

        <Divider className="bg-zinc-200 dark:bg-zinc-800" />

        <div className="flex flex-col gap-2">
          <h3 className="text-base font-bold flex items-center gap-2">
            <FaBrain className="text-primary" />
            AI Text Search Macros Simulator
          </h3>
          <p className="text-xs text-default-500">
            Type food items (e.g. "mashed potatoes and chicken" or "apple") below to test the AI portion estimation and macro calculations.
          </p>
        </div>

        <form onSubmit={handleAnalyze} className="flex flex-col gap-3 w-full">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type multiple foods..."
            variant="faded"
            startContent={<FaUtensils className="text-default-400" />}
            isDisabled={loading}
          />
          <Button
            type="submit"
            color="primary"
            className="font-bold w-full"
            isDisabled={loading || !query.trim()}
          >
            {loading ? <Spinner size="sm" color="current" /> : "Analyze with Gemini"}
          </Button>
        </form>

        <div className="flex flex-col gap-4 w-full">
          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner size="lg" label="Estimating portion and macros..." />
            </div>
          ) : results.length > 0 ? (
            <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1">
              {results.map((food, index) => (
                <Card
                  key={index}
                  className="bg-zinc-50/50 dark:bg-white/[0.02] border border-zinc-200/50 dark:border-white/5"
                >
                  <CardBody className="p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-sm text-foreground truncate">
                        {food.name}
                      </h4>
                      <span className="text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-bold">
                        {food.weight}g portion
                      </span>
                    </div>
                    <p className="text-xs text-default-500">
                      Total Energy: <strong className="text-foreground">{food.calories} kcal</strong>
                    </p>
                    <div className="grid grid-cols-3 gap-2 mt-1 text-[11px] text-default-400 bg-default-50/50 dark:bg-white/[0.01] p-2 rounded-lg border border-default-100">
                      <div>
                        <span className="font-semibold text-foreground">Protein:</span> {food.protein}g
                      </div>
                      <div>
                        <span className="font-semibold text-foreground">Carbs:</span> {food.carbohydrates}g
                      </div>
                      <div>
                        <span className="font-semibold text-foreground">Fat:</span> {food.fat}g
                      </div>
                      <div>
                        <span className="font-semibold text-foreground">Fiber:</span> {food.fiber}g
                      </div>
                      <div>
                        <span className="font-semibold text-foreground">Sugar:</span> {food.sugar}g
                      </div>
                      <div>
                        <span className="font-semibold text-foreground">Salt:</span> {food.salt}g
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : query && !loading ? (
            <p className="text-center text-sm text-default-400 py-6">
              No results found.
            </p>
          ) : null}
        </div>
      </div>
    </main>
  );
};
