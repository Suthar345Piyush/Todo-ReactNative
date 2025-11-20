import {defineSchema , defineTable} from "convex/server";

import { v }  from "convex/values";


export default defineSchema({
   todos : defineTable({
     text : v.string(),
     isCompleted : v.boolean(),
     notificationId : v.optional(v.string()),
     deadlineHours : v.optional(v.number()),
     createdAt : v.number(),
   }),
   
   /* 
     todo history schema   
   */

     todoHistory : defineTable({
       todoText : v.string(),
       action : v.string(),       // "created" , "delete" , "completed"
       timestamp : v.number(),
       todoId : v.optional(v.string()),   // to track with original todo  
       additionalInfo : v.optional(v.string()),
     }).index("by_timestamp" , ["timestamp"]),

});


