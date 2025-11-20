import { mutation , query} from "./_generated/server";
import { v } from "convex/values";


// adding todo history entry  

export const addHistoryEntry = mutation({

    args : {
       todoText : v.string(),
       action : v.string(),
       todoId : v.optional(v.string()),
       additionalInfo : v.optional(v.string()),
    },

    handler : async (ctx , args) => {
        const historyId = await  ctx.db.insert('todoHistory' , {
             todoText : args.todoText,
             action : args.action,
             timestamp :  Date.now(),
             todoId : args.todoId,
             additionalInfo : args.additionalInfo,
        });
        
        return historyId;
    },
});



// getting all the history entries (sorted by the time they created)

export const getHistory = query({
    handler : async(ctx) => {
         const history = await ctx.db
          .query("todoHistory")
          .order("desc")
          .collect();

          return history;
    },
});



// taking the history for specific todo 

export const getHistoryForTodo = query({

    args : {todoId : v.string()},

    handler : async (ctx , args) => {
         await ctx.db.query("todoHistory").filter((q) => q.eq(q.field("todoId") , args.todoId))
         .order("desc")
         .collect();

         return history;
    },
});




// getting history stats 

export const getHistoryStats = query({
     handler : async (ctx) => {
         const history = await ctx.db.query("todoHistory").collect();

         // created for all three actions  

         const created = history.filter(h => h.action === 'created').length;

         const completed = history.filter(h => h.action === 'completed').length;

         const deleted = history.filter(h => h.action === 'deleted').length;


         const completionRate = created > 0 ? Math.round((completed / created) * 100) : 0;


         return {
             totalCreated : created,
             totalCompleted : completed,
             totalDeleted : deleted,
             completionRate,
         };
     },
});



// new feat , where we can clear all the history  

export const clearHistory = mutation({
     handler : async (ctx) => {
         const history = await ctx.db.query("todoHistory").collect();


         for(const entry of history) {
             await ctx.db.delete(entry._id);
         }

         return {
                    deletedCount : history.length
                };
     },
});




