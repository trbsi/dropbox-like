<?php

namespace App\Source\FileSystem\Domain\Service\Store;

use App\Source\FileSystem\Domain\Command\StoreNodeCommand;
use App\Source\FileSystem\Domain\Dto\NodeDto;
use App\Source\FileSystem\Domain\Enum\FileSystemEnum;
use App\Source\FileSystem\Domain\Interface\StoreNodeInterface;

class StoreNodeService
{
    public function __construct(
        private readonly StoreNodeInterface $storeNode,
    ) {
    }

    public function store(?int $parentId, string $name, FileSystemEnum $type): NodeDto
    {
        // any business logic goes here
        return $this->storeNode->store(
            new StoreNodeCommand(parentId: $parentId, name: $name, type: $type)
        );
    }
}
