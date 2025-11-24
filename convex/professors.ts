import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Criar perfil de professor
export const createProfile = mutation({
  args: {
    name: v.string(),
    institution: v.optional(v.string()),
    department: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    // Verificar se já existe perfil
    const existingProfile = await ctx.db
      .query("professors")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (existingProfile) {
      throw new Error("Perfil já existe");
    }

    return await ctx.db.insert("professors", {
      userId,
      name: args.name,
      email: user.email || "",
      institution: args.institution,
      department: args.department,
    });
  },
});

// Obter perfil do professor atual
export const getCurrentProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    return await ctx.db
      .query("professors")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
  },
});

// Atualizar perfil
export const updateProfile = mutation({
  args: {
    name: v.string(),
    institution: v.optional(v.string()),
    department: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    const profile = await ctx.db
      .query("professors")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!profile) {
      throw new Error("Perfil não encontrado");
    }

    await ctx.db.patch(profile._id, {
      name: args.name,
      institution: args.institution,
      department: args.department,
    });
  },
});
