<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('devis_clients', function (Blueprint $table) {
            $table->text('intro')->nullable()->after('theme_projet');
            $table->string('delai_realisation')->nullable()->after('intro');
        });
    }

    public function down(): void
    {
        Schema::table('devis_clients', function (Blueprint $table) {
            $table->dropColumn(['intro', 'delai_realisation']);
        });
    }
};