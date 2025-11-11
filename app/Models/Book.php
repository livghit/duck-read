<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Book extends Model
{
    /** @use HasFactory<\Database\Factories\BookFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'author',
        'description',
        'isbn',
        'cover_url',
        'external_id',
        'published_year',
        'publisher',
        'ol_last_synced_at',
        'ol_sync_status',
        'cached_from_ol',
    ];

    protected function casts(): array
    {
        return [
            'published_year' => 'integer',
            'ol_last_synced_at' => 'datetime',
            'cached_from_ol' => 'boolean',
        ];
    }

    public function cacheMetadata(): HasMany
    {
        return $this->hasMany(BookCacheMetadata::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function toReviewLists(): HasMany
    {
        return $this->hasMany(ToReviewList::class);
    }
}
