<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ImageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom_fichier' => $this->nom_fichier,
            'url' => $this->url,
            'ordre' => $this->ordre
        ];
    }
}