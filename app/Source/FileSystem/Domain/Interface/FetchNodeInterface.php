<?php

namespace App\Source\FileSystem\Domain\Interface;

use App\Source\FileSystem\Domain\Dto\AncestorsDto;
use App\Source\FileSystem\Domain\Dto\NodesDto;
use App\Source\FileSystem\Domain\Query\FetchQuery;
use App\Source\FileSystem\Domain\Query\SearchQuery;

interface FetchNodeInterface
{
    public function fetch(FetchQuery $fetchQuery): NodesDto;

    public function search(SearchQuery $searchQuery): NodesDto;

    public function ancestors(int $nodeId): AncestorsDto;
}
