import { useEffect, useRef } from 'react';
import {
  Chart, LineController, LineElement, PointElement,
  LinearScale, CategoryScale, Filler, Tooltip, Legend,
} from 'chart.js';
import styles from './Chart.module.css';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip, Legend);

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
          backgroundColor: 'rgba(168,85,247,0.12)',
          pointBackgroundColor: '#a855f7',
          pointBorderColor: '#0a0a12',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(10,8,24,0.95)',
            titleColor: '#c084fc',
            bodyColor: '#e2e8f0',
            borderColor: 'rgba(139,92,246,0.35)',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: (ctx) => ` R${ctx.raw.toLocaleString('en-ZA')}`,
            },
          },
        },
        scales: {
          x: {
            grid: { color: 'rgba(139,92,246,0.07)' },
            ticks: { color: '#64748b', font: { size: 11 } },
            border: { color: 'transparent' },
          },
          y: {
            grid: { color: 'rgba(139,92,246,0.07)' },
            ticks: {
              color: '#64748b',
              font: { size: 11 },
              callback: (v) => `R${v.toLocaleString('en-ZA')}`,
            },
            border: { color: 'transparent' },
          },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [monthly]);

  return (
    <div className={`glass-card ${styles.chartCard}`}>
      <h3 className="section-title">Cash Flow</h3>
      <div className={styles.chartWrap}>
        {monthly.length ? <canvas ref={canvasRef} /> : <p className={styles.noData}>No data yet</p>}
      </div>
    </div>
  );
}
