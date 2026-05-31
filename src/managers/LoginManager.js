//import { AuthorManager } from './AuthorManager.js';

export class LoginManager
{
    Dologin(email, password)
    {
      
     if(this.verifyEmail(email) == false){
        return {dados: null, erro: "Email inválido"};
     }
     else if(this.verifyPassword(password)== false){
        return {dados: null, erro: "Senha inválida"};
     }

     else{
      //const resultado =  AuthorManager.login(email, password);
     const resultado =  {dados: {email: "admin@email.com" ,password: "123"}, erro: null}; // Simulação de um login bem-sucedido

      return resultado;
     }

   }
   //verificação de email e senha, para evitar que o usuário tente logar com um email ou senha claramente inválidos.
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

   }

 
   
