import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: "Sarjiyanta Suwarno",
    rating: 5,
    role: "Local Guide",
    text: "Sate nya empuk..... Harga terjangkau...."
  },
  {
    id: 2,
    name: "Suko Prasetyo",
    role: "Local Guide",
    rating: 5,
    text: "Rasa mantap... Pokonya nagih...."
  },
  {
    id: 3,
    name: "A Anton",
    role: "Pelanggan Setia",
    rating: 5,
    text: "Langganan sate kambing"
  }
]

export function SocialProof() {
  return (
    <section className="py-32 relative bg-brand-dark overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-accent/5 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
            Testimonial
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-brand-cream">Apa Kata <span className="text-brand-accent italic">Mereka?</span></h2>
          <div className="flex justify-center items-center gap-2 mt-6">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-brand-accent text-brand-accent" />
              ))}
            </div>
            <span className="text-brand-cream/60 font-medium ml-2">4.9 / 5.0 Rating Google</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              key={t.id} 
              className="group p-8 rounded-[32px] bg-white/[0.03] border border-white/5 hover:border-brand-accent/30 transition-all duration-500 relative"
            >
              <Quote className="absolute top-6 right-8 w-10 h-10 text-white/5 group-hover:text-brand-accent/10 transition-colors" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(t.rating)].map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-brand-accent text-brand-accent" />
                ))}
              </div>

              <p className="text-brand-cream/70 italic mb-8 leading-relaxed font-light">"{t.text}"</p>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-accent to-brand-primary flex items-center justify-center text-brand-dark font-black text-lg">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-brand-cream leading-tight">{t.name}</h4>
                  <p className="text-[10px] uppercase tracking-widest text-brand-accent/60 font-black">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
