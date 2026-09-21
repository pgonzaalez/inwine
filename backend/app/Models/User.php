<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;

class User extends Authenticatable implements FilamentUser
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * Cuentas con acceso completo al panel de Filament. A diferencia de
     * HIDDEN_EMAILS (que solo las oculta de los listados), esta lista
     * decide quién puede entrar.
     *
     * @var list<string>
     */
    public const ADMIN_PANEL_EMAILS = [
        'polsantandreu@gmail.com',
        'pgonzalez@gmail.com',
    ];

    /**
     * Cuentas que tienen acceso normal a la aplicación (y, si les toca, al
     * panel) pero que no deben aparecer en ningún listado del panel de
     * administración (Usuaris, Rols, Cellers, Restaurants, Inversors...) ni
     * en directorios públicos. Se excluyen con el scope visibleToAdmins().
     *
     * @var list<string>
     */
    public const HIDDEN_EMAILS = [
        'pgonzalez@gmail.com',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'NIF',
        'name',
        'email',
        'password',
        'notify_by_email',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'NIF' => 'encrypted',
            'notify_by_email' => 'boolean',
        ];
    }

    public function canAccessPanel(Panel $panel): bool
    {
        // in_array con tercer parámetro strict (true) compara el email
        // exacto, nunca un sufijo o substring: cualquiercosapolsantandreu@
        // gmail.com no cuela aunque "contenga" el email de un admin.
        return in_array($this->email, self::ADMIN_PANEL_EMAILS, true) && $this->hasVerifiedEmail();
    }

    /**
     * Excluye de la consulta los correos "ocultos" (ver HIDDEN_EMAILS). Se
     * usa en los listados del panel de admin y en directorios públicos para
     * que esas cuentas no aparezcan, sin afectar al login ni a ninguna otra
     * consulta normal de la aplicación.
     */
    public function scopeVisibleToAdmins($query)
    {
        return $query->whereNotIn('email', self::HIDDEN_EMAILS);
    }

    public function restaurants()
    {
        return $this->hasOne(Restaurant::class);
    }


    public function sellers()
    {
        return $this->hasOne(Seller::class);
    }

    public function investors()
    {
        return $this->hasOne(Investor::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function requestRestaurant()
    {
        return $this->hasOne(RequestRestaurant::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function roles()
    {
        return $this->hasMany(UserRole::class);
    }

    public function favorites()
    {
        return $this->belongsToMany(Product::class, 'favorites', 'user_id', 'product_id')->withTimestamps();
    }
}
