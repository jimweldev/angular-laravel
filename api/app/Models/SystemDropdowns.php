<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SystemDropdowns extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'module',
        'name',
        'value',
        'default',
        'created_by',
    ];

    public function creator()
    {
        return $this->hasOne(User::class, 'id', 'created_by');
    }
}
