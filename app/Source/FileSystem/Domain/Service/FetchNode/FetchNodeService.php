<?php

namespace App\Source\FileSystem\Domain\Service\FetchNode;

use App\Source\FileSystem\Domain\Dto\NodesDto;
use App\Source\FileSystem\Domain\Interface\FetchNodeInterface;
use App\Source\FileSystem\Domain\Query\FetchQuery;

class FetchNodeService
{
    public function __construct(
        private readonly FetchNodeInterface $fetchNode
    ) {
    }

    public function fetch(?int $parentId): NodesDto
    {
        // any business logic goes here
        return $this->fetchNode->fetch(new FetchQuery(parentId: $parentId));
    }
}
