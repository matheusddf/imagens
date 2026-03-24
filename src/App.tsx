/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Utensils, 
  Beef, 
  Coffee, 
  IceCream, 
  ChevronRight, 
  Star,
  ShoppingBag,
  Clock,
  MapPin,
  Phone,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  ArrowLeft,
  Settings,
  Minus,
  CreditCard,
  QrCode,
  CheckCircle2
} from 'lucide-react';
import { categories, menuItems as initialItems } from './data/menu';
import { supabase } from './lib/supabase';
import { MenuItem, CartItem } from './types';

const IconMap: Record<string, any> = {
  Utensils,
  Beef,
  Coffee,
  IceCream
};

// --- CUSTOMER VIEW (HOME) ---
function Home() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [loading, setLoading] = useState(true);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'pix' | 'success'>('cart');

  useEffect(() => {
    async function fetchItems() {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .order('created_at', { ascending: true });
        
        if (error) throw error;
        if (data && data.length > 0) {
          setItems(data);
        }
      } catch (err) {
        console.error('Error fetching from Supabase, using local data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, []);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return items;
    return items.filter(item => item.category === activeCategory);
  }, [activeCategory, items]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePixPayment = () => {
    setCheckoutStep('pix');
  };

  const confirmPayment = () => {
    setCheckoutStep('success');
    setTimeout(() => {
      setCart([]);
      setIsCartOpen(false);
      setCheckoutStep('cart');
    }, 3000);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header / Hero */}
      <header className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/restaurant/1920/1080?blur=2" 
            alt="Restaurant Background" 
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-bg"></div>
        </div>
        
        <div className="relative z-10 text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="serif text-5xl md:text-7xl font-bold text-brand-primary mb-4"
          >
            Sabor & Arte
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Uma experiência gastronômica única, onde cada prato conta uma história.
          </motion.p>
        </div>
      </header>

      {/* Info Bar */}
      <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0">
            <div className="w-12 h-12 rounded-full bg-brand-bg flex items-center justify-center text-brand-primary">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Horário</p>
              <p className="text-sm font-medium">11:30 - 23:00</p>
            </div>
          </div>
          <div className="flex items-center gap-4 border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0">
            <div className="w-12 h-12 rounded-full bg-brand-bg flex items-center justify-center text-brand-primary">
              <MapPin size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Localização</p>
              <p className="text-sm font-medium">Av. Gastronômica, 123</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-bg flex items-center justify-center text-brand-primary">
              <Phone size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Contato</p>
              <p className="text-sm font-medium">(11) 98765-4321</p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-6xl mx-auto px-4 mt-12 overflow-x-auto no-scrollbar">
        <div className="flex gap-4 pb-4 min-w-max">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              activeCategory === 'all' 
                ? 'bg-brand-primary text-white shadow-lg scale-105' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => {
            const Icon = IconMap[cat.icon];
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeCategory === cat.id 
                    ? 'bg-brand-primary text-white shadow-lg scale-105' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {Icon && <Icon size={18} />}
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Grid */}
      <main className="max-w-6xl mx-auto px-4 mt-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    {item.popular && (
                      <div className="absolute top-4 left-4 bg-brand-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
                        <Star size={10} fill="currentColor" />
                        Popular
                      </div>
                    )}
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full text-brand-primary font-bold text-lg">
                      R$ {item.price.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="serif text-2xl font-bold text-gray-900 mb-2">{item.name}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-6 h-10">
                      {item.description}
                    </p>
                    
                    <button 
                      onClick={() => addToCart(item)}
                      className="w-full py-3 rounded-2xl bg-brand-bg text-brand-primary font-bold text-sm flex items-center justify-center gap-2 hover:bg-brand-primary hover:text-white transition-colors group/btn"
                    >
                      Adicionar ao Pedido
                      <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* Floating Cart Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-8 right-8 bg-brand-primary text-white p-4 rounded-full shadow-2xl z-50 flex items-center gap-3"
      >
        <div className="relative">
          <ShoppingBag size={24} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-brand-primary">
              {cartCount}
            </span>
          )}
        </div>
        <span className="font-bold pr-2">Ver Pedido</span>
      </motion.button>

      {/* Cart Modal / Custom Checkout */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsCartOpen(false);
                setCheckoutStep('cart');
              }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="serif text-2xl font-bold text-brand-primary">
                  {checkoutStep === 'cart' ? 'Seu Pedido' : checkoutStep === 'pix' ? 'Pagamento Pix' : 'Sucesso!'}
                </h2>
                <button onClick={() => {
                  setIsCartOpen(false);
                  setCheckoutStep('cart');
                }} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {checkoutStep === 'cart' && (
                  <div className="space-y-6">
                    {cart.length === 0 ? (
                      <div className="text-center py-20">
                        <ShoppingBag size={48} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-gray-400">Seu carrinho está vazio.</p>
                      </div>
                    ) : (
                      cart.map(item => (
                        <div key={item.id} className="flex gap-4">
                          <img src={item.image} alt="" className="w-20 h-20 rounded-2xl object-cover" />
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900">{item.name}</h3>
                            <p className="text-brand-primary font-bold text-sm">R$ {item.price.toFixed(2)}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <button 
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="font-bold text-sm">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {checkoutStep === 'pix' && (
                  <div className="text-center space-y-6">
                    <div className="bg-brand-bg p-8 rounded-3xl inline-block">
                      <QRCodeSVG 
                        value={`00020126360014BR.GOV.BCB.PIX0114SUACHAVEPIX1235204000053039865405${cartTotal.toFixed(2)}5802BR5912SaborEArte6009SAOPAULO62070503***6304`} 
                        size={200}
                        className="mx-auto"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Escaneie o QR Code acima para pagar</p>
                      <p className="text-2xl font-bold text-brand-primary">R$ {cartTotal.toFixed(2)}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl text-left">
                      <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">Pix Copia e Cola</p>
                      <p className="text-xs break-all font-mono text-gray-600">00020126360014BR.GOV.BCB.PIX0114SUACHAVEPIX1235204000053039865405...</p>
                    </div>
                    <button 
                      onClick={confirmPayment}
                      className="w-full bg-green-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={20} />
                      Já realizei o pagamento
                    </button>
                  </div>
                )}

                {checkoutStep === 'success' && (
                  <div className="text-center py-20 space-y-4">
                    <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-2xl font-bold">Pedido Recebido!</h3>
                    <p className="text-gray-500">O restaurante já está preparando seu lanche.</p>
                  </div>
                )}
              </div>

              {checkoutStep === 'cart' && cart.length > 0 && (
                <div className="p-6 border-t border-gray-100 bg-gray-50">
                  <div className="flex justify-between mb-6">
                    <span className="text-gray-500 font-medium">Total do Pedido</span>
                    <span className="text-2xl font-bold text-brand-primary">R$ {cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <button 
                      onClick={handlePixPayment}
                      className="w-full bg-brand-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-opacity"
                    >
                      <QrCode size={20} />
                      Pagar com Pix (Grátis)
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- ADMIN VIEW (OWNER) ---
function Admin() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 0,
    category: 'main',
    image: 'https://picsum.photos/seed/food/400/300',
    popular: false
  });

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      console.error('Error fetching items:', err);
      // Fallback to local data for demo if Supabase fails
      setItems(initialItems);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('menu_items')
        .insert([newItem]);
      
      if (error) throw error;
      setNewItem({
        name: '',
        description: '',
        price: 0,
        category: 'main',
        image: 'https://picsum.photos/seed/food/400/300',
        popular: false
      });
      fetchItems();
    } catch (err) {
      console.error('Error adding item:', err);
      alert('Erro ao adicionar item. Verifique se o Supabase está configurado.');
    }
  }

  async function handleDeleteItem(id: string) {
    if (!confirm('Deseja realmente excluir este item?')) return;
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      fetchItems();
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-brand-primary transition-colors">
            <ArrowLeft size={20} />
            Voltar para o Cardápio
          </Link>
          <h1 className="serif text-3xl font-bold text-brand-primary">Painel do Dono</h1>
        </div>

        {/* Add New Item Form */}
        <div className="bg-white rounded-3xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Plus size={24} className="text-brand-primary" />
            Adicionar Novo Lanche
          </h2>
          <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400">Nome do Prato</label>
              <input 
                type="text" 
                required
                value={newItem.name}
                onChange={e => setNewItem({...newItem, name: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                placeholder="Ex: X-Salada Especial"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400">Preço (R$)</label>
              <input 
                type="number" 
                step="0.01"
                required
                value={newItem.price}
                onChange={e => setNewItem({...newItem, price: parseFloat(e.target.value)})}
                className="w-full px-4 py-2 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold uppercase text-gray-400">Descrição</label>
              <textarea 
                required
                value={newItem.description}
                onChange={e => setNewItem({...newItem, description: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 h-24"
                placeholder="Descreva os ingredientes..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400">Categoria</label>
              <select 
                value={newItem.category}
                onChange={e => setNewItem({...newItem, category: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400">URL da Imagem</label>
              <input 
                type="text" 
                value={newItem.image}
                onChange={e => setNewItem({...newItem, image: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              />
            </div>
            <div className="flex items-center gap-2 pt-4">
              <input 
                type="checkbox" 
                id="popular"
                checked={newItem.popular}
                onChange={e => setNewItem({...newItem, popular: e.target.checked})}
                className="w-5 h-5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
              />
              <label htmlFor="popular" className="text-sm font-medium text-gray-600">Marcar como Popular</label>
            </div>
            <div className="md:col-span-2 pt-4">
              <button 
                type="submit"
                className="w-full bg-brand-primary text-white py-3 rounded-2xl font-bold hover:opacity-90 transition-opacity"
              >
                Salvar no Cardápio
              </button>
            </div>
          </form>
        </div>

        {/* List Items */}
        <div className="bg-white rounded-3xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-6">Itens Atuais</h2>
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-50 hover:bg-gray-50 transition-colors">
                  <img src={item.image} alt="" className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-xs text-gray-400">R$ {item.price.toFixed(2)} • {item.category}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      
      {/* Admin Shortcut (Optional) */}
      <Link 
        to="/admin" 
        className="fixed bottom-8 left-8 bg-white text-gray-400 p-3 rounded-full shadow-lg hover:text-brand-primary transition-colors z-50"
        title="Painel Admin"
      >
        <Settings size={20} />
      </Link>
    </BrowserRouter>
  );
}
