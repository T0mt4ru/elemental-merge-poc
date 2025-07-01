// api/submit-score.js
import { createClient } from '@supabase/supabase-js';
import Filter from 'bad-words';

// Initialiseer Supabase client met omgevingsvariabelen
// Zorg ervoor dat SUPABASE_URL en SUPABASE_ANON_KEY zijn ingesteld in Vercel
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const filter = new Filter()

export default async function handler(req, res) {
    // Sta alleen POST-verzoeken toe
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Alleen POST-verzoeken zijn toegestaan.' });
    }

    const { playerName, score } = req.body;

    // Basisvalidatie
    if (!playerName || typeof playerName !== 'string' || playerName.trim() === '') {
        return res.status(400).json({ message: 'Spelersnaam is vereist.' });
    }

    if (typeof score !== 'number' || score < 0) {
        return res.status(400).json({ message: 'Score is ongeldig.' });
    }

    if (playerName && typeof playerName === 'string') {
    if (filter.isProfane(playerName)) {
        return res.status(400).json({ message: 'Ongeldige naam: bevat ongepaste inhoud.' });
    }
    }

    try {
        // Voeg de score toe aan de 'scores' tabel
        const { data, error } = await supabase
            .from('scores')
            .insert([
                { player_name: playerName, score: score }
            ]);

        if (error) {
            console.error('Fout bij opslaan score:', error);
            return res.status(500).json({ message: 'Fout bij opslaan score.', error: error.message });
        }

        return res.status(200).json({ message: 'Score succesvol opgeslagen.', data });

    } catch (error) {
        console.error('Serverfout:', error);
        return res.status(500).json({ message: 'Interne serverfout.', error: error.message });
    }
}
