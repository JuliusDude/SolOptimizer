"use client";

import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import { TwentyFiveYearProjectionYear } from "@/lib/solar/types";
import { formatINR } from "@/lib/utils";

interface FinancialProjectionChartProps {
  projection: TwentyFiveYearProjectionYear[];
  systemCostINR: number;
  paybackYears: number | null;
}

export default function FinancialProjectionChart({
  projection,
  systemCostINR,
  paybackYears,
}: FinancialProjectionChartProps) {
  // Filter every few years or format data for clean display
  const chartData = projection.map((item) => ({
    year: `Yr ${item.year}`,
    yearNum: item.year,
    cumulativeSavings: item.cumulativeSavingsINR,
    yearlySavings: item.savingsINR,
    systemCost: systemCostINR,
    netCashFlow: item.netCashFlowINR,
  }));

  const formatLakhs = (val: number) => {
    if (Math.abs(val) >= 100000) {
      return `₹${(val / 100000).toFixed(1)}L`;
    }
    return `₹${(val / 1000).toFixed(0)}k`;
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-2 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            25-Year Cumulative Savings & Return on Investment
          </h3>
          <p className="text-xs text-slate-500">
            Shows cumulative electricity bill savings surpassing initial turnkey capital investment.
          </p>
        </div>
        {paybackYears !== null && (
          <div className="flex items-center space-x-2 rounded-lg bg-eco-50 px-3 py-1.5 text-xs font-semibold text-eco-800 border border-eco-200 self-start sm:self-auto">
            <span>Payback Point:</span>
            <span className="font-bold text-eco-900 font-mono">
              ~{paybackYears} Years
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 20, bottom: 10, left: 10 }}
          >
            <defs>
              <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="year"
              tickLine={false}
              stroke="#64748b"
              fontSize={12}
            />
            <YAxis
              tickLine={false}
              stroke="#64748b"
              fontSize={12}
              tickFormatter={formatLakhs}
            />
            <Tooltip
              formatter={(value: any, name: string) => {
                if (name === "Cumulative Savings") return [formatINR(value), name];
                if (name === "System Cost") return [formatINR(value), name];
                if (name === "Net Cash Flow") return [formatINR(value), name];
                return [value, name];
              }}
              labelFormatter={(label) => `Projection: ${label}`}
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.95)",
                borderRadius: "0.5rem",
                color: "#f8fafc",
                fontSize: "12px",
                border: "none",
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: "10px", fontSize: "12px" }}
            />
            <ReferenceLine
              y={systemCostINR}
              stroke="#f59e0b"
              strokeDasharray="4 4"
              label={{
                value: "Turnkey Cost",
                position: "insideTopLeft",
                fill: "#d97706",
                fontSize: 11,
              }}
            />
            <Area
              type="monotone"
              dataKey="cumulativeSavings"
              name="Cumulative Savings"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#savingsGrad)"
            />
            <Line
              type="monotone"
              dataKey="systemCost"
              name="System Cost"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
        <span>Includes 0.7% annual degradation rate</span>
        <span>Includes 3.0% annual grid tariff escalation rate</span>
      </div>
    </div>
  );
}
