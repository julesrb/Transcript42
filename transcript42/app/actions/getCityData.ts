"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { City } from "../types/city";

/**
 * Fetches city data from Supabase city_data table.
 * This is a Server Action to ensure database access happens on the server side.
 */
export async function getCityData(): Promise<City[]> {
    try {
        const { data, error } = await supabaseAdmin
            .from('city_data')
            .select('campus, lat, lng, value')
            .order('value', { ascending: false });

        if (error) {
            console.error('Error fetching city data from Supabase:', error);
            return [];
        }

        if (!data || data.length === 0) {
            return [];
        }

        return data as City[];
    } catch (e) {
        console.error('Unexpected error fetching city data:', e);
        return [];
    }
}
