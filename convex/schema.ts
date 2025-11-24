import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  // Perfil do professor (estende a tabela users do auth)
  professors: defineTable({
    userId: v.id("users"),
    name: v.string(),
    email: v.string(),
    institution: v.optional(v.string()),
    department: v.optional(v.string()),
  }).index("by_user", ["userId"]),

  // Turmas
  classes: defineTable({
    professorId: v.id("professors"),
    name: v.string(),
    code: v.string(),
    semester: v.string(),
    year: v.number(),
    description: v.optional(v.string()),
  }).index("by_professor", ["professorId"]),

  // Provas
  exams: defineTable({
    professorId: v.id("professors"),
    classId: v.id("classes"),
    title: v.string(),
    description: v.optional(v.string()),
    totalPoints: v.number(),
    createdAt: v.number(),
    isActive: v.boolean(),
  }).index("by_professor", ["professorId"])
    .index("by_class", ["classId"]),

  // Questões das provas
  questions: defineTable({
    examId: v.id("exams"),
    questionNumber: v.number(),
    questionText: v.string(),
    points: v.number(),
    expectedAnswer: v.optional(v.string()),
  }).index("by_exam", ["examId"]),

  // Critérios de avaliação para cada questão
  evaluationCriteria: defineTable({
    questionId: v.id("questions"),
    criteriaText: v.string(),
    points: v.number(),
    isKeyword: v.boolean(), // true para palavra-chave, false para resposta esperada
    weight: v.number(), // peso do critério (0-1)
  }).index("by_question", ["questionId"]),

  // Avaliações respondidas pelos alunos
  studentSubmissions: defineTable({
    examId: v.id("exams"),
    studentName: v.string(),
    studentId: v.string(),
    submissionDate: v.number(),
    fileId: v.optional(v.id("_storage")), // arquivo CSV/Excel
    status: v.union(v.literal("pending"), v.literal("processing"), v.literal("completed"), v.literal("error")),
  }).index("by_exam", ["examId"]),

  // Respostas individuais dos alunos
  studentAnswers: defineTable({
    submissionId: v.id("studentSubmissions"),
    questionId: v.id("questions"),
    answerText: v.string(),
    aiScore: v.optional(v.number()),
    aiComments: v.optional(v.string()),
    manualScore: v.optional(v.number()),
    manualComments: v.optional(v.string()),
    finalScore: v.number(),
  }).index("by_submission", ["submissionId"])
    .index("by_question", ["questionId"]),

  // Detecção de plágio
  plagiarismDetection: defineTable({
    examId: v.id("exams"),
    questionId: v.id("questions"),
    student1Id: v.id("studentSubmissions"),
    student2Id: v.id("studentSubmissions"),
    similarityScore: v.number(), // 0-1
    suspiciousText: v.string(),
    status: v.union(v.literal("flagged"), v.literal("reviewed"), v.literal("dismissed")),
  }).index("by_exam", ["examId"])
    .index("by_question", ["questionId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
