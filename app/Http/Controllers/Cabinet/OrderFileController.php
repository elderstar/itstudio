<?php

namespace App\Http\Controllers\Cabinet;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class OrderFileController extends Controller
{
    public function index(Request $request, Order $order): Response
    {
        $this->authorize('view', $order);

        $files = $order->getMedia('files')->map(fn (Media $media) => [
            'id' => $media->id,
            'name' => $media->file_name,
            'size' => $media->size,
            'mime_type' => $media->mime_type,
            'created_at' => $media->created_at?->toIso8601String(),
            'url' => route('media.download', $media),
        ]);

        return Inertia::render('Cabinet/Orders/Files', [
            'order' => [
                'id' => $order->id,
                'title' => $order->title,
            ],
            'files' => $files,
        ]);
    }

    public function store(Request $request, Order $order)
    {
        $this->authorize('uploadFiles', $order);

        $request->validate([
            'file' => ['required', 'file', 'max:51200'],
        ]);

        $order->addMediaFromRequest('file')->toMediaCollection('files');

        activity()
            ->causedBy($request->user())
            ->performedOn($order)
            ->log('order_file_uploaded');

        return back();
    }
}
