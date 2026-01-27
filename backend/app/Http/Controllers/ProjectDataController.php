<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use App\Models\Project;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ProjectDataController extends Controller
{
    public function addProject(Request $request) 
    {
        // Récupère l'id depuis la query ou le body
        $userId = $request->input('id');

        // Validation des champs attendus
        $validator = Validator::make([
            'id' => $userId,
            'name_project' => $request->input('name_project'),
            'description_project' => $request->input('description_project', ''),
        ], [
            'id' => 'required|exists:users,id',
            'name_project' => 'required|string|max:255|unique:projects,name_project',
            'description_project' => 'nullable|string|max:1000',
        ], [
            'id.required' => "L'utilisateur est requis",
            'id.exists' => "L'utilisateur spécifié n'existe pas",
            'name_project.unique' => 'Ce nom de projet est déjà utilisé',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation échouée',
                'errors' => $validator->errors(),
                'status' => 422
            ], 422);
        }

        DB::beginTransaction();
        try {
            // Vérifie que la colonne user_id existe dans la table projects
            if (!\Schema::hasColumn('projects', 'user_id')) {
                throw new \Exception("La colonne 'user_id' n'existe pas dans la table 'projects'.");
            }

            // Création du projet
            $project = Project::create([
                'name_project' => $request->input('name_project'),
                'description_project' => $request->input('description_project', ''),
                'user_id' => $userId,
                'active' => true,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Projet créé avec succès!',
                'project' => $project,
                'status' => 201
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur création projet: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Erreur lors de la création du projet',
                'error' => $e->getMessage(),
                'status' => 500
            ], 500);
        }
    }

    public function getProject() 
    {
        $project = Project::all();
        $totalResources = DB::table('resources')->sum('price_resource') ?? 0;
        return response()->json(['message' => 'ok', 'project' => $project, 'budget' => $totalResources], 200);
    }

    public function getProjectById(Request $request) {
        $request->validate(['id' => 'required|integer']);
        $id = $request->id;
        $project = Project::find($id);
        if (!$project) {
            return response()->json(['message' => 'Projet non trouvé', 'status' => 404], 404);
        }

        $totalResource = DB::table('resources')->sum('price_resource') ?? 0;

        $totalMake = DB::table('details')
            ->join('makes', 'details.id', '=', 'makes.detail_id')
            ->sum('makes.price_spend') ?? 0;

        $budget = $totalResource - $totalMake;

        return response()->json(['message' => 'ok', 'project' => $project], 200);
    }

    public function deleteProjectById(Request $request) {
        $request->validate(['id' => 'required|integer']);
        $deleted = Project::destroy($request->id);
        if ($deleted) {
            return response()->json(['message' => 'Suppression réussie!', 'Ok' => true], 200);
        } else {
            return response()->json(['message' => 'Projet non trouvé', 'Ok' => false], 404);
        }
    }

    public function updateProject(Request $request) {

        $request->validate(['id' => 'required|integer']);
        $project = Project::findOrFail($request->id);
        $project->update($request->all());
        return response()->json([
            'message' => 'Project updated successfully',
            'project' => $project,
            'Ok' => true,
        ]);

    }
}