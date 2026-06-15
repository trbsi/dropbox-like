<?php

namespace App\Source\FileSystem\App\Response;

use App\Source\FileSystem\Domain\Dto\AncestorDto;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AncestorResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        /** @var AncestorDto $this */
        return [
            "id" => $this->id,
            "name" => $this->name,
        ];
    }
}
