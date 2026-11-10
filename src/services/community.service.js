/**
 * CommunityService - Registro global de membros do IF GNU.
 * Membros existem aqui antes de serem vinculados a qualquer projeto.
 */
export class CommunityService {
  constructor() {
    this._nextId = 19;
    this.members = [
      { id: '1',  nome: 'Prof. Carlos Eduardo',  vinculo: 'Servidor' },
      { id: '2',  nome: 'Ana Beatriz Souza',      vinculo: 'Estudante' },
      { id: '3',  nome: 'Ricardo Mendes',          vinculo: 'Colaborador Externo' },
      { id: '4',  nome: 'Lucas Ferreira',          vinculo: 'Estudante' },
      { id: '5',  nome: 'Mariana Costa',            vinculo: 'Estudante' },
      { id: '6',  nome: 'Prof.ª Juliana Alves',    vinculo: 'Servidor' },
      { id: '7',  nome: 'Pedro Henrique Lima',      vinculo: 'Estudante' },
      { id: '8',  nome: 'Camila Rodrigues',         vinculo: 'Estudante' },
      { id: '9',  nome: 'Prof. Marcos Vinícius',    vinculo: 'Servidor' },
      { id: '10', nome: 'Larissa Fernandes',        vinculo: 'Estudante' },
      { id: '11', nome: 'Diego Oliveira',           vinculo: 'Estudante' },
      { id: '12', nome: 'Fernanda Martins',         vinculo: 'Estudante' },
      { id: '13', nome: 'João Gabriel',             vinculo: 'Estudante' },
      { id: '14', nome: 'Renata Duarte',            vinculo: 'Colaborador Externo' },
      { id: '15', nome: 'Prof.ª Sandra Regina',     vinculo: 'Servidor' },
      { id: '16', nome: 'Thiago Barros',            vinculo: 'Colaborador Externo' },
      { id: '17', nome: 'Isabela Moreira',           vinculo: 'Estudante' },
      { id: '18', nome: 'Felipe Nascimento',         vinculo: 'Estudante' }
    ];
  }

  async getAll() {
    return [...this.members];
  }

  async getById(id) {
    return this.members.find(m => m.id === id) || null;
  }

  async getByIds(ids) {
    return this.members.filter(m => ids.includes(m.id));
  }

  async create({ nome, vinculo }) {
    const member = { id: String(this._nextId++), nome, vinculo };
    this.members.push(member);
    return member;
  }

  async update(id, { nome, vinculo }) {
    const member = this.members.find(m => m.id === id);
    if (!member) return null;
    if (nome !== undefined) member.nome = nome;
    if (vinculo !== undefined) member.vinculo = vinculo;
    return { ...member };
  }

  async remove(id) {
    const idx = this.members.findIndex(m => m.id === id);
    if (idx === -1) return false;
    this.members.splice(idx, 1);
    return true;
  }
}

export const communityService = new CommunityService();
