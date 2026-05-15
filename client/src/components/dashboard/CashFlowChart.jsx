import { useEffect, useRef } from 'react';
import {
  Chart, LineController, LineElement, PointElement,
  LinearScale, CategoryScale, Filler, Tooltip, Legend,
} from 'chart.js';
import styles from './Chart.module.css';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip, Legend);

/* Skill: Line chart for trend over time — primary #8b5cf6, fill 20% opacity */
const CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(4, 2, 14, 0.96)',
      titleColor: '#c084fc',
      bodyColor: '#f8fafc',
      borderColor: 'rgba(139,92,246,0.32)',
      borderWidth: 1,
      padding: 14,
      cornerRadius: 10,
      titleFont: { family: "'IBM Plex Sans', sans-serif", weight: '600', size: 12 },
      bodyFont:  { family: "'IBM Plex Sans', sans-serif", size: 13 },
      callbacks: { label: (ctx) => ` R${ctx.raw.toLocaleString('en-ZA')}` },
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(139,92,246,0.06)', drawBorder: false },
      ticks: { color: '#64748b', font: { size: 11, family: "'IBM Plex Sans', sans-serif" } },
      border: { color: 'transparent' },
    },
    y: {
      grid: { color: 'rgba(139,92,246,0.06)', drawBorder: false },
      ticks: {
        color: '#64748b',
        font: { size: 11, family: "'IBM Plex Sans', sans-serif" },
        callback: (v) => `R${v.toLocaleString('en-ZA')}`,
      },
      border: { color: 'transparent' },
    },
  },
};

export default function CashFlowChart({ monthly = [] }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !monthly.length) return;

    chartRef.current?.destroy();

    const labels = monthly.map((m) => {
      const [y, mo] = m.month.split('-');
      return new Date(y, mo - 1).toLocaleString('en-US', { month: 'short', year: '2-digit' });
    });

    const netFlow = monthly.map((m) => +(m.income - m.expenses).toFixed(2));

    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Net Cash Flow',
          data: netFlow,
          borderColor: '#a855f7',
          backgroundColor: (ctx) => {
            const canvas = ctx.chart.ctx;
            const grad = canvas.createLinearGradient(0, 0, 0, ctx.chart.height);
            grad.addColorStop(0, 'rgba(168,85,247,0.22)');
            grad.addColorStop(1, 'rgba(168,85,247,0.01)');
            return grad;
          },
          pointBackgroundColor: '#c084fc',
          pointBorderColor: '#020617',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 7,
          pointHoverBackgroundColor: '#fff',
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
        }],
      },
      options: CHART_OPTIONS,
    });

    return () => chartRef.current?.destroy();
  }, [monthly]);

  return (
    <div className={`glass-card ${styles.chartCard}`}>
      <h3 className="section-title">Cash Flow</h3>
      <div className={styles.chartWrap}>
        {monthly.length
          ? <canvas ref={canvasRef} />
          : <p className={styles.noData}>No data yet</p>}
      </div>
    </div>
  );
}
