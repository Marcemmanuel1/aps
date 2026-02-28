<?php

namespace App\Http\Controllers;

use App\Models\DevisClient;
use App\Models\Bloc;
use App\Models\Page;
use App\Models\Materiel;
use App\Models\Image;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class DevisController extends Controller
{
    /**
     * Afficher la liste des devis
     */
    public function index(): JsonResponse
    {
        try {
            $devis = DevisClient::with(['blocs.pages.materiels', 'blocs.pages.images'])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $devis
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur index devis: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des devis',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Enregistrer un nouveau devis et générer le PDF
     */
    public function store(Request $request): JsonResponse
    {
        Log::info('Début de l\'enregistrement du devis');
        Log::info('Données reçues:', $request->all());

        try {
            DB::beginTransaction();

            // Valider les données de base
            $validator = validator($request->all(), [
                'client.nom' => 'required|string|max:255',
                'client.prenom' => 'nullable|string|max:255',
                'client.telephone' => 'nullable|string|max:20',
                'client.email' => 'nullable|email|max:255',
                'client.localisation' => 'required|string|max:255',
                'client.type_projet' => 'required|string|max:255',
                'client.style_projet' => 'required|string|max:255',
                'client.theme_projet' => 'required|string|max:255',
                'client.intro' => 'nullable|string',
                'client.delai_realisation' => 'nullable|string|max:255',
                'client.date_edition' => 'required|string',
                'blocs' => 'required|array|min:1',
                'blocs.*.nom' => 'required|string|max:255',
                'blocs.*.pages' => 'required|array|min:1',
                'blocs.*.pages.*.nom_travail' => 'required|string|max:255',
                'blocs.*.pages.*.designation' => 'required|string',
                'blocs.*.pages.*.materiels' => 'required|array|min:1',
                'blocs.*.pages.*.materiels.*.nom' => 'required|string|max:255',
                'blocs.*.pages.*.materiels.*.pieces' => 'required|integer|min:1',
                'blocs.*.pages.*.materiels.*.prix' => 'required|numeric|min:0',
                'blocs.*.pages.*.images' => 'nullable|array|max:3',
                'blocs.*.pages.*.images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur de validation',
                    'errors' => $validator->errors()
                ], 422);
            }

            // 1. Créer le client/devis
            $devisClient = DevisClient::create([
                'nom' => $request->input('client.nom'),
                'prenom' => $request->input('client.prenom', ''),
                'telephone' => $request->input('client.telephone', ''),
                'email' => $request->input('client.email', ''),
                'localisation' => $request->input('client.localisation'),
                'type_projet' => $request->input('client.type_projet'),
                'style_projet' => $request->input('client.style_projet'),
                'theme_projet' => $request->input('client.theme_projet'),
                'intro' => $request->input('client.intro'),                   // NOUVEAU
                'delai_realisation' => $request->input('client.delai_realisation'), // NOUVEAU
                'date_edition' => $request->input('client.date_edition', now()->format('d/m/Y'))
            ]);

            Log::info('Devis client créé avec ID: ' . $devisClient->id);

            // 2. Créer les blocs
            $blocs = $request->input('blocs', []);
            
            foreach ($blocs as $blocIndex => $blocData) {
                $bloc = Bloc::create([
                    'devis_client_id' => $devisClient->id,
                    'nom' => $blocData['nom'] ?? 'Bloc sans nom',
                    'ordre' => $blocIndex + 1
                ]);

                // 3. Créer les pages du bloc
                $pages = $blocData['pages'] ?? [];
                foreach ($pages as $pageIndex => $pageData) {
                    $page = Page::create([
                        'bloc_id' => $bloc->id,
                        'nom_travail' => $pageData['nom_travail'] ?? '',
                        'designation' => $pageData['designation'] ?? '',
                        'ordre' => $pageIndex + 1
                    ]);

                    // 4. Créer les matériels de la page
                    $materiels = $pageData['materiels'] ?? [];
                    foreach ($materiels as $materielIndex => $materielData) {
                        Materiel::create([
                            'page_id' => $page->id,
                            'nom' => $materielData['nom'] ?? '',
                            'pieces' => $materielData['pieces'] ?? 1,
                            'prix' => $materielData['prix'] ?? 0
                        ]);
                    }

                    // 5. Gérer les images uploadées
                    $imageKey = "blocs.{$blocIndex}.pages.{$pageIndex}.images";
                    if ($request->hasFile($imageKey)) {
                        $images = $request->file($imageKey);
                        
                        // S'assurer que c'est un tableau
                        if (!is_array($images)) {
                            $images = [$images];
                        }

                        foreach ($images as $imageIndex => $image) {
                            try {
                                // Vérifier que c'est bien un fichier valide
                                if ($image && $image->isValid()) {
                                    // Générer un nom unique
                                    $extension = $image->getClientOriginalExtension();
                                    $filename = time() . '_' . uniqid() . '.' . $extension;
                                    
                                    // Chemin de stockage
                                    $path = "devis/{$devisClient->id}/page_{$page->id}/{$filename}";
                                    
                                    // Stocker l'image
                                    Storage::disk('public')->put($path, file_get_contents($image));

                                    // Enregistrer en base
                                    Image::create([
                                        'page_id' => $page->id,
                                        'nom_fichier' => $filename,
                                        'chemin' => $path,
                                        'ordre' => $imageIndex + 1
                                    ]);

                                    Log::info('Image uploadée: ' . $path);
                                }
                            } catch (\Exception $e) {
                                Log::error('Erreur upload image: ' . $e->getMessage());
                                // Continuer même si une image échoue
                            }
                        }
                    }
                }
            }

            DB::commit();
            Log::info('Devis enregistré avec succès: ' . $devisClient->id);

            // Charger les relations pour le PDF
            $devisClient->load(['blocs.pages.materiels', 'blocs.pages.images']);

            // Générer le PDF
            try {
                $pdf = $this->generatePDF($devisClient);
                
                // Sauvegarder le PDF
                $pdfPath = "devis/{$devisClient->id}/facture.pdf";
                Storage::disk('public')->put($pdfPath, $pdf->output());
                
                $pdfUrl = Storage::disk('public')->url($pdfPath);
                Log::info('PDF généré avec succès: ' . $pdfPath);
                
            } catch (\Exception $e) {
                Log::error('Erreur lors de la génération du PDF: ' . $e->getMessage());
                $pdfUrl = null;
            }

            return response()->json([
                'success' => true,
                'message' => 'Devis enregistré avec succès',
                'data' => [
                    'devis' => $devisClient,
                    'pdf_url' => $pdfUrl
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de l\'enregistrement du devis: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'enregistrement du devis: ' . $e->getMessage(),
                'error' => $e->getMessage(),
                'trace' => config('app.debug') ? $e->getTrace() : null
            ], 500);
        }
    }

    /**
     * Générer le PDF de la facture
     */
    private function generatePDF($devis)
    {
        $totalGeneral = $this->calculerTotalGeneral($devis);
        
        $data = [
            'devis' => $devis,
            'totalGeneral' => $totalGeneral
        ];

        $pdf = Pdf::loadView('pdf.facture', $data);
        $pdf->setPaper('A4', 'portrait');
        $pdf->setOptions([
            'defaultFont' => 'sans-serif',
            'isHtml5ParserEnabled' => true,
            'isRemoteEnabled' => true,
            'chroot' => [public_path(), storage_path()],
            'tempDir' => storage_path('app/temp'),
            'logOutputFile' => storage_path('logs/dompdf.log')
        ]);

        return $pdf;
    }

    /**
     * Calculer le total général du devis
     */
    private function calculerTotalGeneral($devis): float
    {
        $total = 0;
        foreach ($devis->blocs as $bloc) {
            foreach ($bloc->pages as $page) {
                foreach ($page->materiels as $materiel) {
                    $total += $materiel->pieces * $materiel->prix;
                }
            }
        }
        return $total;
    }

    /**
     * Télécharger le PDF d'un devis
     */
    public function downloadPDF(int $id)
    {
        try {
            $devis = DevisClient::with(['blocs.pages.materiels', 'blocs.pages.images'])
                ->find($id);

            if (!$devis) {
                return response()->json([
                    'success' => false,
                    'message' => 'Devis non trouvé'
                ], 404);
            }

            $pdfPath = "devis/{$id}/facture.pdf";
            
            if (!Storage::disk('public')->exists($pdfPath)) {
                // Générer le PDF s'il n'existe pas
                $pdf = $this->generatePDF($devis);
                Storage::disk('public')->put($pdfPath, $pdf->output());
            }

            $filename = "facture_{$devis->nom}_{$devis->prenom}_{$devis->id}.pdf";
            $filename = str_replace([' ', '/', '\\'], '_', $filename);

            return Storage::disk('public')->download($pdfPath, $filename);

        } catch (\Exception $e) {
            Log::error('Erreur téléchargement PDF: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du téléchargement du PDF',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher un devis spécifique
     */
    public function show(int $id): JsonResponse
    {
        try {
            $devis = DevisClient::with(['blocs.pages.materiels', 'blocs.pages.images'])
                ->find($id);

            if (!$devis) {
                return response()->json([
                    'success' => false,
                    'message' => 'Devis non trouvé'
                ], 404);
            }

            // Ajouter l'URL du PDF si existant
            $pdfPath = "devis/{$id}/facture.pdf";
            $pdfUrl = Storage::disk('public')->exists($pdfPath) 
                ? Storage::disk('public')->url($pdfPath) 
                : null;

            return response()->json([
                'success' => true,
                'data' => [
                    'devis' => $devis,
                    'pdf_url' => $pdfUrl
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur show devis: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération du devis',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mettre à jour un devis
     */
    public function update(Request $request, int $id): JsonResponse
    {
        Log::info('Mise à jour du devis: ' . $id);

        try {
            $devisClient = DevisClient::find($id);

            if (!$devisClient) {
                return response()->json([
                    'success' => false,
                    'message' => 'Devis non trouvé'
                ], 404);
            }

            DB::beginTransaction();

            // Mettre à jour les informations du client
            $devisClient->update([
                'nom' => $request->input('client.nom', $devisClient->nom),
                'prenom' => $request->input('client.prenom', $devisClient->prenom),
                'telephone' => $request->input('client.telephone', $devisClient->telephone),
                'email' => $request->input('client.email', $devisClient->email),
                'localisation' => $request->input('client.localisation', $devisClient->localisation),
                'type_projet' => $request->input('client.type_projet', $devisClient->type_projet),
                'style_projet' => $request->input('client.style_projet', $devisClient->style_projet),
                'theme_projet' => $request->input('client.theme_projet', $devisClient->theme_projet),
                'intro' => $request->input('client.intro', $devisClient->intro),                         // NOUVEAU
                'delai_realisation' => $request->input('client.delai_realisation', $devisClient->delai_realisation), // NOUVEAU
                'date_edition' => $request->input('client.date_edition', $devisClient->date_edition)
            ]);

            // Supprimer les anciens blocs et leurs relations
            if ($request->has('blocs')) {
                // Supprimer les anciennes images du stockage
                foreach ($devisClient->blocs as $bloc) {
                    foreach ($bloc->pages as $page) {
                        foreach ($page->images as $image) {
                            Storage::disk('public')->delete($image->chemin);
                        }
                    }
                }

                // Supprimer les anciens blocs
                $devisClient->blocs()->delete();

                // Créer les nouveaux blocs
                $blocs = $request->input('blocs', []);
                foreach ($blocs as $blocIndex => $blocData) {
                    $bloc = Bloc::create([
                        'devis_client_id' => $devisClient->id,
                        'nom' => $blocData['nom'] ?? 'Bloc sans nom',
                        'ordre' => $blocIndex + 1
                    ]);

                    $pages = $blocData['pages'] ?? [];
                    foreach ($pages as $pageIndex => $pageData) {
                        $page = Page::create([
                            'bloc_id' => $bloc->id,
                            'nom_travail' => $pageData['nom_travail'] ?? '',
                            'designation' => $pageData['designation'] ?? '',
                            'ordre' => $pageIndex + 1
                        ]);

                        $materiels = $pageData['materiels'] ?? [];
                        foreach ($materiels as $materielIndex => $materielData) {
                            Materiel::create([
                                'page_id' => $page->id,
                                'nom' => $materielData['nom'] ?? '',
                                'pieces' => $materielData['pieces'] ?? 1,
                                'prix' => $materielData['prix'] ?? 0
                            ]);
                        }

                        // Gérer les nouvelles images
                        $imageKey = "blocs.{$blocIndex}.pages.{$pageIndex}.images";
                        if ($request->hasFile($imageKey)) {
                            $images = $request->file($imageKey);
                            
                            if (!is_array($images)) {
                                $images = [$images];
                            }

                            foreach ($images as $imageIndex => $image) {
                                if ($image && $image->isValid()) {
                                    $extension = $image->getClientOriginalExtension();
                                    $filename = time() . '_' . uniqid() . '.' . $extension;
                                    
                                    $path = "devis/{$devisClient->id}/page_{$page->id}/{$filename}";
                                    
                                    Storage::disk('public')->put($path, file_get_contents($image));

                                    Image::create([
                                        'page_id' => $page->id,
                                        'nom_fichier' => $filename,
                                        'chemin' => $path,
                                        'ordre' => $imageIndex + 1
                                    ]);
                                }
                            }
                        }
                    }
                }
            }

            DB::commit();

            // Recharger les relations
            $devisClient->load(['blocs.pages.materiels', 'blocs.pages.images']);

            // Regénérer le PDF
            try {
                $pdf = $this->generatePDF($devisClient);
                $pdfPath = "devis/{$devisClient->id}/facture.pdf";
                Storage::disk('public')->put($pdfPath, $pdf->output());
                $pdfUrl = Storage::disk('public')->url($pdfPath);
            } catch (\Exception $e) {
                Log::error('Erreur génération PDF mise à jour: ' . $e->getMessage());
                $pdfUrl = null;
            }

            return response()->json([
                'success' => true,
                'message' => 'Devis mis à jour avec succès',
                'data' => [
                    'devis' => $devisClient,
                    'pdf_url' => $pdfUrl
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur mise à jour devis: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer un devis
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $devisClient = DevisClient::find($id);

            if (!$devisClient) {
                return response()->json([
                    'success' => false,
                    'message' => 'Devis non trouvé'
                ], 404);
            }

            DB::beginTransaction();

            // Supprimer les images du stockage
            foreach ($devisClient->blocs as $bloc) {
                foreach ($bloc->pages as $page) {
                    foreach ($page->images as $image) {
                        Storage::disk('public')->delete($image->chemin);
                    }
                }
            }

            // Supprimer le dossier complet
            Storage::disk('public')->deleteDirectory("devis/{$id}");

            // Supprimer le devis (les relations seront supprimées en cascade)
            $devisClient->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Devis supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur suppression devis: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Statistiques des devis
     */
    public function statistiques(): JsonResponse
    {
        try {
            $totalDevis = DevisClient::count();
            $totalBlocs = Bloc::count();
            $totalPages = Page::count();
            $totalMateriels = Materiel::count();
            
            // Calculer le total général de tous les devis
            $devis = DevisClient::with(['blocs.pages.materiels'])->get();
            $totalGeneralTousDevis = 0;
            
            foreach ($devis as $devisItem) {
                $totalGeneralTousDevis += $this->calculerTotalGeneral($devisItem);
            }

            // Récupérer les 5 derniers devis
            $devisRecents = DevisClient::with(['blocs.pages.materiels'])
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get()
                ->map(function ($devisItem) {
                    return [
                        'id' => $devisItem->id,
                        'client' => $devisItem->nom . ' ' . $devisItem->prenom,
                        'localisation' => $devisItem->localisation,
                        'date' => $devisItem->created_at->format('d/m/Y'),
                        'total' => $this->calculerTotalGeneral($devisItem)
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => [
                    'total_devis' => $totalDevis,
                    'total_blocs' => $totalBlocs,
                    'total_pages' => $totalPages,
                    'total_materiels' => $totalMateriels,
                    'total_general' => $totalGeneralTousDevis,
                    'devis_recents' => $devisRecents
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur statistiques: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du calcul des statistiques',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}