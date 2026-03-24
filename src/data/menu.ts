import { MenuItem, Category } from '../types';

export const categories: Category[] = [
  { id: 'starters', name: 'Entradas', icon: 'Utensils' },
  { id: 'main', name: 'Pratos Principais', icon: 'Beef' },
  { id: 'drinks', name: 'Bebidas', icon: 'Coffee' },
  { id: 'desserts', name: 'Sobremesas', icon: 'IceCream' },
];

export const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Bruschetta Clássica',
    description: 'Pão italiano tostado com tomates frescos, manjericão, alho e azeite extra virgem.',
    price: 28.00,
    category: 'starters',
    image: 'https://picsum.photos/seed/bruschetta/400/300',
    popular: true,
  },
  {
    id: '2',
    name: 'Bolinhos de Bacalhau',
    description: 'Seis unidades de bolinhos crocantes de bacalhau legítimo com ervas finas.',
    price: 35.00,
    category: 'starters',
    image: 'https://picsum.photos/seed/codfish/400/300',
  },
  {
    id: '3',
    name: 'Filé Mignon ao Molho Madeira',
    description: 'Medalhões de filé mignon grelhados, acompanhados de arroz piamontese e batatas rústicas.',
    price: 72.00,
    category: 'main',
    image: 'https://picsum.photos/seed/steak/400/300',
    popular: true,
  },
  {
    id: '4',
    name: 'Risoto de Cogumelos',
    description: 'Arroz arbóreo cremoso com mix de cogumelos frescos, parmesão e toque de trufas.',
    price: 58.00,
    category: 'main',
    image: 'https://picsum.photos/seed/risotto/400/300',
  },
  {
    id: '5',
    name: 'Limonada Suíça',
    description: 'Suco de limão batido com leite condensado e gelo, refrescante e cremosa.',
    price: 15.00,
    category: 'drinks',
    image: 'https://picsum.photos/seed/lemonade/400/300',
  },
  {
    id: '6',
    name: 'Vinho Tinto Reserva',
    description: 'Taça de vinho tinto seco encorpado, safra selecionada.',
    price: 25.00,
    category: 'drinks',
    image: 'https://picsum.photos/seed/wine/400/300',
  },
  {
    id: '7',
    name: 'Petit Gâteau',
    description: 'Bolinho quente de chocolate com recheio cremoso, servido com sorvete de baunilha.',
    price: 24.00,
    category: 'desserts',
    image: 'https://picsum.photos/seed/cake/400/300',
    popular: true,
  },
  {
    id: '8',
    name: 'Pudim de Leite',
    description: 'Pudim clássico de leite condensado com calda de caramelo artesanal.',
    price: 18.00,
    category: 'desserts',
    image: 'https://picsum.photos/seed/pudding/400/300',
  },
];
