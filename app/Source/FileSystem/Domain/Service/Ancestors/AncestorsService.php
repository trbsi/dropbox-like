<?php

namespace App\Source\FileSystem\Domain\Service\Ancestors;

use App\Source\FileSystem\Domain\Dto\AncestorsDto;
use App\Source\FileSystem\Domain\Interface\FetchNodeInterface;

class AncestorsService
{
    public function __construct(private readonly FetchNodeInterface $fetchNode)
    {
    }

    public function get(int $nodeId): AncestorsDto
    {
        return $this->fetchNode->ancestors($nodeId);
    }
}