<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MailLogs extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'recipient',
        'recipient_email',
        'sender',
        'sender_email',
        'subject',
        'link',
        'is_sent',
        'is_opened',
    ];
   
}
