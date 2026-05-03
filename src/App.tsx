import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Menu as MenuIcon, 
  X, 
  MapPin, 
  PhoneCall, 
  Heart, 
  Calendar, 
  Utensils, 
  Instagram, 
  Twitter, 
  Facebook, 
  Smartphone,
  ChevronRight,
  Star,
  Search,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';

// --- Constants ---
const BRAND_RED = "#DD0031";

// --- Types ---
interface MenuItem {
  id: number;
  name: string;
  price: string;
  description: string;
  emoji: string;
}

const MENU_ITEMS: MenuItem[] = [
  { id: 1, name: "Original Chicken Sandwich", price: "5.45", description: "The sandwich that started it all. A perfectly seasoned, hand-breaded chicken breast pressure cooked in 100% refined peanut oil.", emoji: "🥪" },
  { id: 2, name: "Spicy Deluxe Sandwich", price: "6.29", description: "For those who like a little heat. Spicy seasoned chicken breast topped with pepper jack cheese, lettuce, and tomato.", emoji: "🌶️" },
  { id: 3, name: "Waffle Potato Fries", price: "3.09", description: "Our signature potato fries, waffle-cut and cooked in canola oil until crispy outside and tender inside.", emoji: "🍟" },
  { id: 4, name: "Chick-fil-A Sauce 8oz", price: "3.29", description: "The classic blend of honey mustard, barbecue, and ranch. Perfect for dipping just about anything.", emoji: "🧴" },
];

const TESTIMONIALS = [
  { text: "The customer service here is unmatched. They remembered my name on my second visit!", author: "Sarah M.", location: "Atlanta, GA" },
  { text: "Best chicken sandwich in America. I don't care what anyone says.", author: "James T.", location: "Dallas, TX" },
  { text: "My kids ask for Chick-fil-A every Friday. It's become a family tradition.", author: "Monica R.", location: "Charlotte, NC" },
];

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  
  // Skeleton loader effect
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Exit intent
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !localStorage.getItem('exitIntentShown')) {
        setShowExitIntent(true);
        localStorage.setItem('exitIntentShown', 'true');
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="flex flex-col min-h-screen selection:bg-cfa-red selection:text-white">
      {/* Skip Link */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[100] bg-cfa-red text-white py-2 px-4 rounded-full">
        Skip to main content
      </a>

      {/* 1. STICKY NAVIGATION BAR */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-8 py-4 ${
          scrolled ? 'bg-white shadow-md' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo scrolled={scrolled} />
          
          <div className="hidden md:flex items-center gap-8 font-semibold">
            {['Menu', 'Catering', 'Locations', 'App', 'About'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className={`${scrolled ? 'text-cfa-gray' : 'text-white'} hover:text-cfa-red transition-colors`}
              >
                {item}
              </a>
            ))}
            <CTAButton className="bg-cfa-red text-white">Order Now</CTAButton>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(true)}
            className={`md:hidden p-2 ${scrolled ? 'text-cfa-gray' : 'text-white'}`}
            aria-label="Open mobile menu"
          >
            <MenuIcon size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed inset-0 z-[60] bg-white flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
              <Logo scrolled={true} />
              <button onClick={() => setMobileMenuOpen(false)} aria-label="Close mobile menu">
                <X size={32} className="text-cfa-gray" />
              </button>
            </div>
            <div className="flex flex-col gap-8 text-2xl font-display font-bold">
              {['Menu', 'Catering', 'Locations', 'App', 'About'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)}>
                  {item}
                </a>
              ))}
            </div>
            <div className="mt-auto">
              <CTAButton className="w-full bg-cfa-red text-white py-6 text-xl">Order Now</CTAButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main id="main-content">
        {/* 2. HERO SECTION */}
        <section className="relative h-screen min-h-[600px] flex items-center bg-gradient-to-br from-cfa-red via-cfa-red to-red-900 overflow-hidden">
          {/* Background Illustration */}
          <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block opacity-10 pointer-events-none">
             <svg viewBox="0 0 400 400" className="w-full h-full text-white fill-current translate-x-20 scale-125">
                <path d="M200 50 C120 50 50 120 50 200 C50 210 52 220 55 230 C60 210 80 190 110 180 C110 180 130 175 140 185 C150 195 145 210 160 215 C175 220 185 205 200 205 C215 205 225 220 240 215 C255 210 250 195 260 185 C270 175 290 180 290 180 C320 190 340 210 345 230 C348 220 350 210 350 200 C350 120 280 50 200 50 Z" />
                <path d="M100 240 Q150 280 200 240 Q250 280 300 240 L300 280 Q250 320 200 280 Q150 320 100 280 Z" />
             </svg>
          </div>

          <div className="max-w-7xl mx-auto px-4 md:px-8 w-full z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl text-white"
            >
              <h1 className="text-5xl md:text-7xl font-display font-extrabold mb-6 leading-tight">
                More Than a Meal. <br />
                <span className="text-cfa-gold italic">It's a My Pleasure Moment.</span>
              </h1>
              <p className="text-xl md:text-2xl font-sans font-light mb-10 opacity-90 leading-relaxed">
                Hand-breaded chicken. Served with care. <br className="hidden md:block" /> Every single time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <CTAButton className="bg-white text-cfa-red px-10 py-5 text-xl font-bold shadow-2xl">
                  Order Online
                </CTAButton>
                <CTAButton className="border-2 border-white text-white px-10 py-5 text-xl bg-transparent hover:bg-white/10">
                  View Full Menu
                </CTAButton>
              </div>
            </motion.div>
          </div>

          {/* Trust Badge Strip */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/20 backdrop-blur-sm border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
              <div className="flex flex-wrap justify-center md:justify-between items-center gap-6 md:gap-4 text-white font-semibold tracking-wide uppercase text-xs sm:text-sm">
                <span className="flex items-center gap-2"><Heart size={16} className="text-cfa-gold" /> Family Owned Values</span>
                <span className="flex items-center gap-2"><Utensils size={16} className="text-cfa-gold" /> Hand-Breaded Daily</span>
                <span className="flex items-center gap-2"><Calendar size={16} className="text-cfa-gold" /> Closed Sundays</span>
                <span className="flex items-center gap-2">🍗 Fresh Never Frozen</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. FEATURED MENU SECTION */}
        <section id="menu" className="py-24 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold text-cfa-gray mb-4">Fan Favorites</h2>
              <div className="w-20 h-1 bg-cfa-red mx-auto"></div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {MENU_ITEMS.map((item, idx) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col"
                >
                  <div className="text-7xl mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300">
                    {item.emoji}
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-cfa-red transition-colors">{item.name}</h3>
                  <div className="text-cfa-red font-bold text-2xl mb-4">${item.price}</div>
                  <p className="text-gray-500 text-sm mb-8 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                  <button className="mt-auto w-full py-4 rounded-xl border-2 border-cfa-red text-cfa-red font-bold hover:bg-cfa-red hover:text-white transition-all transform active:scale-95">
                    Add to Order
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. WHY CHICK-FIL-A SECTION */}
        <section className="py-24 bg-cfa-cream">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {[
                { icon: Heart, title: "Genuine Hospitality", text: "Every team member is trained to serve with care, not just speed. It's our pleasure." },
                { icon: Utensils, title: "Always Fresh Quality", text: "Our chicken is hand-breaded in-restaurant, never from frozen. Real ingredients, real taste." },
                { icon: Calendar, title: "Closed Sundays", text: "We believe rest matters. For our team and your family. We'll see you on Monday!" }
              ].map((feature, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-cfa-red text-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <feature.icon size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{feature.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. CATERING CTA BANNER */}
        <section id="catering" className="relative py-20 bg-cfa-red overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-12 translate-x-12"></div>
          <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-extrabold text-white mb-4">Feeding a crowd? We've got you.</h2>
              <p className="text-white/80 text-xl font-light">From office lunches to weddings — Chick-fil-A Catering delivers.</p>
            </div>
            <CTAButton className="bg-white text-cfa-red px-10 py-5 text-xl font-bold whitespace-nowrap shadow-xl">
              Explore Catering
            </CTAButton>
          </div>
        </section>

        {/* 6. SOCIAL PROOF / REVIEWS SECTION */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <h2 className="text-4xl font-display font-bold text-center mb-16 underline decoration-cfa-red decoration-4 transition-all">What Our Guests Are Saying</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {TESTIMONIALS.map((review, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-8 bg-cfa-cream rounded-2xl border border-gray-100 flex flex-col"
                >
                  <div className="flex gap-1 mb-6">
                    {[1,2,3,4,5].map(s => <Star key={s} size={18} fill="#F5A623" className="text-cfa-gold" />)}
                  </div>
                  <p className="text-lg italic text-cfa-gray mb-8 flex-grow leading-relaxed">"{review.text}"</p>
                  <div>
                    <p className="font-bold text-cfa-red">{review.author}</p>
                    <p className="text-gray-400 text-sm">{review.location}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. APP DOWNLOAD SECTION */}
        <section id="app" className="py-24 bg-gray-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="order-2 lg:order-1 flex justify-center"
              >
                {/* CSS Drawn Phone Mockup */}
                <div className="relative w-[300px] h-[600px] bg-cfa-gray rounded-[3rem] p-4 shadow-2xl border-4 border-gray-800">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-cfa-gray rounded-b-2xl z-10"></div>
                  <div className="absolute top-4 left-4 right-4 bottom-4 bg-gradient-to-tr from-cfa-red to-red-800 rounded-[2rem] overflow-hidden flex flex-col items-center justify-center p-8 text-center text-white">
                    <img src="https://www.chick-fil-a.com/-/media/images/cfacom/default-images/chick-fil-a-logo-vector.png" className="w-32 brightness-0 invert mb-8" alt="CFA logo" />
                    <p className="text-2xl font-display font-bold mb-4">Points for Nuggets.</p>
                    <div className="w-12 h-1 bg-cfa-gold mb-8"></div>
                    <div className="space-y-4 w-full">
                      <div className="h-4 bg-white/20 rounded-full w-full"></div>
                      <div className="h-4 bg-white/20 rounded-full w-3/4 mx-auto"></div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="order-1 lg:order-2"
              >
                <h2 className="text-5xl font-display font-extrabold mb-6 leading-tight">Order Ahead. <br /><span className="text-cfa-red">Skip the Line.</span></h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Earn points, get free food, and customize your order exactly how you want it. Our app is designed to make your experience as smooth as possible.
                </p>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3 text-lg font-semibold"><div className="w-2 h-2 rounded-full bg-cfa-red" /> Earn 1 point per $1 spent</li>
                  <li className="flex items-center gap-3 text-lg font-semibold"><div className="w-2 h-2 rounded-full bg-cfa-red" /> Free item on signup</li>
                  <li className="flex items-center gap-3 text-lg font-semibold"><div className="w-2 h-2 rounded-full bg-cfa-red" /> Exclusive app-only deals</li>
                </ul>
                <div className="flex flex-wrap gap-4">
                  <button className="flex items-center bg-black text-white px-6 py-3 rounded-xl hover:scale-105 transition-transform">
                    <Smartphone className="mr-3" size={24} />
                    <div className="text-left">
                      <p className="text-[10px] opacity-70 leading-none">Download on the</p>
                      <p className="text-lg font-bold leading-none">App Store</p>
                    </div>
                  </button>
                  <button className="flex items-center bg-black text-white px-6 py-3 rounded-xl hover:scale-105 transition-transform">
                    <Search className="mr-3" size={24} />
                    <div className="text-left">
                      <p className="text-[10px] opacity-70 leading-none">Get it on</p>
                      <p className="text-lg font-bold leading-none">Google Play</p>
                    </div>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 8. LOCATIONS MAP SECTION */}
        <section id="locations" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-display font-bold mb-4">Find Your Nearest Chick-fil-A</h2>
              <div className="max-w-xl mx-auto flex gap-2">
                <input 
                  type="text" 
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  placeholder="Enter Zip Code or City"
                  className="flex-grow border-2 border-gray-200 rounded-xl px-6 py-4 focus:border-cfa-red outline-none transition-colors"
                />
                <button className="bg-cfa-red text-white py-4 px-8 rounded-xl font-bold hover:bg-red-700 transition-colors">
                  Find Location
                </button>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-2xl border-8 border-white mb-12 h-[450px]">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106141.01186716075!2d-84.4566735!3d33.684567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f503306d04245f%3A0xc07a864703b0c169!2sChick-fil-A!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true}
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Atlanta Peachtree", addr: "194 Peachtree St NW, Atlanta, GA", hours: "6:30 AM - 10:00 PM" },
                { name: "Dallas Galleria", addr: "13350 Dallas Pkwy, Dallas, TX", hours: "10:00 AM - 8:00 PM" },
                { name: "New York Fulton St", addr: "144 Fulton St, New York, NY", hours: "7:00 AM - 10:00 PM" }
              ].map((loc, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-gray-50 border border-gray-200 group">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-cfa-red transition-colors">{loc.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{loc.addr}</p>
                  <p className="text-cfa-red font-semibold text-xs mb-6 uppercase tracking-wider">{loc.hours}</p>
                  <a href="#" className="flex items-center font-bold text-cfa-gray hover:translate-x-2 transition-transform">
                    Get Directions <ChevronRight size={16} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. EMAIL NEWSLETTER SECTION */}
        <section className="py-24 px-4 md:px-8">
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-red-600 to-cfa-red rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-32 -translate-y-32"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Be the First to Know</h2>
              <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                New menu items, promotions, and exclusive offers — straight to your inbox. Join our community today.
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-4">
                <input 
                  type="email" 
                  placeholder="name@email.com"
                  required
                  className="flex-grow px-8 py-5 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-md text-white placeholder:text-white/60 outline-none focus:bg-white/30 transition-all text-lg"
                />
                <button className="bg-white text-cfa-red py-5 px-10 rounded-2xl font-bold hover:bg-cfa-cream hover:scale-105 transform transition-all text-lg min-w-[160px]">
                  Subscribe
                </button>
              </form>
              <p className="mt-8 text-white/50 text-sm italic font-light italic">No spam. Unsubscribe anytime. We promise.</p>
            </div>
          </div>
        </section>
      </main>

      {/* 10. FOOTER */}
      <footer className="bg-cfa-gray text-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div>
              <Logo scrolled={false} className="mb-6" />
              <p className="text-gray-400 leading-relaxed font-light mt-4">
                Delivering high-quality food and genuine hospitality since 1946. It's our pleasure to serve you.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-8 text-cfa-gold font-display uppercase tracking-widest">Quick Links</h4>
              <ul className="space-y-4 text-gray-400">
                {['Sign Up', 'Store Locator', 'Catering Info', 'Gift Cards', 'Careers'].map(link => (
                  <li key={link}><a href="#" className="hover:text-white transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-8 text-cfa-gold font-display uppercase tracking-widest">Legal</h4>
              <ul className="space-y-4 text-gray-400">
                {['Privacy Policy', 'Terms of Use', 'Cookie Settings', 'California Privacy', 'Accessibility'].map(link => (
                  <li key={link}><a href="#" className="hover:text-white transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-8 text-cfa-gold font-display uppercase tracking-widest">Connect</h4>
              <div className="flex gap-4 mb-2">
                <SocialIcon Icon={Instagram} />
                <SocialIcon Icon={Twitter} />
                <SocialIcon Icon={Facebook} />
              </div>
              <p className="text-gray-400 text-sm mt-4 font-light">Follow us for behind-the-scenes and tasty updates!</p>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 font-light">
            <p>© 2025 Chick-fil-A, Inc. All Rights Reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
              <a href="#" className="hover:text-white transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating CTA (Mobile Only) */}
      <AnimatePresence>
        {scrolled && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="md:hidden fixed bottom-6 left-6 right-6 z-40"
          >
            <button className="w-full bg-cfa-red text-white py-5 rounded-2xl font-bold shadow-2xl flex items-center justify-center gap-2 text-lg active:scale-95 transition-transform">
              <Utensils size={20} /> Order Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exit Intent Popup */}
      <AnimatePresence>
        {showExitIntent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[2rem] p-8 md:p-12 w-full max-w-xl text-center relative"
            >
              <button 
                onClick={() => setShowExitIntent(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-cfa-gray"
              >
                <X size={24} />
              </button>
              <div className="w-20 h-20 bg-cfa-red/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <Utensils size={40} className="text-cfa-red" />
              </div>
              <h2 className="text-4xl font-display font-bold mb-4">Wait! Don't Miss Out.</h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Get <span className="text-cfa-red font-bold underline decoration-2 offset-2">20% off your first online order</span> when you join our weekly newsletter!
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  required
                  className="w-full px-6 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:border-cfa-red outline-none text-lg transition-colors"
                />
                <button className="w-full bg-cfa-red text-white py-4 rounded-xl font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-lg">
                  Send My Discount
                </button>
              </form>
              <p className="mt-6 text-gray-400 text-xs font-light">Valid for first-time app orders over $15. Terms apply.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cookie Consent */}
      <AnimatePresence>
        {showCookieConsent && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-0 left-0 right-0 z-[90] bg-cfa-gray/95 backdrop-blur-md text-white p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <p className="text-sm md:text-base text-gray-300 max-w-4xl text-center md:text-left leading-relaxed">
              We use cookies to enhance your pleasure... on our website. Our site uses cookies for analytics, personalized content, and to manage your preferences. By clicking "Accept All," you consent to our use of these technologies.
            </p>
            <div className="flex gap-4 shrink-0">
              <button 
                onClick={() => setShowCookieConsent(false)}
                className="px-8 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-colors uppercase text-xs font-bold tracking-widest"
              >
                Settings
              </button>
              <button 
                onClick={() => setShowCookieConsent(false)}
                className="px-8 py-3 rounded-xl bg-cfa-red text-white font-bold hover:bg-red-700 transition-all shadow-lg uppercase text-xs tracking-widest"
              >
                Accept All
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Helper Components ---

function Logo({ scrolled, className }: { scrolled: boolean, className?: string }) {
  return (
    <div className={`flex items-center gap-2 group cursor-pointer ${className}`}>
      <div className={`transition-all duration-300 ${scrolled ? 'scale-90' : 'scale-100'}`}>
        <svg 
          viewBox="0 0 100 100" 
          className={`w-12 h-12 transition-colors ${scrolled ? 'text-cfa-red' : 'text-white'} fill-current`}
        >
          <path d="M50 10 C30 10 10 30 10 50 C10 70 30 90 50 90 C70 90 90 70 90 50 C90 30 70 10 50 10 Z M50 20 C60 20 70 25 75 35 C65 30 55 30 45 35 C40 40 38 45 38 50 C38 55 40 60 45 65 C55 70 65 70 75 65 C70 75 60 80 50 80 C35 80 20 65 20 50 C20 35 35 20 50 20 Z" />
        </svg>
      </div>
      <span className={`text-2xl font-display font-extrabold tracking-tighter transition-colors ${scrolled ? 'text-cfa-red' : 'text-white'}`}>
        Chick-fil-A
      </span>
    </div>
  );
}

function CTAButton({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className={`rounded-full px-6 py-2 transition-all font-sans antialiased ${className}`}
    >
      {children}
    </motion.button>
  );
}

function SocialIcon({ Icon }: { Icon: any }) {
  return (
    <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-cfa-red transition-all transform hover:-translate-y-1">
      <Icon size={20} />
    </a>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="h-20 w-full animate-pulse bg-gray-100 mb-4"></div>
      <div className="max-w-7xl mx-auto px-8 space-y-8">
        <div className="h-[500px] w-full rounded-3xl animate-pulse bg-gray-100"></div>
        <div className="grid grid-cols-4 gap-8">
          <div className="h-80 w-full rounded-2xl animate-pulse bg-gray-100"></div>
          <div className="h-80 w-full rounded-2xl animate-pulse bg-gray-100"></div>
          <div className="h-80 w-full rounded-2xl animate-pulse bg-gray-100"></div>
          <div className="h-80 w-full rounded-2xl animate-pulse bg-gray-100"></div>
        </div>
      </div>
    </div>
  );
}
