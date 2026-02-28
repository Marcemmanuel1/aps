<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Page extends Model
{
    protected $fillable = [
        'bloc_id',
        'nom_travail',
        'designation',
        'ordre'
    ];

    public function bloc(): BelongsTo
    {
        return $this->belongsTo(Bloc::class);
    }

    public function materiels(): HasMany
    {
        return $this->hasMany(Materiel::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(Image::class);
    }
}