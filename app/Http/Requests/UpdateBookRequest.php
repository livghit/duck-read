<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBookRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'author' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'isbn' => ['nullable', 'string', 'max:20'],
            'cover_url' => ['nullable', 'url'],
            'published_year' => ['nullable', 'integer', 'min:1000', 'max:2100'],
            'publisher' => ['nullable', 'string', 'max:255'],
            'first_publish_date' => ['nullable', 'date'],
            'number_of_pages' => ['nullable', 'integer', 'min:1'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Book title is required.',
            'author.required' => 'Author name is required.',
            'cover_url.url' => 'Cover URL must be a valid URL.',
            'published_year.integer' => 'Published year must be a valid year.',
            'number_of_pages.integer' => 'Number of pages must be a number.',
        ];
    }
}
