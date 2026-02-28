<?php

namespace App\Http\Controllers;

use App\Models\DevisClient;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class PropositionController extends Controller
{
    /**
     * Convertit une image locale en base64 pour l'intégration dans le PDF.
     */
    private function imageToBase64(string $relativePath): string
    {
        $fullPath = public_path($relativePath);
        if (!file_exists($fullPath)) {
            return '';
        }
        $extension = strtolower(pathinfo($fullPath, PATHINFO_EXTENSION));
        $mimeTypes = [
            'jpg'  => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png'  => 'image/png',
            'gif'  => 'image/gif',
            'webp' => 'image/webp',
        ];
        $mime = $mimeTypes[$extension] ?? 'image/jpeg';
        $data = base64_encode(file_get_contents($fullPath));
        return "data:{$mime};base64,{$data}";
    }

    /**
     * Convertit une image stockée dans Storage::disk('public') en base64.
     * Utilisée pour les images uploadées via DevisController.
     */
    private function storageImageToBase64(string $storagePath): string
    {
        if (!Storage::disk('public')->exists($storagePath)) {
            return '';
        }
        $extension = strtolower(pathinfo($storagePath, PATHINFO_EXTENSION));
        $mimeTypes = [
            'jpg'  => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png'  => 'image/png',
            'gif'  => 'image/gif',
            'webp' => 'image/webp',
        ];
        $mime = $mimeTypes[$extension] ?? 'image/jpeg';
        $data = base64_encode(Storage::disk('public')->get($storagePath));
        return "data:{$mime};base64,{$data}";
    }

    /**
     * Calcule le total général d'un devis (toutes pages, tous blocs).
     */
    private function calculerTotalGeneral(DevisClient $devis): float
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
     * Génère et stream le PDF de proposition pour un devis donné.
     *
     * @param int $id  ID du DevisClient
     */
    public function generate(int $id)
    {
        try {
            // Charger le devis avec toutes ses relations
            $devis = DevisClient::with(['blocs.pages.materiels', 'blocs.pages.images'])
                ->findOrFail($id);

            // ---------------------------------------------------------------
            // Préparer le dictionnaire chemin => base64 pour toutes les images
            // uploadées via DevisController (stockées dans Storage::disk('public'))
            // ---------------------------------------------------------------
            $imagesData = [];
            foreach ($devis->blocs as $bloc) {
                foreach ($bloc->pages as $page) {
                    foreach ($page->images as $image) {
                        $imagesData[$image->chemin] = $this->storageImageToBase64($image->chemin);
                    }
                }
            }

            // ---------------------------------------------------------------
            // Données à passer à la vue Blade
            // ---------------------------------------------------------------
            $data = [
                // Devis complet (blocs, pages, matériels, images)
                'devis'        => $devis,

                // Total général calculé
                'totalGeneral' => $this->calculerTotalGeneral($devis),

                // Dictionnaire des images uploadées (chemin => base64)
                'imagesData'   => $imagesData,

                // NOUVEAU : Champs introduction et délai pour le PDF
                'intro'        => $devis->intro,
                'delai'        => $devis->delai_realisation,

                // Assets statiques (logo, fonds)
                'logo'         => $this->imageToBase64('images/logo.png'),
                'bg_part'      => $this->imageToBase64('images/bg-part.png'),
                'bg_pdf'       => $this->imageToBase64('images/bg-pdf.png'),
                'code_qr'      => $this->imageToBase64('images/code-qr.png')
            ];

            // ---------------------------------------------------------------
            // Générer le PDF
            // ---------------------------------------------------------------
            $pdf = Pdf::loadView('pdf.proposition', $data)
                ->setPaper([0, 0, 960, 540], 'landscape')
                ->setOptions([
                    'isHtml5ParserEnabled' => true,
                    'isRemoteEnabled'      => true,
                    'defaultFont'          => 'DejaVu Sans',
                ]);

            // Sauvegarder le PDF dans le storage (comme DevisController)
            $pdfPath = "devis/{$devis->id}/proposition.pdf";
            Storage::disk('public')->put($pdfPath, $pdf->output());

            Log::info("Proposition PDF générée pour le devis #{$devis->id} : {$pdfPath}");

            // Streamer le PDF dans le navigateur
            return $pdf->stream("proposition-{$devis->nom}-{$devis->id}.pdf");

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => "Devis #{$id} introuvable.",
            ], 404);
        } catch (\Exception $e) {
            Log::error("Erreur génération proposition PDF pour le devis #{$id} : " . $e->getMessage());
            Log::error($e->getTraceAsString());

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la génération du PDF.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Télécharge le PDF de proposition pour un devis donné.
     * Régénère le fichier si celui-ci n'existe pas encore.
     *
     * @param int $id  ID du DevisClient
     */
    public function download(int $id)
    {
        try {
            $pdfPath = "devis/{$id}/proposition.pdf";

            // Régénérer si le fichier n'existe pas
            if (!Storage::disk('public')->exists($pdfPath)) {
                // Appeler generate() pour créer le fichier, puis rediriger vers download
                $this->generate($id);
            }

            $devis    = DevisClient::findOrFail($id);
            $filename = "proposition_{$devis->nom}_{$devis->id}.pdf";
            $filename = str_replace([' ', '/', '\\'], '_', $filename);

            return Storage::disk('public')->download($pdfPath, $filename);

        } catch (\Exception $e) {
            Log::error("Erreur téléchargement proposition PDF #{$id} : " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du téléchargement du PDF.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}   