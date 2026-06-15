<?php

namespace App\Source\FileSystem\Infrastructure\Repository\DeleteNode;

use App\Models\FileSystem;
use App\Source\FileSystem\Domain\Interface\DeleteNodeInterface;

class DeleteNodeRepository implements DeleteNodeInterface
{
    public function delete(int $id): void
    {
        FileSystem::query()->where("id", $id)->delete();
    }
}
