<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PropositionController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/proposition-pdf', [PropositionController::class, 'generate']);
