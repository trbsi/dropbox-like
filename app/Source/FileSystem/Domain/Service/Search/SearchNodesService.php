<?php

namespace App\Source\FileSystem\Domain\Service\Search;

use App\Source\FileSystem\Domain\Dto\NodesDto;
use App\Source\FileSystem\Domain\Interface\FetchNodeInterface;
use App\Source\FileSystem\Domain\Query\SearchQuery;

class SearchNodesService
{
    public function __construct(
        private readonly FetchNodeInterface $fetchNode
    ) {
    }

    public function search(string $name, ?int $parentId): NodesDto
    {
        if ($name === '') {
            return new NodesDto();
        }

        return $this->fetchNode->search(
            new SearchQuery(name: $name, parentId: $parentId)
        );
    }
}
