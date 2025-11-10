<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ToReviewList extends Model
{
    /** @use HasFactory<\Database\Factories\ToReviewListFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'book_id',
        'added_at',
    ];

    public $timestamps = false;

    protected function casts(): array
    {
        return [
            'added_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }

    public function scopePending(Builder $query): Builder
    {
        return $query->orderByDesc('added_at');
    }

    public function scopeRecent(Builder $query): Builder
    {
        return $query->orderByDesc('added_at');
    }
}
