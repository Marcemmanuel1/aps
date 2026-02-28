<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDevisRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'client.nom' => 'required|string|max:255',
            'client.prenom' => 'nullable|string|max:255',
            'client.telephone' => 'nullable|string|max:20',
            'client.email' => 'nullable|email|max:255',
            'client.localisation' => 'required|string|max:255',
            'client.type_projet' => 'required|string|max:255',
            'client.style_projet' => 'required|string|max:255',
            'client.theme_projet' => 'required|string|max:255',
            'client.intro' => 'nullable|string',
            'client.delai_realisation' => 'nullable|string|max:255',
            'client.date_edition' => 'required|string',
            
            'blocs' => 'required|array|min:1',
            'blocs.*.nom' => 'required|string|max:255',
            'blocs.*.pages' => 'required|array|min:1',
            'blocs.*.pages.*.nom_travail' => 'required|string|max:255',
            'blocs.*.pages.*.designation' => 'required|string',
            'blocs.*.pages.*.materiels' => 'required|array|min:1',
            'blocs.*.pages.*.materiels.*.nom' => 'required|string|max:255',
            'blocs.*.pages.*.materiels.*.pieces' => 'required|integer|min:1',
            'blocs.*.pages.*.materiels.*.prix' => 'required|numeric|min:0',
            'blocs.*.pages.*.images' => 'nullable|array|max:3',
            'blocs.*.pages.*.images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120'
        ];
    }

    public function messages(): array
    {
        return [
            'client.nom.required' => 'Le nom du client est requis',
            'client.localisation.required' => 'La localisation est requise',
            'client.type_projet.required' => 'Le type de projet est requis',
            'client.style_projet.required' => 'Le style de projet est requis',
            'client.theme_projet.required' => 'Le thème du projet est requis',
            'blocs.required' => 'Au moins un bloc est requis',
            'blocs.*.pages.required' => 'Chaque bloc doit contenir au moins une page',
            'blocs.*.pages.*.materiels.required' => 'Chaque page doit contenir au moins un matériel',
            'blocs.*.pages.*.images.max' => 'Maximum 3 images par page',
            'blocs.*.pages.*.images.*.max' => 'Chaque image ne doit pas dépasser 5MB',
            'blocs.*.pages.*.images.*.image' => 'Le fichier doit être une image'
        ];
    }
}