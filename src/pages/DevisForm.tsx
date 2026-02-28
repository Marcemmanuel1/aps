import React, { useState, useEffect } from 'react';

// Définition des types
interface Materiel {
  id: number;
  nom: string;
  pieces: number;
  prix: number;
}

interface Page {
  id: number;
  nom_travail: string;
  designation: string;
  materiels: Materiel[];
  images: string[];
  imageFiles?: File[];
}

interface Bloc {
  id: number;
  nom: string;
  pages: Page[];
}

interface Client {
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  localisation: string;
  type_projet: string;
  style_projet: string;
  theme_projet: string;
  date_edition: string;
  intro: string;
  delai_realisation: string;
}

interface DevisData {
  client: Client;
  blocs: Bloc[];
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: {
    devis?: { id: number };
    pdf_url?: string;
  };
  error?: string;
}

// Configuration de l'API
const API_URL = 'https://api.tifydecor.org/api/v1';

const DevisForm: React.FC = () => {
  const [formData, setFormData] = useState<DevisData>({
    client: {
      nom: '',
      prenom: '',
      telephone: '',
      email: '',
      localisation: '',
      type_projet: '',
      style_projet: '',
      theme_projet: '',
      date_edition: new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }).toUpperCase(),
      intro: '',
      delai_realisation: ''
    },
    blocs: []
  });

  const [blocCounter, setBlocCounter] = useState<number>(0);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);

  // États pour la barre d'installation PWA
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBar, setShowInstallBar] = useState<boolean>(false);
  const [isPWAInstalled, setIsPWAInstalled] = useState<boolean>(false);

  // Détecter si l'application est déjà installée ou est en mode PWA
  useEffect(() => {
    // Vérifier si l'application est en mode standalone (installée)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    setIsPWAInstalled(isStandalone);

    // Écouter l'événement beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      // Empêcher l'affichage automatique de la bannière
      e.preventDefault();
      // Stocker l'événement pour l'utiliser plus tard
      setDeferredPrompt(e);
      // Afficher la barre d'installation
      setShowInstallBar(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Écouter l'événement d'installation réussie
    const handleAppInstalled = () => {
      setShowInstallBar(false);
      setIsPWAInstalled(true);
      setDeferredPrompt(null);
      console.log('PWA installée avec succès');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Fonction pour installer la PWA
  const installPWA = async () => {
    if (!deferredPrompt) return;

    // Afficher la boîte de dialogue d'installation
    deferredPrompt.prompt();

    // Attendre la réponse de l'utilisateur
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('Utilisateur a accepté l\'installation');
    } else {
      console.log('Utilisateur a refusé l\'installation');
    }

    // Réinitialiser l'événement
    setDeferredPrompt(null);
    setShowInstallBar(false);
  };

  // Fonction pour fermer la barre d'installation
  const closeInstallBar = () => {
    setShowInstallBar(false);
  };

  // Télécharger automatiquement le PDF après enregistrement
  const telechargerPDF = async (devisId: number, nomClient: string): Promise<void> => {
    setIsDownloadingPdf(true);
    try {
      const response = await fetch(`${API_URL}/devis/${devisId}/proposition`, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf',
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur lors du téléchargement du PDF (status: ${response.status})`);
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `proposition-${nomClient.replace(/\s+/g, '-')}-${devisId}.pdf`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log(`PDF téléchargé avec succès pour le devis #${devisId}`);
    } catch (error) {
      console.error('Erreur téléchargement PDF:', error);
      setErrorMessage(
        `Devis enregistré, mais le téléchargement du PDF a échoué : ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      );
      setShowError(true);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Ajouter un bloc
  const ajouterBloc = (): void => {
    const newBloc: Bloc = {
      id: blocCounter,
      nom: '',
      pages: []
    };
    setFormData((prev: DevisData) => ({
      ...prev,
      blocs: [...prev.blocs, newBloc]
    }));
    setBlocCounter(blocCounter + 1);
  };

  // Supprimer un bloc
  const supprimerBloc = (blocId: number): void => {
    setFormData((prev: DevisData) => ({
      ...prev,
      blocs: prev.blocs.filter((bloc: Bloc) => bloc.id !== blocId)
    }));
  };

  // Ajouter une page à un bloc
  const ajouterPage = (blocId: number): void => {
    setFormData((prev: DevisData) => ({
      ...prev,
      blocs: prev.blocs.map((bloc: Bloc) => {
        if (bloc.id === blocId) {
          return {
            ...bloc,
            pages: [
              ...bloc.pages,
              {
                id: bloc.pages.length,
                nom_travail: '',
                designation: '',
                materiels: [],
                images: [],
                imageFiles: []
              }
            ]
          };
        }
        return bloc;
      })
    }));
  };

  // Supprimer une page
  const supprimerPage = (blocId: number, pageId: number): void => {
    setFormData((prev: DevisData) => ({
      ...prev,
      blocs: prev.blocs.map((bloc: Bloc) => {
        if (bloc.id === blocId) {
          return {
            ...bloc,
            pages: bloc.pages.filter((page: Page) => page.id !== pageId)
          };
        }
        return bloc;
      })
    }));
  };

  // Ajouter un matériel à une page
  const ajouterMateriel = (blocId: number, pageId: number): void => {
    setFormData((prev: DevisData) => ({
      ...prev,
      blocs: prev.blocs.map((bloc: Bloc) => {
        if (bloc.id === blocId) {
          return {
            ...bloc,
            pages: bloc.pages.map((page: Page) => {
              if (page.id === pageId) {
                return {
                  ...page,
                  materiels: [
                    ...page.materiels,
                    {
                      id: page.materiels.length,
                      nom: '',
                      pieces: 1,
                      prix: 0
                    }
                  ]
                };
              }
              return page;
            })
          };
        }
        return bloc;
      })
    }));
  };

  // Supprimer un matériel
  const supprimerMateriel = (blocId: number, pageId: number, materielId: number): void => {
    setFormData((prev: DevisData) => ({
      ...prev,
      blocs: prev.blocs.map((bloc: Bloc) => {
        if (bloc.id === blocId) {
          return {
            ...bloc,
            pages: bloc.pages.map((page: Page) => {
              if (page.id === pageId) {
                return {
                  ...page,
                  materiels: page.materiels.filter((m: Materiel) => m.id !== materielId)
                };
              }
              return page;
            })
          };
        }
        return bloc;
      })
    }));
  };

  // Gérer les changements dans les champs
  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData((prev: DevisData) => ({
      ...prev,
      client: {
        ...prev.client,
        [name]: value
      }
    }));
  };

  const handleBlocChange = (blocId: number, field: keyof Bloc, value: string): void => {
    setFormData((prev: DevisData) => ({
      ...prev,
      blocs: prev.blocs.map((bloc: Bloc) => {
        if (bloc.id === blocId) {
          return {
            ...bloc,
            [field]: value
          };
        }
        return bloc;
      })
    }));
  };

  const handlePageChange = (blocId: number, pageId: number, field: keyof Page, value: string): void => {
    setFormData((prev: DevisData) => ({
      ...prev,
      blocs: prev.blocs.map((bloc: Bloc) => {
        if (bloc.id === blocId) {
          return {
            ...bloc,
            pages: bloc.pages.map((page: Page) => {
              if (page.id === pageId) {
                return {
                  ...page,
                  [field]: value
                };
              }
              return page;
            })
          };
        }
        return bloc;
      })
    }));
  };

  const handleMaterielChange = (blocId: number, pageId: number, materielId: number, field: keyof Materiel, value: string | number): void => {
    setFormData((prev: DevisData) => ({
      ...prev,
      blocs: prev.blocs.map((bloc: Bloc) => {
        if (bloc.id === blocId) {
          return {
            ...bloc,
            pages: bloc.pages.map((page: Page) => {
              if (page.id === pageId) {
                return {
                  ...page,
                  materiels: page.materiels.map((m: Materiel) => {
                    if (m.id === materielId) {
                      return {
                        ...m,
                        [field]: value
                      };
                    }
                    return m;
                  })
                };
              }
              return page;
            })
          };
        }
        return bloc;
      })
    }));
  };

  const handleImageUpload = (blocId: number, pageId: number, e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const imageUrls = fileArray.map(file => URL.createObjectURL(file));

    setFormData((prev: DevisData) => ({
      ...prev,
      blocs: prev.blocs.map((bloc: Bloc) => {
        if (bloc.id === blocId) {
          return {
            ...bloc,
            pages: bloc.pages.map((page: Page) => {
              if (page.id === pageId) {
                const newImages = [...page.images, ...imageUrls].slice(0, 3);
                const newImageFiles = [...(page.imageFiles || []), ...fileArray].slice(0, 3);
                return {
                  ...page,
                  images: newImages,
                  imageFiles: newImageFiles
                };
              }
              return page;
            })
          };
        }
        return bloc;
      })
    }));
  };

  const supprimerImage = (blocId: number, pageId: number, index: number): void => {
    setFormData((prev: DevisData) => ({
      ...prev,
      blocs: prev.blocs.map((bloc: Bloc) => {
        if (bloc.id === blocId) {
          return {
            ...bloc,
            pages: bloc.pages.map((page: Page) => {
              if (page.id === pageId) {
                return {
                  ...page,
                  images: page.images.filter((_: string, i: number) => i !== index),
                  imageFiles: page.imageFiles?.filter((_: File, i: number) => i !== index)
                };
              }
              return page;
            })
          };
        }
        return bloc;
      })
    }));
  };

  const calculerTotalPage = (materiels: Materiel[]): number => {
    return materiels.reduce((total: number, m: Materiel) => total + (m.pieces * m.prix), 0);
  };

  const calculerTotalGeneral = (): number => {
    let total = 0;
    formData.blocs.forEach((bloc: Bloc) => {
      bloc.pages.forEach((page: Page) => {
        total += calculerTotalPage(page.materiels);
      });
    });
    return total;
  };

  const prepareFormData = (): FormData => {
    const formDataToSend = new FormData();

    // Envoi de tous les champs client avec leurs noms exacts attendus par Laravel
    Object.entries(formData.client).forEach(([key, value]) => {
      formDataToSend.append(`client[${key}]`, value);
    });

    formData.blocs.forEach((bloc, blocIndex) => {
      formDataToSend.append(`blocs[${blocIndex}][nom]`, bloc.nom);

      bloc.pages.forEach((page, pageIndex) => {
        formDataToSend.append(`blocs[${blocIndex}][pages][${pageIndex}][nom_travail]`, page.nom_travail);
        formDataToSend.append(`blocs[${blocIndex}][pages][${pageIndex}][designation]`, page.designation);

        page.materiels.forEach((materiel, matIndex) => {
          formDataToSend.append(`blocs[${blocIndex}][pages][${pageIndex}][materiels][${matIndex}][nom]`, materiel.nom);
          formDataToSend.append(`blocs[${blocIndex}][pages][${pageIndex}][materiels][${matIndex}][pieces]`, materiel.pieces.toString());
          formDataToSend.append(`blocs[${blocIndex}][pages][${pageIndex}][materiels][${matIndex}][prix]`, materiel.prix.toString());
        });

        if (page.imageFiles && page.imageFiles.length > 0) {
          page.imageFiles.forEach((file, imgIndex) => {
            formDataToSend.append(
              `blocs[${blocIndex}][pages][${pageIndex}][images][${imgIndex}]`,
              file,
              file.name
            );
          });
        }
      });
    });

    return formDataToSend;
  };

  const testApiConnection = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/test`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      if (!response.ok) return false;
      return true;
    } catch {
      return false;
    }
  };

  const soumettreDevis = async (): Promise<ApiResponse> => {
    const formDataToSend = prepareFormData();

    const response = await fetch(`${API_URL}/devis`, {
      method: 'POST',
      body: formDataToSend,
      headers: { 'Accept': 'application/json' }
    });

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Réponse non-JSON reçue:', text.substring(0, 500));
      throw new Error(`Le serveur a retourné une réponse non-JSON (Status: ${response.status})`);
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Erreur HTTP ${response.status}`);
    }

    return await response.json();
  };

  const validerFormulaire = (): boolean => {
    if (!formData.client.nom) { setErrorMessage('Le nom du client est requis'); return false; }
    if (!formData.client.localisation) { setErrorMessage('La localisation est requise'); return false; }
    if (!formData.client.type_projet) { setErrorMessage('Le type de projet est requis'); return false; }
    if (!formData.client.style_projet) { setErrorMessage('Le style de projet est requis'); return false; }
    if (!formData.client.theme_projet) { setErrorMessage('Le thème du projet est requis'); return false; }
    if (!formData.client.intro) { setErrorMessage("L'introduction est requise"); return false; }
    if (!formData.client.delai_realisation) { setErrorMessage("Le délai de réalisation est requis"); return false; }
    if (formData.blocs.length === 0) { setErrorMessage('Ajoutez au moins un bloc'); return false; }

    for (const bloc of formData.blocs) {
      if (!bloc.nom) { setErrorMessage('Tous les blocs doivent avoir un nom'); return false; }
      if (bloc.pages.length === 0) { setErrorMessage('Chaque bloc doit avoir au moins une page'); return false; }
      for (const page of bloc.pages) {
        if (!page.nom_travail) { setErrorMessage('Toutes les pages doivent avoir un nom de travail'); return false; }
        if (!page.designation) { setErrorMessage('Toutes les pages doivent avoir une désignation'); return false; }
        if (page.materiels.length === 0) { setErrorMessage('Chaque page doit avoir au moins un matériel'); return false; }
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    setShowError(false);
    setErrorMessage('');

    if (!validerFormulaire()) {
      setShowError(true);
      return;
    }

    setIsLoading(true);

    try {
      const apiOk = await testApiConnection();
      if (!apiOk) {
        throw new Error("Impossible de se connecter à l'API. Vérifiez que le serveur Laravel est démarré (php artisan serve)");
      }

      const result = await soumettreDevis();

      if (result.success) {
        setShowSuccess(true);
        console.log('Devis enregistré:', result.data);

        const devisId = result.data?.devis?.id;
        const nomClient = formData.client.nom;

        if (devisId) {
          await new Promise(resolve => setTimeout(resolve, 800));
          await telechargerPDF(devisId, nomClient);
        } else {
          console.warn('ID du devis non trouvé dans la réponse, impossible de télécharger le PDF automatiquement.');
        }

        setTimeout(() => {
          resetForm(false);
          setShowSuccess(false);
        }, 3000);

      } else {
        setErrorMessage(result.message || "Erreur lors de l'enregistrement");
        setShowError(true);
      }
    } catch (error) {
      console.error('Erreur détaillée:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Erreur de connexion au serveur');
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = (demandConfirmation = true): void => {
    if (demandConfirmation && !window.confirm('Voulez-vous vraiment réinitialiser le formulaire ?')) return;
    setFormData({
      client: {
        nom: '',
        prenom: '',
        telephone: '',
        email: '',
        localisation: '',
        type_projet: '',
        style_projet: '',
        theme_projet: '',
        date_edition: new Date().toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }).toUpperCase(),
        intro: '',
        delai_realisation: ''
      },
      blocs: []
    });
    setBlocCounter(0);
  };

  const styles = {
    container: { background: `linear-gradient(135deg, #F5F1EB 0%, #E8D9CC 100%)` },
    header: { background: `linear-gradient(135deg, #8B5A2B 0%, #C89B66 100%)` },
    installBar: { background: `linear-gradient(135deg, #8A9A5B 0%, #A9BA7C 100%)` }
  };

  const getSubmitLabel = () => {
    if (isLoading) return 'Enregistrement...';
    if (isDownloadingPdf) return 'Téléchargement du PDF...';
    return "Enregistrer l'APS";
  };

  return (
    <div className="min-h-screen py-8 px-4 relative" style={styles.container}>
      {/* Barre d'installation PWA */}
      {showInstallBar && !isPWAInstalled && (
        <div className="fixed top-0 left-0 right-0 z-50 shadow-lg animate-slideDown">
          <div className="text-white px-4 py-3 flex items-center justify-between" style={styles.installBar}>
            <div className="flex items-center space-x-3">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h-2v-6h2v6zm0-8h-2V6h2v2zm6 6.59L14.59 16 12 13.41 13.41 12 16 14.59 17.59 13 19 14.41 17.59 15.8 19 17.19 17.59 18.59 16 17.19 14.41 18.59 13 17.19 14.41 15.8 13 14.41 14.41 13 17 15.59 18.59 14.19z" />
              </svg>
              <div>
                <p className="font-medium">Installer l'application HARMONIA ÉQUILIBRE</p>
                <p className="text-sm opacity-90">Installez cette application sur votre appareil pour un accès rapide et une utilisation hors ligne</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={installPWA}
                className="px-4 py-2 bg-white text-gray-800 rounded-lg font-medium hover:bg-opacity-90 transition flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Installer</span>
              </button>
              <button
                onClick={closeInstallBar}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Espace pour compenser la barre d'installation */}
      {showInstallBar && !isPWAInstalled && <div className="h-16"></div>}

      <div className="max-w-7xl mx-auto">
        {/* En-tête avec badge PWA */}
        <div className="text-white rounded-2xl shadow-xl p-8 mb-8 relative" style={styles.header}>
          {isPWAInstalled && (
            <div className="absolute top-4 right-4 bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h-2v-6h2v6zm0-8h-2V6h2v2zm6 6.59L14.59 16 12 13.41 13.41 12 16 14.59 17.59 13 19 14.41 17.59 15.8 19 17.19 17.59 18.59 16 17.19 14.41 18.59 13 17.19 14.41 15.8 13 14.41 14.41 13 17 15.59 18.59 14.19z" />
              </svg>
              <span>Application installée</span>
            </div>
          )}
          <h1 className="text-4xl font-serif font-bold text-center mb-2" style={{ color: '#FFFFFF' }}>
            HARMONIA ÉQUILIBRE
          </h1>
          <p className="text-center text-lg" style={{ color: '#F5F1EB' }}>
            Création de Proposition d'Aménagement
          </p>
        </div>

        {/* Message de succès */}
        {showSuccess && (
          <div className="p-4 mb-6 rounded-lg shadow" style={{ backgroundColor: '#F5F1EB', color: '#333333' }}>
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3" style={{ color: '#8A9A5B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <p className="font-medium">
                Devis enregistré avec succès !{' '}
                {isDownloadingPdf
                  ? 'Téléchargement du PDF en cours...'
                  : 'Le PDF a été téléchargé.'}
              </p>
            </div>
          </div>
        )}

        {/* Message d'erreur */}
        {showError && (
          <div className="p-4 mb-6 rounded-lg shadow" style={{ backgroundColor: '#F5F1EB', color: '#333333' }}>
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3" style={{ color: '#8B5A2B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-medium">{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section Client */}
          <div className="rounded-2xl shadow-xl p-8 border" style={{ backgroundColor: '#FFFFFF', borderColor: '#C89B66' }}>
            <div className="flex items-center mb-6 pb-4 border-b" style={{ borderColor: '#F5F1EB' }}>
              <div className="w-12 h-12 rounded-full text-white flex items-center justify-center mr-4" style={{ backgroundColor: '#8B5A2B' }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-serif font-semibold" style={{ color: '#333333' }}>
                Informations du Client
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'nom', label: 'Nom', required: true, placeholder: 'Ex: GASSON', type: 'text' },
                { name: 'prenom', label: 'Prénom', required: false, placeholder: 'Prénom du client', type: 'text' },
                { name: 'telephone', label: 'Téléphone', required: false, placeholder: '+225 XX XX XX XX', type: 'tel' },
                { name: 'email', label: 'Email', required: false, placeholder: 'client@email.com', type: 'email' },
                { name: 'localisation', label: 'Localisation', required: true, placeholder: 'Ex: COCODY FAYA', type: 'text' },
                { name: 'type_projet', label: 'Type de projet', required: true, placeholder: "Proposition d'aménagement intérieur", type: 'text' },
                { name: 'style_projet', label: 'Style du projet', required: true, placeholder: 'Aménagement intérieur épuré', type: 'text' },
                { name: 'theme_projet', label: 'Thème du projet', required: true, placeholder: 'HARMONIA ÉQUILIBRE', type: 'text' },
              ].map(field => (
                <div key={field.name}>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>
                    {field.label} {field.required && <span style={{ color: '#8B5A2B' }}>*</span>}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData.client[field.name as keyof Client] as string}
                    onChange={handleClientChange}
                    required={field.required}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 border rounded-lg transition focus:ring-2 focus:border-transparent"
                    style={{ borderColor: '#C89B66', backgroundColor: '#FFFFFF', color: '#333333' }}
                  />
                </div>
              ))}

              {/* Champ Introduction (textarea) — name="intro" pour correspondre à Laravel */}
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>
                  Introduction <span style={{ color: '#8B5A2B' }}>*</span>
                </label>
                <textarea
                  name="intro"
                  value={formData.client.intro}
                  onChange={handleClientChange}
                  required
                  placeholder="Présentation générale du projet, contexte, objectifs..."
                  rows={4}
                  className="w-full px-4 py-3 border rounded-lg transition focus:ring-2 focus:border-transparent"
                  style={{ borderColor: '#C89B66', backgroundColor: '#FFFFFF', color: '#333333' }}
                />
              </div>

              {/* Champ Délai de réalisation — name="delai_realisation" pour correspondre à Laravel */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>
                  Délai de réalisation <span style={{ color: '#8B5A2B' }}>*</span>
                </label>
                <input
                  type="text"
                  name="delai_realisation"
                  value={formData.client.delai_realisation}
                  onChange={handleClientChange}
                  required
                  placeholder="Ex: 10-15 jours, 3 semaines, 1 mois..."
                  className="w-full px-4 py-3 border rounded-lg transition focus:ring-2 focus:border-transparent"
                  style={{ borderColor: '#C89B66', backgroundColor: '#FFFFFF', color: '#333333' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>Date d'édition</label>
                <input
                  type="text"
                  value={formData.client.date_edition}
                  readOnly
                  className="w-full px-4 py-3 border rounded-lg"
                  style={{ borderColor: '#C89B66', backgroundColor: '#F5F1EB', color: '#333333' }}
                />
              </div>
            </div>
          </div>

          {/* Section Blocs */}
          <div className="space-y-6">
            {formData.blocs.map((bloc: Bloc, blocIndex: number) => (
              <div key={bloc.id} className="rounded-2xl shadow-xl p-6 border relative"
                style={{ backgroundColor: '#FFFFFF', borderColor: '#C89B66' }}>
                <button
                  type="button"
                  onClick={() => supprimerBloc(bloc.id)}
                  className="absolute -top-3 -right-3 w-10 h-10 text-white rounded-full hover:opacity-90 transition shadow-lg flex items-center justify-center"
                  style={{ backgroundColor: '#8B5A2B' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full text-white flex items-center justify-center mr-3" style={{ backgroundColor: '#C89B66' }}>
                    <span className="font-bold">{blocIndex + 1}</span>
                  </div>
                  <input
                    type="text"
                    value={bloc.nom}
                    onChange={(e) => handleBlocChange(bloc.id, 'nom', e.target.value)}
                    placeholder="Nom du bloc (ex: SOCLE PRIORITAIRE)"
                    className="flex-1 text-xl font-serif font-semibold px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ borderColor: '#C89B66', backgroundColor: '#FFFFFF', color: '#333333' }}
                  />
                </div>

                <div className="space-y-4 ml-12">
                  {bloc.pages.map((page: Page, pageIndex: number) => (
                    <div key={page.id} className="rounded-xl p-4 border relative"
                      style={{ backgroundColor: '#F5F1EB', borderColor: '#C89B66' }}>
                      <button
                        type="button"
                        onClick={() => supprimerPage(bloc.id, page.id)}
                        className="absolute -top-2 -right-2 w-8 h-8 text-white rounded-full hover:opacity-90 transition shadow flex items-center justify-center"
                        style={{ backgroundColor: '#8B5A2B' }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>

                      <h4 className="text-sm font-medium mb-3" style={{ color: '#8B5A2B' }}>Page {pageIndex + 1}</h4>

                      <div className="mb-3">
                        <label className="block text-xs font-medium mb-1" style={{ color: '#333333' }}>Nom du travail à faire</label>
                        <input
                          type="text"
                          value={page.nom_travail}
                          onChange={(e) => handlePageChange(bloc.id, page.id, 'nom_travail', e.target.value)}
                          placeholder="Ex: Meuble TV suspendu"
                          className="w-full px-3 py-2 border rounded-lg"
                          style={{ borderColor: '#C89B66', backgroundColor: '#FFFFFF', color: '#333333' }}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="block text-xs font-medium mb-1" style={{ color: '#333333' }}>Désignation</label>
                        <textarea
                          value={page.designation}
                          onChange={(e) => handlePageChange(bloc.id, page.id, 'designation', e.target.value)}
                          placeholder="Description détaillée..."
                          rows={3}
                          className="w-full px-3 py-2 border rounded-lg"
                          style={{ borderColor: '#C89B66', backgroundColor: '#FFFFFF', color: '#333333' }}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="block text-xs font-medium mb-2" style={{ color: '#333333' }}>Matériels</label>
                        <div className="space-y-2">
                          {page.materiels.map((materiel: Materiel) => (
                            <div key={materiel.id} className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: '#FFFFFF' }}>
                              <input
                                type="text"
                                value={materiel.nom}
                                onChange={(e) => handleMaterielChange(bloc.id, page.id, materiel.id, 'nom', e.target.value)}
                                placeholder="Nom du matériel"
                                className="flex-1 px-3 py-1 border rounded text-sm"
                                style={{ borderColor: '#C89B66' }}
                              />
                              <input
                                type="number"
                                value={materiel.pieces}
                                onChange={(e) => handleMaterielChange(bloc.id, page.id, materiel.id, 'pieces', parseInt(e.target.value) || 0)}
                                placeholder="Qté"
                                min="1"
                                className="w-20 px-3 py-1 border rounded text-sm"
                                style={{ borderColor: '#C89B66' }}
                              />
                              <input
                                type="number"
                                value={materiel.prix}
                                onChange={(e) => handleMaterielChange(bloc.id, page.id, materiel.id, 'prix', parseInt(e.target.value) || 0)}
                                placeholder="Prix"
                                min="0"
                                className="w-24 px-3 py-1 border rounded text-sm"
                                style={{ borderColor: '#C89B66' }}
                              />
                              <span className="text-sm font-medium w-24 text-right" style={{ color: '#8A9A5B' }}>
                                {(materiel.pieces * materiel.prix).toLocaleString()} F
                              </span>
                              <button
                                type="button"
                                onClick={() => supprimerMateriel(bloc.id, page.id, materiel.id)}
                                style={{ color: '#8B5A2B' }}
                                className="hover:opacity-70"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => ajouterMateriel(bloc.id, page.id)}
                          className="mt-2 text-sm flex items-center gap-1 hover:opacity-70"
                          style={{ color: '#C89B66' }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                          </svg>
                          Ajouter un matériel
                        </button>
                      </div>

                      <div>
                        <label className="block text-xs font-medium mb-2" style={{ color: '#333333' }}>Images (max 3)</label>
                        <div className="flex flex-wrap gap-3 mb-2">
                          {page.images.map((img: string, idx: number) => (
                            <div key={idx} className="relative group">
                              <img
                                src={img}
                                alt={`Preview ${idx + 1}`}
                                className="w-20 h-20 object-cover rounded-lg border-2"
                                style={{ borderColor: '#C89B66' }}
                              />
                              <button
                                type="button"
                                onClick={() => supprimerImage(bloc.id, page.id, idx)}
                                className="absolute -top-2 -right-2 w-6 h-6 text-white rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                                style={{ backgroundColor: '#8B5A2B' }}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                        {page.images.length < 3 && (
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleImageUpload(bloc.id, page.id, e)}
                            className="text-sm"
                            style={{ color: '#333333' }}
                          />
                        )}
                      </div>

                      <div className="mt-3 pt-2 border-t" style={{ borderColor: '#C89B66' }}>
                        <div className="text-right">
                          <span className="text-sm font-medium" style={{ color: '#333333' }}>Total page: </span>
                          <span className="text-lg font-bold" style={{ color: '#8B5A2B' }}>
                            {calculerTotalPage(page.materiels).toLocaleString()} FCFA
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => ajouterPage(bloc.id)}
                    className="flex items-center gap-2 hover:opacity-70 transition"
                    style={{ color: '#C89B66' }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Ajouter une page
                  </button>
                </div>
              </div>
            ))}
          </div>

          {formData.blocs.length < 10 && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={ajouterBloc}
                className="flex items-center gap-3 px-8 py-4 text-white rounded-xl hover:opacity-90 transition shadow-lg transform hover:scale-105"
                style={{ background: `linear-gradient(135deg, #8B5A2B 0%, #C89B66 100%)` }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Ajouter un bloc
              </button>
            </div>
          )}

          {/* Résumé et boutons d'action */}
          <div className="rounded-2xl shadow-xl p-8 border" style={{ backgroundColor: '#FFFFFF', borderColor: '#C89B66' }}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <p className="text-sm mb-1" style={{ color: '#333333' }}>TOTAL GÉNÉRAL</p>
                <p className="text-4xl font-bold" style={{ color: '#8B5A2B' }}>
                  {calculerTotalGeneral().toLocaleString()} FCFA
                </p>
              </div>

              <div className="flex gap-8">
                <div className="text-center">
                  <p className="text-2xl font-bold" style={{ color: '#C89B66' }}>{formData.blocs.length}</p>
                  <p className="text-sm" style={{ color: '#333333' }}>Blocs</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold" style={{ color: '#C89B66' }}>
                    {formData.blocs.reduce((acc: number, bloc: Bloc) => acc + bloc.pages.length, 0)}
                  </p>
                  <p className="text-sm" style={{ color: '#333333' }}>Pages</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => resetForm(true)}
                  disabled={isLoading || isDownloadingPdf}
                  className="px-6 py-3 rounded-lg transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#F5F1EB', color: '#333333' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Réinitialiser
                </button>

                <button
                  type="submit"
                  disabled={isLoading || isDownloadingPdf}
                  className="px-8 py-3 text-white rounded-lg transition shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: `linear-gradient(135deg, #8A9A5B 0%, #A9BA7C 100%)` }}
                >
                  {(isLoading || isDownloadingPdf) ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {getSubmitLabel()}
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      Enregistrer l'APS
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Styles pour les animations */}
      <style>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DevisForm;
