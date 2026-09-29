<?php

namespace App\Http\Controllers;

use App\Models\Commission;

class CommissionController extends Controller
{
    /**
     * Relació tipus (per a la URL) -> nom exacte de la fila a la taula
     * commissions. Llista tancada a propòsit: només s'exposen aquestes
     * tres, mai un nom arbitrari rebut per paràmetre.
     */
    private const COMMISSION_NAMES = [
        'product' => 'Comissió pel producte',
        'restaurant' => 'Comissió pel restaurant',
        'investor' => "Comissió per l'inversor",
    ];

    /**
     * Percentatge d'una de les tres comissions de la plataforma. Pública i
     * de només lectura: exposa el percentatge configurat al panell
     * d'administració perquè el frontend pugui avisar l'usuari (celler,
     * restaurant o inversor) de quina comissió se li aplicarà, mai imports
     * d'una venda concreta. El càrrec/descompte definitiu sempre el calcula
     * el servidor (StripeController, RequestRestaurant::booted, etc.).
     */
    public function show(string $type)
    {
        if (!array_key_exists($type, self::COMMISSION_NAMES)) {
            return response()->json(['message' => 'Tipus de comissió desconegut.'], 404);
        }

        $percentage = Commission::where('name', self::COMMISSION_NAMES[$type])->value('percentage') ?? 0;

        return response()->json(['percentage' => (float) $percentage]);
    }
}
