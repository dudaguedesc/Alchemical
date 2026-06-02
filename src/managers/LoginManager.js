import { AuthManager } from './AuthManager.js'; 

export class LoginManager
{
    async Dologin(email, password)
    {
        // AuthManager faz login no supabase
        const { data, error } = await AuthManager.login(email, password); 

        // senha errada ou email não existe
        if (error) {
            return {dados: null, erro: "Email ou senha incorretos!"};
        }
        return {dados: data, erro: null};
    }
}