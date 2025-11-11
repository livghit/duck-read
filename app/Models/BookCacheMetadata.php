<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookCacheMetadata extends Model
{
    protected $fillable = [
        'book_id',
        'cache_key',
        'expires_at',
        'hit_count',
    ];

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'hit_count' => 'integer',
        ];
    }

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }
}
