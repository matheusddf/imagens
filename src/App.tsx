/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Phone
} from 'lucide-react';
import { categories, menuItems } from './data/menu';

const IconMap: Record<string, any> = {
  Utensils,
  Beef,
  Coffee,
  IceCream
};

export default function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [cartCount, setCartCount] = useState(0);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return menuItems;
    return menuItems.filter(item => item.category === activeCategory);
  }, [activeCategory]);

  const addToCart = () => {
    setCartCount(prev => prev + 1);
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
                    onClick={addToCart}
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
      </main>

      {/* Floating Cart Button (Mobile) */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
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

      {/* Footer */}
      <footer className="mt-20 py-12 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="serif text-3xl font-bold text-brand-primary mb-4">Sabor & Arte</h2>
          <p className="text-gray-400 text-sm mb-8">© 2026 Sabor & Arte. Todos os direitos reservados.</p>
          <div className="flex justify-center gap-6 text-gray-400">
            <a href="#" className="hover:text-brand-primary transition-colors">Instagram</a>
            <a href="#" className="hover:text-brand-primary transition-colors">Facebook</a>
            <a href="#" className="hover:text-brand-primary transition-colors">WhatsApp</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
