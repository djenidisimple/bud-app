<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'name_project',
        'description_project',
        'user_id',
        'active'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
