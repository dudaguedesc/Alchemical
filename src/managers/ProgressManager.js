import { supabase } from './AuthManager.js'; // Aproveita a conexão exata que você já tem!

export class ProgressManager {
    
    async SaveProgress(novoProgresso) {
        
        // verifica qual é o jogador
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !sessionData.session) {
            console.log("Erro: Nenhum jogador logado encontrado.");
            return { sucesso: false, erro: "Jogador não autenticado" };
        }

        const userId = sessionData.session.user.id;

        //faz o update na tabela jogador
        const { data, error } = await supabase
            .from('Jogador')
            .update({ progresso: novoProgresso })
            .eq('id_conta', userId); //so atualiza a linha onde o ID bate com o usuario logado

        if (error) {
            console.error("Erro ao salvar no banco:", error.message);
            return { sucesso: false, erro: error.message };
        }

        console.log("Progresso salvo com sucesso! Novo valor:", novoProgresso);
        return { sucesso: true, dados: data };
    }
}