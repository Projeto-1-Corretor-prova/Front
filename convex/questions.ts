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

// Criar questão
export const createQuestion = mutation({
  args: {
    examId: v.id("exams"),
    questionNumber: v.number(),
    questionText: v.string(),
    points: v.number(),
    expectedAnswer: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const professorId = await getProfessorId(ctx);

    // Verificar se a prova pertence ao professor
    const exam = await ctx.db.get(args.examId);
    if (!exam || exam.professorId !== professorId) {
      throw new Error("Prova não encontrada");
    }

    return await ctx.db.insert("questions", {
      examId: args.examId,
      questionNumber: args.questionNumber,
      questionText: args.questionText,
      points: args.points,
      expectedAnswer: args.expectedAnswer,
    });
  },
});

// Listar questões de uma prova
export const listQuestions = query({
  args: { examId: v.id("exams") },
  handler: async (ctx, args) => {
    const professorId = await getProfessorId(ctx);

    // Verificar se a prova pertence ao professor
    const exam = await ctx.db.get(args.examId);
    if (!exam || exam.professorId !== professorId) {
      throw new Error("Prova não encontrada");
    }

    return await ctx.db
      .query("questions")
      .withIndex("by_exam", (q) => q.eq("examId", args.examId))
      .collect();
  },
});

// Atualizar questão
export const updateQuestion = mutation({
  args: {
    questionId: v.id("questions"),
    questionNumber: v.number(),
    questionText: v.string(),
    points: v.number(),
    expectedAnswer: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const professorId = await getProfessorId(ctx);
    const question = await ctx.db.get(args.questionId);

    if (!question) {
      throw new Error("Questão não encontrada");
    }

    // Verificar se a prova pertence ao professor
    const exam = await ctx.db.get(question.examId);
    if (!exam || exam.professorId !== professorId) {
      throw new Error("Prova não encontrada");
    }

    await ctx.db.patch(args.questionId, {
      questionNumber: args.questionNumber,
      questionText: args.questionText,
      points: args.points,
      expectedAnswer: args.expectedAnswer,
    });
  },
});

// Deletar questão
export const deleteQuestion = mutation({
  args: { questionId: v.id("questions") },
  handler: async (ctx, args) => {
    const professorId = await getProfessorId(ctx);
    const question = await ctx.db.get(args.questionId);

    if (!question) {
      throw new Error("Questão não encontrada");
    }

    // Verificar se a prova pertence ao professor
    const exam = await ctx.db.get(question.examId);
    if (!exam || exam.professorId !== professorId) {
      throw new Error("Prova não encontrada");
    }

    // Deletar critérios associados
    const criteria = await ctx.db
      .query("evaluationCriteria")
      .withIndex("by_question", (q) => q.eq("questionId", args.questionId))
      .collect();

    for (const criterion of criteria) {
      await ctx.db.delete(criterion._id);
    }

    await ctx.db.delete(args.questionId);
  },
});

// Criar critério de avaliação
export const createCriterion = mutation({
  args: {
    questionId: v.id("questions"),
    criteriaText: v.string(),
    points: v.number(),
    isKeyword: v.boolean(),
    weight: v.number(),
  },
  handler: async (ctx, args) => {
    const professorId = await getProfessorId(ctx);
    const question = await ctx.db.get(args.questionId);

    if (!question) {
      throw new Error("Questão não encontrada");
    }

    // Verificar se a prova pertence ao professor
    const exam = await ctx.db.get(question.examId);
    if (!exam || exam.professorId !== professorId) {
      throw new Error("Prova não encontrada");
    }

    return await ctx.db.insert("evaluationCriteria", {
      questionId: args.questionId,
      criteriaText: args.criteriaText,
      points: args.points,
      isKeyword: args.isKeyword,
      weight: args.weight,
    });
  },
});

// Listar critérios de uma questão
export const listCriteria = query({
  args: { questionId: v.id("questions") },
  handler: async (ctx, args) => {
    const professorId = await getProfessorId(ctx);
    const question = await ctx.db.get(args.questionId);

    if (!question) {
      throw new Error("Questão não encontrada");
    }

    // Verificar se a prova pertence ao professor
    const exam = await ctx.db.get(question.examId);
    if (!exam || exam.professorId !== professorId) {
      throw new Error("Prova não encontrada");
    }

    return await ctx.db
      .query("evaluationCriteria")
      .withIndex("by_question", (q) => q.eq("questionId", args.questionId))
      .collect();
  },
});

// Deletar critério
export const deleteCriterion = mutation({
  args: { criterionId: v.id("evaluationCriteria") },
  handler: async (ctx, args) => {
    const professorId = await getProfessorId(ctx);
    const criterion = await ctx.db.get(args.criterionId);

    if (!criterion) {
      throw new Error("Critério não encontrado");
    }

    const question = await ctx.db.get(criterion.questionId);
    if (!question) {
      throw new Error("Questão não encontrada");
    }

    // Verificar se a prova pertence ao professor
    const exam = await ctx.db.get(question.examId);
    if (!exam || exam.professorId !== professorId) {
      throw new Error("Prova não encontrada");
    }

    await ctx.db.delete(args.criterionId);
  },
});
