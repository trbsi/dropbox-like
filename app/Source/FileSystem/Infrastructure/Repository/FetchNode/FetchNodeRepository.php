<?php

namespace App\Source\FileSystem\Infrastructure\Repository\FetchNode;

use App\Models\FileSystem;
use App\Source\FileSystem\Domain\Dto\AncestorDto;
use App\Source\FileSystem\Domain\Dto\AncestorsDto;
use App\Source\FileSystem\Domain\Dto\NodesDto;
use App\Source\FileSystem\Domain\Enum\FileSystemEnum;
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
        $query = FileSystem::query();
        if ($searchQuery->parentId) {
            $query->where('parent_id', $searchQuery->parentId);
        }
        $query
            ->where('type', FileSystemEnum::File->value)
            ->where('name', 'LIKE', $searchQuery->name . '%')
            ->orderBy('name', 'asc')
            ->limit(10);

        return $this->domainMapper->mapCollectionToDomain($query->get());
    }

    public function ancestors(int $nodeId): AncestorsDto
    {
        $node = FileSystem::query()
            ->select(['id', 'parent_id'])
            ->find($nodeId);

        if ($node === null) {
            return new AncestorsDto();
        }

        $folders = FileSystem::query()
            ->select(['id', 'parent_id', 'name'])
            ->where('type', FileSystemEnum::Folder->value)
            ->get()
            ->keyBy('id');

        $ancestors = [];
        $parentId = $node->getParentId();

        while ($parentId !== null && $folders->has($parentId)) {
            /** @var FileSystem $ancestor */
            $ancestor = $folders->get($parentId);

            array_unshift(
                $ancestors,
                new AncestorDto(
                    id: (string)$ancestor->getId(),
                    name: $ancestor->getName(),
                )
            );

            $parentId = $ancestor->getParentId();
        }

        return new AncestorsDto(...$ancestors);
    }
}
