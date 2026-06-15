<?php

namespace App\Source\FileSystem\Domain\Query;

class SearchQuery
{
    public function __construct(
        public readonly string $name,
        public readonly ?int $parentId = null,
    ) {
    }
}
