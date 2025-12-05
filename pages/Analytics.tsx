import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import { ReadingStat } from '../types';

const mockData: ReadingStat[] = [
  { month: 'Jan', pagesRead: 450, booksFinished: 2 },
  { month: 'Feb', pagesRead: 320, booksFinished: 1 },
  { month: 'Mar', pagesRead: 550, booksFinished: 3 },
  { month: 'Apr', pagesRead: 700, booksFinished: 4 },
  { month: 'May', pagesRead: 200, booksFinished: 1 },
  { month: 'Jun', pagesRead: 600, booksFinished: 2 },
];

export const Analytics: React.FC = () => {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-serif font-bold text-ink dark:text-stone-100">Reading Stats</h2>
        <p className="text-stone-500 dark:text-stone-400">Track your literary consumption over time.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm transition-colors">
            <p className="text-stone-400 text-sm font-bold uppercase tracking-wider mb-2">Total Books 2024</p>
            <p className="text-5xl font-serif font-bold text-ink dark:text-stone-100">13</p>
        </div>
        <div className="bg-white dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm transition-colors">
            <p className="text-stone-400 text-sm font-bold uppercase tracking-wider mb-2">Pages Read</p>
            <p className="text-5xl font-serif font-bold text-ink dark:text-stone-100">2,820</p>
        </div>
        <div className="bg-white dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm transition-colors">
            <p className="text-stone-400 text-sm font-bold uppercase tracking-wider mb-2">Avg Rating</p>
            <p className="text-5xl font-serif font-bold text-ink dark:text-stone-100">4.2</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm h-[400px] transition-colors">
            <h3 className="font-bold text-ink dark:text-stone-100 mb-6">Pages Read per Month</h3>
            <ResponsiveContainer width="100%" height="85%">
                <BarChart data={mockData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#57534e" opacity={0.3} />
                    <XAxis dataKey="month" stroke="#78716c" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#78716c" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e7e5e4' }}
                        cursor={{ fill: '#f5f5f4' }}
                    />
                    <Bar dataKey="pagesRead" fill="#d97706" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm h-[400px] transition-colors">
             <h3 className="font-bold text-ink dark:text-stone-100 mb-6">Reading Velocity</h3>
             <ResponsiveContainer width="100%" height="85%">
                <LineChart data={mockData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#57534e" opacity={0.3} />
                    <XAxis dataKey="month" stroke="#78716c" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#78716c" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e7e5e4' }} />
                    <Line type="monotone" dataKey="booksFinished" stroke="#d97706" strokeWidth={3} dot={{ r: 4, fill: '#d97706' }} activeDot={{ r: 6 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};