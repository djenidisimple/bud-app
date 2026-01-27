<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectDataController;
use App\Http\Controllers\DataController;
use App\Http\Controllers\UserDataController;

Route::post('/register', [UserDataController::class, 'register']);

Route::post('/addProject', [ProjectDataController::class, 'addProject']);

Route::get('/getProject', [ProjectDataController::class, 'getProject']);

Route::get('/getByIdProject', [ProjectDataController::class, 'getProjectById']);

Route::delete('/deleteProject', [ProjectDataController::class, 'deleteProjectById']);

Route::post('/updateProject', [ProjectDataController::class, 'updateProject']);

Route::get('/getData', [DataController::class, 'getData']);

Route::post('/getDataByFilter', [DataController::class, 'getDataByFilter']);

Route::post('/postData', [DataController::class, 'postData']);

Route::get('/getDataMonthsYears', [DataController::class, 'getDataMonthsYears']);

Route::post('/login', [UserDataController::class, 'login']);

Route::middleware('auth:sanctum')->get('/user', fn(Request $request) => $request->user());

Route::middleware('auth:sanctum')->post('/logout', function (Request $request) {
    $request->user()->currentAccessToken()->delete();
    return response()->json(['message' => 'Logged out successfully']);
});
