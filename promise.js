class myPromise{
    result;
    status;
 
    constructor(executor) {
         console.log("contructor called");
         executor(this.resolve,this.reject); 
     }
 
    then(resolve, reject){     
         console.log("inside then"); 
         if(this.status == "fulfilled")
             {alert(resolve);}
         else{
             alert(reject);
         }
 
         return new myPromise(resolve, reject);
     }
 
     catch(resolve, reject){
         alert(reject);
         //this.reject(reject);
         return new myPromise(resolve, reject);
     }
 
     resolve(result){
         this.result = result;
         this.status = "fulfilled";
     }
 
     reject(result){
         this.result = result;
         this.status = "rejected";
     }
 
 }
 const wait = ms => new myPromise(resolve => setTimeout(resolve, ms));
 wait(60000000).then((resolve) => alert("inside wait"))
 .then( () => console.log("inside 2nd then call"));
 
 alert("I am waiting...");
 alert("Hi Nupur!!");