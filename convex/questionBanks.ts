import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

async function getProfessorId(ctx: any) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Usuário não autenticado");
  }

  const professor = await ctx.db
    .query("professors")
    .withIndex("by_user", (q: any) => q.eq("userId", userId))
    .unique();

  if (!professor) {
    throw new Error("Perfil de professor não encontrado");
  }

  return professor._id;
}

// Criar banco de questões
export const createQuestionBank = mutation({
  args: {
    titulo: v.string(),
  },
  handler: async (ctx, args) => {
    const professorId = await getProfessorId(ctx);

    return await ctx.db.insert("questionBanks", {
      professorId,
      titulo: args.titulo,
    });
  },
});

// Listar bancos de questões do professor
export const listQuestionBanks = query({
  args: {},
  handler: async (ctx) => {
    const professorId = await getProfessorId(ctx);

    return await ctx.db
      .query("questionBanks")
      .withIndex("by_professor", (q) => q.eq("professorId", professorId))
      .collect();
  },
});

// Obter banco de questões por ID
export const getQuestionBank = query({
  args: { questionBankId: v.id("questionBanks") },
  handler: async (ctx, args) => {
    const professorId = await getProfessorId(ctx);
    const questionBank = await ctx.db.get(args.questionBankId);

    if (!questionBank || questionBank.professorId !== professorId) {
      throw new Error("Banco de questões não encontrado");
    }

    return questionBank;
  },
});

// Atualizar banco de questões
export const updateQuestionBank = mutation({
  args: {
    questionBankId: v.id("questionBanks"),
    titulo: v.string(),
  },
  handler: async (ctx, args) => {
    const professorId = await getProfessorId(ctx);
    const questionBank = await ctx.db.get(args.questionBankId);

    if (!questionBank || questionBank.professorId !== professorId) {
      throw new Error("Banco de questões não encontrado");
    }

    await ctx.db.patch(args.questionBankId, {
      titulo: args.titulo,
    });
  },
});

// Deletar banco de questões
export const deleteQuestionBank = mutation({
  args: { questionBankId: v.id("questionBanks") },
  handler: async (ctx, args) => {
    const professorId = await getProfessorId(ctx);
    const questionBank = await ctx.db.get(args.questionBankId);

    if (!questionBank || questionBank.professorId !== professorId) {
      throw new Error("Banco de questões não encontrado");
    }

    // Verificar se há questões associadas
    const questions = await ctx.db
      .query("questions")
      .withIndex("by_question_bank", (q) => q.eq("questionBankId", args.questionBankId))
      .collect();

    if (questions.length > 0) {
      throw new Error("Não é possível deletar banco de questões com questões associadas");
    }

    await ctx.db.delete(args.questionBankId);
  },
});

