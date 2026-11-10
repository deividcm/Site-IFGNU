import { projectService } from '../services/project.service.js';
import { communityService } from '../services/community.service.js';

/**
 * Controller/View de Detalhes do Projeto
 * Edição inline de título, descrição, responsáveis e membros.
 */
export async function renderProjectDetail(id) {
  const project = await projectService.getById(id);
  if (!project) {
    return `<p style="color:var(--color-status-rejected);">Projeto não encontrado.</p>`;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'var(--color-status-approved)';
      case 'pending': return 'var(--color-status-pending)';
      case 'done': return 'var(--color-status-done)';
      default: return 'var(--color-status-draft)';
    }
  };

  const vinculoBadge = (v) => {
    const colors = {
      'Estudante': 'var(--color-brand-green-500)',
      'Servidor': 'var(--color-status-pending)',
      'Colaborador Externo': 'var(--color-status-done)'
    };
    return `<span style="font-size:0.75rem;font-weight:600;color:#fff;background:${colors[v] || 'var(--color-gray-400)'};padding:2px 8px;border-radius:var(--radius-sm);">${v}</span>`;
  };

  // Resolver membros e responsáveis
  const allMembers = await communityService.getAll();
  const respMembers = await communityService.getByIds(project.responsaveis);
  const projMembers = await communityService.getByIds(project.membros);

  // Membros que ainda não estão no projeto (para o dropdown de adicionar)
  const availableMembers = allMembers.filter(m => !project.membros.includes(m.id));
  const availableOptions = availableMembers.map(m =>
    `<option value="${m.id}">${m.nome} — ${m.vinculo}</option>`
  ).join('');

  // Responsáveis disponíveis para adicionar (membros do projeto que não são responsáveis)
  const availableResps = projMembers.filter(m => !project.responsaveis.includes(m.id));
  const availableRespOptions = availableResps.map(m =>
    `<option value="${m.id}">${m.nome} — ${m.vinculo}</option>`
  ).join('');

  const respHtml = respMembers.map(r => `
    <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--color-gray-100);border-radius:var(--radius-sm);">
      <span style="flex:1;font-weight:500;">${r.nome}</span>
      ${vinculoBadge(r.vinculo)}
      <button class="btn-remove-resp" data-id="${r.id}" style="background:none;border:none;cursor:pointer;color:var(--color-status-rejected);font-weight:700;font-size:1.1rem;" title="Remover responsável">×</button>
    </div>
  `).join('');

  const membrosHtml = projMembers.map(m => {
    const isResp = project.responsaveis.includes(m.id);
    return `
      <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--color-gray-100);border-radius:var(--radius-sm);">
        <span style="flex:1;">${m.nome}</span>
        ${vinculoBadge(m.vinculo)}
        ${isResp ? '<span style="font-size:0.7rem;color:var(--color-primary);font-weight:600;background:var(--color-brand-green-100);padding:2px 6px;border-radius:var(--radius-sm);">Responsável</span>' : ''}
        <button class="btn-remove-member" data-id="${m.id}" style="background:none;border:none;cursor:pointer;color:var(--color-status-rejected);font-weight:700;font-size:1.1rem;" title="Remover do projeto">×</button>
      </div>
    `;
  }).join('');

  return `
    <a href="#/projetos" style="color:var(--color-primary);text-decoration:none;font-size:0.9rem;font-weight:500;">← Voltar aos Projetos</a>

    <header style="margin-top:16px;margin-bottom:24px;">
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
        <span style="font-size:0.8rem;font-weight:600;color:${getStatusColor(project.status)};display:inline-flex;align-items:center;gap:4px;">● ${project.statusLabel}</span>
        <span style="font-size:0.75rem;font-weight:600;text-transform:uppercase;color:var(--color-gray-600);background:var(--color-gray-100);padding:2px 8px;border-radius:var(--radius-sm);">${project.category}</span>
      </div>
    </header>

    <!-- Tabs -->
    <div style="display:flex;gap:0;border-bottom:2px solid var(--color-border);margin-bottom:24px;">
      <button class="tab-btn active-tab" data-tab="info" style="padding:10px 20px;border:none;background:none;cursor:pointer;font-weight:600;font-size:0.95rem;border-bottom:2px solid var(--color-primary);margin-bottom:-2px;color:var(--color-primary);">Informações</button>
      <button class="tab-btn" data-tab="membros" style="padding:10px 20px;border:none;background:none;cursor:pointer;font-weight:500;font-size:0.95rem;color:var(--color-text-muted);">Membros (${projMembers.length})</button>
    </div>

    <!-- Tab: Info — edição inline -->
    <div id="tab-info" class="tab-content">
      <section style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-md);padding:24px;margin-bottom:20px;">
        <label style="display:flex;flex-direction:column;gap:6px;margin-bottom:20px;">
          <span style="font-weight:600;font-size:0.9rem;">Nome do Projeto</span>
          <input type="text" id="edit-titulo" value="${project.title}" style="padding:8px 12px;border:1px solid var(--color-border);border-radius:var(--radius-sm);font-size:1.1rem;font-weight:600;">
        </label>
        <label style="display:flex;flex-direction:column;gap:6px;margin-bottom:20px;">
          <span style="font-weight:600;font-size:0.9rem;">Descrição</span>
          <textarea id="edit-descricao" rows="4" style="padding:8px 12px;border:1px solid var(--color-border);border-radius:var(--radius-sm);font-size:0.95rem;line-height:1.5;resize:vertical;">${project.description}</textarea>
        </label>

        <div style="display:flex;justify-content:flex-end;">
          <button id="btn-salvar-info" class="btn" style="padding:8px 20px;">💾 Salvar Alterações</button>
        </div>
        <p id="save-feedback" style="text-align:right;font-size:0.85rem;color:var(--color-status-approved);margin-top:8px;display:none;">Alterações salvas.</p>
      </section>

      <!-- Responsáveis -->
      <section style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-md);padding:24px;">
        <h3 style="font-size:1rem;font-weight:600;margin-bottom:12px;">Responsáveis</h3>
        <div id="lista-responsaveis-detail" style="display:flex;flex-direction:column;gap:8px;margin-bottom:12px;">
          ${respHtml || '<p style="color:var(--color-text-muted);font-size:0.9rem;">Nenhum responsável.</p>'}
        </div>
        <div style="display:flex;gap:8px;align-items:end;">
          <select id="sel-add-resp" style="flex:1;padding:6px 10px;border:1px solid var(--color-border);border-radius:var(--radius-sm);font-size:0.9rem;">
            <option value="">Adicionar responsável (membro do projeto)…</option>
            ${availableRespOptions}
          </select>
          <button type="button" id="btn-add-resp-detail" class="btn" style="padding:6px 12px;font-size:0.85rem;">Adicionar</button>
        </div>
      </section>
    </div>

    <!-- Tab: Membros -->
    <div id="tab-membros" class="tab-content" style="display:none;">
      <section style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-md);padding:24px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
          <h3 style="font-size:1rem;font-weight:600;">Membros do Projeto</h3>
        </div>

        <!-- Adicionar membro da comunidade -->
        <div style="display:flex;gap:8px;align-items:end;margin-bottom:16px;padding:12px;border:1px solid var(--color-border);border-radius:var(--radius-sm);background:var(--color-gray-050);">
          <select id="sel-add-member" style="flex:1;padding:6px 10px;border:1px solid var(--color-border);border-radius:var(--radius-sm);font-size:0.9rem;">
            <option value="">Adicionar membro da comunidade…</option>
            ${availableOptions}
          </select>
          <button type="button" id="btn-add-member" class="btn" style="padding:6px 12px;font-size:0.85rem;">Adicionar</button>
        </div>

        <div id="lista-membros-projeto" style="display:flex;flex-direction:column;gap:8px;">
          ${membrosHtml || '<p style="color:var(--color-text-muted);font-size:0.9rem;">Nenhum membro.</p>'}
        </div>
      </section>
    </div>
  `;
}

export function afterRenderProjectDetail(projectId) {
  // Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => {
        b.style.borderBottom = 'none';
        b.style.color = 'var(--color-text-muted)';
        b.style.fontWeight = '500';
        b.classList.remove('active-tab');
      });
      btn.style.borderBottom = '2px solid var(--color-primary)';
      btn.style.color = 'var(--color-primary)';
      btn.style.fontWeight = '600';
      btn.classList.add('active-tab');
      document.querySelectorAll('.tab-content').forEach(tc => tc.style.display = 'none');
      document.getElementById('tab-' + btn.dataset.tab).style.display = 'block';
    });
  });

  // Salvar título e descrição
  const btnSalvar = document.getElementById('btn-salvar-info');
  if (btnSalvar) {
    btnSalvar.addEventListener('click', async () => {
      const title = document.getElementById('edit-titulo').value.trim();
      const description = document.getElementById('edit-descricao').value.trim();
      if (!title || !description) return;
      await projectService.update(projectId, { title, description });
      const fb = document.getElementById('save-feedback');
      fb.style.display = 'block';
      setTimeout(() => { fb.style.display = 'none'; }, 2000);
    });
  }

  // Adicionar responsável (entre membros do projeto)
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
