import { communityService } from '../services/community.service.js';
import { projectService } from '../services/project.service.js';

/**
 * Página Comunidade — CRUD completo de membros globais do IF GNU.
 * Mostra em quais projetos cada membro participa.
 */
export async function renderCommunity() {
  const members = await communityService.getAll();

  // Mapear projetos de cada membro
  const memberRows = [];
  for (const m of members) {
    const projs = await projectService.getProjectsForMember(m.id);
    memberRows.push({ ...m, projetos: projs });
  }

  const vinculoBadge = (v) => {
    const colors = {
      'Estudante': 'var(--color-brand-green-500)',
      'Servidor': 'var(--color-status-pending)',
      'Colaborador Externo': 'var(--color-status-done)'
    };
    return `<span style="font-size:0.75rem;font-weight:600;color:#fff;background:${colors[v] || 'var(--color-gray-400)'};padding:2px 8px;border-radius:var(--radius-sm);">${v}</span>`;
  };

  const rows = memberRows.map(m => {
    const projLinks = m.projetos.length > 0
      ? m.projetos.map(p => `<a href="#/projetos/${p.id}" style="color:var(--color-primary);text-decoration:none;font-size:0.85rem;">${p.title}</a>`).join(', ')
      : '<span style="color:var(--color-gray-400);font-size:0.85rem;font-style:italic;">Nenhum projeto</span>';
    return `
      <tr data-id="${m.id}">
        <td style="padding:10px 12px;font-weight:500;">${m.nome}</td>
        <td style="padding:10px 12px;">${vinculoBadge(m.vinculo)}</td>
        <td style="padding:10px 12px;">${projLinks}</td>
        <td style="padding:10px 12px;white-space:nowrap;">
          <button class="btn-edit-membro" data-id="${m.id}" style="background:none;border:none;cursor:pointer;font-size:0.9rem;color:var(--color-primary);font-weight:600;margin-right:8px;" title="Editar">✏️</button>
          <button class="btn-delete-membro" data-id="${m.id}" style="background:none;border:none;cursor:pointer;font-size:0.9rem;color:var(--color-status-rejected);font-weight:600;" title="Remover">🗑️</button>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <header style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
      <div>
        <h1 style="font-size:1.875rem;font-weight:700;color:var(--color-gray-950);">👥 Comunidade IF GNU</h1>
        <p style="color:var(--color-text-muted);font-size:0.95rem;margin-top:4px;">${members.length} membros registrados. Gerencie vínculos e veja participação em projetos.</p>
      </div>
      <button id="btn-add-membro-global" class="btn" style="font-size:0.9rem;">+ Adicionar Membro</button>
    </header>

    <!-- Form Adicionar / Editar (oculto) -->
    <div id="form-membro-global" style="display:none;background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-md);padding:20px;margin-bottom:20px;">
      <h3 id="form-membro-titulo" style="font-size:1rem;font-weight:600;margin-bottom:12px;">Adicionar Membro</h3>
      <input type="hidden" id="inp-membro-id" value="">
      <div style="display:flex;gap:12px;align-items:end;flex-wrap:wrap;">
        <label style="display:flex;flex-direction:column;gap:4px;flex:1;min-width:180px;">
          <span style="font-size:0.85rem;font-weight:500;">Nome *</span>
          <input type="text" id="inp-membro-nome" style="padding:8px 10px;border:1px solid var(--color-border);border-radius:var(--radius-sm);font-size:0.9rem;">
        </label>
        <label style="display:flex;flex-direction:column;gap:4px;">
          <span style="font-size:0.85rem;font-weight:500;">Vínculo *</span>
          <select id="inp-membro-vinculo" style="padding:8px 10px;border:1px solid var(--color-border);border-radius:var(--radius-sm);font-size:0.9rem;">
            <option value="">Selecione…</option>
            <option value="Estudante">Estudante</option>
            <option value="Servidor">Servidor</option>
            <option value="Colaborador Externo">Colaborador Externo</option>
          </select>
        </label>
        <button type="button" id="btn-salvar-membro" class="btn" style="padding:8px 16px;">Salvar</button>
        <button type="button" id="btn-cancelar-membro" style="padding:8px 16px;border-radius:var(--radius-sm);border:1px solid var(--color-border);background:var(--color-surface);cursor:pointer;font-weight:500;">Cancelar</button>
      </div>
      <p id="membro-error" style="color:var(--color-status-rejected);font-size:0.8rem;margin-top:8px;display:none;"></p>
    </div>

    <!-- Confirmação de remoção -->
    <div id="confirm-delete" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;align-items:center;justify-content:center;">
      <div style="background:var(--color-surface);border-radius:var(--radius-lg);padding:28px;width:90%;max-width:420px;box-shadow:var(--shadow-md);text-align:center;">
        <p style="font-size:1rem;margin-bottom:8px;font-weight:600;">Remover membro?</p>
        <p id="confirm-delete-nome" style="font-size:0.9rem;color:var(--color-text-muted);margin-bottom:20px;"></p>
        <p style="font-size:0.85rem;color:var(--color-status-rejected);margin-bottom:20px;">O membro será removido de todos os projetos.</p>
        <div style="display:flex;gap:12px;justify-content:center;">
          <button id="btn-confirm-cancel" style="padding:8px 20px;border-radius:var(--radius-sm);border:1px solid var(--color-border);background:var(--color-surface);cursor:pointer;font-weight:500;">Cancelar</button>
          <button id="btn-confirm-delete" class="btn" style="padding:8px 20px;background:var(--color-status-rejected);">Remover</button>
        </div>
      </div>
    </div>

    <section style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-md);overflow:hidden;">
      <table style="width:100%;border-collapse:collapse;font-size:0.9rem;">
        <thead>
          <tr style="text-align:left;border-bottom:2px solid var(--color-border);background:var(--color-gray-050);">
            <th style="padding:12px;">Nome</th>
            <th style="padding:12px;">Vínculo</th>
            <th style="padding:12px;">Projetos</th>
            <th style="padding:12px;width:100px;">Ações</th>
          </tr>
        </thead>
        <tbody>
          ${rows || '<tr><td colspan="4" style="padding:20px;color:var(--color-text-muted);text-align:center;">Nenhum membro cadastrado.</td></tr>'}
        </tbody>
      </table>
    </section>
  `;
}

export function afterRenderCommunity() {
  const formEl = document.getElementById('form-membro-global');
  const btnAdd = document.getElementById('btn-add-membro-global');
  const btnSalvar = document.getElementById('btn-salvar-membro');
  const btnCancelar = document.getElementById('btn-cancelar-membro');
  const errEl = document.getElementById('membro-error');

  if (!formEl) return;

  const resetForm = () => {
    document.getElementById('inp-membro-id').value = '';
    document.getElementById('inp-membro-nome').value = '';
    document.getElementById('inp-membro-vinculo').value = '';
    document.getElementById('form-membro-titulo').textContent = 'Adicionar Membro';
    errEl.style.display = 'none';
    formEl.style.display = 'none';
  };

  // Adicionar
  btnAdd.addEventListener('click', () => {
    resetForm();
    formEl.style.display = 'block';
  });

  btnCancelar.addEventListener('click', resetForm);

  // Salvar (create ou update)
  btnSalvar.addEventListener('click', async () => {
    const id = document.getElementById('inp-membro-id').value;
    const nome = document.getElementById('inp-membro-nome').value.trim();
    const vinculo = document.getElementById('inp-membro-vinculo').value;
    if (!nome || !vinculo) {
      errEl.textContent = 'Preencha nome e vínculo.';
      errEl.style.display = 'block';
      return;
    }
    if (id) {
      await communityService.update(id, { nome, vinculo });
    } else {
      await communityService.create({ nome, vinculo });
    }
    await reRenderCommunity();
  });

  // Editar
  document.querySelectorAll('.btn-edit-membro').forEach(btn => {
    btn.addEventListener('click', async () => {
      const member = await communityService.getById(btn.dataset.id);
      if (!member) return;
      formEl.style.display = 'block';
      document.getElementById('form-membro-titulo').textContent = 'Editar Membro';
      document.getElementById('inp-membro-id').value = member.id;
      document.getElementById('inp-membro-nome').value = member.nome;
      document.getElementById('inp-membro-vinculo').value = member.vinculo;
    });
  });

  // Deletar — confirmação
  let deleteTargetId = null;
  const confirmEl = document.getElementById('confirm-delete');

  document.querySelectorAll('.btn-delete-membro').forEach(btn => {
    btn.addEventListener('click', async () => {
      deleteTargetId = btn.dataset.id;
      const member = await communityService.getById(deleteTargetId);
      document.getElementById('confirm-delete-nome').textContent = member ? member.nome : '';
      confirmEl.style.display = 'flex';
    });
  });

  document.getElementById('btn-confirm-cancel').addEventListener('click', () => {
    confirmEl.style.display = 'none';
    deleteTargetId = null;
  });

  document.getElementById('btn-confirm-delete').addEventListener('click', async () => {
    if (deleteTargetId) {
      await projectService.removeMemberFromAll(deleteTargetId);
      await communityService.remove(deleteTargetId);
    }
    confirmEl.style.display = 'none';
    deleteTargetId = null;
    await reRenderCommunity();
  });
}

async function reRenderCommunity() {
  const el = document.getElementById('router-view');
  el.innerHTML = await renderCommunity();
  afterRenderCommunity();
}
