import React from 'react';
import { Award, CheckCircle2 } from 'lucide-react';

const AboutUs: React.FC = () => {
  return (
    <section id="about" className="py-32 relative bg-brand-dark overflow-hidden">
      {/* Subtle Divider Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-brand-accent/20 to-transparent"></div>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-brand-accent/10 rounded-[40px] blur-3xl group-hover:bg-brand-accent/20 transition-all duration-700"></div>
            <div className="relative">
              <img 
                src="/images/hero_sate_kambing.png" 
                alt="Proses Bakar Sate Pak Pung" 
                className="rounded-[32px] shadow-2xl object-cover h-[500px] w-full border border-white/10"
              />
              {/* Badge */}
              <div className="absolute -bottom-6 -right-6 bg-brand-accent text-brand-dark p-6 rounded-3xl shadow-2xl rotate-3 flex flex-col items-center">
                <Award className="w-8 h-8 mb-1" />
                <span className="text-2xl font-black heading leading-none">5+</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/70">Tahun Melegenda</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-[10px] font-bold uppercase tracking-[0.3em] mb-6">
                Warisan Cita Rasa
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-brand-cream leading-[1.1]">
                Resep <span className="text-brand-accent italic">Turun Temurun</span> Sejak Puluhan Tahun
              </h2>
            </div>
            
            <p className="text-lg text-brand-cream/60 leading-relaxed font-light">
              <span className="text-brand-accent font-bold">Sate Kambing Pak Pung</span> bukan sekadar hidangan, melainkan dedikasi kami dalam melestarikan <span className="text-brand-cream font-medium">keaslian rasa</span> sate kambing muda yang empuk dan gurih meresap.
            </p>

            <div className="grid grid-cols-1 gap-4 pt-4">
              {[
                "Daging Kambing Muda Pilihan",
                "Bumbu Rempah Rahasia Keluarga",
                "Pelayanan Sepenuh Hati"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 text-brand-cream/80 group">
                  <div className="w-6 h-6 rounded-full bg-brand-accent/10 border border-brand-accent/30 flex items-center justify-center group-hover:bg-brand-accent transition-all">
                    <CheckCircle2 className="w-4 h-4 text-brand-accent group-hover:text-brand-dark" />
                  </div>
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
