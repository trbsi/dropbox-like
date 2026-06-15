<?php

namespace App\Source\FileSystem\Domain\Query;

class FetchQuery
{
    public function __construct(
        public readonly ?string $id = null,
        public readonly ?int $parentId = null,
        public readonly ?string $name = null,
        public readonly ?string $type = null,
    ) {
    }
}
