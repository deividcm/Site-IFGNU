import './styles/main.css';
import './components/layout/app-sidebar.js';
import { Router } from './router/router.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderProjects, afterRenderProjects } from './pages/projects.js';
import { renderProjectDetail, afterRenderProjectDetail } from './pages/project-detail.js';
import { renderCommunity, afterRenderCommunity } from './pages/community.js';

const routes = {
  '/': {
    render: () => renderDashboard()
  },
  '/projetos': {
    render: () => renderProjects(),
    afterRender: () => afterRenderProjects()
  },
  '/projetos/:id': {
    render: (params) => renderProjectDetail(params.id),
    afterRender: (params) => afterRenderProjectDetail(params.id)
  },
  '/comunidade': {
    render: () => renderCommunity(),
    afterRender: () => afterRenderCommunity()
  },
  '/404': {
    render: () => `
      <div class="card animate-slide-up" style="padding: 48px; text-align: center; max-width: 480px; margin: 40px auto;">
        <h1 style="font-size: 2rem; font-weight: 800; color: var(--color-gray-950); margin-bottom: 8px;">404</h1>
        <p style="color: var(--color-text-muted); margin-bottom: 24px;">Página não encontrada ou rota inexistente.</p>
        <a href="#/" class="btn btn-primary">Voltar ao Painel</a>
      </div>
    `
  }
};

const contentEl = document.getElementById('router-view');
new Router(routes, contentEl);
