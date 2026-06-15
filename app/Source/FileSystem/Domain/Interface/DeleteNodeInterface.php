<?php

namespace App\Source\FileSystem\Domain\Interface;

interface DeleteNodeInterface
{
    public function delete(int $id): void;
}
