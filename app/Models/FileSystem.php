<?php

namespace App\Models;

use App\Source\FileSystem\Domain\Enum\FileSystemEnum;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class FileSystem extends Model
{
    protected $casts = [
        'id' => 'integer',
        'name' => 'string',
        'type' => FileSystemEnum::class,
    ];

    public function getId(): int
    {
        return $this->id;
    }


    public function getParentId(): int
    {
        return $this->parent_id;
    }

    public function setParentId(?int $parent_id): self
    {
        $this->parent_id = $parent_id;
        return $this;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;
        return $this;
    }

    public function getType(): FileSystemEnum
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;
        return $this;
    }

    public function getCreatedAt(): Carbon
    {
        return $this->createdAt;
    }
}
