import { useRef, useState } from 'react';

function App() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    visitReason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const formRef = useRef<HTMLDivElement>(null);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulation d'envoi
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        visitReason: ''
      });

      setTimeout(() => {
        setShowSuccess(false);
      }, 4000);
    }, 1500);
  };

  // Liste des motifs de visite
  const visitReasons = [
    "Demande de devis",
    "Consultation design d'intérieur",
    "Visite showroom",
    "Suivi de projet",
    "Rencontre avec l'architecte",
    "Demande d'information",
    "Autre motif"
  ];

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-[Urbanist]">
      {/* Image de fond - Remplacez par votre propre image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://tifydecor.org/video-et-photo/public/about.jpeg')",
        }}
      >
        {/* Overlay gradient élégant */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
      </div>

      {/* Éléments décoratifs */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#f5ddc6]/50 to-transparent z-10"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#f5ddc6]/50 to-transparent z-10"></div>

      {/* Cercles décoratifs */}
      <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-[#8B5A2B]/5 blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-[#f5ddc6]/5 blur-3xl"></div>

      {/* Message de succès */}
      {showSuccess && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 animate-slideDown">
          <div className="bg-white/95 backdrop-blur-sm border border-[#f5ddc6] px-8 py-4 shadow-2xl flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#8B5A2B]/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#8B5A2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-[#1A1A1A] font-medium">Visiteur enregistré avec succès</p>
              <p className="text-[#666] text-sm">L'accueil a bien été notifié</p>
            </div>
          </div>
        </div>
      )}

      {/* Conteneur principal du formulaire */}
      <div className="relative z-20 w-full max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
        <div
          ref={formRef}
          className="bg-white/95 backdrop-blur-sm shadow-2xl border border-white/20 transform transition-all duration-700"
        >
          {/* En-tête élégant avec ligne décorative */}
          <div className="relative px-8 pt-12 pb-6 border-b border-[#E8E2D9]">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#f5ddc6] via-[#8B5A2B] to-[#f5ddc6]"></div>

            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-[Poppins] text-[#1A1A1A] font-light mb-3">
                Enregistrement <span className="text-[#8B5A2B] italic">Visiteur</span>
              </h1>
              <div className="flex justify-center items-center space-x-2">
                <div className="w-12 h-px bg-[#8B5A2B]/30"></div>
                <p className="text-[#666] text-sm tracking-widest uppercase font-light">
                  Bienvenue chez TifyDécor
                </p>
                <div className="w-12 h-px bg-[#8B5A2B]/30"></div>
              </div>
            </div>

            {/* Icône décorative */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
              <div className="w-12 h-12 rounded-full bg-white border-4 border-[#f5ddc6]/30 flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-[#8B5A2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Nom & Prénom */}
            <div className="group">
              <label className="block text-[#1A1A1A] text-sm uppercase tracking-widest mb-3 font-light">
                Nom & Prénom <span className="text-[#8B5A2B]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-[#8B5A2B]/60 group-focus-within:text-[#8B5A2B] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 focus:border-[#8B5A2B] focus:bg-white focus:outline-none transition-all duration-300 text-gray-700 placeholder-gray-400"
                  placeholder="Jean Kouassi"
                />
              </div>
            </div>

            {/* Téléphone */}
            <div className="group">
              <label className="block text-[#1A1A1A] text-sm uppercase tracking-widest mb-3 font-light">
                Téléphone <span className="text-[#8B5A2B]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-[#8B5A2B]/60 group-focus-within:text-[#8B5A2B] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 focus:border-[#8B5A2B] focus:bg-white focus:outline-none transition-all duration-300 text-gray-700 placeholder-gray-400"
                  placeholder="+225 07 12 34 56 78"
                />
              </div>
            </div>

            {/* Email (facultatif) */}
            <div className="group">
              <label className="block text-[#1A1A1A] text-sm uppercase tracking-widest mb-3 font-light">
                Email <span className="text-gray-400 text-xs">(facultatif)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-[#8B5A2B]/60 group-focus-within:text-[#8B5A2B] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 focus:border-[#8B5A2B] focus:bg-white focus:outline-none transition-all duration-300 text-gray-700 placeholder-gray-400"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            {/* Motif de la visite */}
            <div className="group">
              <label className="block text-[#1A1A1A] text-sm uppercase tracking-widest mb-3 font-light">
                Motif de la visite <span className="text-[#8B5A2B]">*</span>
              </label>
              <div className="relative">
                <div className="absolute top-4 left-4 pointer-events-none">
                  <svg className="w-5 h-5 text-[#8B5A2B]/60 group-focus-within:text-[#8B5A2B] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <textarea
                  name="visitReason"
                  value={formData.visitReason}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 focus:border-[#8B5A2B] focus:bg-white focus:outline-none transition-all duration-300 text-gray-700 placeholder-gray-400 resize-none"
                  placeholder="Décrivez brièvement l'objet de votre visite..."
                />
              </div>

              {/* Suggestions de motifs */}
              <div className="mt-4">
                <p className="text-xs text-[#666] mb-2 font-light tracking-wider">MOTIFS FRÉQUENTS :</p>
                <div className="flex flex-wrap gap-2">
                  {visitReasons.map((reason, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, visitReason: reason }))}
                      className="px-4 py-2 bg-gray-100 hover:bg-[#f5ddc6]/30 border border-gray-200 hover:border-[#8B5A2B] text-xs text-[#666] hover:text-[#8B5A2B] transition-all duration-300 font-light"
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bouton de soumission */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="relative w-full group overflow-hidden"
              >
                {/* Effet de bordure animé */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#8B5A2B] to-[#f5ddc6] opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Contenu du bouton */}
                <div className="relative bg-[#8B5A2B] group-hover:bg-transparent transition-all duration-500 m-0.5 py-5">
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-3">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-white font-[Urbanist] text-sm uppercase tracking-[0.3em]">
                        Enregistrement...
                      </span>
                    </div>
                  ) : (
                    <span className="text-white font-[Urbanist] text-sm uppercase tracking-[0.3em] group-hover:tracking-[0.5em] transition-all duration-500">
                      Enregistrer la visite
                    </span>
                  )}
                </div>
              </button>
            </div>

            {/* Mention légale */}
            <p className="text-center text-xs text-gray-400 font-light mt-6">
              En vous enregistrant, vous acceptez d'être accueilli par notre équipe
            </p>
          </form>

          {/* Pied de formulaire élégant */}
          <div className="px-8 py-4 bg-gray-50/80 border-t border-[#E8E2D9] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-[#8B5A2B] animate-pulse"></div>
              <span className="text-xs text-[#666] font-light">Accueil ouvert</span>
            </div>
            <div className="text-xs text-[#8B5A2B] font-light">
              TifyDécor · Design d'intérieur
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;