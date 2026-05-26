export class LoginManager
{
    constructor(email, password)
    {
   this.email = email;
   this.password = password;
    }
     
    verifyEmail(email)
    { 
        if(email.includes("@")){return true;} 
        else{return false;}
    }
     
    login(email,password)
    {
      if(verifyEmail(email) == true)
      {
        import {login} from './AuthManager.js';
        const log = new login();
        const {data , erro} = log.login(email, password);
        if( data !== null  && erro == null)
        {
            return true;
        }
        else{
            console.log("Dados Inválidos.");
            return false;
        }
      }
      else{
        console.log("Email Inválido.");
        return; 
      }
    }
 

}