<?php

namespace App\Source\FileSystem\Domain\Dto;

class AncestorDto
{
    public function __construct(
        public readonly string $id,
        public readonly string $name,
    ) {
    }
}