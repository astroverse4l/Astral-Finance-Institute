"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface AnalyticsPieChartProps {
  data: Array<{ name: string; value: number }>
  colors?: string[]
}

export function AnalyticsPieChart({
  data,
  colors = [
    "#6366f1",
    "#8b5cf6",
    "#d946ef",
    "#ec4899",
    "#f43f5e",
    "#f97316",
    "#eab308",
    "#84cc16",
    "#22c55e",
    "#14b8a6",
  ],
}: AnalyticsPieChartProps) {
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    // Format data for the chart
    setChartData(data)
  }, [data])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "white",
          }}
          formatter={(value: number) => [`${value}`, "Count"]}
        />
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          wrapperStyle={{ color: "rgba(255, 255, 255, 0.7)" }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
