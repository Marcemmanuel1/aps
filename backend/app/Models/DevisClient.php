<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DevisClient extends Model
{
    protected $table = 'devis_clients';
    
    protected $fillable = [
        'nom',
        'prenom',
        'telephone',
        'email',
        'localisation',
        'type_projet',
        'style_projet',
        'theme_projet',
        'intro',
        'delai_realisation',
        'date_edition'
    ];

    public function blocs(): HasMany
    {
        return $this->hasMany(Bloc::class, 'devis_client_id');
    }
}