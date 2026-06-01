import { AuthManager } from './AuthManager.js'; 

export class RegisterManager
{
    // usamos async porque a comunicaçao com a base de dados (supabase) nao e instantanea
    async DoRegister(nomeJogador, email, password, confirmPassword)
    {
        // verificaçoes locais
        if(this.verifyUser(nomeJogador) == false){
            return {dados: null, erro: "Nome de jogador inválido"};
        }

        if(this.verifyEmail(email) == false){
            return {dados: null, erro: "Email inválido"};
        }

        if(this.verifyPassword(password)== false){
            return {dados: null, erro: "Senha inválida"};
        }
        
        if(this.verifyConfirmPassword(password, confirmPassword) == false){
            return {dados: null, erro: "As senhas não coincidem"};
        }
      
        // o await faz com que o código espere a resposta da base de dados antes de continuar, garantindo que temos os dados ou o erro antes de prosseguir
        const { data, error } = await AuthManager.register(email, password, nomeJogador);

        if (error) {
            return {dados: null, erro: error.message}; 
        }
        return {dados: data, erro: null};
    }

    verifyUser(nomeJogador){
        if(nomeJogador.length >= 3){return true;} 
        else{console.log("Nome de jogador inválido."); return false;}
    } 

    verifyEmail(email)
    { 
        if(email.includes("@")){return true;} 
        else{console.log("Email Inválido."); return false;}
    }
   
    verifyPassword(password)
    {
        if(password.length >= 6){return true;} 
        else{console.log("Senha Inválida."); return false;}
    }

    verifyConfirmPassword(password, confirmPassword)
    {
        if(password === confirmPassword){return true;}
        else{console.log("As senhas não coincidem"); return false;}
    }
}