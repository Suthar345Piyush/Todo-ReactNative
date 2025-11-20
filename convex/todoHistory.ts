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
        const historyId = await 
    }



})