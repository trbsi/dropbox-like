<?php

namespace App\Source\FileSystem\App\Requests;

use App\Models\FileSystem;
use App\Source\FileSystem\Domain\Enum\FileSystemEnum;
use Closure;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreNodeRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'parent_id' => [
                'nullable',
                'integer',
                Rule::exists('file_systems', 'id')->where('type', FileSystemEnum::Folder->value),
            ],
            'name' => [
                'required',
                'string',
                'max:255',
                function (string $attribute, mixed $value, Closure $fail): void {
                    $parentId = $this->integer('parent_id') ?: null;

                    $exists = FileSystem::query()
                        ->where('parent_id', $parentId)
                        ->where('name', $value)
                        ->exists();

                    if ($exists) {
                        $fail("A node named \"{$value}\" already exists here.");
                    }
                },
            ],
            'type' => [
                'required',
                Rule::enum(FileSystemEnum::class),
            ],
        ];
    }
}
