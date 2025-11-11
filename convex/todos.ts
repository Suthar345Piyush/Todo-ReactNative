// react native app sent a query to convex db to get the todos 

import { mutation, query } from "./_generated/server";
import { ConvexError , v } from "convex/values";

export const getTodos = query({
   handler : async (ctx) => {
     const todos = await ctx.db.query("todos").order("desc").collect();
     return todos;
   }
});

//for adding the todo doing mutation

export const addTodo = mutation({
   args : {
     text : v.string(),
     notificationId : v.optional(v.string()),      // storing notification id  
     deadlineHours : v.optional(v.number()),     // storing  deadline time for the particular todo 
    },

   handler : async (ctx , args) => {
     const todoId = await ctx.db.insert("todos" , {
       text : args.text,
       isCompleted : false,
       notificationId : args.notificationId,
       deadlineHours : args.deadlineHours,
       createdAt : Date.now(),

     });

     return todoId;
   },
});


//for toggle the todo 


export const toggleTodo = mutation({
   args : {id : v.id("todos")},
   handler : async(ctx , args) => {
     const todo = await ctx.db.get(args.id)
     if (!todo) throw new ConvexError("Todo not found")


     await ctx.db.patch(args.id , {
       isCompleted : !todo.isCompleted
     })

     // return the updated todo , we can cancel the notification , if it's completed 
     const updatedTodo =  await ctx.db.get(args.id);
      return updatedTodo;
   }
});



//for deleting the todo 


export const deleteTodo = mutation({
   args : {id : v.id("todos")},
   handler : async (ctx , args) => {
   
    // taking todo before deletion , so  we can cancel the notification 
    const todo = await ctx.db.get(args.id); 
     await ctx.db.delete(args.id);

     // returning the notification id , so caller can cancel it
     
     return {notification : todo?.notificationId};
     
   },
});


//editing the todo (update)

export const updateTodo = mutation({
   args : {
     id : v.id("todos"),
     text : v.string(),
   },
   handler : async (ctx , args) => {
     await ctx.db.patch(args.id , {
       text : args.text,
     });
   },
});


//clearing all the todos 

export const clearAllTodos = mutation({
   handler : async (ctx) => {
     const todos  = await ctx.db.query("todos").collect();

     // collecting all notificationId's , before delete them all 
     
      const notificationIds = todos.map(todo => todo.notificationId).filter(id => id !== undefined);

     //delete all the todos 
     
     for(const todo of todos) {
       await ctx.db.delete(todo._id);
     }
     return {
      deletedCount : todos.length,
      notificationIds : notificationIds
      };
   }
});







