import { communityService } from '../services/community.service.js';
import { projectService } from '../services/project.service.js';
import { renderIcon } from '../utils/icons.js';

/**
 * Página Comunidade — CRUD de membros globais do IF GNU.
 * Apresenta projetos vinculados com interface sem emojis e botões fora das seções de input.
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
    const config = {
      'Estudante': { bg: 'var(--color-brand-green-050)', color: 'var(--color-primary)', border: 'var(--color-brand-green-100)' },
      'Servidor': { bg: 'var(--color-status-pending-bg)', color: 'var(--color-status-pending)', border: 'var(--color-status-pending-border)' },
      'Colaborador Externo': { bg: 'var(--color-status-done-bg)', color: 'var(--color-status-done)', border: 'var(--color-status-done-border)' }
    };
    const c = config[v] || { bg: 'var(--color-gray-100)', color: 'var(--color-gray-600)', border: 'var(--color-gray-200)' };
    return `<span class="badge" style="background:${c.bg};color:${c.color};border:1px solid ${c.border};">${v}</span>`;
  };

  const rows = memberRows.map(m => {
    const projLinks = m.projetos.length > 0
      ? m.projetos.map(p => `<a href="#/projetos/${p.id}" style="color:var(--color-primary);text-decoration:none;font-size:0.875rem;font-weight:500;display:inline-flex;align-items:center;gap:4px;">${p.title} ${renderIcon('ExternalLink', { width: 12, height: 12 })}</a>`).join(', ')
      : '<span style="color:var(--color-gray-400);font-size:0.85rem;font-style:italic;">Nenhum projeto vinculado</span>';

    return `
      <tr data-id="${m.id}" class="community-row" style="border-bottom: 1px solid var(--color-border); transition: var(--transition-fast);">
        <td style="padding: 14px 16px; font-weight: 600; color: var(--color-gray-900);">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 32px; height: 32px; border-radius: var(--radius-full); background: var(--color-brand-green-050); border: 1px solid var(--color-brand-green-100); display: flex; align-items: center; justify-content: center; color: var(--color-primary); font-size: 0.8rem; font-weight: 700;">
              ${m.nome.charAt(0).toUpperCase()}
            </div>
            <span>${m.nome}</span>
          </div>
        </td>
        <td style="padding: 14px 16px;">${vinculoBadge(m.vinculo)}</td>
        <td style="padding: 14px 16px;">${projLinks}</td>
        <td style="padding: 14px 16px; text-align: right; white-space: nowrap;">
          <div style="display: inline-flex; gap: 6px;">
            <button class="btn-icon btn-edit-membro" data-id="${m.id}" title="Editar Membro">
              ${renderIcon('Pencil', { width: 16, height: 16, stroke: 'var(--color-primary)' })}
            </button>
            <button class="btn-icon danger btn-delete-membro" data-id="${m.id}" title="Remover Membro">
              ${renderIcon('Trash2', { width: 16, height: 16, stroke: 'var(--color-status-rejected)' })}
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div class="animate-slide-up">
      <header class="page-header">
        <div>
          <h1 class="page-title">
            <span>Comunidade IF GNU</span>
          </h1>
          <p class="page-description">${members.length} membros registrados. Gerencie vínculos institucionais e acompanhe a alocação nos projetos.</p>
        </div>
        <button id="btn-add-membro-global" class="btn btn-primary">
          ${renderIcon('UserPlus', { width: 16, height: 16 })} Adicionar Membro
        </button>
      </header>

      <!-- Painel de Cadastro / Edição -->
      <div id="wrapper-form-membro" style="display: none; margin-bottom: 24px;" class="animate-fade-in">
        <!-- <div> que engloba os campos do membro -->
        <div id="container-campos-membro" class="card" style="padding: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 id="form-membro-titulo" style="font-size: 1.1rem; font-weight: 700; color: var(--color-gray-950);">Adicionar Membro</h3>
          </div>
          
          <input type="hidden" id="inp-membro-id" value="">
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;">
            <div class="form-group" style="margin-bottom: 0;">
              <label for="inp-membro-nome" class="form-label">Nome Completo *</label>
              <input type="text" id="inp-membro-nome" class="form-input" placeholder="Ex: Ada Lovelace">
            </div>
            
            <div class="form-group" style="margin-bottom: 0;">
              <label for="inp-membro-vinculo" class="form-label">Vínculo Institucional *</label>
              <select id="inp-membro-vinculo" class="form-select">
                <option value="">Selecione o vínculo…</option>
                <option value="Estudante">Estudante</option>
                <option value="Servidor">Servidor</option>
                <option value="Colaborador Externo">Colaborador Externo</option>
              </select>
            </div>
          </div>

          <p id="membro-error" style="color: var(--color-status-rejected); font-size: 0.85rem; margin-top: 12px; display: none; font-weight: 500;"></p>
        </div>

        <!-- REQUISITO 4: Botões Salvar e Cancelar posicionados FORA e ABAIXO da <div> dos campos -->
        <div class="form-actions-bar">
          <button type="button" id="btn-cancelar-membro" class="btn btn-secondary">Cancelar</button>
          <button type="button" id="btn-salvar-membro" class="btn btn-primary">
            ${renderIcon('Save', { width: 16, height: 16 })} Salvar Membro
          </button>
        </div>
      </div>

      <!-- Diálogo de confirmação de exclusão -->
      <div id="confirm-delete" class="modal-overlay" style="display: none;">
        <div class="modal-container" style="max-width: 440px; text-align: center;">
          <div style="width: 52px; height: 52px; border-radius: var(--radius-full); background: var(--color-status-rejected-bg); color: var(--color-status-rejected); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
            ${renderIcon('AlertTriangle', { width: 26, height: 26 })}
          </div>
          <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 8px; color: var(--color-gray-950);">Remover Membro?</h3>
          <p id="confirm-delete-nome" style="font-size: 1rem; font-weight: 600; color: var(--color-gray-800); margin-bottom: 6px;"></p>
          <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: 24px; line-height: 1.5;">
            Esta ação desvinculará permanentemente o participante de todos os projetos associados.
          </p>
          <div style="display: flex; gap: 12px; justify-content: center;">
            <button id="btn-confirm-cancel" class="btn btn-secondary">Cancelar</button>
            <button id="btn-confirm-delete" class="btn btn-danger">
              ${renderIcon('Trash2', { width: 16, height: 16 })} Confirmar Remoção
            </button>
          </div>
        </div>
      </div>

      <!-- Tabela de Membros -->
      <section class="card" style="overflow: hidden;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.925rem; text-align: left;">
          <thead>
            <tr style="border-bottom: 1px solid var(--color-border); background: var(--color-gray-050);">
              <th style="padding: 14px 16px; font-weight: 700; color: var(--color-gray-700); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.04em;">Nome</th>
              <th style="padding: 14px 16px; font-weight: 700; color: var(--color-gray-700); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.04em;">Vínculo</th>
              <th style="padding: 14px 16px; font-weight: 700; color: var(--color-gray-700); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.04em;">Projetos em Participação</th>
              <th style="padding: 14px 16px; font-weight: 700; color: var(--color-gray-700); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.04em; text-align: right;">Ações</th>
            </tr>
          </thead>
          <tbody>
            ${rows || '<tr><td colspan="4" style="padding: 32px; color: var(--color-text-muted); text-align: center;">Nenhum membro cadastrado até o momento.</td></tr>'}
          </tbody>
        </table>
      </section>
    </div>

    <style>
      .community-row:hover {
        background: var(--color-gray-050);
      }
    </style>
  `;
}

export function afterRenderCommunity() {
  const wrapperForm = document.getElementById('wrapper-form-membro');
  const btnAdd = document.getElementById('btn-add-membro-global');
  const btnSalvar = document.getElementById('btn-salvar-membro');
  const btnCancelar = document.getElementById('btn-cancelar-membro');
  const errEl = document.getElementById('membro-error');

  if (!wrapperForm) return;

  const resetForm = () => {
    document.getElementById('inp-membro-id').value = '';
    document.getElementById('inp-membro-nome').value = '';
    document.getElementById('inp-membro-vinculo').value = '';
    document.getElementById('form-membro-titulo').textContent = 'Adicionar Membro';
    errEl.style.display = 'none';
    wrapperForm.style.display = 'none';
  };

  // Abrir formulário para inclusão
  btnAdd.addEventListener('click', () => {
    resetForm();
    wrapperForm.style.display = 'block';
    document.getElementById('inp-membro-nome').focus();
  });

  btnCancelar.addEventListener('click', resetForm);

  // Salvar (criação ou edição)
  btnSalvar.addEventListener('click', async () => {
    const id = document.getElementById('inp-membro-id').value;
    const nome = document.getElementById('inp-membro-nome').value.trim();
    const vinculo = document.getElementById('inp-membro-vinculo').value;
    if (!nome || !vinculo) {
      errEl.textContent = 'Por favor, preencha o nome completo e selecione o vínculo.';
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

  // Editar membro existente
  document.querySelectorAll('.btn-edit-membro').forEach(btn => {
    btn.addEventListener('click', async () => {
      const member = await communityService.getById(btn.dataset.id);
      if (!member) return;
      wrapperForm.style.display = 'block';
      document.getElementById('form-membro-titulo').textContent = 'Editar Informações do Membro';
      document.getElementById('inp-membro-id').value = member.id;
      document.getElementById('inp-membro-nome').value = member.nome;
      document.getElementById('inp-membro-vinculo').value = member.vinculo;
      document.getElementById('inp-membro-nome').focus();
    });
  });

  // Excluir membro com modal de confirmação
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
