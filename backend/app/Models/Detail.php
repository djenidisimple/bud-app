<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Detail extends Model
{
    protected $fillable = [
        'name_detail',
        'spend_id',
    ];

    public function spend()
    {
        return $this->belongsTo(Spend::class);
    }
}
