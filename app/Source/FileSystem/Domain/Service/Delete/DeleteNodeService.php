<?php

namespace App\Source\FileSystem\Domain\Service\Delete;

use App\Source\FileSystem\Domain\Interface\DeleteNodeInterface;

class DeleteNodeService
{
    public function __construct(
        private readonly DeleteNodeInterface $deleteNode,
    ) {
    }

    public function delete(int $id): void
    {
        $this->deleteNode->delete($id);
    }
}
