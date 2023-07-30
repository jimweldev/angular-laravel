<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserLogs extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'activity',
        'notes',
        'created_by',
    ];
    
    public function creator()
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }
}
