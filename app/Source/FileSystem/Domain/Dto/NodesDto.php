<?php

namespace App\Source\FileSystem\Domain\Dto;

class NodesDto
{
    private array $nodes;

    public function __construct(NodesDto ...$nodes)
    {
        $this->nodes = $nodes;
    }

    public function getNodes(): array
    {
        return $this->nodes;
    }
}
