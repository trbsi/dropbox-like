<?php

namespace App\Source\FileSystem\Domain\Dto;

use App\Source\FileSystem\Domain\Enum\FileSystemEnum;
use Carbon\Carbon;

class NodeDto
{
    public function __construct(
        public readonly string $id,
        public readonly ?int $parentId,
        public readonly string $name,
        public readonly FileSystemEnum $type,
        public readonly Carbon $createdAt,
    ) {
    }

    public function isFolder(): bool
    {
        return $this->type === FileSystemEnum::Folder;
    }
}
