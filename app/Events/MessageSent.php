<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Message $message)
    {
        $this->message->load([
            'user:id,name',
            'parent.user:id,name',
        ]);
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('orders.'.$this->message->order_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'message.sent';
    }

    public function broadcastWith(): array
    {
        $message = $this->message;

        return [
            'id' => $message->id,
            'order_id' => $message->order_id,
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
