import { projectService } from '../services/project.service.js';
import { renderIcon } from '../utils/icons.js';

/**
 * Controller/View do Dashboard
 * Exibe métricas consolidadas com design moderno, ícones e microinterações.
 */
export async function renderDashboard() {
  const metrics = await projectService.getMetrics();

  return `
    <div class="animate-slide-up">
      <header class="page-header">
        <div>
          <h1 class="page-title">
            <span>Painel de Controle</span>
          </h1>
          <p class="page-description">Visão consolidada dos projetos de pesquisa, extensão e membros ativos do IF GNU.</p>
        </div>
      </header>

      <!-- Métricas Principais -->
      <section style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 32px;">
        
        <!-- Total de Projetos -->
        <div class="card interactive-card" style="padding: 24px; display: flex; align-items: flex-start; justify-content: space-between;">
          <div>
            <span style="color: var(--color-text-muted); font-size: 0.875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em;">Total de Projetos</span>
            <div style="font-size: 2.25rem; font-weight: 800; color: var(--color-gray-950); margin-top: 8px; line-height: 1;">${metrics.total}</div>
            <p style="font-size: 0.8rem; color: var(--color-text-muted); margin-top: 8px;">Cadastrados na plataforma</p>
          </div>
          <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: var(--color-brand-green-050); border: 1px solid var(--color-brand-green-100); display: flex; align-items: center; justify-content: center; color: var(--color-primary); flex-shrink: 0;">
            ${renderIcon('FolderKanban', { width: 22, height: 22 })}
          </div>
        </div>

        <!-- Bolsistas e Voluntários -->
        <div class="card interactive-card" style="padding: 24px; display: flex; align-items: flex-start; justify-content: space-between;">
          <div>
            <span style="color: var(--color-text-muted); font-size: 0.875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em;">Membros Ativos</span>
            <div style="font-size: 2.25rem; font-weight: 800; color: var(--color-gray-950); margin-top: 8px; line-height: 1;">${metrics.activeMembers}</div>
            <p style="font-size: 0.8rem; color: var(--color-text-muted); margin-top: 8px;">Bolsistas e colaboradores</p>
          </div>
          <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: #eff6ff; border: 1px solid #dbeafe; display: flex; align-items: center; justify-content: center; color: #2563eb; flex-shrink: 0;">
            ${renderIcon('Users', { width: 22, height: 22 })}
          </div>
        </div>

        <!-- Projetos em Análise -->
        <div class="card interactive-card" style="padding: 24px; display: flex; align-items: flex-start; justify-content: space-between;">
          <div>
            <span style="color: var(--color-text-muted); font-size: 0.875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em;">Em Análise</span>
            <div style="font-size: 2.25rem; font-weight: 800; color: var(--color-status-pending); margin-top: 8px; line-height: 1;">${metrics.inReview}</div>
            <p style="font-size: 0.8rem; color: var(--color-text-muted); margin-top: 8px;">Aguardando validação</p>
          </div>
          <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: var(--color-status-pending-bg); border: 1px solid var(--color-status-pending-border); display: flex; align-items: center; justify-content: center; color: var(--color-status-pending); flex-shrink: 0;">
            ${renderIcon('Clock', { width: 22, height: 22 })}
          </div>
        </div>

        <!-- Aprovados -->
        <div class="card interactive-card" style="padding: 24px; display: flex; align-items: flex-start; justify-content: space-between;">
          <div>
            <span style="color: var(--color-text-muted); font-size: 0.875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em;">Aprovados</span>
            <div style="font-size: 2.25rem; font-weight: 800; color: var(--color-status-approved); margin-top: 8px; line-height: 1;">${metrics.approved}</div>
            <p style="font-size: 0.8rem; color: var(--color-text-muted); margin-top: 8px;">Em desenvolvimento ativo</p>
          </div>
          <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: var(--color-status-approved-bg); border: 1px solid var(--color-status-approved-border); display: flex; align-items: center; justify-content: center; color: var(--color-status-approved); flex-shrink: 0;">
            ${renderIcon('CheckCircle2', { width: 22, height: 22 })}
          </div>
        </div>

      </section>

      <!-- Painel de Destaques / Ações Rápidas -->
      <section style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px;">
        <div class="card" style="padding: 24px;">
          <h2 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 12px; display:flex; align-items:center; gap:8px;">
            ${renderIcon('FolderKanban', { width: 18, height: 18, stroke: 'var(--color-primary)' })}
            Iniciativas de Software Livre
          </h2>
          <p style="color: var(--color-text-muted); font-size: 0.925rem; line-height: 1.6; margin-bottom: 20px;">
            O núcleo IF GNU apoia o ecossistema acadêmico com projetos abertos, pesquisas e formação tecnológica de ponta. Explore os projetos em andamento ou gerencie os responsáveis e membros da comunidade.
          </p>
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <a href="#/projetos" class="btn btn-secondary">
              ${renderIcon('FolderKanban', { width: 16, height: 16 })} Ver Todos os Projetos
            </a>
            <a href="#/comunidade" class="btn btn-secondary">
              ${renderIcon('Users', { width: 16, height: 16 })} Ver Comunidade
            </a>
          </div>
        </div>
      </section>
    </div>
  `;
}
