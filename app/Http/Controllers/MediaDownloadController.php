<?php

namespace App\Http\Controllers;

use App\Models\CoderApplication;
use App\Models\Message;
use App\Models\Order;
use Illuminate\Http\Request;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Symfony\Component\HttpFoundation\StreamedResponse;

class MediaDownloadController extends Controller
{
    public function __invoke(Request $request, Media $media): StreamedResponse
    {
        $user = $request->user();
        abort_unless($user, 403);

        $model = $media->model;

        if ($model instanceof Order) {
            abort_unless($user->can('view', $model), 403);
        } elseif ($model instanceof Message) {
            abort_unless($user->can('chat', $model->order), 403);
        } elseif ($model instanceof CoderApplication) {
            abort_unless(
                $user->hasRole('admin') || (int) $model->user_id === (int) $user->id,
                403
            );
        } elseif ($media->collection_name === 'avatar') {
            // public avatars
        } else {
            abort(403);
        }

        return response()->streamDownload(function () use ($media) {
            echo stream_get_contents($media->stream());
        }, $media->file_name, [
            'Content-Type' => $media->mime_type,
        ]);
    }
}
