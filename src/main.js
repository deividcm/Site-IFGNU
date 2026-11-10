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
    render: () => `<h1>Página não encontrada</h1>`
  }
};

const contentEl = document.getElementById('router-view');
new Router(routes, contentEl);
