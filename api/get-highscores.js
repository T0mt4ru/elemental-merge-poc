// api/get-highscores.js
import { createClient } from '@supabase/supabase-js';

// Initialiseer Supabase client met omgevingsvariabelen
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
    // Sta alleen GET-verzoeken toe
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Alleen GET-verzoeken zijn toegestaan.' });
    }

    try {
        // Haal de top 10 scores op, gesorteerd op score aflopend
        const { data, error } = await supabase
            .from('scores')
            .select('player_name, score') // Selecteer alleen de benodigde kolommen
            .order('score', { ascending: false }) // Sorteer aflopend op score
            .limit(10); // Beperk tot de top 10

        if (error) {
            console.error('Fout bij ophalen highscores:', error);
            return res.status(500).json({ message: 'Fout bij ophalen highscores.', error: error.message });
        }

        return res.status(200).json({ highscores: data });

    } catch (error) {
        console.error('Serverfout:', error);
        return res.status(500).json({ message: 'Interne serverfout.', error: error.message });
    }
}
