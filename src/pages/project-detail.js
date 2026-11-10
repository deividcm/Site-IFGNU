import { projectService } from '../services/project.service.js';
import { communityService } from '../services/community.service.js';
import { renderIcon } from '../utils/icons.js';

/**
 * Controller/View de Detalhes do Projeto
 * Edição de título, descrição, responsáveis e gerenciamento de membros.
 * Atende às diretrizes de UI/UX com botões de Salvar posicionados FORA e ABAIXO dos containers.
 */
export async function renderProjectDetail(id) {
  const project = await projectService.getById(id);
  if (!project) {
    return `
      <div class="card" style="padding: 32px; text-align: center;">
        <p style="color: var(--color-status-rejected); font-weight: 600; font-size: 1.1rem; margin-bottom: 12px;">Projeto não encontrado.</p>
        <a href="#/projetos" class="btn btn-secondary">
          ${renderIcon('ArrowLeft', { width: 16, height: 16 })} Voltar para Projetos
        </a>
      </div>
    `;
  }

  const getStatusBadge = (status, label) => {
    switch (status) {
      case 'approved':
        return `<span class="badge" style="background:var(--color-status-approved-bg);color:var(--color-status-approved);border:1px solid var(--color-status-approved-border);"><span class="status-dot" style="background:var(--color-status-approved);"></span>${label}</span>`;
      case 'pending':
        return `<span class="badge" style="background:var(--color-status-pending-bg);color:var(--color-status-pending);border:1px solid var(--color-status-pending-border);"><span class="status-dot" style="background:var(--color-status-pending);"></span>${label}</span>`;
      case 'done':
        return `<span class="badge" style="background:var(--color-status-done-bg);color:var(--color-status-done);border:1px solid var(--color-status-done-border);"><span class="status-dot" style="background:var(--color-status-done);"></span>${label}</span>`;
      default:
        return `<span class="badge" style="background:var(--color-status-draft-bg);color:var(--color-status-draft);border:1px solid var(--color-status-draft-border);"><span class="status-dot" style="background:var(--color-status-draft);"></span>${label}</span>`;
    }
  };

  const vinculoBadge = (v) => {
    const config = {
      'Estudante': { bg: 'var(--color-brand-green-050)', color: 'var(--color-primary)', border: 'var(--color-brand-green-100)' },
      'Servidor': { bg: 'var(--color-status-pending-bg)', color: 'var(--color-status-pending)', border: 'var(--color-status-pending-border)' },
      'Colaborador Externo': { bg: 'var(--color-status-done-bg)', color: 'var(--color-status-done)', border: 'var(--color-status-done-border)' }
    };
    const c = config[v] || { bg: 'var(--color-gray-100)', color: 'var(--color-gray-600)', border: 'var(--color-gray-200)' };
    return `<span class="badge" style="background:${c.bg};color:${c.color};border:1px solid ${c.border};">${v}</span>`;
  };

  // Resolver membros e responsáveis
  const allMembers = await communityService.getAll();
  const respMembers = await communityService.getByIds(project.responsaveis);
  const projMembers = await communityService.getByIds(project.membros);

  // Membros da comunidade ainda não adicionados ao projeto
  const availableMembers = allMembers.filter(m => !project.membros.includes(m.id));
  const availableOptions = availableMembers.map(m =>
    `<option value="${m.id}">${m.nome} — ${m.vinculo}</option>`
  ).join('');

  // Membros do projeto que ainda não são responsáveis
  const availableResps = projMembers.filter(m => !project.responsaveis.includes(m.id));
  const availableRespOptions = availableResps.map(m =>
    `<option value="${m.id}">${m.nome} — ${m.vinculo}</option>`
  ).join('');

  const respHtml = respMembers.map(r => `
    <div style="
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      background: var(--color-gray-050);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      transition: var(--transition-fast);
    ">
      <span style="display:flex;align-items:center;color:var(--color-primary);">
        ${renderIcon('UserCheck', { width: 16, height: 16 })}
      </span>
      <span style="flex: 1; font-weight: 600; color: var(--color-gray-900); font-size: 0.925rem;">${r.nome}</span>
      ${vinculoBadge(r.vinculo)}
      <button class="btn-icon danger btn-remove-resp" data-id="${r.id}" title="Remover responsável" style="padding: 6px;">
        ${renderIcon('Trash2', { width: 16, height: 16 })}
      </button>
    </div>
  `).join('');

  const membrosHtml = projMembers.map(m => {
    const isResp = project.responsaveis.includes(m.id);
    return `
      <div style="
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        transition: var(--transition-normal);
      " class="member-item-row">
        <span style="display:flex;align-items:center;color:${isResp ? 'var(--color-primary)' : 'var(--color-gray-400)'};">
          ${renderIcon(isResp ? 'UserCheck' : 'Users', { width: 18, height: 18 })}
        </span>
        <span style="flex: 1; font-weight: 500; font-size: 0.95rem; color: var(--color-gray-900);">${m.nome}</span>
        ${vinculoBadge(m.vinculo)}
        ${isResp ? `<span class="badge" style="background:var(--color-brand-green-100);color:var(--color-primary);border:1px solid var(--color-brand-green-200);font-weight:700;">Responsável</span>` : ''}
        <button class="btn-icon danger btn-remove-member" data-id="${m.id}" title="Remover do projeto" style="padding: 6px;">
          ${renderIcon('Trash2', { width: 16, height: 16 })}
        </button>
      </div>
    `;
  }).join('');

  return `
    <div class="animate-slide-up">
      <!-- Navegação Superior -->
      <div style="margin-bottom: 20px;">
        <a href="#/projetos" class="btn btn-secondary" style="padding: 6px 14px; font-size: 0.85rem;">
          ${renderIcon('ArrowLeft', { width: 15, height: 15 })} Voltar aos Projetos
        </a>
      </div>

      <header style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap;">
        <div>
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
            ${getStatusBadge(project.status, project.statusLabel)}
            <span class="badge" style="background:var(--color-gray-100);color:var(--color-gray-700);border:1px solid var(--color-gray-200);text-transform:uppercase;letter-spacing:0.04em;">${project.category}</span>
          </div>
          <h1 style="font-size: 1.875rem; font-weight: 800; color: var(--color-gray-950); line-height: 1.25;">${project.title}</h1>
        </div>
      </header>

      <!-- Navegação de Abas -->
      <div style="display: flex; gap: 8px; border-bottom: 2px solid var(--color-border); margin-bottom: 24px;">
        <button class="tab-btn active-tab" data-tab="info" style="
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 20px; border: none; background: none; cursor: pointer;
          font-weight: 600; font-size: 0.95rem; border-bottom: 3px solid var(--color-primary);
          margin-bottom: -2px; color: var(--color-primary); transition: var(--transition-fast);
        ">
          ${renderIcon('FolderKanban', { width: 17, height: 17 })} Informações Gerais
        </button>
        <button class="tab-btn" data-tab="membros" style="
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 20px; border: none; background: none; cursor: pointer;
          font-weight: 500; font-size: 0.95rem; border-bottom: 3px solid transparent;
          margin-bottom: -2px; color: var(--color-text-muted); transition: var(--transition-fast);
        ">
          ${renderIcon('Users', { width: 17, height: 17 })} Equipe & Membros (${projMembers.length})
        </button>
      </div>

      <!-- ABA 1: Informações e Responsáveis -->
      <div id="tab-info" class="tab-content">
        <!-- <div> que engloba as informações e os responsáveis -->
        <div id="container-projeto-info" class="card" style="padding: 28px;">
          <h2 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 18px; color: var(--color-gray-950);">
            Dados do Projeto
          </h2>

          <div class="form-group">
            <label for="edit-titulo" class="form-label">Nome do Projeto</label>
            <input type="text" id="edit-titulo" value="${project.title}" class="form-input" style="font-weight: 600; font-size: 1.05rem;">
          </div>

          <div class="form-group" style="margin-bottom: 28px;">
            <label for="edit-descricao" class="form-label">Descrição Detalhada</label>
            <textarea id="edit-descricao" rows="5" class="form-textarea" style="line-height: 1.6;">${project.description}</textarea>
          </div>

          <div style="border-top: 1px solid var(--color-border); padding-top: 24px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 14px;">
              <div>
                <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--color-gray-950);">Responsáveis pela Coordenação</h3>
                <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-top: 2px;">Membros com perfil de liderança e gestão no projeto.</p>
              </div>
            </div>

            <div id="lista-responsaveis-detail" style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;">
              ${respHtml || '<p style="color:var(--color-text-muted);font-size:0.9rem;padding:12px;background:var(--color-gray-050);border-radius:var(--radius-sm);">Nenhum responsável vinculado no momento.</p>'}
            </div>

            <div style="display: flex; gap: 10px; align-items: center; background: var(--color-gray-050); padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--color-border);">
              <select id="sel-add-resp" class="form-select" style="flex: 1;">
                <option value="">Adicionar responsável (dentre os membros do projeto)…</option>
                ${availableRespOptions}
              </select>
              <button type="button" id="btn-add-resp-detail" class="btn btn-secondary">
                ${renderIcon('Plus', { width: 15, height: 15 })} Vincular
              </button>
            </div>
          </div>
        </div>

        <!-- REQUISITO 4: Botão "Salvar" completamente FORA da <div> das informações/responsáveis, posicionado logo abaixo -->
        <div class="form-actions-bar">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span id="save-feedback" class="feedback-badge" style="display: none;">
              ${renderIcon('CheckCircle2', { width: 16, height: 16 })} Alterações salvas com sucesso!
            </span>
          </div>
          <button id="btn-salvar-info" class="btn btn-primary" style="padding: 10px 24px; font-size: 0.95rem;">
            ${renderIcon('Save', { width: 18, height: 18 })} Salvar Alterações
          </button>
        </div>
      </div>

      <!-- ABA 2: Membros -->
      <div id="tab-membros" class="tab-content" style="display: none;">
        <!-- <div> que engloba o gerenciamento de membros -->
        <div id="container-gerenciamento-membros" class="card" style="padding: 28px;">
          <div style="margin-bottom: 20px;">
            <h2 style="font-size: 1.15rem; font-weight: 700; color: var(--color-gray-950);">Quadro de Membros do Projeto</h2>
            <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-top: 4px;">Gerencie estudantes, servidores e colaboradores participantes desta iniciativa.</p>
          </div>

          <!-- Seletor de inclusão de membros -->
          <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 20px; padding: 16px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); background: var(--color-gray-050);">
            <select id="sel-add-member" class="form-select" style="flex: 1;">
              <option value="">Selecione um membro da comunidade para incluir…</option>
              ${availableOptions}
            </select>
            <button type="button" id="btn-add-member" class="btn btn-secondary">
              ${renderIcon('UserPlus', { width: 16, height: 16 })} Adicionar ao Projeto
            </button>
          </div>

          <!-- Lista de membros -->
          <div id="lista-membros-projeto" style="display: flex; flex-direction: column; gap: 10px;">
            ${membrosHtml || '<p style="color:var(--color-text-muted);font-size:0.9rem;padding:16px;text-align:center;">Nenhum membro cadastrado neste projeto.</p>'}
          </div>
        </div>

        <!-- REQUISITO 4: Botão "Salvar" completamente FORA da <div> de membros, posicionado logo abaixo -->
        <div class="form-actions-bar">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span id="save-membros-feedback" class="feedback-badge" style="display: none;">
              ${renderIcon('CheckCircle2', { width: 16, height: 16 })} Quadro de membros atualizado com sucesso!
            </span>
          </div>
          <button id="btn-salvar-membros" class="btn btn-primary" style="padding: 10px 24px; font-size: 0.95rem;">
            ${renderIcon('Save', { width: 18, height: 18 })} Salvar Membros
          </button>
        </div>
      </div>
    </div>
  `;
}

export function afterRenderProjectDetail(projectId) {
  // Controle de Abas
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => {
        b.style.borderBottom = '3px solid transparent';
        b.style.color = 'var(--color-text-muted)';
        b.style.fontWeight = '500';
        b.classList.remove('active-tab');
      });
      btn.style.borderBottom = '3px solid var(--color-primary)';
      btn.style.color = 'var(--color-primary)';
      btn.style.fontWeight = '600';
      btn.classList.add('active-tab');
      document.querySelectorAll('.tab-content').forEach(tc => tc.style.display = 'none');
      document.getElementById('tab-' + btn.dataset.tab).style.display = 'block';
    });
  });

  // Salvar título e descrição (Aba 1)
  const btnSalvarInfo = document.getElementById('btn-salvar-info');
  if (btnSalvarInfo) {
    btnSalvarInfo.addEventListener('click', async () => {
      const title = document.getElementById('edit-titulo').value.trim();
      const description = document.getElementById('edit-descricao').value.trim();
      if (!title || !description) return;
      await projectService.update(projectId, { title, description });
      const fb = document.getElementById('save-feedback');
      fb.style.display = 'inline-flex';
      setTimeout(() => { fb.style.display = 'none'; }, 2800);
    });
  }

  // Salvar Membros (Aba 2 - Confirmação e Feedback persistente)
  const btnSalvarMembros = document.getElementById('btn-salvar-membros');
  if (btnSalvarMembros) {
    btnSalvarMembros.addEventListener('click', async () => {
      const fb = document.getElementById('save-membros-feedback');
      fb.style.display = 'inline-flex';
      setTimeout(() => { fb.style.display = 'none'; }, 2800);
    });
  }

  // Adicionar responsável
  const btnAddResp = document.getElementById('btn-add-resp-detail');
  if (btnAddResp) {
    btnAddResp.addEventListener('click', async () => {
      const memberId = document.getElementById('sel-add-resp').value;
      if (!memberId) return;
      const project = await projectService.getById(projectId);
      const newResps = [...project.responsaveis, memberId];
      await projectService.update(projectId, { responsaveis: newResps });
      await reRenderDetail(projectId, 'info');
    });
  }

  // Remover responsável
  document.querySelectorAll('.btn-remove-resp').forEach(btn => {
    btn.addEventListener('click', async () => {
      const project = await projectService.getById(projectId);
      const newResps = project.responsaveis.filter(id => id !== btn.dataset.id);
      await projectService.update(projectId, { responsaveis: newResps });
      await reRenderDetail(projectId, 'info');
    });
  });

  // Adicionar membro da comunidade ao projeto
  const btnAddMember = document.getElementById('btn-add-member');
  if (btnAddMember) {
    btnAddMember.addEventListener('click', async () => {
      const memberId = document.getElementById('sel-add-member').value;
      if (!memberId) return;
      await projectService.addMember(projectId, memberId);
      await reRenderDetail(projectId, 'membros');
    });
  }

  // Remover membro do projeto
  document.querySelectorAll('.btn-remove-member').forEach(btn => {
    btn.addEventListener('click', async () => {
      await projectService.removeMember(projectId, btn.dataset.id);
      await reRenderDetail(projectId, 'membros');
    });
  });
}

async function reRenderDetail(projectId, activeTab) {
  const contentEl = document.getElementById('router-view');
  contentEl.innerHTML = await renderProjectDetail(projectId);
  afterRenderProjectDetail(projectId);
  if (activeTab) {
    const tabBtn = document.querySelector(`[data-tab="${activeTab}"]`);
    if (tabBtn) tabBtn.click();
  }
}
