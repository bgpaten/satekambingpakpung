import React from 'react';
import { ShoppingBag, MessageSquare, Clock, CheckCircle } from 'lucide-react';

const TermsSection: React.FC = () => {
  const steps = [
    {
      icon: <ShoppingBag className="w-8 h-8" />,
      title: "Pilih Menu",
      desc: "Pilih sate favorit Anda melalui daftar menu digital kami."
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Konfirmasi WA",
      desc: "Pesanan akan diarahkan ke WhatsApp untuk konfirmasi detail."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Proses Bakar",
      desc: "Hidangan dibakar fresh sesuai jam pengambilan Anda."
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Siap Dinikmati",
      desc: "Ambil di lokasi dan nikmati kelezatan sate legendaris."
    }
  ];

  return (
    <section id="flow" className="py-32 bg-brand-dark/50 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-brand-cream">Langkah <span className="text-brand-accent italic">Pemesanan</span></h2>
          <p className="text-brand-cream/40 mt-4 font-light">Proses mudah, rasa tetap terjaga keasliannya.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-accent/20 to-transparent z-0"></div>

          {steps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-3xl bg-brand-dark border border-white/5 flex items-center justify-center mb-6 shadow-2xl group-hover:border-brand-accent/40 group-hover:shadow-brand-accent/10 transition-all duration-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-brand-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-brand-accent group-hover:scale-110 transition-transform duration-500">
                  {step.icon}
                </div>
                <div className="absolute -bottom-2 -right-2 text-4xl font-black text-white/5 italic select-none">
                  0{idx + 1}
                </div>
              </div>
              <h3 className="text-xl font-bold text-brand-cream mb-2 group-hover:text-brand-accent transition-colors">{step.title}</h3>
              <p className="text-sm text-brand-cream/40 leading-relaxed font-light">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TermsSection;
