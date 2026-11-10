export class AppSidebar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <aside style="
        width: 240px;
        background: #fff;
        border-right: 1px solid var(--color-gray-200);
        display: flex;
        flex-direction: column;
        padding: 24px 16px;
      ">
        <div style="font-size: 1.25rem; font-weight: bold; color: var(--color-brand-green-500); margin-bottom: 32px;">
          🐧 IF GNU
        </div>
        <nav style="display: flex; flex-direction: column; gap: 8px;">
          <a href="#/" class="nav-item">📊 Dashboard</a>
          <a href="#/projetos" class="nav-item">📁 Projetos</a>
          <a href="#/comunidade" class="nav-item">👥 Comunidade</a>
        </nav>
      </aside>
      <style>
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 6px;
          color: var(--color-gray-800);
          text-decoration: none;
          font-weight: 500;
          transition: background 0.2s;
        }
        .nav-item:hover {
          background: var(--color-brand-green-050);
          color: var(--color-brand-green-500);
        }
      </style>
    `;
  }
}
customElements.define('app-sidebar', AppSidebar);
