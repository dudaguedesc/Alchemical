import { createClient } from '@supabase/supabase-js';

//(Project Settings > API)
const SUPABASE_URL = 'https://wfokujwbgwnxtyxuyjih.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_FYWgjiQ2g8XNjp8U8_xUVQ_PzpTlB1Z';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export class AuthManager {
    
    static async login(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        return { data, error };
    }

    static async register(email, password, nomeJogador) {
        // cria as credenciais de acesso no módulo de autenticação
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (authError) return { error: authError };

        //se a conta foi gerada, registra o perfil na tabela Jogador
        if (authData?.user) {
            const { error: playerError } = await supabase
                .from('Jogador')
                .insert([
                    {
                        nome: nomeJogador,
                        id_conta: authData.user.id, // associa à conta criada
                        progresso: 0.0
                    }
                ]);

            if (playerError) return { error: playerError };
        }

        return { data: authData, error: null };
    }

    //encerra a sessão ativa do usuário
    static async logout() {
        const { error } = await supabase.auth.signOut();
        return { error };
    }

    //retorna os dados da sessão atual
    static async getSession() {
        const { data, error } = await supabase.auth.getSession();
        if (error) return null;
        return data?.session;
    }
}