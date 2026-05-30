import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function RiskCurveChart({ dailyRiskCurve, baseRisk = 0.5 }) {
  // If we don't have custom daily curves, generate a fallback mock forecast
  const data = dailyRiskCurve
    ? JSON.parse(dailyRiskCurve)
    : Array.from({ length: 30 }, (_, i) => {
        const day = i * 3 + 3; // 3 to 90 days
        const ratio = day / 90.0;
        return {
          day: `Day ${day}`,
          P50: Math.min(1.0, baseRisk * (1.0 + ratio * 0.2) + (day * 0.001)),
          P10: Math.min(1.0, baseRisk * 0.6 * (1.0 + ratio * 0.1)),
          P90: Math.min(1.0, Math.min(1.0, baseRisk * 1.4 * (1.0 + ratio * 0.3))),
        };
      });

  const formattedData = dailyRiskCurve && Array.isArray(data)
    ? data.map((d, index) => {
        // If dailyRiskCurve is a list of { day, probability }
        const pVal = d.probability || d.overallRisk || baseRisk;
        return {
          day: `Day ${d.day || (index + 1)}`,
          P50: parseFloat(pVal.toFixed(3)),
          P10: parseFloat((pVal * 0.6).toFixed(3)),
          P90: parseFloat(Math.min(1.0, pVal * 1.3).toFixed(3)),
        };
      })
    : data;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: '#1e293b',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '12px',
          borderRadius: '8px',
          color: '#f8fafc',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
          fontSize: '0.85rem'
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>{payload[0].payload.day}</p>
          {payload.map((pld, index) => (
            <div key={index} style={{ color: pld.color, margin: '2px 0' }}>
              {pld.name}: {(pld.value * 100).toFixed(1)}%
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.4)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      borderRadius: '8px',
      padding: '20px',
      height: '100%',
      minHeight: '260px',
      boxSizing: 'border-box'
    }}>
      <h4 style={{ margin: '0 0 16px 0', color: '#f8fafc', fontSize: '0.95rem', fontWeight: 600 }}>
        90-Day Churn Risk Trajectory
      </h4>
      
      <div style={{ width: '100%', height: '200px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={formattedData}
            margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
            <XAxis
              dataKey="day"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              domain={[0, 1]}
              tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '0.78rem', paddingTop: '10px' }}
            />
            <Line
              name="P90 (Pessimistic)"
              type="monotone"
              dataKey="P90"
              stroke="#EF4444"
              strokeWidth={2}
              dot={false}
            />
            <Line
              name="P50 (Expected)"
              type="monotone"
              dataKey="P50"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={false}
            />
            <Line
              name="P10 (Optimistic)"
              type="monotone"
              dataKey="P10"
              stroke="#10B981"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
