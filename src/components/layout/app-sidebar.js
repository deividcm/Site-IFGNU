import { renderIcon } from '../../utils/icons.js';

export class AppSidebar extends HTMLElement {
  connectedCallback() {
    this.render();
    window.addEventListener('hashchange', () => this.updateActiveLink());
    this.updateActiveLink();
  }

  updateActiveLink() {
    const currentHash = window.location.hash || '#/';
    const links = this.querySelectorAll('.nav-item');
    links.forEach(link => {
      const href = link.getAttribute('href');
      const isActive = href === '#/' 
        ? (currentHash === '#/' || currentHash === '' || currentHash === '#')
        : currentHash.startsWith(href);
      if (isActive) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  render() {
    this.innerHTML = `
      <aside class="sidebar-container">
        <div class="sidebar-brand">
          <img src="/penguim.png" alt="IF GNU Mascote" class="brand-penguin-img" />
          <div class="brand-text-container">
            <span class="brand-title">IF GNU</span>
            <span class="brand-subtitle">Software Livre</span>
          </div>
        </div>

        <nav class="sidebar-nav">
          <a href="#/" class="nav-item">
            <span class="nav-icon">${renderIcon('LayoutDashboard', { width: 19, height: 19 })}</span>
            <span class="nav-label">Dashboard</span>
          </a>
          <a href="#/projetos" class="nav-item">
            <span class="nav-icon">${renderIcon('FolderKanban', { width: 19, height: 19 })}</span>
            <span class="nav-label">Projetos</span>
          </a>
          <a href="#/comunidade" class="nav-item">
            <span class="nav-icon">${renderIcon('Users', { width: 19, height: 19 })}</span>
            <span class="nav-label">Comunidade</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <span class="sidebar-version">v1.2.0 • Open Source</span>
        </div>
      </aside>

      <style>
        .sidebar-container {
          width: 250px;
          min-height: 100vh;
          background: var(--color-surface);
          border-right: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          padding: 24px 16px;
          flex-shrink: 0;
          transition: var(--transition-normal);
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          margin-bottom: 28px;
          border-radius: var(--radius-md);
          background: var(--color-brand-green-050);
          border: 1px solid var(--color-brand-green-100);
        }

        .brand-text-container {
          display: flex;
          flex-direction: column;
        }

        .brand-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--color-brand-green-900);
          line-height: 1.15;
          letter-spacing: -0.01em;
        }

        .brand-subtitle {
          font-size: 0.725rem;
          font-weight: 600;
          color: var(--color-primary);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          color: var(--color-gray-700);
          text-decoration: none;
          font-weight: 500;
          font-size: 0.925rem;
          transition: var(--transition-normal);
          position: relative;
        }

        .nav-item .nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-gray-500);
          transition: var(--transition-fast);
        }

        .nav-item:hover {
          background: var(--color-gray-100);
          color: var(--color-gray-950);
          transform: translateX(2px);
        }

        .nav-item:hover .nav-icon {
          color: var(--color-primary);
        }

        .nav-item.active {
          background: var(--color-brand-green-050);
          color: var(--color-primary);
          font-weight: 600;
        }

        .nav-item.active .nav-icon {
          color: var(--color-primary);
        }

        .nav-item.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 6px;
          bottom: 6px;
          width: 3.5px;
          border-radius: 0 4px 4px 0;
          background: var(--color-primary);
        }

        .sidebar-footer {
          padding-top: 16px;
          border-top: 1px solid var(--color-border-subtle);
          text-align: center;
        }

        .sidebar-version {
          font-size: 0.75rem;
          color: var(--color-gray-400);
          font-weight: 500;
        }
      </style>
    `;
  }
}

customElements.define('app-sidebar', AppSidebar);
