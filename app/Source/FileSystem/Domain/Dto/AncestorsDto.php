<?php

namespace App\Source\FileSystem\Domain\Dto;

class AncestorsDto
{
    private array $ancestors;

    public function __construct(AncestorDto ...$ancestors)
    {
        $this->ancestors = $ancestors;
    }

    public function getAncestors(): array
    {
        return $this->ancestors;
    }
}