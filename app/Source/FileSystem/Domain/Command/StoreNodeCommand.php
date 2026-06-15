<?php

namespace App\Source\FileSystem\Domain\Command;

use App\Source\FileSystem\Domain\Enum\FileSystemEnum;

class StoreNodeCommand
{
    public function __construct(
        public readonly ?int $parentId,
        public readonly string $name,
        public readonly FileSystemEnum $type,
    ) {
    }
}
