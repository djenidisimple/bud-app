<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;
use App\Models\Resource;
use App\Models\Spend;
use App\Models\Detail;
use App\Models\Make;
use Illuminate\Support\Facades\DB;

class DataController extends Controller
{
    public function getDataMonthsYears() 
    {
        $resource = DB::table('resources')
            ->select([DB::raw('SUM(resources.price_resource) as price')])
            ->get();

        $totalResource = DB::table('resources')->sum('price_resource') ?? 0;

        $totalMakes = DB::table('details')
            ->join('makes', 'makes.detail_id', '=', 'details.id')
            ->sum('makes.price_spend') ?? 0;

        $budget = $totalResource - $totalMakes;

        $query = DB::table('resources');

        if (DB::getDriverName() === 'sqlite') {
            $query->select([
                DB::raw('MAX(id) as id'),
                DB::raw('strftime("%Y", created_at) as year')
            ])
            ->groupBy(DB::raw('strftime("%Y", created_at)'));
        } else {
            $query->select([
                DB::raw('MAX(id) as id'),
                DB::raw('YEAR(created_at) as year')
            ])
            ->groupBy(DB::raw('YEAR(created_at)'));
        }

        $years = $query->orderBy('year', 'desc')->get();

        $spend = DB::table('details')
            ->select([DB::raw('SUM(makes.price_spend) as price_spend')])
            ->join('makes', 'makes.detail_id', '=', 'details.id')
            ->join('spends', 'spends.id', '=', 'details.spend_id')
            ->get();

        $data = DB::table('makes')
            ->select([
                'resources.id',
                DB::raw('SUM(makes.price_spend) as price_spend'), 
                DB::raw('MAX(resources.price_resource) as price_resource'), 
                DB::raw('MAX(makes.created_at) as date') 
            ])
            ->join('resources', 'resources.id', '=', 'makes.resource_id')
            ->groupBy('resources.id') 
            ->get();

        return response()->json(
            [
                'message' => 'donnée bien reçu!', 
                'Data' => [
                    'project' => Project::count(),
                    'budget' => $budget,
                    'resource' => $resource, 
                    'spend' => $spend,
                    'years' => $years,
                    'dataChart' => $data
                ]
            ]
        );
    }

    public function getData(Request $request)
    {
        // Récupère projectId depuis la requête (body ou query)
        $projectId = $request->projectId ?? $request->query('projectId');
        $request->merge(['projectId' => $projectId]);
        $request->validate(['projectId' => 'required|integer']);

        // Filtre les données par projectId
        $detailSpend = DB::table('details')
            ->select([
                'details.id as id',
                'details.name_detail as name_detail',
                DB::raw('(SELECT SUM(price_spend) FROM makes WHERE makes.detail_id = details.id) as price_spend'),
                DB::raw('(SELECT created_at FROM makes WHERE makes.detail_id = details.id ORDER BY created_at DESC) as date')
            ])
            ->join('spends', 'spends.id', '=', 'details.spend_id')
            ->where('spends.project_id', $projectId)
            ->get();

        $stayResource = DB::table('resources')
            ->select([
                'resources.id', 
                DB::raw('resources.origine_resource as name_resource'), 
                DB::raw('resources.price_resource as price_resource'), 
                DB::raw('SUM(makes.price_spend) as total_spend'),
                DB::raw('(resources.price_resource - COALESCE(SUM(makes.price_spend), 0)) as stay')
            ])
            ->leftJoin('makes', 'makes.resource_id', '=', 'resources.id')
            ->where('resources.project_id', $projectId)
            ->groupBy(['resources.id', 'resources.origine_resource', 'resources.price_resource'])
            ->get();

        $totalResource = DB::table('resources')->where('project_id', $projectId)->sum('price_resource') ?? 0;

        $totalSpend = DB::table('details')
            ->join('makes', 'makes.detail_id', '=', 'details.id')
            ->join('spends', 'spends.id', '=', 'details.spend_id')
            ->where('spends.project_id', $projectId)->sum('makes.price_spend') ?? 0;

        $budget = $totalResource - $totalSpend;

        // Filtre les ressources, dépenses, détails et makes par projectId
        $resources = Resource::where('project_id', $projectId)->get();
        $spends = Spend::where('project_id', $projectId)->get();
        $details = Detail::whereIn('spend_id', $spends->pluck('id'))->get();
        $makes = Make::whereIn('detail_id', $details->pluck('id'))->get();

        // Récupère le projet concerné
        $project = Project::where('id', $projectId)->get();

        return response()->json([
            'message' => 'Les données sont bien obtenues !',
            'Data' => [
                'resource' => $resources,
                'spend' => $spends,
                'detail' => $details,
                'make' => $makes,
                'budget' => $budget,
                'totalResource' => $totalResource,
                'totalSpend' => $totalSpend,
                'detailSpend' => $detailSpend,
                'stayResource' => $stayResource,
                'project' => $project
            ], 
            'status' => 201
        ], 201);
    }

    public function getDataByFilter(Request $request)
    {
        $request->validate([
            'months' => 'required|string',
            'years' => 'required'
        ]);

        $year = $request->years;
        $month = mb_strtolower($request->months); // Conversion en minuscules avec support Unicode

        // Mapping des mois français avec accent supporté
        $frenchMonths = [
            'janvier' => '01',
            'fevrier' => '02',
            'mars' => '03',
            'avril' => '04',
            'mai' => '05',
            'juin' => '06',
            'juillet' => '07',
            'aout' => '08',
            'septembre' => '09',
            'octobre' => '10',
            'novembre' => '11',
            'decembre' => '12',
            'tous' => null
        ];

        // Nettoyage du mois (enlève les accents pour correspondance)
        $month = iconv('UTF-8', 'ASCII//TRANSLIT', $month);
        $month = preg_replace('/[^a-z]/', '', $month);

        if (!array_key_exists($month, $frenchMonths)) {
            return response()->json([
                'message' => 'Mois invalide. Utilisez un mois français valide ou "tous"',
                'valid_months' => array_keys($frenchMonths),
                'status' => 400
            ], 400);
        }

        $monthNumber = $frenchMonths[$month];

        // Construction de la date pour requête SQL optimisée
        $dateFilter = function($query) use ($year, $monthNumber) {
            if ($monthNumber) {
                $query->where('created_at', 'LIKE', "{$year}-{$monthNumber}-%");
            } else {
                $query->where('created_at', 'LIKE', "{$year}-%");
            }
        };

        // Récupération avec eager loading
        $data = [
            'resource' => Resource::where($dateFilter)->get(),
            'spend' => Spend::where($dateFilter)->get(),
            'detail' => Detail::where($dateFilter)->get(),
            'make' => Make::where($dateFilter)->get(),
        ];

        return response()->json([
            'message' => 'Données filtrées avec succès',
            'data' => $data,
            'filters_applied' => [
                'year' => $year,
                'month' => $monthNumber ?: 'Tous les mois',
                'format_date' => 'YYYY-MM-DD HH:MM:SS'
            ],
            'status' => 200
        ], 200);
    }

    public function postData(Request $request) 
    {
        $request->validate(['projectId' => 'required|integer']);

        try {
            foreach ($request->ressource ?? [] as $value) {
                $exist = Resource::where('id', $value["id"])->first();
                if ($exist) {
                    $exist->update([
                        'origine_resource' => $value["name"],
                        'price_resource' => $value["prix"],
                        'project_id' => (int) $request->projectId,
                    ]);
                } else {
                    Resource::create([
                        'origine_resource' => $value["name"],
                        'price_resource' => $value["prix"],
                        'project_id' => (int) $request->projectId
                    ]);
                }
            }

            foreach ($request->depense ?? [] as $value) {
                $exist = Spend::where('id', $value["id"])->first();
                if ($exist) {
                    $exist->update([
                        'name_spend' => $value["name"],
                        'project_id' => (int) $request->projectId,
                    ]);
                } else {
                    Spend::create([
                        'name_spend' => $value["name"],
                        'project_id' => (int) $request->projectId,
                    ]);
                }
            }

            foreach ($request->detail ?? [] as $value) {
                $exist = Detail::where('id', $value["id"])->first();
                if ($exist) {
                    $exist->update([
                        'name_detail' => $value["value"],
                        'spend_id' => $value["depense_id"]
                    ]);
                } else {
                    Detail::create([
                        'name_detail' => $value["value"],
                        'spend_id' => $value["depense_id"],
                    ]);
                }
            }

            foreach ($request->make ?? [] as $value) {
                $exist = Make::where('id', $value["id"])->first();
                if ($exist) {
                    $exist->update([
                        'detail_id' => $value["detail_id"],
                        'resource_id' => $value["ressource_id"],
                        'price_spend' => $value["prix"]
                    ]);
                } else {
                    Make::create([
                        'detail_id' => $value["detail_id"],
                        'resource_id' => $value["ressource_id"],
                        'price_spend' => $value["prix"]
                    ]);
                }
            }
            return response()->json(['message' => 'Enregistrement reussite!', 'Data' => $request->make]);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Erreur d\'enregistrement! ' . $e->getMessage(), 'Data' => $request->ressource]);
        }
    }
}
