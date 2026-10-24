<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Home', [
            'about_images' => [
                '/imgs/about/01-foundation.jpg',
                '/imgs/about/02-triangle.jpg',
                '/imgs/about/03-kanban.jpg',
                '/imgs/about/04-contrast.jpg',
            ],
            'hero_image' => '/imgs/bg/'.random_int(1, 7).'.jpg',
        ]);
    }
}
