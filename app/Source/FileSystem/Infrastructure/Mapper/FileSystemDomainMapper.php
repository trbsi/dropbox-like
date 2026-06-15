<?php

namespace App\Source\FileSystem\Infrastructure\Mapper;

use App\Models\FileSystem;
use App\Source\FileSystem\Domain\Dto\NodeDto;
use App\Source\FileSystem\Domain\Dto\NodesDto;
use Illuminate\Support\Collection;

class FileSystemDomainMapper
{
    public function mapCollectionToDomain(Collection $nodes): NodesDto
    {
        $nodesDto = [];
        /** @var FileSystem $node */
        foreach ($nodes as $node) {
            $nodesDto[] = $this->mapSingleToDomain($node);
        }

        return new NodesDto(...$nodesDto);
    }

    public function mapSingleToDomain(FileSystem $fileSystem): NodeDto
    {
        return new NodeDto(
            id: $fileSystem->getId(),
            parentId: $fileSystem->getParentId(),
            name: $fileSystem->getName(),
            type: $fileSystem->getType(),
            createdAt: $fileSystem->getCreatedAt()
        );
    }
}
