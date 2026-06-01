//import { register } from './AuthManager.js';

export class RegisterManager
{
 DoRegister(nomeJogador, email, password, confirmPassword)
 {
  
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
   
  //const resultado = register(nomeJogador, email, password);
  const resultado = {dados: {nomeJogador, email, password}, erro: null}; // Simulação de resultado bem-sucedido

  //
  return resultado;
   
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
        if(password.length >= 3){return true;}
        else{console.log("Senha Inválida."); return false;}
    }
    verifyConfirmPassword(password, confirmPassword)
    {
        if(password === confirmPassword){return true;}
        else{console.log("As senhas não coincidem."); return false;}
    }
}