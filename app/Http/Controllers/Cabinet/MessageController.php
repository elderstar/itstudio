<?php

namespace App\Http\Controllers\Cabinet;

use App\Events\MessageSent;
use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Order;
use App\Models\OrderParticipant;
use App\Notifications\NewOrderMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MessageController extends Controller
{
    public function index(Request $request, Order $order): Response
    {
        $this->authorize('chat', $order);

        $messages = $order->messages()
            ->with(['user:id,name', 'parent.user:id,name'])
            ->latest()
            ->paginate(50)
            ->through(fn (Message $message) => $this->transform($message));

        OrderParticipant::query()
            ->where('order_id', $order->id)
            ->where('user_id', $request->user()->id)
            ->update(['last_read_at' => now()]);

        return Inertia::render('Cabinet/Orders/Chat', [
            'order' => [
                'id' => $order->id,
                'title' => $order->title,
            ],
            'messages' => $messages,
        ]);
    }

    public function store(Request $request, Order $order)
    {
        $this->authorize('chat', $order);

        $data = $request->validate([
            'body' => ['required', 'string', 'max:5000'],
            'parent_id' => ['nullable', 'exists:messages,id'],
            'attachment' => ['nullable', 'file', 'max:20480'],
        ]);

        if (! empty($data['parent_id'])) {
            $parent = Message::query()->findOrFail($data['parent_id']);
            abort_unless((int) $parent->order_id === (int) $order->id, 422);
        }

        $message = $order->messages()->create([
            'user_id' => $request->user()->id,
            'parent_id' => $data['parent_id'] ?? null,
            'body' => $data['body'],
        ]);

        if ($request->hasFile('attachment')) {
            $message->addMediaFromRequest('attachment')->toMediaCollection('attachments');
        }

        $message->load(['user', 'parent.user']);

        broadcast(new MessageSent($message))->toOthers();

        $recipients = $order->activeParticipants()
            ->with('user')
            ->where('user_id', '!=', $request->user()->id)
            ->get()
            ->pluck('user');

        foreach ($recipients as $recipient) {
            $recipient?->notify(new NewOrderMessage($message));
        }

        OrderParticipant::query()
            ->where('order_id', $order->id)
            ->where('user_id', $request->user()->id)
            ->update(['last_read_at' => now()]);

        if ($request->wantsJson()) {
            return response()->json($this->transform($message));
        }

        return back();
    }

    private function transform(Message $message): array
    {
        return [
            'id' => $message->id,
            'body' => $message->body,
            'created_at' => $message->created_at?->toIso8601String(),
            'user' => [
                'id' => $message->user->id,
                'name' => $message->user->name,
                'avatar_url' => $message->user->avatar_url,
            ],
            'parent' => $message->parent ? [
                'id' => $message->parent->id,
                'body' => $message->parent->body,
                'user' => [
                    'id' => $message->parent->user->id,
                    'name' => $message->parent->user->name,
                    'avatar_url' => $message->parent->user->avatar_url,
                ],
            ] : null,
            'attachments' => $message->getMedia('attachments')->map(fn ($media) => [
                'id' => $media->id,
                'name' => $media->file_name,
                'size' => $media->size,
                'mime_type' => $media->mime_type,
                'url' => route('media.download', $media),
            ])->values()->all(),
        ];
    }
}
