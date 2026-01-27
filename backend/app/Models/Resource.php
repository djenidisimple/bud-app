<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resource extends Model
{
    protected $fillable = [
        'origine_resource',
        'price_resource',
        'project_id'
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
