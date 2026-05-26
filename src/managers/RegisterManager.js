export class RegisterManager
{
 InformData()
 {
   const email = $("#email").value;
   const password = $("#password").value;
   const nomeJogador = $("#nomeJogador").value;
   const confirm_password = $("#confirm_password").value;
     
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

}