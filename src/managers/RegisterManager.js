export class RegisterManager
{
 InformData()
 {
   const email = $("#email").value;
   const password = $("#password").value
   const confirm_password = $("#confirm_password").value;

   VerifyInformation()
   {
    if(!(password == confirm_password) || !(email.includes("@")))
    {
        console.log("Dados Incorretos.")
        return;
    }
    else{
        data = {email , password};

        import {register} from './AuthManager.js';
    }
   }

 }

}