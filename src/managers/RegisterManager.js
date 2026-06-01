import { register } from './AuthManager.js';

export class RegisterManager
{
 DoRegister(nomeJogador, email, password, confirmPassword)
 {
  
  
   const AllCorrect = email !=null && password != null && confirm_password !=null && nomeJogador !=null;
    //verifica se não tem nada nulo.
   VerifyInformation()
   {
    if(!(password == confirm_password) || !(email.includes("@")) || AllCorrect != true)
    {
        console.log("Dados Incorretos.")
        return false;
    }
    else{
        import {register} from './AuthManager.js';
         const reg = new register;
         reg.register(email, password, nomeJogador);
         console.log("Conta Cadastrada");
    }
   }

 }
  veryfyUser(nomeJogador){
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
        if(password.length >= 3){return true;}
        else{console.log("Senha Inválida."); return false;}
    }
    verifyConfirmPassword(password, confirmPassword)
    {
        if(password === confirmPassword){return true;}
        else{console.log("As senhas não coincidem."); return false;}
    }
}