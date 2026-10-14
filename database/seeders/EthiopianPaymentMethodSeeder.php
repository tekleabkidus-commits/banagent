<?php

namespace Database\Seeders;

use App\Models\PaymentMethod;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class EthiopianPaymentMethodSeeder extends Seeder
{
    /** Provider options, not payment gateway integrations. */
    public const METHODS = [
        'telebirr' => 'TeleBirr',
        'mpesa' => 'M-Pesa',
        'cbe_birr' => 'CBE Birr',
        'amole' => 'Amole',
        'ebirr' => 'E-Birr',
        'hellocash' => 'HelloCash',
        'kacha' => 'Kacha',
        'yaya' => 'Yaya Wallet',
        'cbe' => 'Commercial Bank of Ethiopia',
        'awash' => 'Awash Bank',
        'dashen' => 'Dashen Bank',
        'boa' => 'Bank of Abyssinia',
        'coop' => 'Cooperative Bank of Oromia',
        'wegagen' => 'Wegagen Bank',
        'abay' => 'Abay Bank',
        'addis_international' => 'Addis International Bank',
        'ahadu' => 'Ahadu Bank',
        'amhara' => 'Amhara Bank',
        'berhan' => 'Berhan Bank',
        'bunna' => 'Bunna Bank',
        'development_bank' => 'Development Bank of Ethiopia',
        'enat' => 'Enat Bank',
        'gadaa' => 'Gadaa Bank',
        'global' => 'Global Bank Ethiopia',
        'goh' => 'Goh Betoch Bank',
        'hibret' => 'Hibret Bank',
        'hijra' => 'Hijra Bank',
        'lion' => 'Lion International Bank',
        'nib' => 'Nib International Bank',
        'oromia' => 'Oromia Bank',
        'omo' => 'Omo Bank',
        'rammis' => 'Rammis Bank',
        'shabelle' => 'Shabelle Bank',
        'sidama' => 'Sidama Bank',
        'siinqee' => 'Siinqee Bank',
        'siket' => 'Siket Bank',
        'tsedey' => 'Tsedey Bank',
        'tsehay' => 'Tsehay Bank',
        'zamzam' => 'Zam Zam Bank',
        'zemen' => 'Zemen Bank',
    ];

    public function run(): void
    {
        DB::transaction(function () {
            $order = (int) PaymentMethod::withTrashed()->max('display_order');
            foreach (self::METHODS as $slug => $name) {
                $method = PaymentMethod::withTrashed()->where('slug', $slug)->first()
                    ?? PaymentMethod::withTrashed()->whereRaw('LOWER(display_name) = ?', [strtolower($name)])->first();
                if (! $method) {
                    $order += 10;
                    $method = new PaymentMethod([
                        'slug' => $slug,
                        'display_name' => $name,
                        'display_order' => $order,
                    ]);
                }
                // Keep IDs, custom names, icons, order, and agent relationships.
                $method->is_active = true;
                $method->deleted_at = null;
                $method->save();
            }
        });
        Cache::forget('public_agents');
        $this->command?->info(count(self::METHODS).' Ethiopian bank and wallet options activated.');
    }
}
