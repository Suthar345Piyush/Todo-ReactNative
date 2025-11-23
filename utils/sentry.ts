import * as Sentry from '@sentry/react-native';

export const initSentry = () => {
   Sentry.init({

     // our actual dsn here 

      dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,

      //enabling tracing(set this undefined to not trace , so it don't sent any traces to sentry)
      
      tracesSampleRate : 1.0,

      // for capturing the errors 

      enableAutoSessionTracking : true,
      sessionTrackingIntervalMillis : 10000,


      // environment setup 

      environment: __DEV__ ? 'development' : 'production',

      // release tracking  

      release : 'todo-app@1.0.0',

      //to get the user feedback  

      enableUserInteractionTracing : true,

   });
};


// function to manually capture issues/errors 

export const captureError = (error : Error , context? : Record<string , any>) => {
    Sentry.captureException(error , {
       extra : context,
    });
};



//function to add breadCrumbs (tracing user actions , before any error)

export const addBreadCrumb = (message : string , category : string , data? : any) => {
    Sentry.addBreadcrumb({
        message,
        category,
        data,
        level : 'info',
    });
};




