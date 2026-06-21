// Ícones decorativos por categoria — só apresentação visual.
// As categorias em si vêm sempre da API (TheMealDB), nada aqui é inventado.
const CATEGORY_ICONS: Record<string, string> = {
  Beef: '🥩',
  Breakfast: '🍳',
  Chicken: '🍗',
  Dessert: '🍰',
  Goat: '🐐',
  Lamb: '🍖',
  Miscellaneous: '🍽️',
  Pasta: '🍝',
  Pork: '🥓',
  Seafood: '🦐',
  Side: '🥗',
  Starter: '🥟',
  Vegan: '🌱',
  Vegetarian: '🥦'
};

const DEFAULT_ICON = '🍴';

export function getCategoryIcon(category: string | undefined): string {
  if (!category) return DEFAULT_ICON;
  return CATEGORY_ICONS[category] || DEFAULT_ICON;
}
