<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('devis_clients', function (Blueprint $table) {
            // Vérifier si la colonne delai_realisation n'existe pas avant de l'ajouter
            if (!Schema::hasColumn('devis_clients', 'delai_realisation')) {
                $table->string('delai_realisation', 255)->nullable()->after('theme_projet');
            }
            
            // Note: La colonne 'intro' existe déjà, donc on ne l'ajoute pas
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('devis_clients', function (Blueprint $table) {
            // Supprimer seulement si elle existe
            if (Schema::hasColumn('devis_clients', 'delai_realisation')) {
                $table->dropColumn('delai_realisation');
            }
        });
    }
};