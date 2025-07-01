import { createClient } from '@supabase/supabase-js';
import { Filter } from 'bad-words'; // Correcte import voor bad-words

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Initialiseer Supabase client met omgevingsvariabelen
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initialiseer de bad-words filter
const filter = new Filter();

// Optioneel: Voeg extra woorden toe aan de filter
// filter.addWords('jouw', 'eigen', 'woorden');

export default async function handler(req, res) {
    // Controleer of het een POST-verzoek is
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { playerName, score } = req.body;

    // Basisvalidatie van de input
    if (!playerName || typeof playerName !== 'string' || playerName.trim() === '') {
        return res.status(400).json({ message: 'Ongeldige naam: Naam is verplicht.' });
    }
    if (typeof score !== 'number' || score < 0) {
        return res.status(400).json({ message: 'Ongeldige score: Score moet een positief getal zijn.' });
    }

    // Naam opschonen en valideren
    const trimmedPlayerName = playerName.trim();

    // Optionele whitelisting van karakters (alleen letters, cijfers, spaties)
    const isValidCharacters = /^[a-zA-Z0-9\s]+$/.test(trimmedPlayerName);
    if (!isValidCharacters) {
        return res.status(400).json({ message: 'Ongeldige naam: Alleen letters, cijfers en spaties zijn toegestaan.' });
    }

    // Profaniteitsfilter toepassen
    if (filter.isProfane(trimmedPlayerName)) {
        return res.status(400).json({ message: 'Ongeldige naam: Bevat ongepaste inhoud.' });
    }

    // Beperk de lengte van de naam
    if (trimmedPlayerName.length < 2 || trimmedPlayerName.length > 15) {
        return res.status(400).json({ message: 'Ongeldige naam: Naam moet tussen 2 en 15 tekens lang zijn.' });
    }

    try {
        // Voeg de score toe aan de Supabase tabel
        const { data, error } = await supabase
            .from('scores') // Zorg ervoor dat dit de juiste tabelnaam is
            .insert([
                { player_name: trimmedPlayerName, score: score }
            ]);

        if (error) {
            console.error('Supabase insert error:', error);
            return res.status(500).json({ message: 'Fout bij opslaan score', error: error.message });
        }

        res.status(200).json({ message: 'Score succesvol opgeslagen', data });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Interne serverfout' });
    }
}