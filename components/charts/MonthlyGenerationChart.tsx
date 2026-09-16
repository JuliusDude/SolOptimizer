"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { formatNumber } from "@/lib/utils";

interface MonthlyGenerationChartProps {
  monthlyGenerationKWh: number[];
  annualGenerationKWh: number;
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function MonthlyGenerationChart({
  monthlyGenerationKWh,
  annualGenerationKWh,
}: MonthlyGenerationChartProps) {
  const data = MONTH_NAMES.map((name, idx) => ({
    month: name,
    generation: monthlyGenerationKWh[idx] || 0,
  }));

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-2 border-b border-white/10">
        <div>
          <h3 className="text-base font-bold text-white">
            Estimated Monthly Generation (kWh)
          </h3>
          <p className="text-xs text-slate-400">
            Seasonal irradiance variations reflecting summer peak and monsoon dips across India.
          </p>
        </div>
        <div className="flex items-center space-x-1.5 text-xs text-slate-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
          <span>Annual Total:</span>
          <strong className="text-white font-mono">
            {formatNumber(annualGenerationKWh)} kWh
          </strong>
        </div>
      </div>

      <div className="mt-4 h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
            <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              tickFormatter={(v) => `${v}`}
            />
            <Tooltip
              formatter={(value: any) => [`${formatNumber(value)} kWh`, "Generation"]}
              contentStyle={{
                backgroundColor: "rgba(7, 10, 17, 0.95)",
                borderRadius: "0.5rem",
                color: "#f8fafc",
                fontSize: "12px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            />
            <Bar dataKey="generation" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
