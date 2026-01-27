<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Make extends Model
{
    protected $fillable = [
        'detail_id',
        'resource_id',
        'price_spend',
    ];
    public function resource()
    {
        return $this->belongsTo(Resource::class);
    }
    public function detail()
    {
        return $this->belongsTo(Detail::class);
    }
}
