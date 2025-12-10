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
    questionBankId: v.id("questionBanks"),
    identificador: v.string(),
    enunciado: v.string(),
    peso: v.number(),
    linhas: v.number(),
  },
  handler: async (ctx, args) => {
    const professorId = await getProfessorId(ctx);

    // Verificar se o banco de questões pertence ao professor
    const questionBank = await ctx.db.get(args.questionBankId);
    if (!questionBank || questionBank.professorId !== professorId) {
      throw new Error("Banco de questões não encontrado");
    }

    return await ctx.db.insert("questions", {
      questionBankId: args.questionBankId,
      identificador: args.identificador,
      enunciado: args.enunciado,
      peso: args.peso,
      linhas: args.linhas,
    });
  },
});

// Listar questões de um banco de questões
export const listQuestions = query({
  args: { questionBankId: v.id("questionBanks") },
  handler: async (ctx, args) => {
    const professorId = await getProfessorId(ctx);

    // Verificar se o banco de questões pertence ao professor
    const questionBank = await ctx.db.get(args.questionBankId);
    if (!questionBank || questionBank.professorId !== professorId) {
      throw new Error("Banco de questões não encontrado");
    }

    return await ctx.db
      .query("questions")
      .withIndex("by_question_bank", (q) => q.eq("questionBankId", args.questionBankId))
      .collect();
  },
});

// Listar questões de uma prova (através da relação many-to-many)
export const listQuestionsByExam = query({
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

    const questions = await Promise.all(
      examQuestions.map(async (eq) => {
        const question = await ctx.db.get(eq.questionId);
        return question;
      })
    );

    return questions.filter((q) => q !== null);
  },
});

// Atualizar questão
export const updateQuestion = mutation({
  args: {
    questionId: v.id("questions"),
    identificador: v.string(),
    enunciado: v.string(),
    peso: v.number(),
    linhas: v.number(),
  },
  handler: async (ctx, args) => {
    const professorId = await getProfessorId(ctx);
    const question = await ctx.db.get(args.questionId);

    if (!question) {
      throw new Error("Questão não encontrada");
    }

    // Verificar se o banco de questões pertence ao professor
    const questionBank = await ctx.db.get(question.questionBankId);
    if (!questionBank || questionBank.professorId !== professorId) {
      throw new Error("Questão não encontrada");
    }

    await ctx.db.patch(args.questionId, {
      identificador: args.identificador,
      enunciado: args.enunciado,
      peso: args.peso,
      linhas: args.linhas,
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

    // Verificar se o banco de questões pertence ao professor
    const questionBank = await ctx.db.get(question.questionBankId);
    if (!questionBank || questionBank.professorId !== professorId) {
      throw new Error("Questão não encontrada");
    }

    // Deletar critérios associados
    const criteria = await ctx.db
      .query("questionCriteria")
      .withIndex("by_question", (q) => q.eq("questionId", args.questionId))
      .collect();

    for (const criterion of criteria) {
      await ctx.db.delete(criterion._id);
    }

    // Deletar relações many-to-many com provas
    const examQuestions = await ctx.db
      .query("examQuestions")
      .withIndex("by_question", (q) => q.eq("questionId", args.questionId))
      .collect();

    for (const examQuestion of examQuestions) {
      await ctx.db.delete(examQuestion._id);
    }

    await ctx.db.delete(args.questionId);
  },
});

// Adicionar questão a uma prova (criar relação many-to-many)
export const addQuestionToExam = mutation({
  args: {
    examId: v.id("exams"),
    questionId: v.id("questions"),
  },
  handler: async (ctx, args) => {
    const professorId = await getProfessorId(ctx);
    const exam = await ctx.db.get(args.examId);
    const question = await ctx.db.get(args.questionId);

    if (!exam || !question) {
      throw new Error("Prova ou questão não encontrada");
    }

    // Verificar se a turma pertence ao professor
    const classData = await ctx.db.get(exam.classId);
    if (!classData || classData.professorId !== professorId) {
      throw new Error("Prova não encontrada");
    }

    // Verificar se o banco de questões pertence ao professor
    const questionBank = await ctx.db.get(question.questionBankId);
    if (!questionBank || questionBank.professorId !== professorId) {
      throw new Error("Questão não encontrada");
    }

    // Verificar se a relação já existe
    const existing = await ctx.db
      .query("examQuestions")
      .withIndex("by_exam", (q) => q.eq("examId", args.examId))
      .filter((q) => q.eq(q.field("questionId"), args.questionId))
      .first();

    if (existing) {
      throw new Error("Questão já está associada a esta prova");
    }

    return await ctx.db.insert("examQuestions", {
      examId: args.examId,
      questionId: args.questionId,
    });
  },
});

// Remover questão de uma prova
export const removeQuestionFromExam = mutation({
  args: {
    examId: v.id("exams"),
    questionId: v.id("questions"),
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

    const examQuestion = await ctx.db
      .query("examQuestions")
      .withIndex("by_exam", (q) => q.eq("examId", args.examId))
      .filter((q) => q.eq(q.field("questionId"), args.questionId))
      .first();

    if (!examQuestion) {
      throw new Error("Relação não encontrada");
    }

    await ctx.db.delete(examQuestion._id);
  },
});

// Criar critério de questão
export const createCriterion = mutation({
  args: {
    questionId: v.id("questions"),
    regra: v.string(),
    tipo: v.union(v.literal("PALAVRA CHAVE"), v.literal("SEMANTICO")),
  },
  handler: async (ctx, args) => {
    const professorId = await getProfessorId(ctx);
    const question = await ctx.db.get(args.questionId);

    if (!question) {
      throw new Error("Questão não encontrada");
    }

    // Verificar se o banco de questões pertence ao professor
    const questionBank = await ctx.db.get(question.questionBankId);
    if (!questionBank || questionBank.professorId !== professorId) {
      throw new Error("Questão não encontrada");
    }

    return await ctx.db.insert("questionCriteria", {
      questionId: args.questionId,
      regra: args.regra,
      tipo: args.tipo,
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

    // Verificar se o banco de questões pertence ao professor
    const questionBank = await ctx.db.get(question.questionBankId);
    if (!questionBank || questionBank.professorId !== professorId) {
      throw new Error("Questão não encontrada");
    }

    return await ctx.db
      .query("questionCriteria")
      .withIndex("by_question", (q) => q.eq("questionId", args.questionId))
      .collect();
  },
});

// Deletar critério
export const deleteCriterion = mutation({
  args: { criterionId: v.id("questionCriteria") },
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

    // Verificar se o banco de questões pertence ao professor
    const questionBank = await ctx.db.get(question.questionBankId);
    if (!questionBank || questionBank.professorId !== professorId) {
      throw new Error("Critério não encontrado");
    }

    await ctx.db.delete(args.criterionId);
  },
});

// Criar questão e associar a uma prova (função helper)
export const createQuestionForExam = mutation({
  args: {
    examId: v.id("exams"),
    questionBankId: v.optional(v.id("questionBanks")),
    identificador: v.string(),
    enunciado: v.string(),
    peso: v.number(),
    linhas: v.number(),
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

    // Se não foi fornecido questionBankId, criar ou obter um padrão para a prova
    let questionBankId = args.questionBankId;
    if (!questionBankId) {
      // Buscar um questionBank padrão com o nome da prova
      const defaultQuestionBank = await ctx.db
        .query("questionBanks")
        .withIndex("by_professor", (q) => q.eq("professorId", professorId))
        .filter((q) => q.eq(q.field("titulo"), `Banco: ${exam.titulo}`))
        .first();

      if (defaultQuestionBank) {
        questionBankId = defaultQuestionBank._id;
      } else {
        // Criar um novo questionBank padrão
        questionBankId = await ctx.db.insert("questionBanks", {
          professorId,
          titulo: `Banco: ${exam.titulo}`,
        });
      }
    } else {
      // Verificar se o questionBank fornecido pertence ao professor
      const questionBank = await ctx.db.get(questionBankId);
      if (!questionBank || questionBank.professorId !== professorId) {
        throw new Error("Banco de questões não encontrado");
      }
    }

    // Criar a questão
    const questionId = await ctx.db.insert("questions", {
      questionBankId,
      identificador: args.identificador,
      enunciado: args.enunciado,
      peso: args.peso,
      linhas: args.linhas,
    });

    // Associar a questão à prova
    const existing = await ctx.db
      .query("examQuestions")
      .withIndex("by_exam", (q) => q.eq("examId", args.examId))
      .filter((q) => q.eq(q.field("questionId"), questionId))
      .first();

    if (!existing) {
      await ctx.db.insert("examQuestions", {
        examId: args.examId,
        questionId,
      });
    }

    return questionId;
  },
});
