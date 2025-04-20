"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

interface AnalyticsChartProps {
  data: Array<{ name: string; value: number }>
  xAxisKey?: string
  yAxisKey?: string
  xAxisLabel?: string
  yAxisLabel?: string
  type?: "bar" | "line"
  color?: string
}

export function AnalyticsChart({
  data,
  xAxisKey = "name",
  yAxisKey = "value",
  xAxisLabel,
  yAxisLabel,
  type = "bar",
  color = "#6366f1",
}: AnalyticsChartProps) {
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    // Format data for the chart
    setChartData(data)
  }, [data])

  return (
    <ResponsiveContainer width="100%" height="100%">
      {type === "bar" ? (
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis
            dataKey={xAxisKey}
            stroke="rgba(255, 255, 255, 0.7)"
            label={{
              value: xAxisLabel,
              position: "insideBottom",
              offset: -10,
              fill: "rgba(255, 255, 255, 0.7)",
            }}
          />
          <YAxis
            stroke="rgba(255, 255, 255, 0.7)"
            label={{
              value: yAxisLabel,
              angle: -90,
              position: "insideLeft",
              fill: "rgba(255, 255, 255, 0.7)",
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "white",
            }}
          />
          <Bar dataKey={yAxisKey} fill={color} radius={[4, 4, 0, 0]} />
        </BarChart>
      ) : (
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis
            dataKey={xAxisKey}
            stroke="rgba(255, 255, 255, 0.7)"
            label={{
              value: xAxisLabel,
              position: "insideBottom",
              offset: -10,
              fill: "rgba(255, 255, 255, 0.7)",
            }}
          />
          <YAxis
            stroke="rgba(255, 255, 255, 0.7)"
            label={{
              value: yAxisLabel,
              angle: -90,
              position: "insideLeft",
              fill: "rgba(255, 255, 255, 0.7)",
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "white",
            }}
          />
          <Line type="monotone" dataKey={yAxisKey} stroke={color} strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      )}
    </ResponsiveContainer>
  )
}
