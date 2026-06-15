<?php

namespace App\Source\FileSystem\Domain\Interface;

use App\Source\FileSystem\Domain\Dto\NodeDto;
use App\Source\FileSystem\Domain\Dto\NodesDto;
use App\Source\FileSystem\Domain\Exception\NodeNotFoundException;
use App\Source\FileSystem\Domain\Query\FetchQuery;
use App\Source\FileSystem\Domain\Query\SearchQuery;

interface FetchNodeInterface
{
    public function fetch(FetchQuery $fetchQuery): NodesDto;

    public function search(SearchQuery $searchQuery): NodesDto;

    /**
     * @throws NodeNotFoundException
     */
    public function get(int $id): NodeDto;
}
