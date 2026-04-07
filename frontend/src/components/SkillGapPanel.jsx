import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Target } from 'lucide-react';

export default function SkillGapPanel({ jobs }) {
  const chartData = useMemo(() => {
    if (!jobs || jobs.length === 0) return [];
    
    const skillCounts = {};
    
    // Aggregate missing skills across the fetched jobs
    jobs.slice(0, 5).forEach(job => {
      (job.missing_skills || []).forEach(skill => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    });
    
    // Sort and take top 7
    return Object.entries(skillCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7);
  }, [jobs]);

  if (!chartData.length) return null;

  return (
    <div className="w-full bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl mb-8">
      <div className="flex justify-between items-center mb-6">
         <h3 className="text-lg font-bold text-white flex items-center gap-2">
           <Target className="w-5 h-5 text-red-400" />
           Top Recommended Skills to Learn
         </h3>
         <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Based on top 5 matched jobs</span>
      </div>
      
      <div className="h-64 w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 13, fontWeight: 600 }}
              width={100}
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', color: '#f3f4f6' }}
              formatter={(val) => [`${val} jobs`, 'Occurrences']}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#ef4444" opacity={0.8 - (index * 0.1)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
