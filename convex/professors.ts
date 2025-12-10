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
      nome: args.name,
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

    const profile = await ctx.db
      .query("professors")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    // Retornar com nome migrado se necessário (a migração será feita via mutation quando necessário)
    if (profile && (profile as any).name && !profile.nome) {
      return {
        ...profile,
        nome: (profile as any).name,
      };
    }

    return profile;
  },
});

// Migrar perfil antigo (chamado automaticamente quando necessário)
export const migrateProfile = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    const profile = await ctx.db
      .query("professors")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (profile && (profile as any).name && !profile.nome) {
      await ctx.db.patch(profile._id, {
        nome: (profile as any).name,
      });
      return { migrated: true };
    }

    return { migrated: false };
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
      nome: args.name,
      institution: args.institution,
      department: args.department,
    });
  },
});
