import { projectService } from '../services/project.service.js';
import { communityService } from '../services/community.service.js';

/**
 * Controller/View de Projetos — listagem + modal de criação.
 * Responsáveis e membros são selecionados da comunidade global.
 */
export async function renderProjects() {
  const projects = await projectService.getAll();

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'var(--color-status-approved)';
      case 'pending': return 'var(--color-status-pending)';
      case 'done': return 'var(--color-status-done)';
      default: return 'var(--color-status-draft)';
    }
  };

  const cardsHtml = projects.map(p => `
    <article style="
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      box-shadow: var(--shadow-sm);
    ">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
        <span style="
          font-size: 0.75rem; font-weight: 600; text-transform: uppercase;
          color: var(--color-gray-600); background: var(--color-gray-100);
          padding: 2px 8px; border-radius: var(--radius-sm);
        ">${p.category}</span>
        <span style="
          font-size: 0.8rem; font-weight: 600;
          color: ${getStatusColor(p.status)};
          display: inline-flex; align-items: center; gap: 4px;
        ">● ${p.statusLabel}</span>
      </div>
      <h2 style="font-size: 1.15rem; font-weight: 600; color: var(--color-gray-950);">${p.title}</h2>
      <p style="font-size: 0.9rem; color: var(--color-text-muted); line-height: 1.4; flex: 1;">${p.description.substring(0, 120)}…</p>
      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--color-gray-100); padding-top: 12px; margin-top: 4px; font-size: 0.85rem; color: var(--color-text-muted);">
        <span>👥 ${p.membersCount} participantes</span>
        <a href="#/projetos/${p.id}" class="btn" style="padding: 6px 12px; font-size: 0.85rem;">Detalhes</a>
      </div>
    </article>
  `).join('');

  // Opções da comunidade para selects
  const members = await communityService.getAll();
  const memberOptions = members.map(m => `<option value="${m.id}">${m.nome} — ${m.vinculo}</option>`).join('');

  return `
    <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
      <div>
        <h1 style="font-size: 1.875rem; font-weight: 700; color: var(--color-gray-950);">Gestão de Projetos</h1>
        <p style="color: var(--color-text-muted); font-size: 0.95rem; margin-top: 4px;">Iniciativas de software livre, pesquisa e extensão.</p>
      </div>
      <button class="btn" id="btn-novo-projeto" style="font-size: 0.9rem;">+ Novo Projeto</button>
    </header>

    <section style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
      ${cardsHtml}
    </section>

    <!-- Modal Criar Projeto -->
    <div id="modal-criar-projeto" style="
      display: none; position: fixed; inset: 0;
      background: rgba(0,0,0,0.5); z-index: 1000;
      align-items: center; justify-content: center;
    ">
      <div style="
        background: var(--color-surface); border-radius: var(--radius-lg);
        padding: 32px; width: 90%; max-width: 560px;
        max-height: 90vh; overflow-y: auto; box-shadow: var(--shadow-md);
      ">
        <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 20px; color: var(--color-gray-950);">Criar Novo Projeto</h2>
        <form id="form-criar-projeto" style="display: flex; flex-direction: column; gap: 16px;">

          <label style="display:flex;flex-direction:column;gap:4px;">
            <span style="font-weight:600;font-size:0.9rem;">Nome do Projeto *</span>
            <input type="text" id="inp-titulo" required style="padding:8px 12px;border:1px solid var(--color-border);border-radius:var(--radius-sm);font-size:0.95rem;">
          </label>

          <label style="display:flex;flex-direction:column;gap:4px;">
            <span style="font-weight:600;font-size:0.9rem;">Descrição *</span>
            <textarea id="inp-descricao" required rows="3" style="padding:8px 12px;border:1px solid var(--color-border);border-radius:var(--radius-sm);font-size:0.95rem;resize:vertical;"></textarea>
          </label>

          <fieldset style="border:1px solid var(--color-border);border-radius:var(--radius-sm);padding:16px;">
            <legend style="font-weight:600;font-size:0.9rem;padding:0 4px;">Responsáveis * (da comunidade)</legend>
            <div id="lista-responsaveis" style="display:flex;flex-direction:column;gap:6px;margin-bottom:12px;"></div>
            <div style="display:flex;gap:8px;align-items:end;">
              <select id="sel-responsavel" style="flex:1;padding:6px 10px;border:1px solid var(--color-border);border-radius:var(--radius-sm);font-size:0.9rem;">
                <option value="">Selecionar membro…</option>
                ${memberOptions}
              </select>
              <button type="button" id="btn-add-resp" class="btn" style="padding:6px 12px;font-size:0.85rem;">Adicionar</button>
            </div>
            <p id="resp-error" style="color:var(--color-status-rejected);font-size:0.8rem;margin-top:6px;display:none;"></p>
          </fieldset>

          <div style="display:flex;gap:12px;justify-content:flex-end;margin-top:8px;">
            <button type="button" id="btn-cancelar-projeto" style="padding:8px 16px;border-radius:var(--radius-sm);border:1px solid var(--color-border);background:var(--color-surface);cursor:pointer;font-weight:500;">Cancelar</button>
            <button type="submit" class="btn" style="padding:8px 20px;">Criar Projeto</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

export function afterRenderProjects() {
  const modal = document.getElementById('modal-criar-projeto');
  const btnAbrir = document.getElementById('btn-novo-projeto');
  const btnCancelar = document.getElementById('btn-cancelar-projeto');
  const form = document.getElementById('form-criar-projeto');
  const btnAddResp = document.getElementById('btn-add-resp');
  const listaResp = document.getElementById('lista-responsaveis');
  const respError = document.getElementById('resp-error');

  if (!modal) return;

  const selectedResps = []; // { id, nome, vinculo }

  const renderResp = () => {
    listaResp.innerHTML = selectedResps.map((r, i) => `
      <div style="display:flex;align-items:center;gap:8px;padding:6px 10px;background:var(--color-gray-100);border-radius:var(--radius-sm);">
        <span style="flex:1;font-size:0.9rem;">${r.nome}</span>
        <span style="font-size:0.8rem;color:var(--color-text-muted);background:var(--color-surface);padding:2px 8px;border-radius:var(--radius-sm);">${r.vinculo}</span>
        <button type="button" data-idx="${i}" class="btn-rm-resp" style="background:none;border:none;cursor:pointer;color:var(--color-status-rejected);font-weight:700;font-size:1rem;">×</button>
      </div>
    `).join('');
    listaResp.querySelectorAll('.btn-rm-resp').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedResps.splice(Number(btn.dataset.idx), 1);
        renderResp();
      });
    });
  };

  btnAbrir.addEventListener('click', () => { modal.style.display = 'flex'; });
  btnCancelar.addEventListener('click', () => { modal.style.display = 'none'; });
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

  btnAddResp.addEventListener('click', async () => {
    const sel = document.getElementById('sel-responsavel');
    const memberId = sel.value;
    if (!memberId) {
      respError.textContent = 'Selecione um membro da comunidade.';
      respError.style.display = 'block';
      return;
    }
    if (selectedResps.find(r => r.id === memberId)) {
      respError.textContent = 'Membro já adicionado.';
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
