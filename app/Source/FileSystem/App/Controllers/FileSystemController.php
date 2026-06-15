<?php

namespace App\Source\FileSystem\App\Controllers;

use App\Http\Controllers\Controller;
use App\Source\FileSystem\App\Requests\StoreNodeRequest;
use App\Source\FileSystem\App\Response\NodeResource;
use App\Source\FileSystem\Domain\Enum\FileSystemEnum;
use App\Source\FileSystem\Domain\Service\Delete\DeleteNodeService;
use App\Source\FileSystem\Domain\Service\FetchNode\FetchNodeService;
use App\Source\FileSystem\Domain\Service\Search\SearchNodesService;
use App\Source\FileSystem\Domain\Service\Store\StoreNodeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class FileSystemController extends Controller
{
    public function nodes(Request $request, FetchNodeService $service): JsonResource
    {
        $nodes = $service->fetch($request->integer('parent_id') ?: null);

        return NodeResource::collection($nodes);
    }

    public function store(StoreNodeRequest $request, StoreNodeService $service): JsonResource
    {
        $node = $service->store(
            parentId: $request->integer('parent_id') ?: null,
            name: $request->string('name')->toString(),
            type: FileSystemEnum::from($request->string('type')->toString()),
        );

        return NodeResource::make($node)->response()->setStatusCode(201);
    }

    public function destroy(int $id, DeleteNodeService $service): JsonResponse
    {
        try {
            $service->delete($id);
            return response()->json(null, 204);
        } catch (NotFoundHttpException $exception) {
            return response()->json([
                'message' => 'Not found'
            ], 404);
        }
    }

    public function search(Request $request, SearchNodesService $service): JsonResource
    {
        $nodes = $service->search(
            $request->string('q'),
            $request->integer('parent_id') ?: null
        );

        return NodeResource::collection($nodes);
    }
}
