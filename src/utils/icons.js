import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Pencil,
  Trash2,
  Save,
  Plus,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  X,
  AlertTriangle,
  Info,
  UserPlus,
  UserCheck,
  ExternalLink,
  Search
} from 'lucide';

const iconMap = {
  LayoutDashboard,
  FolderKanban,
  Users,
  Pencil,
  Trash2,
  Save,
  Plus,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  X,
  AlertTriangle,
  Info,
  UserPlus,
  UserCheck,
  ExternalLink,
  Search
};

/**
 * Utilitário de Ícones SVG Lucide Otimizado
 * Renderiza SVGs inline limpos com tree-shaking habilitado.
 */
export function renderIcon(name, customAttrs = {}) {
  const iconDef = iconMap[name];
  if (!iconDef) {
    console.warn(`[Icons] Ícone não encontrado: ${name}`);
    return '';
  }

  const mergedAttrs = {
    xmlns: 'http://www.w3.org/2000/svg',
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    ...customAttrs
  };

  const attrString = Object.entries(mergedAttrs)
    .filter(([_, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${k}="${v}"`)
    .join(' ');

  const children = iconDef
    .map(([tag, elAttrs]) => {
      const elAttrString = Object.entries(elAttrs)
        .map(([k, v]) => `${k}="${v}"`)
        .join(' ');
      return `<${tag} ${elAttrString}></${tag}>`;
    })
    .join('');

  return `<svg ${attrString}>${children}</svg>`;
}
