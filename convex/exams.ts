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
    titulo: v.string(),
    campoIdentificador: v.string(),
    peso: v.number(),
  },
  handler: async (ctx, args) => {
    const professorId = await getProfessorId(ctx);

    // Verificar se a turma pertence ao professor
    const classData = await ctx.db.get(args.classId);
    if (!classData || classData.professorId !== professorId) {
      throw new Error("Turma não encontrada");
    }

    return await ctx.db.insert("exams", {
      classId: args.classId,
      titulo: args.titulo,
      campoIdentificador: args.campoIdentificador,
      peso: args.peso,
    });
  },
});

// Listar provas do professor
export const listExams = query({
  args: { classId: v.optional(v.id("classes")) },
  handler: async (ctx, args) => {
    const professorId = await getProfessorId(ctx);

    if (args.classId) {
      // Verificar se a turma pertence ao professor
      const classData = await ctx.db.get(args.classId);
      if (!classData || classData.professorId !== professorId) {
        throw new Error("Turma não encontrada");
      }

      return await ctx.db
        .query("exams")
        .withIndex("by_class", (q: any) => q.eq("classId", args.classId))
        .collect();
    }

    // Buscar todas as turmas do professor e suas provas
    const classes = await ctx.db
      .query("classes")
      .withIndex("by_professor", (q) => q.eq("professorId", professorId))
      .collect();

    const allExams = await Promise.all(
      classes.map(async (classItem) => {
        const exams = await ctx.db
          .query("exams")
          .withIndex("by_class", (q) => q.eq("classId", classItem._id))
          .collect();
        return exams;
      })
    );

    return allExams.flat();
  },
});

// Obter prova por ID
export const getExam = query({
  args: { examId: v.id("exams") },
  handler: async (ctx, args) => {
    const professorId = await getProfessorId(ctx);
    const exam = await ctx.db.get(args.examId);

    if (!exam) {
      throw new Error("Prova não encontrada");
    }

    // Verificar se a turma pertence ao professor
    const classData = await ctx.db.get(exam.classId);
    if (!classData || classData.professorId !== professorId) {
      throw new Error("Prova não encontrada");
    }

    return exam;
  },
});

// Atualizar prova
export const updateExam = mutation({
  args: {
    examId: v.id("exams"),
    titulo: v.string(),
    campoIdentificador: v.string(),
    peso: v.number(),
  },
  handler: async (ctx, args) => {
    const professorId = await getProfessorId(ctx);
    const exam = await ctx.db.get(args.examId);

    if (!exam) {
      throw new Error("Prova não encontrada");
    }

    // Verificar se a turma pertence ao professor
    const classData = await ctx.db.get(exam.classId);
    if (!classData || classData.professorId !== professorId) {
      throw new Error("Prova não encontrada");
    }

    await ctx.db.patch(args.examId, {
      titulo: args.titulo,
      campoIdentificador: args.campoIdentificador,
      peso: args.peso,
    });
  },
});

// Deletar prova
export const deleteExam = mutation({
  args: { examId: v.id("exams") },
  handler: async (ctx, args) => {
    const professorId = await getProfessorId(ctx);
    const exam = await ctx.db.get(args.examId);

    if (!exam) {
      throw new Error("Prova não encontrada");
    }

    // Verificar se a turma pertence ao professor
    const classData = await ctx.db.get(exam.classId);
    if (!classData || classData.professorId !== professorId) {
      throw new Error("Prova não encontrada");
    }

    // Deletar relações many-to-many com questões
    const examQuestions = await ctx.db
      .query("examQuestions")
      .withIndex("by_exam", (q) => q.eq("examId", args.examId))
      .collect();

    for (const examQuestion of examQuestions) {
      await ctx.db.delete(examQuestion._id);
    }

    // Deletar correções associadas
    const corrections = await ctx.db
      .query("corrections")
      .withIndex("by_exam", (q) => q.eq("examId", args.examId))
      .collect();

    for (const correction of corrections) {
      // Deletar respostas da correção
      const answers = await ctx.db
        .query("answers")
        .withIndex("by_correction", (q) => q.eq("correctionId", correction._id))
        .collect();

      for (const answer of answers) {
        await ctx.db.delete(answer._id);
      }

      await ctx.db.delete(correction._id);
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

    if (!exam) {
      throw new Error("Prova não encontrada");
    }

    // Verificar se a turma pertence ao professor
    const classData = await ctx.db.get(exam.classId);
    if (!classData || classData.professorId !== professorId) {
      throw new Error("Prova não encontrada");
    }

    // Buscar questões através da relação many-to-many
    const examQuestions = await ctx.db
      .query("examQuestions")
      .withIndex("by_exam", (q) => q.eq("examId", args.examId))
      .collect();

    const questionsWithCriteria = await Promise.all(
      examQuestions.map(async (examQuestion) => {
        const question = await ctx.db.get(examQuestion.questionId);
        if (!question) return null;

        const criteria = await ctx.db
          .query("questionCriteria")
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
      questions: questionsWithCriteria.filter((q) => q !== null),
    };
  },
});

