<?php

namespace App\Source\FileSystem\App\Response;

use App\Source\FileSystem\Domain\Dto\NodeDto;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NodeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        /** @var NodeDto $this */
        return [
            "id" => $this->id,
            "parent_id" => $this->parentId,
            "name" => $this->name,
            "type" => $this->type,
            "created_at" => $this->createdAt->format('Y-m-d H:i:s'),
        ];
    }
}
