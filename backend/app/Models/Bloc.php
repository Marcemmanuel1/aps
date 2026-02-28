<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Bloc extends Model
{
    protected $fillable = [
        'devis_client_id',
        'nom',
        'ordre'
    ];

    public function devisClient(): BelongsTo
    {
        return $this->belongsTo(DevisClient::class);
    }

    public function pages(): HasMany
    {
        return $this->hasMany(Page::class);
    }
}