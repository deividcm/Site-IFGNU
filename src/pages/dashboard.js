import { projectService } from '../services/project.service.js';

/**
 * Controller/View do Dashboard
 * Responsabilidade: Orquestrar busca de métricas e gerar o HTML correspondente.
 */
export async function renderDashboard() {
  const metrics = await projectService.getMetrics();

  return `
    <header style="margin-bottom: 24px;">
      <h1 style="font-size: 1.875rem; font-weight: 700; color: var(--color-gray-950);">Painel de Controle</h1>
      <p style="color: var(--color-text-muted); font-size: 0.95rem; margin-top: 4px;">Acompanhamento consolidado dos projetos e membros do IF GNU.</p>
    </header>

    <section style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 32px;">
      <div style="background: var(--color-surface); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--color-border); box-shadow: var(--shadow-sm);">
        <span style="color: var(--color-text-muted); font-size: 0.875rem; font-weight: 500;">Total de Projetos</span>
        <div style="font-size: 2rem; font-weight: 700; color: var(--color-primary); margin-top: 6px;">${metrics.total}</div>
      </div>
      <div style="background: var(--color-surface); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--color-border); box-shadow: var(--shadow-sm);">
        <span style="color: var(--color-text-muted); font-size: 0.875rem; font-weight: 500;">Bolsistas & Voluntários</span>
        <div style="font-size: 2rem; font-weight: 700; color: var(--color-gray-950); margin-top: 6px;">${metrics.activeMembers}</div>
      </div>
      <div style="background: var(--color-surface); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--color-border); box-shadow: var(--shadow-sm);">
        <span style="color: var(--color-text-muted); font-size: 0.875rem; font-weight: 500;">Projetos em Análise</span>
        <div style="font-size: 2rem; font-weight: 700; color: var(--color-status-pending); margin-top: 6px;">${metrics.inReview}</div>
      </div>
      <div style="background: var(--color-surface); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--color-border); box-shadow: var(--shadow-sm);">
        <span style="color: var(--color-text-muted); font-size: 0.875rem; font-weight: 500;">Aprovados</span>
        <div style="font-size: 2rem; font-weight: 700; color: var(--color-status-approved); margin-top: 6px;">${metrics.approved}</div>
      </div>
    </section>
  `;
}
