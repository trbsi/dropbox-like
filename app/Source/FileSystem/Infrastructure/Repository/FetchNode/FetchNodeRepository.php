<?php

namespace App\Source\FileSystem\Infrastructure\Repository\FetchNode;

use App\Models\FileSystem;
use App\Source\FileSystem\Domain\Dto\NodeDto;
use App\Source\FileSystem\Domain\Dto\NodesDto;
use App\Source\FileSystem\Domain\Enum\FileSystemEnum;
use App\Source\FileSystem\Domain\Exception\NodeNotFoundException;
use App\Source\FileSystem\Domain\Interface\FetchNodeInterface;
use App\Source\FileSystem\Domain\Query\FetchQuery;
use App\Source\FileSystem\Domain\Query\SearchQuery;
use App\Source\FileSystem\Infrastructure\Mapper\FileSystemDomainMapper;

class FetchNodeRepository implements FetchNodeInterface
{
    public function __construct(private readonly FileSystemDomainMapper $domainMapper)
    {
    }

    public function fetch(FetchQuery $fetchQuery): NodesDto
    {
        $query = FileSystem::query();
        $query->where('parent_id', $fetchQuery->parentId)
            ->orderByRaw('type = ?', [FileSystemEnum::Folder->value])
            ->orderBy('name', 'asc');

        return $this->domainMapper->mapCollectionToDomain($query->get());
    }

    public function search(SearchQuery $searchQuery): NodesDto
    {
        $query = FileSystem::query()
            ->where('name', 'LIKE', $searchQuery->name . '%')
            ->orderBy('name', 'asc')
            ->limit(10);

        return $this->domainMapper->mapCollectionToDomain($query->get());
    }

    public function get(int $id): NodeDto
    {
        $result = FileSystem::query()->first($id);

        if (!$result) {
            throw new NodeNotFoundException();
        }

        return $this->domainMapper->mapSingleToDomain($result);
    }
}
