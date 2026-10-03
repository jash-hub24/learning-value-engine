import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';
import { CompetencyEvaluation } from '../types';

interface CompetencyChartProps {
  competencies: CompetencyEvaluation[];
  onSelectCompetency?: (id: string) => void;
}

export const CompetencyChart: React.FC<CompetencyChartProps> = ({
  competencies,
  onSelectCompetency
}) => {
  const chartData = competencies.map((comp) => ({
    id: comp.competency.id,
    name: comp.competency.name,
    score: comp.score,
    target: comp.competency.targetScore,
    status: comp.status
  }));

  const getBarColor = (score: number) => {
    if (score < 50) return '#f43f5e'; // rose-500
    if (score < 70) return '#f59e0b'; // amber-500
    return '#10b981'; // emerald-500
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Competency Profile Overview
          </h3>
          <p className="text-xs text-slate-500">
            Calculated from dynamic evidence records against 70% threshold
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-emerald-700">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block"></span> Strong (&ge;70%)
          </span>
          <span className="flex items-center gap-1.5 text-amber-700">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500 inline-block"></span> Developing (50-69%)
          </span>
          <span className="flex items-center gap-1.5 text-rose-700">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500 inline-block"></span> Gap (&lt;50%)
          </span>
        </div>
      </div>

      <div className="h-72 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
            <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 11, fill: '#64748b' }} />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 12, fill: '#1e293b', fontWeight: 500 }}
              width={140}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white p-2.5 rounded-lg shadow-lg text-xs space-y-1">
                      <p className="font-bold">{data.name}</p>
                      <p className="text-sky-300">Calculated Score: {data.score}%</p>
                      <p className="text-slate-300">Target Benchmark: {data.target}%</p>
                      <p className="capitalize text-slate-400">Status: {data.status}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine x={70} stroke="#10b981" strokeDasharray="4 4" label={{ value: 'Target 70%', fill: '#10b981', fontSize: 10, position: 'top' }} />
            <ReferenceLine x={50} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'Passing 50%', fill: '#f59e0b', fontSize: 10, position: 'top' }} />
            <Bar
              dataKey="score"
              radius={[0, 6, 6, 0]}
              cursor="pointer"
              onClick={(data) => onSelectCompetency && onSelectCompetency(data.id)}
            >
              {chartData.map((entry) => (
                <Cell key={`cell-${entry.id}`} fill={getBarColor(entry.score)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[11px] text-slate-400 text-center mt-2">
        Click any competency bar to open the traceable evidence contribution calculation.
      </p>
    </div>
  );
};
