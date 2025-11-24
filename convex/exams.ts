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

// Criar prova
export const createExam = mutation({
  args: {
    classId: v.id("classes"),
    title: v.string(),
    description: v.optional(v.string()),
    totalPoints: v.number(),
  },
  handler: async (ctx, args) => {
    const professorId = await getProfessorId(ctx);

    // Verificar se a turma pertence ao professor
    const classData = await ctx.db.get(args.classId);
    if (!classData || classData.professorId !== professorId) {
      throw new Error("Turma não encontrada");
    }

    return await ctx.db.insert("exams", {
      professorId,
      classId: args.classId,
      title: args.title,
      description: args.description,
      totalPoints: args.totalPoints,
      createdAt: Date.now(),
      isActive: true,
    });
  },
});

// Listar provas do professor
export const listExams = query({
  args: { classId: v.optional(v.id("classes")) },
  handler: async (ctx, args) => {
    const professorId = await getProfessorId(ctx);

    if (args.classId) {
      return await ctx.db
        .query("exams")
        .withIndex("by_class", (q: any) => q.eq("classId", args.classId))
        .filter((q: any) => q.eq(q.field("professorId"), professorId))
        .collect();
    }

    return await ctx.db
      .query("exams")
      .withIndex("by_professor", (q) => q.eq("professorId", professorId))
      .collect();
  },
});

// Obter prova por ID
export const getExam = query({
  args: { examId: v.id("exams") },
  handler: async (ctx, args) => {
    const professorId = await getProfessorId(ctx);
    const exam = await ctx.db.get(args.examId);

    if (!exam || exam.professorId !== professorId) {
      throw new Error("Prova não encontrada");
    }

    return exam;
  },
});

// Atualizar prova
export const updateExam = mutation({
  args: {
    examId: v.id("exams"),
    title: v.string(),
    description: v.optional(v.string()),
    totalPoints: v.number(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const professorId = await getProfessorId(ctx);
    const exam = await ctx.db.get(args.examId);

    if (!exam || exam.professorId !== professorId) {
      throw new Error("Prova não encontrada");
    }

    await ctx.db.patch(args.examId, {
      title: args.title,
      description: args.description,
      totalPoints: args.totalPoints,
      isActive: args.isActive,
    });
  },
});

// Deletar prova
export const deleteExam = mutation({
  args: { examId: v.id("exams") },
  handler: async (ctx, args) => {
    const professorId = await getProfessorId(ctx);
    const exam = await ctx.db.get(args.examId);

    if (!exam || exam.professorId !== professorId) {
      throw new Error("Prova não encontrada");
    }

    // Deletar questões associadas
    const questions = await ctx.db
      .query("questions")
      .withIndex("by_exam", (q) => q.eq("examId", args.examId))
      .collect();

    for (const question of questions) {
      // Deletar critérios da questão
      const criteria = await ctx.db
        .query("evaluationCriteria")
        .withIndex("by_question", (q) => q.eq("questionId", question._id))
        .collect();

      for (const criterion of criteria) {
        await ctx.db.delete(criterion._id);
      }

      await ctx.db.delete(question._id);
    }

    await ctx.db.delete(args.examId);
  },
});

// Obter prova com questões e critérios
export const getExamWithDetails = query({
  args: { examId: v.id("exams") },
  handler: async (ctx, args) => {
    const professorId = await getProfessorId(ctx);
    const exam = await ctx.db.get(args.examId);

    if (!exam || exam.professorId !== professorId) {
      throw new Error("Prova não encontrada");
    }

    const questions = await ctx.db
      .query("questions")
      .withIndex("by_exam", (q) => q.eq("examId", args.examId))
      .collect();

    const questionsWithCriteria = await Promise.all(
      questions.map(async (question) => {
        const criteria = await ctx.db
          .query("evaluationCriteria")
          .withIndex("by_question", (q) => q.eq("questionId", question._id))
          .collect();

        return {
          ...question,
          criteria,
        };
      })
    );

    return {
      ...exam,
      questions: questionsWithCriteria,
    };
  },
});
