<?php

namespace App\Source\FileSystem\Infrastructure\Repository\StoreNode;

use App\Models\FileSystem;
use App\Source\FileSystem\Domain\Command\StoreNodeCommand;
use App\Source\FileSystem\Domain\Dto\NodeDto;
use App\Source\FileSystem\Domain\Interface\StoreNodeInterface;
use App\Source\FileSystem\Infrastructure\Mapper\FileSystemDomainMapper;

class StoreNodeRepository implements StoreNodeInterface
{
    public function __construct(private readonly FileSystemDomainMapper $domainMapper)
    {
    }

    public function store(StoreNodeCommand $command): NodeDto
    {
        $model = new FileSystem();
        $model->setParentId($command->parentId);
        $model->setName($command->name);
        $model->setType($command->type->value);
        $model->save();

        return $this->domainMapper->mapSingleToDomain($model);
    }
}
