import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
     
     let token=localStorage.getItem('token')

     let clonereq=req.clone({
      setHeaders:{
        Authorization:`Bearer ${token}`
      }
     })


  return next(clonereq);
};
