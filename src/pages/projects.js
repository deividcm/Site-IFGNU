import { projectService } from '../services/project.service.js';
import { communityService } from '../services/community.service.js';
import { renderIcon } from '../utils/icons.js';

/**
 * Controller/View de Projetos — listagem + modal de criação.
 * Responsáveis e membros são selecionados da comunidade global.
 */
export async function renderProjects() {
  const projects = await projectService.getAll();

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

  const cardsHtml = projects.map(p => `
    <article class="card interactive-card animate-slide-up" style="
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      height: 100%;
    ">
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
        <span class="badge" style="
          background: var(--color-gray-100);
          color: var(--color-gray-700);
          border: 1px solid var(--color-gray-200);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          font-size: 0.7rem;
        ">${p.category}</span>
        ${getStatusBadge(p.status, p.statusLabel)}
      </div>

      <h2 style="font-size: 1.15rem; font-weight: 700; color: var(--color-gray-950); line-height: 1.35; margin-top: 2px;">
        ${p.title}
      </h2>

      <p style="font-size: 0.9rem; color: var(--color-text-muted); line-height: 1.5; flex: 1;">
        ${p.description.substring(0, 130)}…
      </p>

      <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid var(--color-border);
        padding-top: 16px;
        margin-top: 4px;
      ">
        <span style="font-size: 0.85rem; color: var(--color-text-muted); font-weight: 500; display: inline-flex; align-items: center; gap: 6px;">
          ${renderIcon('Users', { width: 16, height: 16, stroke: 'var(--color-gray-500)' })}
          ${p.membersCount} participantes
        </span>
        <a href="#/projetos/${p.id}" class="btn btn-secondary" style="padding: 6px 14px; font-size: 0.85rem;">
          Detalhes ${renderIcon('ArrowRight', { width: 14, height: 14 })}
        </a>
      </div>
    </article>
  `).join('');

  // Opções da comunidade para selects
  const members = await communityService.getAll();
  const memberOptions = members.map(m => `<option value="${m.id}">${m.nome} — ${m.vinculo}</option>`).join('');

  return `
    <div class="animate-slide-up">
      <header class="page-header">
        <div>
          <h1 class="page-title">
            <span>Gestão de Projetos</span>
          </h1>
          <p class="page-description">Iniciativas de software livre, pesquisa acadêmica e projetos de extensão do IF GNU.</p>
        </div>
        <button class="btn btn-primary" id="btn-novo-projeto">
          ${renderIcon('Plus', { width: 16, height: 16 })} Novo Projeto
        </button>
      </header>

      <section style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px;">
        ${cardsHtml}
      </section>

      <!-- Modal Criar Projeto -->
      <div id="modal-criar-projeto" class="modal-overlay" style="display: none;">
        <div class="modal-container">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px;">
            <h2 style="font-size: 1.35rem; font-weight: 700; color: var(--color-gray-950);">Criar Novo Projeto</h2>
            <button type="button" id="btn-fechar-modal" class="btn-icon" title="Fechar">
              ${renderIcon('X', { width: 20, height: 20 })}
            </button>
          </div>

          <form id="form-criar-projeto" style="display: flex; flex-direction: column; gap: 18px;">
            <div class="form-group" style="margin-bottom: 0;">
              <label for="inp-titulo" class="form-label">Nome do Projeto *</label>
              <input type="text" id="inp-titulo" required class="form-input" placeholder="Ex: Plataforma GNU Acadêmica">
            </div>

            <div class="form-group" style="margin-bottom: 0;">
              <label for="inp-descricao" class="form-label">Descrição *</label>
              <textarea id="inp-descricao" required rows="3" class="form-textarea" placeholder="Descreva os objetivos e tecnologias..."></textarea>
            </div>

            <fieldset style="border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 18px; background: var(--color-gray-050);">
              <legend style="font-weight: 600; font-size: 0.875rem; color: var(--color-gray-800); padding: 0 8px; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-xs);">
                Responsáveis do Projeto *
              </legend>
              <div id="lista-responsaveis" style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px;"></div>
              
              <div style="display: flex; gap: 8px; align-items: center;">
                <select id="sel-responsavel" class="form-select" style="flex: 1;">
                  <option value="">Selecionar membro da comunidade…</option>
                  ${memberOptions}
                </select>
                <button type="button" id="btn-add-resp" class="btn btn-secondary" style="padding: 9px 14px;">
                  ${renderIcon('Plus', { width: 15, height: 15 })} Incluir
                </button>
              </div>
              <p id="resp-error" style="color: var(--color-status-rejected); font-size: 0.825rem; margin-top: 8px; display: none; font-weight: 500;"></p>
            </fieldset>

            <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px; padding-top: 16px; border-top: 1px solid var(--color-border);">
              <button type="button" id="btn-cancelar-projeto" class="btn btn-secondary">Cancelar</button>
              <button type="submit" class="btn btn-primary">
                ${renderIcon('Plus', { width: 16, height: 16 })} Criar Projeto
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
}

export function afterRenderProjects() {
  const modal = document.getElementById('modal-criar-projeto');
  const btnAbrir = document.getElementById('btn-novo-projeto');
  const btnCancelar = document.getElementById('btn-cancelar-projeto');
  const btnFechar = document.getElementById('btn-fechar-modal');
  const form = document.getElementById('form-criar-projeto');
  const btnAddResp = document.getElementById('btn-add-resp');
  const listaResp = document.getElementById('lista-responsaveis');
  const respError = document.getElementById('resp-error');

  if (!modal) return;

  const selectedResps = []; // { id, nome, vinculo }

  const renderResp = () => {
    listaResp.innerHTML = selectedResps.map((r, i) => `
      <div style="
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        animation: fadeIn 0.2s ease;
      ">
        <span style="flex: 1; font-size: 0.9rem; font-weight: 500; color: var(--color-gray-900);">${r.nome}</span>
        <span class="badge" style="background: var(--color-brand-green-050); color: var(--color-primary); border: 1px solid var(--color-brand-green-100);">${r.vinculo}</span>
        <button type="button" data-idx="${i}" class="btn-icon danger btn-rm-resp" title="Remover" style="padding: 4px;">
          ${renderIcon('X', { width: 16, height: 16 })}
        </button>
      </div>
    `).join('');

    listaResp.querySelectorAll('.btn-rm-resp').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedResps.splice(Number(btn.dataset.idx), 1);
        renderResp();
      });
    });
  };

  const fecharModal = () => { modal.style.display = 'none'; };

  btnAbrir.addEventListener('click', () => { modal.style.display = 'flex'; });
  btnCancelar.addEventListener('click', fecharModal);
  if (btnFechar) btnFechar.addEventListener('click', fecharModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) fecharModal(); });

  btnAddResp.addEventListener('click', async () => {
    const sel = document.getElementById('sel-responsavel');
    const memberId = sel.value;
    if (!memberId) {
      respError.textContent = 'Selecione um membro da comunidade.';
      respError.style.display = 'block';
      return;
    }
    if (selectedResps.find(r => r.id === memberId)) {
      respError.textContent = 'Membro já adicionado aos responsáveis.';
      respError.style.display = 'block';
      return;
    }
    respError.style.display = 'none';
    const member = await communityService.getById(memberId);
    if (member) {
      selectedResps.push({ id: member.id, nome: member.nome, vinculo: member.vinculo });
      sel.value = '';
      renderResp();
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('inp-titulo').value.trim();
    const description = document.getElementById('inp-descricao').value.trim();
    if (!title || !description) return;
    if (selectedResps.length === 0) {
      respError.textContent = 'Adicione ao menos um responsável.';
      respError.style.display = 'block';
      return;
    }
    await projectService.create({
      title,
      description,
      responsaveis: selectedResps.map(r => r.id),
      membros: selectedResps.map(r => r.id)
    });
    modal.style.display = 'none';
    // Re-render
    const contentEl = document.getElementById('router-view');
    contentEl.innerHTML = await renderProjects();
    afterRenderProjects();
  });
}
