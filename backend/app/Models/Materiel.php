<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Materiel extends Model
{
    protected $fillable = [
        'page_id',
        'nom',
        'pieces',
        'prix'
    ];

    protected $casts = [
        'pieces' => 'integer',
        'prix' => 'decimal:2'
    ];

    public function page(): BelongsTo
    {
        return $this->belongsTo(Page::class);
    }
}