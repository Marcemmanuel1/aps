<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('devis_clients', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('prenom')->nullable();
            $table->string('telephone')->nullable();
            $table->string('email')->nullable();
            $table->string('localisation');
            $table->string('type_projet');
            $table->string('style_projet');
            $table->string('theme_projet');
            $table->string('date_edition');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('devis_clients');
    }
};