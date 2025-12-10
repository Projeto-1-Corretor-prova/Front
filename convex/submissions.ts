import { query, mutation, action, internalQuery, internalMutation, internalAction } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

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

// Gerar URL para upload de arquivo
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Criar submissão de avaliação
export const createSubmission = mutation({
  args: {
    examId: v.id("exams"),
    studentName: v.string(),
    studentId: v.string(),
    fileId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const professorId = await getProfessorId(ctx);

    // Verificar se a prova pertence ao professor
    const exam = await ctx.db.get(args.examId);
    if (!exam) {
      throw new Error("Prova não encontrada");
    }

    // Verificar se a turma pertence ao professor
    const classData = await ctx.db.get(exam.classId);
    if (!classData || classData.professorId !== professorId) {
      throw new Error("Prova não encontrada");
    }

    return await ctx.db.insert("studentSubmissions", {
      examId: args.examId,
      studentName: args.studentName,
      studentId: args.studentId,
      submissionDate: Date.now(),
      fileId: args.fileId,
      status: "pending",
    });
  },
});

// Processar submissão (ação interna)
export const processSubmission = action({
  args: { submissionId: v.id("studentSubmissions") },
  handler: async (ctx, args) => {
    // Atualizar status para processando
    await ctx.runMutation(internal.submissions.updateSubmissionStatus, {
      submissionId: args.submissionId,
      status: "processing",
    });

    try {
      const submission = await ctx.runQuery(internal.submissions.getSubmissionInternal, {
        submissionId: args.submissionId,
      });

      if (!submission || !submission.fileId) {
        throw new Error("Submissão ou arquivo não encontrado");
      }

      // Aqui você processaria o arquivo CSV/Excel
      // Por enquanto, vamos simular o processamento
      const exam = await ctx.runQuery(internal.submissions.getExamInternal, {
        examId: submission.examId,
      });

      if (!exam) {
        throw new Error("Prova não encontrada");
      }

      // Simular respostas do CSV (em implementação real, você parsearia o arquivo)
      // Buscar questões da prova através da relação many-to-many
      const examQuestions = await ctx.runQuery(internal.submissions.getExamQuestionsInternal, {
        examId: submission.examId,
      });

      const mockAnswers = examQuestions.slice(0, 2).map((eq, index) => ({
        questionId: eq.questionId,
        answerText: `Esta é uma resposta simulada para a questão ${index + 1}`,
      }));

      // Processar cada resposta
      for (const answer of mockAnswers) {
        await ctx.runMutation(internal.submissions.createStudentAnswer, {
          submissionId: args.submissionId,
          questionId: answer.questionId,
          answerText: answer.answerText,
        });
      }

      // Atualizar status para concluído
      await ctx.runMutation(internal.submissions.updateSubmissionStatus, {
        submissionId: args.submissionId,
        status: "completed",
      });

      // Agendar correção com IA
      await ctx.scheduler.runAfter(0, internal.submissions.correctWithAI, {
        submissionId: args.submissionId,
      });

    } catch (error) {
      await ctx.runMutation(internal.submissions.updateSubmissionStatus, {
        submissionId: args.submissionId,
        status: "error",
      });
      throw error;
    }
  },
});

// Funções internas para processamento
export const updateSubmissionStatus = internalMutation({
  args: {
    submissionId: v.id("studentSubmissions"),
    status: v.union(v.literal("pending"), v.literal("processing"), v.literal("completed"), v.literal("error")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.submissionId, { status: args.status });
  },
});

export const getSubmissionInternal = internalQuery({
  args: { submissionId: v.id("studentSubmissions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.submissionId);
  },
});

export const getExamInternal = internalQuery({
  args: { examId: v.id("exams") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.examId);
  },
});

export const getExamQuestionsInternal = internalQuery({
  args: { examId: v.id("exams") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("examQuestions")
      .withIndex("by_exam", (q) => q.eq("examId", args.examId))
      .collect();
  },
});

export const createStudentAnswer = internalMutation({
  args: {
    submissionId: v.id("studentSubmissions"),
    questionId: v.id("questions"),
    answerText: v.string(),
  },
  handler: async (ctx, args) => {
    const submission = await ctx.db.get(args.submissionId);
    if (!submission) {
      throw new Error("Submissão não encontrada");
    }

    // Verificar se a questão existe
    const question = await ctx.db.get(args.questionId);
    if (!question) {
      throw new Error("Questão não encontrada");
    }

    return await ctx.db.insert("studentAnswers", {
      submissionId: args.submissionId,
      questionId: args.questionId,
      answerText: args.answerText,
      finalScore: 0, // Será atualizado pela IA
    });
  },
});

// Correção com IA
export const correctWithAI = internalAction({
  args: { submissionId: v.id("studentSubmissions") },
  handler: async (ctx, args) => {
    const answers = await ctx.runQuery(internal.submissions.getAnswersForCorrection, {
      submissionId: args.submissionId,
    });

    for (const answer of answers) {
      // Usar IA para correção
      const aiResult = await ctx.runAction(internal.submissions.evaluateAnswer, {
        answerText: answer.answerText,
        criteria: answer.criteria,
        maxPoints: answer.maxPoints,
      });

      // Atualizar resposta com resultado da IA
      await ctx.runMutation(internal.submissions.updateAnswerScore, {
        answerId: answer._id,
        aiScore: aiResult.score,
        aiComments: aiResult.comments,
        finalScore: aiResult.score,
      });
    }

    // Detectar plágio
    await ctx.runAction(internal.submissions.detectPlagiarism, {
      submissionId: args.submissionId,
    });
  },
});

export const getAnswersForCorrection = internalQuery({
  args: { submissionId: v.id("studentSubmissions") },
  handler: async (ctx, args) => {
    const answers = await ctx.db
      .query("studentAnswers")
      .withIndex("by_submission", (q) => q.eq("submissionId", args.submissionId))
      .collect();

    const answersWithCriteria = await Promise.all(
      answers.map(async (answer) => {
        const question = await ctx.db.get(answer.questionId);
        const criteria = await ctx.db
          .query("questionCriteria")
          .withIndex("by_question", (q: any) => q.eq("questionId", answer.questionId))
          .collect();

        // Converter critérios para o formato esperado pela função de avaliação
        const formattedCriteria = criteria.map((c) => ({
          criteriaText: c.regra,
          points: 1, // Valor padrão, pode ser ajustado
          isKeyword: c.tipo === "PALAVRA CHAVE",
          weight: 1, // Valor padrão, pode ser ajustado
        }));

        return {
          ...answer,
          criteria: formattedCriteria,
          maxPoints: question?.peso || 0,
        };
      })
    );

    return answersWithCriteria;
  },
});

export const evaluateAnswer = internalAction({
  args: {
    answerText: v.string(),
    criteria: v.array(v.object({
      criteriaText: v.string(),
      points: v.number(),
      isKeyword: v.boolean(),
      weight: v.number(),
    })),
    maxPoints: v.number(),
  },
  handler: async (ctx, args) => {
    // Simular avaliação com IA (implementar com OpenAI)
    let totalScore = 0;
    const comments = [];

    for (const criterion of args.criteria) {
      if (criterion.isKeyword) {
        // Verificar palavra-chave
        const hasKeyword = args.answerText.toLowerCase().includes(criterion.criteriaText.toLowerCase());
        if (hasKeyword) {
          totalScore += criterion.points * criterion.weight;
          comments.push(`✓ Palavra-chave encontrada: "${criterion.criteriaText}"`);
        } else {
          comments.push(`✗ Palavra-chave não encontrada: "${criterion.criteriaText}"`);
        }
      } else {
        // Avaliar resposta esperada (aqui usaria IA real)
        const similarity = Math.random() * 0.8 + 0.2; // Simular similaridade
        const score = criterion.points * criterion.weight * similarity;
        totalScore += score;
        comments.push(`Similaridade com resposta esperada: ${(similarity * 100).toFixed(1)}%`);
      }
    }

    return {
      score: Math.min(totalScore, args.maxPoints),
      comments: comments.join("; "),
    };
  },
});

export const updateAnswerScore = internalMutation({
  args: {
    answerId: v.id("studentAnswers"),
    aiScore: v.number(),
    aiComments: v.string(),
    finalScore: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.answerId, {
      aiScore: args.aiScore,
      aiComments: args.aiComments,
      finalScore: args.finalScore,
    });
  },
});

export const detectPlagiarism = internalAction({
  args: { submissionId: v.id("studentSubmissions") },
  handler: async (ctx, args) => {
    // Implementar detecção de plágio comparando respostas similares
    // Por enquanto, apenas um placeholder
    console.log("Detectando plágio para submissão:", args.submissionId);
  },
});

// Listar submissões de uma prova
export const listSubmissions = query({
  args: { examId: v.id("exams") },
  handler: async (ctx, args) => {
    const professorId = await getProfessorId(ctx);

    // Verificar se a prova pertence ao professor
    const exam = await ctx.db.get(args.examId);
    if (!exam) {
      throw new Error("Prova não encontrada");
    }

    // Verificar se a turma pertence ao professor
    const classData = await ctx.db.get(exam.classId);
    if (!classData || classData.professorId !== professorId) {
      throw new Error("Prova não encontrada");
    }

    return await ctx.db
      .query("studentSubmissions")
      .withIndex("by_exam", (q: any) => q.eq("examId", args.examId))
      .collect();
  },
});

// Obter detalhes de uma submissão
export const getSubmissionDetails = query({
  args: { submissionId: v.id("studentSubmissions") },
  handler: async (ctx, args) => {
    const professorId = await getProfessorId(ctx);
    const submission = await ctx.db.get(args.submissionId);

    if (!submission) {
      throw new Error("Submissão não encontrada");
    }

    // Verificar se a prova pertence ao professor
    const exam = await ctx.db.get(submission.examId);
    if (!exam) {
      throw new Error("Prova não encontrada");
    }

    // Verificar se a turma pertence ao professor
    const classData = await ctx.db.get(exam.classId);
    if (!classData || classData.professorId !== professorId) {
      throw new Error("Prova não encontrada");
    }

    const answers = await ctx.db
      .query("studentAnswers")
      .withIndex("by_submission", (q) => q.eq("submissionId", args.submissionId))
      .collect();

    const answersWithQuestions = await Promise.all(
      answers.map(async (answer) => {
        const question = await ctx.db.get(answer.questionId);
        return {
          ...answer,
          question,
        };
      })
    );

    return {
      ...submission,
      answers: answersWithQuestions,
    };
  },
});
