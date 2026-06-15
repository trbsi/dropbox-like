<?php

namespace App\Source\FileSystem\Domain\Interface;

use App\Source\FileSystem\Domain\Command\StoreNodeCommand;
use App\Source\FileSystem\Domain\Dto\NodeDto;

interface StoreNodeInterface
{
    public function store(StoreNodeCommand $command): NodeDto;
}
