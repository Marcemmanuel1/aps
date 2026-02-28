<?php

use App\Http\Controllers\DevisController;
use App\Http\Controllers\PropositionController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    // Route de test
    Route::get('/test', function () {
        return response()->json([
            'success'   => true,
            'message'   => 'API Laravel fonctionne correctement',
            'version'   => '1.0.0',
            'timestamp' => now()->toDateTimeString()
        ]);
    });

    // Routes spécifiques déclarées AVANT apiResource pour éviter les conflits de paramètres
    Route::get('/devis/statistiques',     [DevisController::class,      'statistiques']);
    Route::get('/devis/{id}/pdf',         [DevisController::class,      'downloadPDF']);
    Route::get('/devis/{id}/facture',     [DevisController::class,      'downloadPDF']);

    // ✅ NOUVEAU : Route proposition PDF — appelée automatiquement par le frontend après enregistrement
    Route::get('/devis/{id}/proposition', [PropositionController::class, 'generate']);

    // CRUD complet (index, store, show, update, destroy)
    Route::apiResource('devis', DevisController::class);

});