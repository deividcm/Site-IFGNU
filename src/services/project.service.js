import { communityService } from './community.service.js';

/**
 * ProjectService - Projetos referenciam membros da comunidade global por ID.
 */
export class ProjectService {
  constructor() {
    this._nextId = 5;
    this.projects = [
      {
        id: '1',
        title: 'Laboratório de Redes GNU/Linux',
        description: 'Implementação de ambiente de testes e homologação para servidores Linux. O projeto contempla a configuração de VLANs, firewalls com iptables/nftables, serviços DNS e DHCP, além de monitoramento com Zabbix e Grafana. O laboratório atende disciplinas de Redes de Computadores e Sistemas Operacionais.',
        status: 'approved',
        statusLabel: 'Aprovado',
        category: 'Infraestrutura',
        responsaveis: ['1', '2'],
        membros: ['1', '2', '3', '4', '5']
      },
      {
        id: '2',
        title: 'Repositório de Software Livre Acadêmico',
        description: 'Portal de distribuição e documentação de projetos de extensão com código aberto. Utiliza GitLab auto-hospedado, CI/CD com pipelines automatizados e documentação via MkDocs. Integra trabalhos de conclusão de curso, iniciações científicas e projetos de extensão sob licenças livres.',
        status: 'pending',
        statusLabel: 'Em Análise',
        category: 'Desenvolvimento',
        responsaveis: ['6', '7'],
        membros: ['6', '7', '8']
      },
      {
        id: '3',
        title: 'Oficinas Comunitárias de Terminal e Shell',
        description: 'Capacitação introdutória em Linux para discentes ingressantes do IF. Aborda navegação no terminal, permissões, scripting em Bash, gerenciamento de pacotes e introdução ao Git. As oficinas ocorrem semanalmente no laboratório de informática com vagas abertas à comunidade externa.',
        status: 'done',
        statusLabel: 'Concluído',
        category: 'Extensão',
        responsaveis: ['9', '10'],
        membros: ['9', '10', '11', '12', '13', '14']
      },
      {
        id: '4',
        title: 'Migração para LibreOffice nas Salas de Aula',
        description: 'Projeto piloto para substituir suítes proprietárias pelo LibreOffice em laboratórios didáticos. Inclui treinamento docente, criação de templates institucionais e suporte de compatibilidade com formatos legados.',
        status: 'approved',
        statusLabel: 'Aprovado',
        category: 'Extensão',
        responsaveis: ['15', '16'],
        membros: ['15', '16', '17', '18']
      }
    ];
  }

  async getAll() {
    return this.projects.map(p => ({
      ...p,
      membersCount: p.membros.length
    }));
  }

  async getById(id) {
    const p = this.projects.find(p => p.id === id);
    if (!p) return null;
    return { ...p, membersCount: p.membros.length };
  }

  /** Retorna IDs de projetos em que um membro participa */
  async getProjectsForMember(memberId) {
    return this.projects
      .filter(p => p.membros.includes(memberId) || p.responsaveis.includes(memberId))
      .map(p => ({ id: p.id, title: p.title }));
  }

  async create({ title, description, responsaveis, membros }) {
    const allMembros = [...new Set([...responsaveis, ...(membros || [])])];
    const project = {
      id: String(this._nextId++),
      title,
      description,
      status: 'pending',
      statusLabel: 'Em Análise',
      category: 'Geral',
      responsaveis: [...responsaveis],
      membros: allMembros
    };
    this.projects.push(project);
    return project;
  }

  async update(id, data) {
    const p = this.projects.find(p => p.id === id);
    if (!p) return null;
    if (data.title !== undefined) p.title = data.title;
    if (data.description !== undefined) p.description = data.description;
    if (data.responsaveis !== undefined) p.responsaveis = [...data.responsaveis];
    if (data.membros !== undefined) p.membros = [...data.membros];
    // Garante responsáveis sempre em membros
    for (const rId of p.responsaveis) {
      if (!p.membros.includes(rId)) p.membros.push(rId);
    }
    return { ...p, membersCount: p.membros.length };
  }

  async addMember(projectId, memberId) {
    const p = this.projects.find(p => p.id === projectId);
    if (!p || p.membros.includes(memberId)) return p;
    p.membros.push(memberId);
    return { ...p };
  }

  async removeMember(projectId, memberId) {
    const p = this.projects.find(p => p.id === projectId);
    if (!p) return null;
    p.membros = p.membros.filter(id => id !== memberId);
    p.responsaveis = p.responsaveis.filter(id => id !== memberId);
    return { ...p };
  }

  /** Remove membro de TODOS os projetos (usado ao deletar da comunidade) */
  async removeMemberFromAll(memberId) {
    for (const p of this.projects) {
      p.membros = p.membros.filter(id => id !== memberId);
      p.responsaveis = p.responsaveis.filter(id => id !== memberId);
    }
  }

  async getMetrics() {
    const uniqueMembers = new Set();
    this.projects.forEach(p => p.membros.forEach(id => uniqueMembers.add(id)));
    return {
      total: this.projects.length,
      activeMembers: uniqueMembers.size,
      inReview: this.projects.filter(p => p.status === 'pending').length,
      approved: this.projects.filter(p => p.status === 'approved').length
    };
  }
}

export const projectService = new ProjectService();
