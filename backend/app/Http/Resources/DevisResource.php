<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DevisResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'client' => [
                'nom' => $this->nom,
                'prenom' => $this->prenom,
                'telephone' => $this->telephone,
                'email' => $this->email,
                'localisation' => $this->localisation,
                'type_projet' => $this->type_projet,
                'style_projet' => $this->style_projet,
                'theme_projet' => $this->theme_projet,
                'date_edition' => $this->date_edition
            ],
            'blocs' => BlocResource::collection($this->whenLoaded('blocs')),
            'total_general' => $this->calculerTotalGeneral(),
            'statistiques' => [
                'nombre_blocs' => $this->blocs->count(),
                'nombre_pages' => $this->blocs->sum(fn($bloc) => $bloc->pages->count()),
                'nombre_materiels' => $this->blocs->sum(fn($bloc) => 
                    $bloc->pages->sum(fn($page) => $page->materiels->count())
                )
            ],
            'created_at' => $this->created_at->format('d/m/Y H:i'),
            'updated_at' => $this->updated_at->format('d/m/Y H:i')
        ];
    }

    private function calculerTotalGeneral(): float
    {
        $total = 0;
        foreach ($this->blocs as $bloc) {
            foreach ($bloc->pages as $page) {
                foreach ($page->materiels as $materiel) {
                    $total += $materiel->pieces * $materiel->prix;
                }
            }
        }
        return $total;
    }
}