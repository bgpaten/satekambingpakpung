import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: "Dimas Anggara",
    rating: 5,
    text: "Gila, dagingnya empuk banget dan bumbunya itu lho meresap sampai ke dalam-dalam. Sate ayamnya juga enak parah."
  },
  {
    id: 2,
    name: "Siti Rahma",
    rating: 5,
    text: "Gulai kambing hari Rabu itu andalan suami. Suka banget karena kuahnya nggak bikin eneg tapinya gurih banget!"
  },
  {
    id: 3,
    name: "Wahyu Pratama",
    rating: 5,
    text: "Praktis banget pesannya lewat web dan langsung WhatsApp. Sampe ambil sana udah disiapin fresh dan anget."
  }
]

export function SocialProof() {
  return (
    <section className="py-20 bg-gradient-to-b from-brand-dark to-[#0F3520] relative">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Kata Pelanggan Kami</h2>
          <div className="flex justify-center items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-brand-accent text-brand-accent" />
            ))}
            <span className="ml-2 font-bold text-white text-lg">4.7 / 5</span>
          </div>
          <p className="text-gray-400 mt-2">Berdasarkan ulasan asli pelanggan di Google Maps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              key={t.id} 
              className="bg-brand-dark-card/50 backdrop-blur-sm border border-white/5 p-8 rounded-2xl flex flex-col"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-brand-accent text-brand-accent" />
                ))}
              </div>
              <p className="text-gray-300 italic mb-6 leading-relaxed flex-grow">"{t.text}"</p>
              <h4 className="font-bold text-white">- {t.name}</h4>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
