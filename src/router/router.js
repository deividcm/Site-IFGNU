/**
 * Client-Side Router
 * Responsabilidade: Escutar mudanças de hash e renderizar a rota correspondente.
 * Suporta views síncronas e assíncronas (Promises).
 * Suporta rotas com parâmetros dinâmicos (ex: /projetos/:id).
 */
export class Router {
  constructor(routes, rootElement) {
    this.routes = routes;
    this.rootElement = rootElement;
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());
  }

  matchRoute(hash) {
    // Try exact match first
    if (this.routes[hash]) {
      return { handler: this.routes[hash], params: {} };
    }
    // Try parameterized routes
    for (const pattern of Object.keys(this.routes)) {
      if (!pattern.includes(':')) continue;
      const patternParts = pattern.split('/');
      const hashParts = hash.split('/');
      if (patternParts.length !== hashParts.length) continue;

      const params = {};
      let match = true;
      for (let i = 0; i < patternParts.length; i++) {
        if (patternParts[i].startsWith(':')) {
          params[patternParts[i].slice(1)] = hashParts[i];
        } else if (patternParts[i] !== hashParts[i]) {
          match = false;
          break;
        }
      }
      if (match) return { handler: this.routes[pattern], params };
    }
    return null;
  }

  async handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    const matched = this.matchRoute(hash);
    const route = matched || (this.routes['/404'] ? { handler: this.routes['/404'], params: {} } : null);

    if (route) {
      try {
        const result = await route.handler.render(route.params);
        this.rootElement.innerHTML = result;
        if (route.handler.afterRender) {
          route.handler.afterRender(route.params);
        }
      } catch (err) {
        console.error('Erro ao renderizar rota:', err);
        this.rootElement.innerHTML = `<p style="color: var(--color-status-rejected);">Erro ao carregar a página.</p>`;
      }
    }
  }
}
