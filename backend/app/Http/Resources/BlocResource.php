<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BlocResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'ordre' => $this->ordre,
            'pages' => PageResource::collection($this->whenLoaded('pages')),
            'total_pages' => $this->pages->count(),
            'total_materiels' => $this->pages->sum(fn($page) => $page->materiels->count()),
            'total_page' => $this->pages->sum(fn($page) => 
                $page->materiels->sum(fn($m) => $m->pieces * $m->prix)
            )
        ];
    }
}