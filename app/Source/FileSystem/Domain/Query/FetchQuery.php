<?php

namespace App\Source\FileSystem\Domain\Query;

class FetchQuery
{
    public function __construct(
        public readonly ?int $parentId,
    ) {
    }
}
