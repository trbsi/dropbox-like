<?php

namespace App\Source\FileSystem\Domain\Enum;

enum FileSystemEnum: string
{
    case File = 'file';
    case Folder = 'folder';
}
